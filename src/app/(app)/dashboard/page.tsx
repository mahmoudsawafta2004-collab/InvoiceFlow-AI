"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { toast } from "sonner";
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
import { BillingCard } from "@/components/billing-card";
import { useHistory } from "@/lib/storage";
import { formatDate } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export default function DashboardPage() {
  const { t } = useI18n();
  const d = t.dashboard;
  const batches = useHistory();

  // A plan chosen on the pricing page before signing up arrives here as
  // ?plan=; fire the checkout it implied exactly once instead of leaving the
  // visitor to find the button again.
  const triggeredRef = useRef(false);
  useEffect(() => {
    if (triggeredRef.current) return;
    const params = new URLSearchParams(window.location.search);
    const plan = params.get("plan");
    if (!plan) return;
    triggeredRef.current = true;

    window.history.replaceState(null, "", "/dashboard");

    fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planKey: plan }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.url) window.location.href = json.url;
        else if (json.error) toast.error(json.error);
      })
      .catch(() => {});
  }, []);

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
      label: d.stats.totalInvoices,
      value: totalInvoices.toLocaleString(),
      icon: FileText,
    },
    {
      label: d.stats.batchesRun,
      value: batches.length.toLocaleString(),
      icon: Layers,
    },
    {
      label: d.stats.successRate,
      value: totalInvoices > 0 ? `${successRate}%` : "—",
      icon: CheckCircle2,
    },
    {
      label: d.stats.avgConfidence,
      value: confidences.length > 0 ? `${avgConfidence}%` : "—",
      icon: Gauge,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">{d.title}</h1>
          <p className="mt-1 text-sm text-ink-2">{d.subtitle}</p>
        </div>
        <Link href="/workspace">
          <Button variant="primary" size="sm">
            {d.newBatch}
            <ArrowRight className="rtl:-scale-x-100 h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      <BillingCard />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-ink-2">{stat.label}</p>
                <stat.icon className="h-4 w-4 text-ink-3" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-ink">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink">{d.recentBatches}</h2>
          <Link href="/history" className="text-sm font-medium text-accent hover:text-accent">
            {d.viewAll}
          </Link>
        </div>

        {batches.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <p className="text-sm font-medium text-ink">{d.empty.title}</p>
              <p className="max-w-xs text-sm text-ink-2">{d.empty.body}</p>
              <Link href="/workspace">
                <Button variant="primary" size="sm" className="mt-2">
                  {d.empty.cta}
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
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft">
                      <FileText className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {d.batchLabel(batch.id.slice(0, 8))}
                      </p>
                      <p className="text-xs text-ink-2">
                        {formatDate(batch.createdAt)} · {d.invoicesCount(batch.rowCount)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="success">{d.ok(batch.successCount)}</Badge>
                    {batch.errorCount > 0 && (
                      <Badge variant="destructive">{d.failedCount(batch.errorCount)}</Badge>
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
