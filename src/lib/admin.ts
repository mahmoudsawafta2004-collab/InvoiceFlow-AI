import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Plan } from "@/lib/supabase/types";

export interface AdminUserRow {
  id: string;
  email: string;
  fullName: string | null;
  role: "user" | "admin";
  createdAt: string;
  planName: string;
  planKey: string;
  status: string;
  usedThisPeriod: number;
  limit: number;
  periodEnd: string;
}

export interface AdminOverview {
  totalUsers: number;
  activePaidSubscriptions: number;
  mrrCents: number;
  invoicesThisMonth: number;
  users: AdminUserRow[];
  plans: Plan[];
}

/** Everything the admin dashboard renders, gathered in one round trip. */
export async function getAdminOverview(): Promise<AdminOverview | null> {
  const admin = createAdminClient();
  if (!admin) return null;

  const [{ data: profiles }, { data: subscriptions }, { data: plans }] = await Promise.all([
    admin.from("profiles").select("*").order("created_at", { ascending: false }),
    admin.from("subscriptions").select("*"),
    admin.from("plans").select("*").order("sort_order", { ascending: true }),
  ]);

  const planById = new Map((plans ?? []).map((p) => [p.id, p]));
  const subByUser = new Map((subscriptions ?? []).map((s) => [s.user_id, s]));

  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);

  const { count: invoicesThisMonth } = await admin
    .from("usage_events")
    .select("id", { count: "exact", head: true })
    .gte("created_at", startOfMonth.toISOString());

  const users: AdminUserRow[] = [];
  let activePaidSubscriptions = 0;
  let mrrCents = 0;

  for (const profile of profiles ?? []) {
    const sub = subByUser.get(profile.id);
    const plan = sub ? planById.get(sub.plan_id) : undefined;

    let usedThisPeriod = 0;
    if (sub) {
      const { count } = await admin
        .from("usage_events")
        .select("id", { count: "exact", head: true })
        .eq("user_id", profile.id)
        .gte("created_at", sub.current_period_start);
      usedThisPeriod = count ?? 0;
    }

    if (sub?.status === "active" && plan && plan.price_cents > 0) {
      activePaidSubscriptions += 1;
      mrrCents += plan.price_cents;
    }

    users.push({
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      role: profile.role,
      createdAt: profile.created_at,
      planName: plan?.name ?? "—",
      planKey: plan?.key ?? "none",
      status: sub?.status ?? "none",
      usedThisPeriod,
      limit: plan?.monthly_invoice_limit ?? 0,
      periodEnd: sub?.current_period_end ?? "",
    });
  }

  return {
    totalUsers: profiles?.length ?? 0,
    activePaidSubscriptions,
    mrrCents,
    invoicesThisMonth: invoicesThisMonth ?? 0,
    users,
    plans: plans ?? [],
  };
}
