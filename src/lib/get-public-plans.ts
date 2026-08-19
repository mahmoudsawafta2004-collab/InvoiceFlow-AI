import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { FALLBACK_PLANS } from "@/lib/plans";
import type { Plan } from "@/lib/supabase/types";

/**
 * Public pricing data for the landing page. Uses the anon key with no
 * cookies — this doesn't need a signed-in visitor, just the plans RLS
 * already allows anyone to read (`is_active = true`). Falls back to
 * reasonable defaults before Supabase is connected so the pricing section
 * still renders.
 */
export async function getPublicPlans(): Promise<Plan[]> {
  const env = getSupabasePublicEnv();
  if (!env) return FALLBACK_PLANS;

  const supabase = createSupabaseClient(env.url, env.anonKey);
  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return FALLBACK_PLANS;
  return data;
}
