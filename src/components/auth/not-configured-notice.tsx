import { AlertTriangle } from "lucide-react";

/** Shown instead of a form when NEXT_PUBLIC_SUPABASE_URL / ANON_KEY are unset. */
export function NotConfiguredNotice() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-warn/30 bg-warn-soft p-4 text-sm text-warn">
      <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
      <div>
        <p className="font-medium">Accounts aren&apos;t set up yet</p>
        <p className="mt-1 text-warn/90">
          This deployment hasn&apos;t been connected to Supabase. Add
          NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable
          sign-in.
        </p>
      </div>
    </div>
  );
}
