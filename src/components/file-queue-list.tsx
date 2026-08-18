"use client";

import { FileText, X, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import type { InvoiceRow } from "@/lib/types";
import { formatFileSize, cn } from "@/lib/utils";

const statusConfig = {
  queued: { icon: Clock, className: "text-neutral-300" },
  processing: { icon: Loader2, className: "text-indigo-500 animate-spin" },
  done: { icon: CheckCircle2, className: "text-emerald-500" },
  error: { icon: XCircle, className: "text-red-500" },
};

export function FileQueueList({
  rows,
  onRemove,
}: {
  rows: InvoiceRow[];
  onRemove?: (id: string) => void;
}) {
  return (
    <ul className="divide-y divide-neutral-100 rounded-xl border border-neutral-200 bg-white">
      {rows.map((row) => {
        const { icon: StatusIcon, className } = statusConfig[row.status];
        return (
          <li key={row.id} className="flex items-center gap-3 px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
              <FileText className="h-4 w-4 text-neutral-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-neutral-900">
                {row.fileName}
              </p>
              <p className="text-xs text-neutral-400">
                {formatFileSize(row.fileSize)}
                {row.status === "error" && row.error ? ` · ${row.error}` : ""}
              </p>
            </div>
            <StatusIcon className={cn("h-4.5 w-4.5 shrink-0", className)} />
            {onRemove && row.status === "queued" && (
              <button
                onClick={() => onRemove(row.id)}
                className="shrink-0 rounded-md p-1 text-neutral-300 hover:bg-neutral-100 hover:text-neutral-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
