"use client";

import { AccountContext, type AccountSummary } from "@/lib/use-account";

/** Thin client boundary so a Server Component can seed the account context. */
export function AccountProvider({
  account,
  children,
}: {
  account: AccountSummary;
  children: React.ReactNode;
}) {
  return <AccountContext.Provider value={account}>{children}</AccountContext.Provider>;
}
