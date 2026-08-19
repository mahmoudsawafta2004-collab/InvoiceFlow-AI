"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicEnv } from "./env";
import type { Database } from "./types";

/** Returns null when Supabase hasn't been configured yet — callers must handle it. */
export function createClient() {
  const env = getSupabasePublicEnv();
  if (!env) return null;
  return createBrowserClient<Database>(env.url, env.anonKey);
}
