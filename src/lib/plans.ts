import type { Plan } from "@/lib/supabase/types";

export function formatPrice(cents: number, currency: string): string {
  if (cents === 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

/** Client-side fallback shown while live plans load, or if Supabase isn't configured. */
export const FALLBACK_PLANS: Plan[] = [
  {
    id: "fallback-free",
    key: "free",
    name: "Free",
    price_cents: 0,
    currency: "usd",
    monthly_invoice_limit: 10,
    is_active: true,
    sort_order: 0,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-starter",
    key: "starter",
    name: "Starter",
    price_cents: 1900,
    currency: "usd",
    monthly_invoice_limit: 150,
    is_active: true,
    sort_order: 1,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-pro",
    key: "pro",
    name: "Pro",
    price_cents: 4900,
    currency: "usd",
    monthly_invoice_limit: 600,
    is_active: true,
    sort_order: 2,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-business",
    key: "business",
    name: "Business",
    price_cents: 12900,
    currency: "usd",
    monthly_invoice_limit: 3000,
    is_active: true,
    sort_order: 3,
    created_at: "",
    updated_at: "",
  },
];
