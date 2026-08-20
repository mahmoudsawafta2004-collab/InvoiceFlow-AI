import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getCurrentUser } from "@/lib/auth";
import { getAdminOverview } from "@/lib/admin";
import { NotConfiguredNotice } from "@/components/auth/not-configured-notice";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default async function AdminPage() {
  if (!isSupabaseConfigured()) return <NotConfiguredNotice />;

  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (!user.isAdmin) redirect("/workspace");

  const overview = await getAdminOverview();
  if (!overview) return <NotConfiguredNotice />;

  return <AdminDashboard overview={overview} />;
}
