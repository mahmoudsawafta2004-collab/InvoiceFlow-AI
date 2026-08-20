import { Suspense } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { NotConfiguredNotice } from "@/components/auth/not-configured-notice";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  if (!isSupabaseConfigured()) return <NotConfiguredNotice />;
  return (
    <Suspense fallback={<div className="h-40" />}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
