import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * Starts a Stripe Checkout session for a paid plan. The price is built at
 * checkout time from the plans table (price_data, not a pre-created Stripe
 * Price), so an admin editing a price in /admin takes effect on the very
 * next checkout — nothing to keep in sync on Stripe's side.
 */
export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Billing isn't configured on this deployment yet." },
      { status: 503 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = (await supabase?.auth.getUser()) ?? { data: { user: null } };
  if (!user || !user.email) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }

  const { planKey } = await req.json();
  if (typeof planKey !== "string") {
    return NextResponse.json({ error: "Missing planKey." }, { status: 400 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Server not configured." }, { status: 503 });
  }

  const { data: plan } = await admin
    .from("plans")
    .select("*")
    .eq("key", planKey)
    .eq("is_active", true)
    .maybeSingle();

  if (!plan) {
    return NextResponse.json({ error: "Unknown plan." }, { status: 404 });
  }

  if (plan.price_cents <= 0) {
    return NextResponse.json({ error: "This plan doesn't require checkout." }, { status: 400 });
  }

  const { data: existingSub } = await admin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const origin = req.nextUrl.origin;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: existingSub?.stripe_customer_id || undefined,
    customer_email: existingSub?.stripe_customer_id ? undefined : user.email,
    client_reference_id: user.id,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: plan.currency,
          unit_amount: plan.price_cents,
          recurring: { interval: "month" },
          product_data: { name: `InvoiceFlow AI — ${plan.name}` },
        },
      },
    ],
    metadata: { user_id: user.id, plan_id: plan.id, plan_key: plan.key },
    subscription_data: {
      metadata: { user_id: user.id, plan_id: plan.id, plan_key: plan.key },
    },
    success_url: `${origin}/dashboard?checkout=success`,
    cancel_url: `${origin}/#pricing`,
  });

  return NextResponse.json({ url: session.url });
}
