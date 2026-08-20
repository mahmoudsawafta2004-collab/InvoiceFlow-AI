"use client";

import { createContext, useContext } from "react";

export interface AccountSummary {
  configured: boolean;
  signedIn: boolean;
  /** True only when a Stripe secret key is present on the deployment. */
  billingEnabled: boolean;
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

export const EMPTY_ACCOUNT: AccountSummary = {
  configured: false,
  signedIn: false,
  billingEnabled: false,
};

/**
 * Account state is resolved on the server and handed down through this
 * context. It used to be fetched from /api/account/summary after hydration,
 * which meant a cold serverless round trip — several seconds during which the
 * nav showed no email and the dashboard no plan, on a page that was otherwise
 * fully rendered. Nothing here waits on the network any more.
 */
export const AccountContext = createContext<AccountSummary>(EMPTY_ACCOUNT);

export function useAccount(): { account: AccountSummary; loading: boolean } {
  return { account: useContext(AccountContext), loading: false };
}
