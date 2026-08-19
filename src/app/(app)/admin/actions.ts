"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user?.isAdmin) throw new Error("Admin access required.");
  return user;
}

/** Edits a plan's price and monthly limit. Takes effect on the next checkout immediately. */
export async function updatePlanAction(
  planId: string,
  updates: { name: string; price_cents: number; monthly_invoice_limit: number; is_active: boolean }
) {
  await requireAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("Server not configured.");

  const { error } = await admin
    .from("plans")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", planId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

/**
 * Manually moves a user onto a plan without going through Stripe — for
 * comping an account, extending a trial, or downgrading someone by hand.
 * Does not touch their Stripe subscription if one exists, so use the
 * customer's own billing portal for anything that should also change what
 * they're charged.
 */
export async function setUserPlanAction(userId: string, planId: string) {
  await requireAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("Server not configured.");

  const { error } = await admin.from("subscriptions").upsert(
    {
      user_id: userId,
      plan_id: planId,
      status: "active",
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}
