"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExtractionPreview } from "@/components/landing/extraction-preview";
import { EASE } from "@/components/motion-primitives";

const line = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay: 0.06 * i },
  }),
};

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient light. Two offset pools read as depth; one centred glow reads as a template. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 h-[560px]"
        style={{
          background:
            "radial-gradient(52% 60% at 30% 0%, rgb(var(--accent) / 0.20), transparent 70%), radial-gradient(40% 50% at 78% 12%, rgb(var(--accent) / 0.12), transparent 72%)",
        }}
      />
      {/* A faint grid grounds the glow so it doesn't float. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(var(--line)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--line)) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(70% 55% at 50% 0%, black 20%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(70% 55% at 50% 0%, black 20%, transparent 78%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-20 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div variants={line} custom={0} initial="hidden" animate="show">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3 py-1 text-xs font-medium text-ink-2 backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ok" />
              </span>
              Built for accountants and finance teams
            </span>
          </motion.div>

          <motion.h1
            variants={line}
            custom={1}
            initial="hidden"
            animate="show"
            className="mt-6 text-balance-pretty text-[2.6rem] font-semibold leading-[1.06] tracking-[-0.035em] text-ink sm:text-6xl"
          >
            Fifty invoice PDFs in.
            <br />
            <span className="bg-gradient-to-br from-accent via-accent-hover to-accent bg-clip-text text-transparent">
              One clean spreadsheet
            </span>{" "}
            out.
          </motion.h1>

          <motion.p
            variants={line}
            custom={2}
            initial="hidden"
            animate="show"
            className="mx-auto mt-6 max-w-xl text-balance-pretty text-[17px] leading-relaxed text-ink-2"
          >
            Drop a stack of invoices and get every supplier, date, tax figure and
            total extracted into Excel — with a confidence score on each field so
            you know exactly what to double-check.
          </motion.p>

          <motion.div
            variants={line}
            custom={3}
            initial="hidden"
            animate="show"
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link href="/workspace" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="group w-full sm:w-auto">
                Convert your first batch
                <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="/workspace" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                See it work
              </Button>
            </Link>
          </motion.div>

          <motion.p
            variants={line}
            custom={4}
            initial="hidden"
            animate="show"
            className="mt-4 text-[13px] text-ink-3"
          >
            No sign-up · No credit card · A full batch of 50 in about 3 minutes
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 34, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.85, ease: EASE, delay: 0.34 }}
          className="mt-16"
        >
          <ExtractionPreview />
        </motion.div>
      </div>
    </section>
  );
}
