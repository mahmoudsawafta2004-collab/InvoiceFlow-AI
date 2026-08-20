"use client";

import { Users, CreditCard, TrendingUp, FileText } from "lucide-react";
import type { AdminOverview } from "@/lib/admin";
import { useI18n } from "@/lib/i18n/context";
import { Card, CardContent } from "@/components/ui/card";
import { PlanEditor } from "@/components/admin/plan-editor";
import { UsersTable } from "@/components/admin/users-table";
import { formatPrice } from "@/lib/plans";

export function AdminDashboard({ overview }: { overview: AdminOverview }) {
  const { t } = useI18n();
  const a = t.admin;

  const stats = [
    { label: a.stats.totalUsers, value: overview.totalUsers.toLocaleString(), icon: Users },
    {
      label: a.stats.payingSubscribers,
      value: overview.activePaidSubscriptions.toLocaleString(),
      icon: CreditCard,
    },
    { label: a.stats.mrr, value: formatPrice(overview.mrrCents, "usd"), icon: TrendingUp },
    {
      label: a.stats.invoicesThisMonth,
      value: overview.invoicesThisMonth.toLocaleString(),
      icon: FileText,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-[-0.01em] text-ink">{a.title}</h1>
        <p className="mt-1 text-sm text-ink-2">{a.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
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
        <h2 className="text-base font-semibold text-ink">{a.plans.title}</h2>
        <p className="mt-1 text-[13px] text-ink-2">{a.plans.note}</p>
        <div className="mt-4">
          <PlanEditor plans={overview.plans} />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-base font-semibold text-ink">{a.users.title}</h2>
        <p className="mt-1 text-[13px] text-ink-2">{a.users.count(overview.users.length)}</p>
        <div className="mt-4">
          <UsersTable users={overview.users} plans={overview.plans} />
        </div>
      </div>
    </div>
  );
}
