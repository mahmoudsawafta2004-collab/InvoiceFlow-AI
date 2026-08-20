"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExtractionPreview } from "@/components/landing/extraction-preview";
import { EASE } from "@/components/motion-primitives";
import { useI18n } from "@/lib/i18n/context";

const line = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay: 0.06 * i },
  }),
};

export function Hero() {
  const { t } = useI18n();
  const h = t.landing.hero;

  return (
    <section className="relative overflow-hidden">
      {/* Ambient light. Two offset pools read as depth; one centred glow reads as a template. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 h-[560px]"
        style={{
          background:
            "radial-gradient(46% 55% at 22% 0%, rgb(var(--tint-iris) / 0.16), transparent 70%), radial-gradient(40% 50% at 62% 6%, rgb(var(--tint-teal) / 0.13), transparent 72%), radial-gradient(38% 48% at 88% 16%, rgb(var(--tint-rose) / 0.11), transparent 72%)",
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
          {/* An editorial kicker rather than a pill badge — the bordered capsule
              with an icon is the stock landing-page motif, and reads as one. */}
          <motion.div variants={line} custom={0} initial="hidden" animate="show">
            <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              <span aria-hidden className="hidden h-px w-10 bg-accent/35 sm:block" />
              {h.kicker}
              <span aria-hidden className="hidden h-px w-10 bg-accent/35 sm:block" />
            </span>
          </motion.div>

          <motion.h1
            variants={line}
            custom={1}
            initial="hidden"
            animate="show"
            className="mt-6 text-balance-pretty text-[2.6rem] font-semibold leading-[1.06] tracking-[-0.035em] text-ink sm:text-6xl"
          >
            {h.headline1}
            <br />
            <span className="font-display italic font-normal bg-gradient-to-r from-heading-blue-from to-heading-blue-to bg-clip-text text-transparent">
              {h.headlineAccent}
            </span>
            {h.headlineEnd}
          </motion.h1>

          <motion.p
            variants={line}
            custom={2}
            initial="hidden"
            animate="show"
            className="mx-auto mt-6 max-w-xl text-balance-pretty text-[17px] leading-relaxed text-ink-2"
          >
            {h.sub}
          </motion.p>

          <motion.div
            variants={line}
            custom={3}
            initial="hidden"
            animate="show"
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link href="/signup" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="group w-full sm:w-auto">
                {h.ctaPrimary}
                <ArrowRight className="rtl:-scale-x-100 transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
              </Button>
            </Link>
            <Link href="/signup" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                {h.ctaSecondary}
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
            {h.note}
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
