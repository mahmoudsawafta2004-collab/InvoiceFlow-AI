import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/** Sends an already-subscribed user to Stripe's hosted portal to manage or cancel. */
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
  if (!user) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: sub } = (await admin
    ?.from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle()) ?? { data: null };

  if (!sub?.stripe_customer_id) {
    return NextResponse.json({ error: "No billing account yet." }, { status: 404 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${req.nextUrl.origin}/dashboard`,
  });

  return NextResponse.json({ url: session.url });
}
