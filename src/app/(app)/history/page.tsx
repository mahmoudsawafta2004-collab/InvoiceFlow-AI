"use client";

import { toast } from "sonner";
import { FileSpreadsheet, Trash2, Download, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Batch } from "@/lib/types";
import { useHistory, clearHistory } from "@/lib/storage";
import { buildInvoiceWorkbook, downloadBlob } from "@/lib/excel";
import { formatDate } from "@/lib/utils";

export default function HistoryPage() {
  const batches = useHistory();

  async function handleRedownload(batch: Batch) {
    const blob = await buildInvoiceWorkbook(batch.rows);
    downloadBlob(blob, `invoiceflow-export-${batch.id.slice(0, 8)}.xlsx`);
    toast.success("Excel file downloaded");
  }

  function handleClear() {
    clearHistory();
    toast.success("History cleared");
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">History</h1>
          <p className="mt-1 text-sm text-ink-2">
            Every batch you have processed, stored in this browser.
          </p>
        </div>
        {batches.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClear}>
            <Trash2 className="h-3.5 w-3.5" />
            Clear history
          </Button>
        )}
      </div>

      {batches.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-3">
              <Inbox className="h-6 w-6 text-ink-3" />
            </div>
            <p className="text-sm font-medium text-ink">No batches yet</p>
            <p className="max-w-xs text-sm text-ink-2">
              Batches you export from the Convert page will show up here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-xl border border-line bg-surface">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-line bg-surface-2">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-2">
                  Batch
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-2">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-2">
                  Invoices
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-2">
                  Status
                </th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {batches.map((batch) => (
                <tr key={batch.id} className="hover:bg-surface-2">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft">
                        <FileSpreadsheet className="h-4 w-4 text-accent" />
                      </div>
                      <span className="font-medium text-ink">
                        Batch #{batch.id.slice(0, 8)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-2">
                    {formatDate(batch.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-ink-2">{batch.rowCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Badge variant="success">{batch.successCount} ok</Badge>
                      {batch.errorCount > 0 && (
                        <Badge variant="destructive">{batch.errorCount} failed</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRedownload(batch)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
