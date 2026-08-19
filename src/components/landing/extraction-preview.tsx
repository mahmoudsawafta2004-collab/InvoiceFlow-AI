"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "motion/react";
import { Check, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE } from "@/components/motion-primitives";
import { useI18n } from "@/lib/i18n/context";

type Row = {
  file: string;
  supplier: string;
  number: string;
  date: string;
  currency: string;
  total: string;
  confidence: number;
};

/** Mirrors the real sample invoices shipped in samples/. */
const ROWS: Row[] = [
  { file: "nimbus-cloud.pdf", supplier: "Nimbus Cloud Services", number: "NCS-2026-0881", date: "2026-07-03", currency: "EUR", total: "1,166.20", confidence: 0.99 },
  { file: "cedar-wood.pdf", supplier: "Cedar Wood Furniture", number: "CWF/4471", date: "2026-06-15", currency: "JOD", total: "1,371.12", confidence: 0.99 },
  { file: "meridian-legal.pdf", supplier: "Meridian Legal Partners", number: "INV 90233", date: "2026-08-01", currency: "GBP", total: "2,592.00", confidence: 0.98 },
  { file: "technoparts.pdf", supplier: "TechnoParts Trading", number: "TP-55120", date: "2026-05-22", currency: "USD", total: "1,707.50", confidence: 0.72 },
  { file: "sahara-logistics.pdf", supplier: "Sahara Logistics FZE", number: "SL2026/331", date: "2026-07-28", currency: "AED", total: "3,832.50", confidence: 0.99 },
];

const STEP_MS = 900;

export function ExtractionPreview() {
  const { t } = useI18n();
  const p = t.landing.preview;
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // `once` keeps the demo from replaying every time it scrolls back into view.
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const [done, setDone] = useState(reduced ? ROWS.length : 0);

  useEffect(() => {
    // Runs a single pass on first sight, then holds the finished table. A
    // permanent loop pulls the eye away from the copy beside it.
    if (reduced || !inView || done >= ROWS.length) return;
    const t = setTimeout(() => setDone((d) => d + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [done, reduced, inView]);

  const pct = Math.round((done / ROWS.length) * 100);

  return (
    <div ref={ref} className="mx-auto max-w-5xl">
      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-float">
        {/* Chrome */}
        <div className="flex items-center gap-3 border-b border-line bg-surface-2 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          </div>
          <div className="mx-auto flex items-center gap-2 rounded-md bg-surface-3 px-3 py-1 font-mono text-[11px] text-ink-3">
            {p.url}
          </div>
        </div>

        {/* Status strip */}
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5">
          <div className="flex items-center gap-2.5 text-sm">
            <AnimatePresence mode="wait" initial={false}>
              {done < ROWS.length ? (
                <motion.span
                  key="working"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-ink-2"
                >
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
                  {p.extracting}
                </motion.span>
              ) : (
                <motion.span
                  key="done"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 font-medium text-ok"
                >
                  <Check className="h-3.5 w-3.5" />
                  {p.extracted(ROWS.length)}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <span className="tabular font-mono text-xs text-ink-3">{pct}%</span>
        </div>

        {/* Progress hairline */}
        <div className="h-px w-full bg-line">
          <motion.div
            className="h-px bg-accent"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: EASE }}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-start">
            <thead>
              <tr className="border-b border-line">
                {[p.columns.file, p.columns.supplier, p.columns.number, p.columns.date, p.columns.total, ""].map(
                  (h, i) => (
                    <th
                      key={i}
                      className="px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-3"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => {
                const filled = i < done;
                return (
                  <tr key={row.file} className="border-b border-line/60 last:border-0">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <FileText
                          className={cn(
                            "h-3.5 w-3.5 transition-colors duration-300",
                            filled ? "text-accent" : "text-ink-3/50"
                          )}
                        />
                        <span className="font-mono text-[11px] text-ink-3">{row.file}</span>
                      </div>
                    </td>
                    <Cell filled={filled} delay={0}>{row.supplier}</Cell>
                    <Cell filled={filled} delay={0.05} mono>{row.number}</Cell>
                    <Cell filled={filled} delay={0.1} mono>{row.date}</Cell>
                    <Cell filled={filled} delay={0.15} mono align="end">
                      {row.currency} {row.total}
                    </Cell>
                    <td className="px-5 py-3">
                      <AnimatePresence>
                        {filled && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, ease: EASE, delay: 0.2 }}
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium tabular",
                              row.confidence >= 0.9
                                ? "bg-ok-soft text-ok"
                                : "bg-warn-soft text-warn"
                            )}
                          >
                            <span
                              className={cn(
                                "h-1 w-1 rounded-full",
                                row.confidence >= 0.9 ? "bg-ok" : "bg-warn"
                              )}
                            />
                            {Math.round(row.confidence * 100)}%
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-center text-[13px] text-ink-3">{p.note}</p>
    </div>
  );
}

function Cell({
  children,
  filled,
  delay,
  mono,
  align = "start",
}: {
  children: React.ReactNode;
  filled: boolean;
  delay: number;
  mono?: boolean;
  align?: "start" | "end";
}) {
  return (
    <td className={cn("px-5 py-3", align === "end" && "text-end")}>
      {filled ? (
        <motion.span
          initial={{ opacity: 0, y: 3, filter: "blur(3px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.35, ease: EASE, delay }}
          className={cn(
            "inline-block text-[13px] text-ink",
            mono && "font-mono text-[12px] tabular"
          )}
        >
          {children}
        </motion.span>
      ) : (
        <span
          className="inline-block h-3 rounded bg-surface-3"
          style={{ width: align === "end" ? "5.5rem" : "7rem" }}
        />
      )}
    </td>
  );
}
