"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CreditCard, ExternalLink, Loader2, ShieldCheck } from "lucide-react";
import { useAccount } from "@/lib/use-account";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function BillingCard() {
  const { account, loading } = useAccount();
  const [portalLoading, setPortalLoading] = useState(false);

  if (loading || !account?.configured || !account.signedIn) return null;

  async function openPortal() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const json = await res.json();
      if (json.url) {
        window.location.href = json.url;
      } else {
        toast.error(json.error || "Couldn't open billing portal.");
      }
    } finally {
      setPortalLoading(false);
    }
  }

  if (account.isAdmin) {
    return (
      <Card className="mb-8 border-accent/25 bg-accent-soft/40">
        <CardContent className="flex items-center gap-3 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft">
            <ShieldCheck className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-ink">Admin account</p>
            <p className="text-[13px] text-ink-2">
              Unlimited extractions — no subscription needed.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const usage = account.usage;
  const limit = usage?.limit ?? 0;
  const used = usage?.used ?? 0;
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const nearLimit = pct >= 80;

  return (
    <Card className="mb-8">
      <CardContent className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[13px] text-ink-2">Current plan</p>
            <p className="text-lg font-semibold tracking-[-0.01em] text-ink">
              {account.plan?.name ?? "Free"}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/#pricing">
              <Button variant="primary" size="sm">
                <CreditCard className="h-3.5 w-3.5" />
                Upgrade
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={openPortal} disabled={portalLoading}>
              {portalLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ExternalLink className="h-3.5 w-3.5" />
              )}
              Manage billing
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-ink-2">
              {used} / {limit || "—"} invoices this period
            </span>
            <span className={cn("tabular font-medium", nearLimit ? "text-warn" : "text-ink-3")}>
              {pct}%
            </span>
          </div>
          <div className="mt-1.5">
            <Progress value={pct} indicatorClassName={nearLimit ? "bg-warn" : undefined} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
