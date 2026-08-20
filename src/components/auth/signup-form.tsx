"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Mail, UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isGoogleAuthEnabled } from "@/lib/supabase/env";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleIcon } from "@/components/auth/google-icon";

export function SignupForm() {
  const params = useSearchParams();
  const plan = params.get("plan");
  const postAuthPath = plan && plan !== "free" ? `/dashboard?plan=${plan}` : "/workspace";
  const { t } = useI18n();
  const c = t.auth.signup;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    if (!supabase) return;

    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(postAuthPath)}`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Supabase deliberately answers a signup for an existing address with a
    // success shaped exactly like a new one, so an attacker cannot probe which
    // emails are registered. The one tell is an empty identities array — the
    // obfuscated user it hands back owns no identity. Without this check the
    // form claims to have sent a confirmation link that never arrives.
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      setError(c.alreadyRegistered);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  async function handleGoogle() {
    const supabase = createClient();
    if (!supabase) return;
    setGoogleLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(postAuthPath)}`,
      },
    });
  }

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-ok-soft">
          <Mail className="h-5 w-5 text-ok" />
        </div>
        <h1 className="text-xl font-semibold tracking-[-0.01em] text-ink">{c.sentTitle}</h1>
        <p className="text-sm text-ink-2">{c.sentBody(email)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-xl font-semibold tracking-[-0.01em] text-ink">{c.title}</h1>
        <p className="mt-1 text-sm text-ink-2">{c.subtitle}</p>
      </div>

      {isGoogleAuthEnabled() && (
        <>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleGoogle}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon className="h-4 w-4" />
            )}
            {c.google}
          </Button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-line" />
            <span className="text-[11px] uppercase tracking-wider text-ink-3">{c.or}</span>
            <div className="h-px flex-1 bg-line" />
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">{c.name}</Label>
          <Input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">{c.email}</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">{c.password}</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-[13px] text-bad">
            {error}
            {error === c.alreadyRegistered && (
              <>
                {" "}
                <Link href="/login" className="font-medium text-accent hover:underline">
                  {c.signIn}
                </Link>
              </>
            )}
          </p>
        )}

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
          {c.submit}
        </Button>
      </form>

      <p className="text-center text-[13px] text-ink-2">
        {c.haveAccount}{" "}
        <Link href="/login" className="font-medium text-accent hover:underline">
          {c.signIn}
        </Link>
      </p>

      <p className="text-center text-[12px] text-ink-3">
        {c.agree}{" "}
        <Link href="/terms" className="hover:underline">{t.nav.terms}</Link> {c.and}{" "}
        <Link href="/privacy" className="hover:underline">{t.nav.privacy}</Link>.
      </p>
    </div>
  );
}
