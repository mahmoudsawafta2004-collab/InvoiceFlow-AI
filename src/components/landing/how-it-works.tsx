"use client";

import { UploadCloud, ScanLine, PencilLine, Download } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion-primitives";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: UploadCloud,
    tint: "text-tint-iris bg-tint-iris-soft",
    rule: "rgb(var(--tint-iris))",
    title: "Upload",
    body: "Drag in 1 to 50 invoice PDFs at once. No templates to configure, no mapping to set up.",
  },
  {
    icon: ScanLine,
    tint: "text-tint-teal bg-tint-teal-soft",
    rule: "rgb(var(--tint-teal))",
    title: "Extract",
    body: "Each invoice is read for supplier, numbers, dates, currency, tax and totals — in parallel.",
  },
  {
    icon: PencilLine,
    tint: "text-tint-amber bg-tint-amber-soft",
    rule: "rgb(var(--tint-amber))",
    title: "Review",
    body: "Every field carries a confidence score. Click any value to correct it before you export.",
  },
  {
    icon: Download,
    tint: "text-tint-violet bg-tint-violet-soft",
    rule: "rgb(var(--tint-violet))",
    title: "Export",
    body: "One click produces a formatted .xlsx with column totals, ready for your ledger.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-line py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-tint-teal">
            How it works
          </p>
          <h2 className="mt-3 text-balance-pretty text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl">
            Four steps from folder to{" "}
            <span className="font-display italic font-normal text-tint-teal">
              spreadsheet
            </span>
          </h2>
        </Reveal>

        <RevealGroup className="relative mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* The connecting rule turns four cards into one process. */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-5 hidden h-px lg:block"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgb(var(--tint-iris) / 0.5), rgb(var(--tint-teal) / 0.5), rgb(var(--tint-amber) / 0.5), rgb(var(--tint-violet) / 0.5), transparent)",
            }}
          />
          {steps.map((step, i) => (
            <RevealItem key={step.title} className="relative">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl shadow-raise ring-1 ring-inset ring-line",
                  step.tint
                )}
              >
                <step.icon className="h-4.5 w-4.5" />
              </div>
              <p className="mt-5 font-mono text-[11px] tracking-wider text-ink-3">
                0{i + 1}
              </p>
              <h3 className="mt-1.5 text-[15px] font-semibold tracking-[-0.01em] text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{step.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
