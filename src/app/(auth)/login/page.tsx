import { Suspense } from "react";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getCurrentUser } from "@/lib/auth";
import { NotConfiguredNotice } from "@/components/auth/not-configured-notice";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage() {
  if (!isSupabaseConfigured()) return <NotConfiguredNotice />;

  const user = await getCurrentUser();
  if (user) redirect("/workspace");

  return (
    <Suspense fallback={<div className="h-40" />}>
      <LoginForm />
    </Suspense>
  );
}
