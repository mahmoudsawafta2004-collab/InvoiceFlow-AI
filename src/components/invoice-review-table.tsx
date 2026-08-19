"use client";

import { AlertCircle, Loader2, RotateCw, Trash2 } from "lucide-react";
import type { FieldKey, InvoiceRow } from "@/lib/types";
import { EditableCell } from "@/components/editable-cell";
import { ConfidenceBadge } from "@/components/confidence-badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, formatFileSize } from "@/lib/utils";

const numericFields: FieldKey[] = ["subtotal", "tax", "total"];

export function InvoiceReviewTable({
  rows,
  onUpdateField,
  onRemoveRow,
  onRetryRow,
}: {
  rows: InvoiceRow[];
  onUpdateField: (rowId: string, field: FieldKey, value: string) => void;
  onRemoveRow: (rowId: string) => void;
  onRetryRow: (rowId: string) => void;
}) {
  const columns: { key: FieldKey; label: string; align: "left" | "right" }[] = [
    { key: "supplierName", label: "Supplier", align: "left" },
    { key: "invoiceNumber", label: "Invoice #", align: "left" },
    { key: "invoiceDate", label: "Invoice Date", align: "left" },
    { key: "dueDate", label: "Due Date", align: "left" },
    { key: "currency", label: "Currency", align: "left" },
    { key: "subtotal", label: "Subtotal", align: "right" },
    { key: "tax", label: "VAT / Tax", align: "right" },
    { key: "total", label: "Total", align: "right" },
  ];

  return (
    <div className="relative">
      {/* The table scrolls sideways; this fade tells the reader there is more. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-px right-px z-20 w-12 rounded-r-xl bg-gradient-to-l from-surface to-transparent"
      />
      <div className="overflow-auto rounded-xl border border-line bg-surface">
        <table className="w-full min-w-[1100px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-surface-2">
              <th className="sticky left-0 z-10 bg-surface-2 px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-3">
                File
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-2 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-3"
                >
                  {col.label}
                </th>
              ))}
              <th className="w-10 px-2 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row) => {
              if (row.status === "processing") {
                return (
                  <tr key={row.id}>
                    <td className="sticky left-0 z-10 bg-surface px-4 py-3 align-top">
                      <p className="max-w-[200px] truncate text-[13px] font-medium text-ink">
                        {row.fileName}
                      </p>
                      <p className="font-mono text-[11px] text-ink-3">
                        {formatFileSize(row.fileSize)}
                      </p>
                    </td>
                    <td
                      colSpan={columns.length + 1}
                      className="px-2 py-3 align-top"
                    >
                      <div className="flex items-center gap-2 text-[13px] text-ink-2">
                        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-accent" />
                        Retrying extraction…
                      </div>
                    </td>
                  </tr>
                );
              }

              if (row.status === "error") {
                return (
                  <tr key={row.id} className="bg-bad-soft/50">
                    <td className="sticky left-0 z-10 bg-bad-soft/50 px-4 py-3 align-top">
                      <p className="max-w-[200px] truncate text-[13px] font-medium text-ink">
                        {row.fileName}
                      </p>
                      <p className="font-mono text-[11px] text-ink-3">
                        {formatFileSize(row.fileSize)}
                      </p>
                    </td>
                    <td
                      colSpan={columns.length}
                      className="px-2 py-3 align-top"
                    >
                      <div className="flex items-center gap-2 text-sm text-bad">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {row.error || "Extraction failed."}
                      </div>
                    </td>
                    <td className="px-2 py-3 align-top">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onRetryRow(row.id)}
                          title="Retry extraction"
                          className="rounded-md p-1.5 text-ink-3 transition-colors hover:bg-surface-3 hover:text-accent"
                        >
                          <RotateCw className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onRemoveRow(row.id)}
                          title="Remove"
                          className="rounded-md p-1.5 text-ink-3 transition-colors hover:bg-surface-3 hover:text-bad"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }

              const data = row.data;

              return (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-surface-2"
                >
                  <td className="sticky left-0 z-10 bg-surface px-4 py-2 align-middle">
                    <p className="max-w-[200px] truncate text-[13px] font-medium text-ink">
                      {row.fileName}
                    </p>
                    <p className="font-mono text-[11px] text-ink-3">
                      {formatFileSize(row.fileSize)}
                    </p>
                  </td>
                  {columns.map((col) => {
                    const field = data?.[col.key];
                    const value = field ? String(field.value) : "";
                    return (
                      <td
                        key={col.key}
                        className={cn(
                          "px-1 py-2 align-middle",
                          col.key === "supplierName"
                            ? "min-w-[190px]"
                            : "min-w-[130px]",
                        )}
                      >
                        <div className="flex items-center gap-1.5">
                          <div className="flex-1">
                            <EditableCell
                              value={value}
                              align={col.align}
                              type={
                                numericFields.includes(col.key)
                                  ? "number"
                                  : "text"
                              }
                              onChange={(v) =>
                                onUpdateField(row.id, col.key, v)
                              }
                            />
                          </div>
                          {field && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>
                                  <ConfidenceBadge
                                    confidence={field.confidence}
                                  />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                AI confidence — click the value to correct it
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-2 py-2 align-middle">
                    <button
                      onClick={() => onRemoveRow(row.id)}
                      className="rounded-md p-1.5 text-ink-3 transition-colors hover:bg-surface-3 hover:text-bad"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
