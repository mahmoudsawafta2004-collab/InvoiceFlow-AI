"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowRight,
  Download,
  KeyRound,
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
import { saveBatch, useApiKey } from "@/lib/storage";

type Stage = "upload" | "processing" | "review";

const steps: Step[] = [
  { key: "upload", label: "Upload" },
  { key: "processing", label: "AI Extraction" },
  { key: "review", label: "Review & Export" },
];

const stageIndex: Record<Stage, number> = { upload: 0, processing: 1, review: 2 };

function makeId() {
  return crypto.randomUUID();
}

export default function WorkspacePage() {
  const [stage, setStage] = useState<Stage>("upload");
  const [rows, setRows] = useState<InvoiceRow[]>([]);
  const [progress, setProgress] = useState(0);
  const [exporting, setExporting] = useState(false);
  const filesRef = useRef<Map<string, File>>(new Map());
  const hasApiKey = !!useApiKey();

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
        toast.info(
          `Skipped ${duplicateCount} file${duplicateCount > 1 ? "s" : ""} already in the queue.`
        );
      }
      if (overflow > 0) {
        toast.info(`Only the first 50 files were kept — ${overflow} were not added.`);
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
          r.id === rowId
            ? { ...r, status: "error", error: "The original file is no longer available." }
            : r
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
      const message = err instanceof ExtractionError ? err.message : "Extraction failed.";
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
      toast.success("Excel file exported", {
        description: `${rows.filter((r) => r.status === "done").length} invoices included.`,
      });
    } catch {
      toast.error("Export failed. Please try again.");
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
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Convert Invoices
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Upload, extract, review, and export — all in one place.
          </p>
        </div>
        {stage !== "upload" && (
          <Button variant="outline" size="sm" onClick={resetAll}>
            <RotateCcw className="h-3.5 w-3.5" />
            Start over
          </Button>
        )}
      </div>

      <div className="mb-10">
        <StepIndicator steps={steps} currentIndex={stageIndex[stage]} />
      </div>

      {!hasApiKey && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="flex items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                <KeyRound className="h-4.5 w-4.5 text-amber-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-900">
                  Add your Gemini API key to enable extraction
                </p>
                <p className="text-sm text-amber-700">
                  You can still upload files now — add the key any time in Settings.
                </p>
              </div>
            </div>
            <Link href="/settings">
              <Button size="sm" variant="outline" className="border-amber-300 bg-white">
                Go to Settings
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {stage === "upload" && (
        <div className="space-y-6">
          <Dropzone onFiles={handleFiles} />
          {rows.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-neutral-700">
                  {rows.length} file{rows.length > 1 ? "s" : ""} ready
                </p>
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
                  Extract {rows.length} invoice{rows.length > 1 ? "s" : ""}
                  <ArrowRight className="h-4 w-4" />
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
                <span className="font-medium text-neutral-700">
                  Extracting invoice data…
                </span>
                <span className="tabular-nums text-neutral-500">{progress}%</span>
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
              <span className="font-medium text-neutral-900">
                {successCount} extracted
              </span>
              {errorCount > 0 && (
                <span className="font-medium text-red-600">{errorCount} failed</span>
              )}
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleExport}
              disabled={exporting || successCount === 0}
            >
              <Download className="h-4 w-4" />
              {exporting ? "Exporting…" : "Download Excel (.xlsx)"}
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
