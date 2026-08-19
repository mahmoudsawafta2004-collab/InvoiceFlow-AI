"use client";

import { motion, AnimatePresence } from "motion/react";
import { FileText, X, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import type { InvoiceRow } from "@/lib/types";
import { formatFileSize, cn } from "@/lib/utils";

const statusConfig = {
  queued: { icon: Clock, className: "text-ink-3" },
  processing: { icon: Loader2, className: "text-accent animate-spin" },
  done: { icon: CheckCircle2, className: "text-ok" },
  error: { icon: XCircle, className: "text-bad" },
};

export function FileQueueList({
  rows,
  onRemove,
}: {
  rows: InvoiceRow[];
  onRemove?: (id: string) => void;
}) {
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
      <AnimatePresence initial={false}>
        {rows.map((row) => {
          const { icon: StatusIcon, className } = statusConfig[row.status];
          return (
            <motion.li
              key={row.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 px-4 py-2.5"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-3">
                <FileText className="h-3.5 w-3.5 text-ink-3" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-ink">{row.fileName}</p>
                <p className="font-mono text-[11px] text-ink-3">
                  {formatFileSize(row.fileSize)}
                  {row.status === "error" && row.error ? ` · ${row.error}` : ""}
                </p>
              </div>
              <StatusIcon className={cn("h-4 w-4 shrink-0", className)} />
              {onRemove && row.status === "queued" && (
                <button
                  onClick={() => onRemove(row.id)}
                  className="shrink-0 rounded-md p-1 text-ink-3 transition-colors hover:bg-surface-3 hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
