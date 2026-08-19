/**
 * Centralised, lazy env access. Reading these at import time would crash the
 * build before Supabase is configured — every caller must handle `null` by
 * treating auth/billing as unavailable rather than throwing.
 */
export function getSupabasePublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export function getSupabaseServiceRoleKey(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || null;
}

export function isSupabaseConfigured(): boolean {
  return getSupabasePublicEnv() !== null;
}
