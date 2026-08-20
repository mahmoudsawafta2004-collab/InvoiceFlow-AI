import "server-only";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isStripeConfigured } from "@/lib/stripe";
import { getCurrentUser, getUsageInfo } from "@/lib/auth";
import { EMPTY_ACCOUNT, type AccountSummary } from "@/lib/use-account";

/**
 * The single source of truth for "who is signed in and what are they allowed
 * to do", shared by the app layout (which seeds the client context with it)
 * and the account API route. Never throws — a failure here must degrade to
 * signed-out, not take down every page in the app group.
 */
export async function getAccountSummary(): Promise<AccountSummary> {
  const billingEnabled = isStripeConfigured();

  if (!isSupabaseConfigured()) {
    return { ...EMPTY_ACCOUNT, billingEnabled };
  }

  try {
    const user = await getCurrentUser();
    if (!user) {
      return { configured: true, signedIn: false, billingEnabled };
    }

    const usage = await getUsageInfo(user);

    return {
      configured: true,
      signedIn: true,
      billingEnabled,
      email: user.email,
      isAdmin: user.isAdmin,
      plan: usage.plan ? { key: usage.plan.key, name: usage.plan.name } : null,
      usage: {
        used: usage.usedThisPeriod,
        limit: usage.limit,
        remaining: usage.remaining,
        periodEnd: usage.periodEnd,
      },
    };
  } catch {
    return { configured: true, signedIn: false, billingEnabled };
  }
}
