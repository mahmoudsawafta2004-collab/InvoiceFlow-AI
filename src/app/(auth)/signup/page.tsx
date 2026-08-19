import { Suspense } from "react";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { NotConfiguredNotice } from "@/components/auth/not-configured-notice";
import { SignupForm } from "@/components/auth/signup-form";

export default async function SignupPage() {
  if (!isSupabaseConfigured()) return <NotConfiguredNotice />;

  const supabase = await createClient();
  const {
    data: { user },
  } = (await supabase?.auth.getUser()) ?? { data: { user: null } };
  if (user) redirect("/workspace");

  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
