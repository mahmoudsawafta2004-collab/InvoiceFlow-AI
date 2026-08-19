import "server-only";
import Stripe from "stripe";

let cached: Stripe | null | undefined;

/** Returns null until STRIPE_SECRET_KEY is set — callers must handle that. */
export function getStripe(): Stripe | null {
  if (cached !== undefined) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  cached = key ? new Stripe(key) : null;
  return cached;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
