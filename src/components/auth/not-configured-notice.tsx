"use client";

import { AlertTriangle } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

/** Shown instead of a form when NEXT_PUBLIC_SUPABASE_URL / ANON_KEY are unset. */
export function NotConfiguredNotice() {
  const { t } = useI18n();
  const c = t.auth.notConfigured;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-warn/30 bg-warn-soft p-4 text-sm text-warn">
      <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
      <div>
        <p className="font-medium">{c.title}</p>
        <p className="mt-1 text-warn/90">{c.body}</p>
      </div>
    </div>
  );
}
