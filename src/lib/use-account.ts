"use client";

import { useEffect, useState } from "react";

export interface AccountSummary {
  configured: boolean;
  signedIn: boolean;
  email?: string;
  isAdmin?: boolean;
  plan?: { key: string; name: string } | null;
  usage?: {
    used: number;
    limit: number | null;
    remaining: number | null;
    periodEnd: string;
  };
}

/** One-shot fetch of the signed-in visitor's account state — plan, usage, admin flag. */
export function useAccount() {
  const [data, setData] = useState<AccountSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/account/summary")
      .then((res) => res.json())
      .then((json) => {
        if (active) setData(json);
      })
      .catch(() => {
        if (active) setData({ configured: false, signedIn: false });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { account: data, loading };
}
