import { AppNav } from "@/components/app-nav";
import { AccountProvider } from "@/components/account-provider";
import { getAccountSummary } from "@/lib/account-summary";

/**
 * Shell for the working surface. The marketing page sits outside this group so
 * it can commit to its own dark treatment. Account state is resolved here, on
 * the server, so the nav and dashboard render signed-in on the first paint.
 */
export default async function AppLayout({ children }: LayoutProps<"/">) {
  const account = await getAccountSummary();

  return (
    <AccountProvider account={account}>
      <AppNav />
      <main className="flex-1">{children}</main>
    </AccountProvider>
  );
}
