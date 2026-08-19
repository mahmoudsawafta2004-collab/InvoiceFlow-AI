import { redirect } from "next/navigation";
import { Users, CreditCard, TrendingUp, FileText } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getCurrentUser } from "@/lib/auth";
import { getAdminOverview } from "@/lib/admin";
import { NotConfiguredNotice } from "@/components/auth/not-configured-notice";
import { Card, CardContent } from "@/components/ui/card";
import { PlanEditor } from "@/components/admin/plan-editor";
import { UsersTable } from "@/components/admin/users-table";
import { formatPrice } from "@/lib/plans";

export default async function AdminPage() {
  if (!isSupabaseConfigured()) return <NotConfiguredNotice />;

  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (!user.isAdmin) redirect("/workspace");

  const overview = await getAdminOverview();
  if (!overview) return <NotConfiguredNotice />;

  const stats = [
    { label: "Total users", value: overview.totalUsers.toLocaleString(), icon: Users },
    {
      label: "Paying subscribers",
      value: overview.activePaidSubscriptions.toLocaleString(),
      icon: CreditCard,
    },
    {
      label: "Monthly recurring revenue",
      value: formatPrice(overview.mrrCents, "usd"),
      icon: TrendingUp,
    },
    {
      label: "Invoices this month",
      value: overview.invoicesThisMonth.toLocaleString(),
      icon: FileText,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-[-0.01em] text-ink">Admin</h1>
        <p className="mt-1 text-sm text-ink-2">
          Subscribers, usage, and pricing — visible only to accounts on the
          ADMIN_EMAILS allowlist.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-[13px] text-ink-2">{stat.label}</p>
                <stat.icon className="h-4 w-4 text-ink-3" />
              </div>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.01em] text-ink">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-base font-semibold text-ink">Plans</h2>
        <p className="mt-1 text-[13px] text-ink-2">
          Editing a price here changes what new checkouts charge immediately —
          nothing to update on Stripe&apos;s side.
        </p>
        <div className="mt-4">
          <PlanEditor plans={overview.plans} />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-base font-semibold text-ink">Subscribers</h2>
        <p className="mt-1 text-[13px] text-ink-2">
          {overview.users.length} account{overview.users.length === 1 ? "" : "s"}.
        </p>
        <div className="mt-4">
          <UsersTable users={overview.users} plans={overview.plans} />
        </div>
      </div>
    </div>
  );
}
