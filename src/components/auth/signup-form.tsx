"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Mail, UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isGoogleAuthEnabled } from "@/lib/supabase/env";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleIcon } from "@/components/auth/google-icon";

export function SignupForm() {
  const params = useSearchParams();
  const plan = params.get("plan");
  const postAuthPath = plan && plan !== "free" ? `/dashboard?plan=${plan}` : "/workspace";

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

    const { error } = await supabase.auth.signUp({
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
        <h1 className="text-xl font-semibold tracking-[-0.01em] text-ink">Check your email</h1>
        <p className="text-sm text-ink-2">
          We sent a confirmation link to <span className="font-medium text-ink">{email}</span>.
          Click it to activate your account.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-xl font-semibold tracking-[-0.01em] text-ink">Create your account</h1>
        <p className="mt-1 text-sm text-ink-2">Starts on the free plan — no card required.</p>
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
            Continue with Google
          </Button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-line" />
            <span className="text-[11px] uppercase tracking-wider text-ink-3">or</span>
            <div className="h-px flex-1 bg-line" />
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
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
          <Label htmlFor="password">Password</Label>
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

        {error && <p className="text-[13px] text-bad">{error}</p>}

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
          Create account
        </Button>
      </form>

      <p className="text-center text-[13px] text-ink-2">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-accent hover:underline">
          Sign in
        </Link>
      </p>

      <p className="text-center text-[12px] text-ink-3">
        By continuing you agree to our{" "}
        <Link href="/terms" className="hover:underline">Terms</Link> and{" "}
        <Link href="/privacy" className="hover:underline">Privacy Policy</Link>.
      </p>
    </div>
  );
}
