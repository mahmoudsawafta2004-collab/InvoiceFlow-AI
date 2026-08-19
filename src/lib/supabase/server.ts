import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabasePublicEnv } from "./env";
import type { Database } from "./types";

/**
 * Server-side client scoped to the current request's cookies, so RLS sees the
 * visitor's own session. Returns null when Supabase isn't configured — every
 * caller must treat that as "not signed in" rather than throwing, so the app
 * keeps working before the buyer connects their own project.
 */
export async function createClient() {
  const env = getSupabasePublicEnv();
  if (!env) return null;

  const cookieStore = await cookies();

  return createServerClient<Database>(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component render, where cookies are
          // read-only. Harmless as long as middleware also refreshes the
          // session, which it does.
        }
      },
    },
  });
}
