"use client";

import { motion } from "motion/react";
import { Gauge, Layers, ShieldCheck, Table2, Coins } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion-primitives";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Gauge,
    title: "Confidence on every field",
    body: "The extractor reports how sure it is, field by field. Anything uncertain is flagged in amber so you review the three values that matter instead of re-checking all forty.",
    span: "lg:col-span-3",
    tint: "text-tint-iris bg-tint-iris-soft",
    glow: "rgb(var(--tint-iris) / 0.12)",
  },
  {
    icon: Layers,
    title: "Batches, not one-offs",
    body: "Up to 50 invoices per run, processed in parallel with a live progress read-out.",
    span: "lg:col-span-3",
    tint: "text-tint-teal bg-tint-teal-soft",
    glow: "rgb(var(--tint-teal) / 0.12)",
  },
  {
    icon: Table2,
    title: "Excel that's actually usable",
    body: "Typed number columns, frozen headers, filters and a totals row with live formulas.",
    span: "lg:col-span-2",
    tint: "text-tint-violet bg-tint-violet-soft",
    glow: "rgb(var(--tint-violet) / 0.12)",
  },
  {
    icon: ShieldCheck,
    title: "Nothing stored",
    body: "Invoices are held in memory only long enough to read them. No database, no files at rest.",
    span: "lg:col-span-2",
    tint: "text-tint-rose bg-tint-rose-soft",
    glow: "rgb(var(--tint-rose) / 0.12)",
  },
  {
    icon: Coins,
    title: "Mixed currencies",
    body: "Reads EUR, GBP, USD, JOD, AED and more — inferred from symbols when unlabelled.",
    span: "lg:col-span-2",
    tint: "text-tint-amber bg-tint-amber-soft",
    glow: "rgb(var(--tint-amber) / 0.12)",
  },
];

export function Features() {
  return (
    <section className="border-t border-line py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-tint-rose">
            Why teams keep it
          </p>
          <h2 className="mt-3 text-balance-pretty text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl">
            Built around the part that actually{" "}
            <span className="font-display italic font-normal text-tint-rose">
              takes time
            </span>
          </h2>
          <p className="mt-4 text-balance-pretty text-ink-2">
            Reading an invoice is quick. Typing forty of them into a spreadsheet is
            not. That is the only problem this solves, and it solves it properly.
          </p>
        </Reveal>

        <RevealGroup className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {features.map((f) => (
            <RevealItem key={f.title} className={cn(f.span)}>
              <FeatureCard {...f} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  body,
  tint,
  glow,
}: {
  icon: typeof Gauge;
  title: string;
  body: string;
  tint: string;
  glow: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="group relative h-full overflow-hidden rounded-xl border border-line bg-surface p-6 shadow-raise"
    >
      {/* Each card's wash matches its own hue, so the colour reads as a label. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(120% 80% at 50% 0%, ${glow}, transparent 70%)`,
        }}
      />
      <div className="relative">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset ring-line",
            tint
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="mt-4 text-[15px] font-semibold tracking-[-0.01em] text-ink">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">{body}</p>
      </div>
    </motion.div>
  );
}
