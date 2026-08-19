import { isSupabaseConfigured } from "@/lib/supabase/env";
import { NotConfiguredNotice } from "@/components/auth/not-configured-notice";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";

export default function UpdatePasswordPage() {
  if (!isSupabaseConfigured()) return <NotConfiguredNotice />;
  return <UpdatePasswordForm />;
}
