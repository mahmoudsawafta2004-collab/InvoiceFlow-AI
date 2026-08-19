"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowRight,
  Download,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dropzone } from "@/components/dropzone";
import { FileQueueList } from "@/components/file-queue-list";
import { InvoiceReviewTable } from "@/components/invoice-review-table";
import { StepIndicator, type Step } from "@/components/step-indicator";
import type { FieldKey, InvoiceRow } from "@/lib/types";
import { extractInvoice, ExtractionError } from "@/lib/extract";
import { runWithConcurrency } from "@/lib/pool";
import { buildInvoiceWorkbook, downloadBlob } from "@/lib/excel";
import { saveBatch } from "@/lib/storage";
import { useServerKeyConfigured } from "@/lib/use-server-key";
import { useI18n } from "@/lib/i18n/context";

type Stage = "upload" | "processing" | "review";

const stageIndex: Record<Stage, number> = { upload: 0, processing: 1, review: 2 };

function makeId() {
  return crypto.randomUUID();
}

export default function WorkspacePage() {
  const { t } = useI18n();
  const w = t.workspace;
  const [stage, setStage] = useState<Stage>("upload");
  const [rows, setRows] = useState<InvoiceRow[]>([]);
  const [progress, setProgress] = useState(0);
  const [exporting, setExporting] = useState(false);
  const filesRef = useRef<Map<string, File>>(new Map());

  const steps: Step[] = [
    { key: "upload", label: w.steps.upload },
    { key: "processing", label: w.steps.extraction },
    { key: "review", label: w.steps.review },
  ];

  // Extraction runs entirely on the deployment's own key. `serverKey` is null
  // until /api/config answers, so the UI stays neutral until then.
  const serverKey = useServerKeyConfigured();
  const hasApiKey = serverKey === true;
  const extractionUnavailable = serverKey === false;

  function handleFiles(newFiles: File[]) {
    setRows((prev) => {
      const existingNames = new Set(prev.map((r) => r.fileName));
      const additions: InvoiceRow[] = [];
      let duplicateCount = 0;
      for (const file of newFiles) {
        if (existingNames.has(file.name)) {
          duplicateCount += 1;
          continue;
        }
        const id = makeId();
        filesRef.current.set(id, file);
        additions.push({
          id,
          fileName: file.name,
          fileSize: file.size,
          status: "queued",
        });
      }

      const combined = [...prev, ...additions];
      const overflow = Math.max(0, combined.length - 50);
      const finalRows = combined.slice(0, 50);
      for (const dropped of combined.slice(50)) {
        filesRef.current.delete(dropped.id);
      }

      if (duplicateCount > 0) {
        toast.info(w.toasts.duplicatesSkipped(duplicateCount));
      }
      if (overflow > 0) {
        toast.info(w.toasts.overflowKept(overflow));
      }

      return finalRows;
    });
  }

  function removeRow(id: string) {
    filesRef.current.delete(id);
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  async function processRow(rowId: string) {
    const file = filesRef.current.get(rowId);
    if (!file) {
      setRows((prev) =>
        prev.map((r) =>
          r.id === rowId ? { ...r, status: "error", error: w.errors.fileGone } : r
        )
      );
      return;
    }
    try {
      const data = await extractInvoice(file);
      setRows((prev) =>
        prev.map((r) => (r.id === rowId ? { ...r, status: "done", data, error: undefined } : r))
      );
    } catch (err) {
      const message = err instanceof ExtractionError ? err.message : w.errors.extractionFailed;
      setRows((prev) =>
        prev.map((r) => (r.id === rowId ? { ...r, status: "error", error: message } : r))
      );
    }
  }

  async function startExtraction() {
    if (rows.length === 0) return;
    setStage("processing");
    setProgress(0);

    let completed = 0;
    const total = rows.length;
    const rowIds = rows.map((r) => r.id);

    setRows((prev) => prev.map((r) => ({ ...r, status: "processing" as const })));

    await runWithConcurrency(rowIds, 4, async (rowId) => {
      await processRow(rowId);
      completed += 1;
      setProgress(Math.round((completed / total) * 100));
    });

    setStage("review");
  }

  async function retryRow(rowId: string) {
    setRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, status: "processing", error: undefined } : r))
    );
    await processRow(rowId);
  }

  function updateField(rowId: string, field: FieldKey, value: string) {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== rowId || !r.data) return r;
        const isNumeric = field === "subtotal" || field === "tax" || field === "total";
        const parsed = isNumeric ? Number(value) || 0 : value;
        return {
          ...r,
          data: {
            ...r.data,
            [field]: { value: parsed, confidence: 1 },
          },
        };
      })
    );
  }

  async function handleExport() {
    setExporting(true);
    try {
      const blob = await buildInvoiceWorkbook(rows);
      const filename = `invoiceflow-export-${new Date().toISOString().slice(0, 10)}.xlsx`;
      downloadBlob(blob, filename);
      saveBatch(rows);
      toast.success(w.toasts.exportSuccessTitle, {
        description: w.toasts.exportSuccessDesc(rows.filter((r) => r.status === "done").length),
      });
    } catch {
      toast.error(w.toasts.exportError);
    } finally {
      setExporting(false);
    }
  }

  function resetAll() {
    filesRef.current.clear();
    setRows([]);
    setProgress(0);
    setStage("upload");
  }

  const successCount = rows.filter((r) => r.status === "done").length;
  const errorCount = rows.filter((r) => r.status === "error").length;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">{w.title}</h1>
          <p className="mt-1 text-sm text-ink-2">{w.subtitle}</p>
        </div>
        {stage !== "upload" && (
          <Button variant="outline" size="sm" onClick={resetAll}>
            <RotateCcw className="h-3.5 w-3.5" />
            {w.startOver}
          </Button>
        )}
      </div>

      <div className="mb-10">
        <StepIndicator steps={steps} currentIndex={stageIndex[stage]} />
      </div>

      {extractionUnavailable && (
        <Card className="mb-6 border-warn/30 bg-warn-soft">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warn-soft">
              <AlertTriangle className="h-4.5 w-4.5 text-warn" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink">{w.unavailable.title}</p>
              <p className="text-sm text-warn">{w.unavailable.body}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {stage === "upload" && (
        <div className="space-y-6">
          <Dropzone onFiles={handleFiles} />
          {rows.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-ink-2">{w.filesReady(rows.length)}</p>
              </div>
              <FileQueueList rows={rows} onRemove={removeRow} />
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={startExtraction}
                  disabled={!hasApiKey}
                >
                  <Sparkles className="h-4 w-4" />
                  {w.extractButton(rows.length)}
                  <ArrowRight className="rtl:-scale-x-100 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {stage === "processing" && (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-ink-2">{w.extracting}</span>
                <span className="tabular-nums text-ink-2">{progress}%</span>
              </div>
              <Progress value={progress} />
            </CardContent>
          </Card>
          <FileQueueList rows={rows} />
        </div>
      )}

      {stage === "review" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm">
              <span className="font-medium text-ink">{w.extracted(successCount)}</span>
              {errorCount > 0 && (
                <span className="font-medium text-bad">{w.failed(errorCount)}</span>
              )}
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleExport}
              disabled={exporting || successCount === 0}
            >
              <Download className="h-4 w-4" />
              {exporting ? w.exporting : w.download}
            </Button>
          </div>
          <InvoiceReviewTable
            rows={rows}
            onUpdateField={updateField}
            onRemoveRow={removeRow}
            onRetryRow={retryRow}
          />
        </div>
      )}
    </div>
  );
}
