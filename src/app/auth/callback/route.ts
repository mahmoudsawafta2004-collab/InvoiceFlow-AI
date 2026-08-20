import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Only ever redirect to a path on this site, never to "//evil.com". */
function safeNext(raw: string | null, fallback = "/workspace"): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return fallback;
  return raw;
}

/**
 * Landing point for Google OAuth, email confirmation and password-reset links.
 * Supabase redirects here with a `code` to exchange for a session.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const error = searchParams.get("error") ?? searchParams.get("error_code");

  // A recovery link must land on the form that sets a new password, whatever
  // ?next says — Supabase drops the query string from redirect_to unless the
  // exact URL is on the allowlist, and losing it used to dump the visitor on
  // the home page with no way to finish the reset.
  const fallback = type === "recovery" ? "/update-password" : "/workspace";
  const next = safeNext(searchParams.get("next"), fallback);

  if (error) {
    // Expired or already-used link: send them back to ask for a fresh one
    // rather than to a page that will only fail.
    const dest = new URL(type === "recovery" ? "/forgot-password" : "/login", origin);
    dest.searchParams.set("error", error);
    return NextResponse.redirect(dest);
  }

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) {
        const dest = new URL(type === "recovery" ? "/forgot-password" : "/login", origin);
        dest.searchParams.set("error", "link_invalid");
        return NextResponse.redirect(dest);
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
