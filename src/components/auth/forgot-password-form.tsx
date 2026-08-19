"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound, Loader2, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    if (!supabase) return;

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
    });

    // Always show the same success state regardless of outcome — confirming
    // or denying that an email exists is an account-enumeration leak.
    if (error) {
      setError(null);
    }
    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-ok-soft">
          <Mail className="h-5 w-5 text-ok" />
        </div>
        <h1 className="text-xl font-semibold tracking-[-0.01em] text-ink">Check your email</h1>
        <p className="text-sm text-ink-2">
          If an account exists for <span className="font-medium text-ink">{email}</span>,
          a reset link is on its way.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft">
          <KeyRound className="h-5 w-5 text-accent" />
        </div>
        <h1 className="mt-3 text-xl font-semibold tracking-[-0.01em] text-ink">
          Reset your password
        </h1>
        <p className="mt-1 text-sm text-ink-2">
          Enter your email and we&apos;ll send a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        {error && <p className="text-[13px] text-bad">{error}</p>}

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Send reset link
        </Button>
      </form>

      <p className="text-center text-[13px] text-ink-2">
        <Link href="/login" className="font-medium text-accent hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
