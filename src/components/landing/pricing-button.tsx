"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAccount } from "@/lib/use-account";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";

export function PricingButton({
  planKey,
  isFree,
  label,
  highlighted,
}: {
  planKey: string;
  isFree: boolean;
  label: string;
  highlighted: boolean;
}) {
  const router = useRouter();
  const { account } = useAccount();
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    // Signed out (or Supabase not configured): the signup flow carries ?plan=
    // through so an upgrade can be offered right after confirmation, rather
    // than dropping the visitor's choice on the floor.
    if (!account.signedIn) {
      router.push(`/signup?plan=${planKey}`);
      return;
    }

    if (isFree) {
      router.push("/workspace");
      return;
    }

    // Paid plan on a deployment with no Stripe key: say so instead of firing a
    // request that can only come back 503.
    if (!account.billingEnabled) {
      toast.info(t.billing.comingSoon);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planKey }),
      });
      const json = await res.json();
      if (json.url) {
        window.location.href = json.url;
      } else {
        toast.error(json.error || t.billing.checkoutFailed);
        setLoading(false);
      }
    } catch {
      toast.error(t.billing.checkoutFailed);
      setLoading(false);
    }
  }

  return (
    <Button
      variant={highlighted ? "primary" : "outline"}
      size="lg"
      className="w-full"
      onClick={handleClick}
      disabled={loading}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {label}
    </Button>
  );
}
