import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getCurrentUser, getUsageInfo } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ configured: false, signedIn: false });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ configured: true, signedIn: false });
  }

  const usage = await getUsageInfo(user);

  return NextResponse.json({
    configured: true,
    signedIn: true,
    email: user.email,
    isAdmin: user.isAdmin,
    plan: usage.plan ? { key: usage.plan.key, name: usage.plan.name } : null,
    usage: {
      used: usage.usedThisPeriod,
      limit: usage.limit,
      remaining: usage.remaining,
      periodEnd: usage.periodEnd,
    },
  });
}
