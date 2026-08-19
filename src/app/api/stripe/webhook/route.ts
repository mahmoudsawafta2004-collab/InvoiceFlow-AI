import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * Single source of truth for subscription state. Nothing else writes
 * `status`, `current_period_end`, or `stripe_subscription_id` — the checkout
 * route only creates the Checkout Session, it never marks a user as paid.
 * That happens here, only after Stripe confirms it, verified by signature.
 */
export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const admin = createAdminClient();

  if (!stripe || !webhookSecret || !admin) {
    return NextResponse.json({ error: "Billing not configured." }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const planId = session.metadata?.plan_id;
      const subscriptionId =
        typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
      const customerId =
        typeof session.customer === "string" ? session.customer : session.customer?.id;

      if (userId && planId && subscriptionId && customerId) {
        const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);
        await admin.from("subscriptions").upsert(
          {
            user_id: userId,
            plan_id: planId,
            status: "active",
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            current_period_start: new Date(
              stripeSub.items.data[0].current_period_start * 1000
            ).toISOString(),
            current_period_end: new Date(
              stripeSub.items.data[0].current_period_end * 1000
            ).toISOString(),
            cancel_at_period_end: stripeSub.cancel_at_period_end,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.user_id;
      const status = mapStripeStatus(sub.status);

      if (userId) {
        await admin
          .from("subscriptions")
          .update({
            status,
            current_period_start: new Date(sub.items.data[0].current_period_start * 1000).toISOString(),
            current_period_end: new Date(sub.items.data[0].current_period_end * 1000).toISOString(),
            cancel_at_period_end: sub.cancel_at_period_end,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
      if (customerId) {
        await admin
          .from("subscriptions")
          .update({ status: "past_due", updated_at: new Date().toISOString() })
          .eq("stripe_customer_id", customerId);
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}

function mapStripeStatus(
  status: Stripe.Subscription.Status
): "active" | "trialing" | "past_due" | "canceled" | "incomplete" {
  switch (status) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "past_due":
    case "unpaid":
      return "past_due";
    case "canceled":
      return "canceled";
    default:
      return "incomplete";
  }
}
