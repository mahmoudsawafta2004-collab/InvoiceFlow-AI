import { isSupabaseConfigured } from "@/lib/supabase/env";
import { NotConfiguredNotice } from "@/components/auth/not-configured-notice";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  if (!isSupabaseConfigured()) return <NotConfiguredNotice />;
  return <ForgotPasswordForm />;
}
