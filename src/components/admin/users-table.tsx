"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import type { AdminUserRow } from "@/lib/admin";
import type { Plan } from "@/lib/supabase/types";
import { setUserPlanAction } from "@/app/(app)/admin/actions";
import { useI18n } from "@/lib/i18n/context";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const statusVariant: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  active: "success",
  trialing: "secondary",
  past_due: "warning",
  canceled: "destructive",
  none: "secondary",
};

export function UsersTable({ users, plans }: { users: AdminUserRow[]; plans: Plan[] }) {
  const { t } = useI18n();
  const u = t.admin.users;
  const headers = [u.colUser, u.colPlan, u.colStatus, u.colUsage, u.colJoined, ""];

  if (users.length === 0) {
    return (
      <div className="rounded-xl border border-line bg-surface px-4 py-10 text-center text-[13px] text-ink-2">
        {u.empty}
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-xl border border-line bg-surface">
      <table className="w-full min-w-[840px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-surface-2">
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-2.5 text-start text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-3"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {users.map((row) => (
            <UserRow key={row.id} user={row} plans={plans} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UserRow({ user, plans }: { user: AdminUserRow; plans: Plan[] }) {
  const { t } = useI18n();
  const u = t.admin.users;
  const [isPending, startTransition] = useTransition();
  const [planKey, setPlanKey] = useState(user.planKey);

  function handleChange(newKey: string) {
    const plan = plans.find((p) => p.key === newKey);
    if (!plan) return;
    setPlanKey(newKey);
    startTransition(async () => {
      try {
        await setUserPlanAction(user.id, plan.id);
        toast.success(u.moved(user.email, plan.name));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : u.updateFailed);
      }
    });
  }

  return (
    <tr className="transition-colors hover:bg-surface-2">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div>
            <p className="flex items-center gap-1.5 text-[13px] font-medium text-ink">
              {user.fullName || user.email}
              {user.role === "admin" && (
                <ShieldCheck className="h-3.5 w-3.5 text-accent" aria-label="Admin" />
              )}
            </p>
            <p className="font-mono text-[11px] text-ink-3">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <select
          value={planKey}
          onChange={(e) => handleChange(e.target.value)}
          disabled={isPending}
          className="rounded-md border border-line bg-surface px-2 py-1 text-[13px] text-ink outline-none focus-visible:border-accent disabled:opacity-50"
        >
          {plans.map((p) => (
            <option key={p.id} value={p.key}>
              {p.name}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3">
        <Badge variant={statusVariant[user.status] ?? "secondary"}>{user.status}</Badge>
      </td>
      <td className="px-4 py-3 tabular text-[13px] text-ink-2">
        {user.usedThisPeriod} / {user.limit || "—"}
      </td>
      <td className="px-4 py-3 text-[13px] text-ink-2">{formatDate(user.createdAt)}</td>
      <td className="px-4 py-3" />
    </tr>
  );
}
