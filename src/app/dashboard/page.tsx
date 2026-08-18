"use client";

import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  Gauge,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useHistory } from "@/lib/storage";
import { formatDate } from "@/lib/utils";

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export default function DashboardPage() {
  const batches = useHistory();

  const totalInvoices = batches.reduce((sum, b) => sum + b.rowCount, 0);
  const totalSuccess = batches.reduce((sum, b) => sum + b.successCount, 0);
  const successRate = totalInvoices > 0 ? Math.round((totalSuccess / totalInvoices) * 100) : 0;

  const confidences = batches.flatMap((b) =>
    b.rows
      .filter((r) => r.status === "done" && r.data)
      .flatMap((r) =>
        Object.values(r.data!).map((f) => (f as { confidence: number }).confidence)
      )
  );
  const avgConfidence = Math.round(average(confidences) * 100);

  const stats = [
    {
      label: "Total invoices processed",
      value: totalInvoices.toLocaleString(),
      icon: FileText,
    },
    {
      label: "Batches run",
      value: batches.length.toLocaleString(),
      icon: Layers,
    },
    {
      label: "Success rate",
      value: totalInvoices > 0 ? `${successRate}%` : "—",
      icon: CheckCircle2,
    },
    {
      label: "Avg. confidence",
      value: confidences.length > 0 ? `${avgConfidence}%` : "—",
      icon: Gauge,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            An overview of your invoice processing activity.
          </p>
        </div>
        <Link href="/workspace">
          <Button variant="primary" size="sm">
            New batch
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-500">{stat.label}</p>
                <stat.icon className="h-4 w-4 text-neutral-400" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-neutral-900">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-neutral-900">Recent batches</h2>
          <Link href="/history" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            View all
          </Link>
        </div>

        {batches.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <p className="text-sm font-medium text-neutral-900">
                No activity yet
              </p>
              <p className="max-w-xs text-sm text-neutral-500">
                Run your first batch to see stats and history here.
              </p>
              <Link href="/workspace">
                <Button variant="primary" size="sm" className="mt-2">
                  Convert invoices
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {batches.slice(0, 5).map((batch) => (
              <Card key={batch.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
                      <FileText className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        Batch #{batch.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {formatDate(batch.createdAt)} · {batch.rowCount} invoices
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="success">{batch.successCount} ok</Badge>
                    {batch.errorCount > 0 && (
                      <Badge variant="destructive">{batch.errorCount} failed</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
