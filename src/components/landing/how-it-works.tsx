"use client";

import { UploadCloud, ScanLine, PencilLine, Download } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion-primitives";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";

const icons = [UploadCloud, ScanLine, PencilLine, Download];
const tints = [
  "text-tint-iris bg-tint-iris-soft",
  "text-tint-teal bg-tint-teal-soft",
  "text-tint-amber bg-tint-amber-soft",
  "text-tint-violet bg-tint-violet-soft",
];

export function HowItWorks() {
  const { t } = useI18n();
  const h = t.landing.howItWorks;

  return (
    <section className="border-t border-line py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            {h.kicker}
          </p>
          <h2 className="mt-3 text-balance-pretty text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl">
            {h.titleStart}{" "}
            <span className="font-display italic font-normal bg-gradient-to-r from-heading-blue-from to-heading-blue-to bg-clip-text text-transparent">
              {h.titleAccent}
            </span>
          </h2>
        </Reveal>

        <RevealGroup className="relative mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* The connecting rule turns four cards into one process. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-5 hidden h-px lg:block"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgb(var(--tint-iris) / 0.5), rgb(var(--tint-teal) / 0.5), rgb(var(--tint-amber) / 0.5), rgb(var(--tint-violet) / 0.5), transparent)",
            }}
          />
          {h.steps.map((step, i) => {
            const Icon = icons[i];
            return (
              <RevealItem key={i} className="relative">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl shadow-raise ring-1 ring-inset ring-line",
                    tints[i]
                  )}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <p className="mt-5 font-mono text-[11px] tracking-wider text-ink-3">
                  0{i + 1}
                </p>
                <h3 className="mt-1.5 text-[15px] font-semibold tracking-[-0.01em] text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{step.body}</p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
