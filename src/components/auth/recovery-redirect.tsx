"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Password-reset links do not always arrive where they were pointed. Supabase
 * validates `redirect_to` against its allowlist and, when the URL does not
 * match exactly — a `?next=` query string is enough to miss — silently falls
 * back to the project's Site URL. The visitor lands on the home page holding a
 * valid recovery session and no way to reach the form that uses it.
 *
 * Listening for the recovery event catches that case wherever it lands, so the
 * reset finishes even on a deployment whose allowlist was never widened.
 */
export function RecoveryRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" && pathname !== "/update-password") {
        router.replace("/update-password");
      }
    });

    return () => subscription.unsubscribe();
  }, [router, pathname]);

  return null;
}
