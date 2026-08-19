import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv, getSupabaseServiceRoleKey } from "./env";
import type { Database } from "./types";

/**
 * Service-role client. Bypasses Row Level Security entirely, so it must only
 * ever be imported from server-only code: API routes, Server Actions, the
 * Stripe webhook. Never import this from a Client Component or send its
 * output verbatim to the browser.
 */
export function createAdminClient() {
  const env = getSupabasePublicEnv();
  const serviceRoleKey = getSupabaseServiceRoleKey();
  if (!env || !serviceRoleKey) return null;

  return createSupabaseClient<Database>(env.url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
