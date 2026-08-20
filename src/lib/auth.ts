import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Plan, Profile, Subscription } from "@/lib/supabase/types";

/**
 * Admin access is granted by email allowlist (ADMIN_EMAILS, comma-separated)
 * rather than only a database flag. That means the site owner can sign up
 * and get full, unpaid admin access immediately — no manual SQL required —
 * while still being enforced server-side on every check below.
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}

export interface CurrentUser {
  id: string;
  email: string;
  isAdmin: boolean;
  profile: Profile | null;
}

/**
 * Returns null when signed out, Supabase isn't configured yet, or the Auth
 * server call fails for any reason (network blip, transient 5xx). This must
 * never throw: it runs at the top of every protected Server Component, and
 * an uncaught error here previously took down the whole page with nothing
 * rendered but the surrounding layout — "not signed in" is always a safe
 * fallback, a broken page never is.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || !user.email) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    return {
      id: user.id,
      email: user.email,
      isAdmin: isAdminEmail(user.email) || profile?.role === "admin",
      profile: profile ?? null,
    };
  } catch {
    return null;
  }
}

export interface UsageInfo {
  plan: Plan | null;
  subscription: Subscription | null;
  usedThisPeriod: number;
  limit: number | null; // null means unlimited (admin)
  remaining: number | null;
  periodStart: string;
  periodEnd: string;
}

/**
 * Reads the caller's plan and how many invoices they've processed in the
 * current billing period. Admins get an unlimited allowance so the owner can
 * test freely without a subscription — everyone else is metered against
 * their plan's monthly_invoice_limit.
 */
export async function getUsageInfo(user: CurrentUser): Promise<UsageInfo> {
  const admin = createAdminClient();
  const now = new Date();

  if (!admin) {
    return {
      plan: null,
      subscription: null,
      usedThisPeriod: 0,
      limit: user.isAdmin ? null : 0,
      remaining: user.isAdmin ? null : 0,
      periodStart: now.toISOString(),
      periodEnd: now.toISOString(),
    };
  }

  const { data: subscription } = await admin
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  let plan: Plan | null = null;
  if (subscription) {
    const { data } = await admin
      .from("plans")
      .select("*")
      .eq("id", subscription.plan_id)
      .maybeSingle();
    plan = data;
  }

  const periodStart = subscription?.current_period_start ?? now.toISOString();
  const periodEnd = subscription?.current_period_end ?? now.toISOString();

  const { count } = await admin
    .from("usage_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", periodStart);

  const usedThisPeriod = count ?? 0;
  const limit = user.isAdmin ? null : (plan?.monthly_invoice_limit ?? 0);
  const remaining = limit === null ? null : Math.max(0, limit - usedThisPeriod);

  return { plan, subscription, usedThisPeriod, limit, remaining, periodStart, periodEnd };
}
