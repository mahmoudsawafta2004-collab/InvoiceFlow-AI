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

/**
 * The "Continue with Google" button is only ever shown when this is true.
 * Attempting Google sign-in against a Supabase project that hasn't had the
 * Google provider enabled doesn't fail gracefully — supabase-js navigates
 * straight to Supabase's authorize endpoint regardless, which then renders a
 * raw {"error_code":"validation_failed"} JSON page. Gating the button on an
 * explicit flag (flipped on only once the provider is actually configured,
 * see DOCUMENTATION.md) avoids that dead end entirely rather than trying to
 * catch it after the fact.
 */
export function isGoogleAuthEnabled(): boolean {
  return process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";
}
