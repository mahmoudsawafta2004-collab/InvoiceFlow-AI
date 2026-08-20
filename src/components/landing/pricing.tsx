"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import type { Plan } from "@/lib/supabase/types";
import { formatPrice } from "@/lib/plans";
import { PricingButton } from "@/components/landing/pricing-button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion-primitives";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

const tints = [
  "text-tint-teal bg-tint-teal-soft",
  "text-tint-iris bg-tint-iris-soft",
  "text-tint-violet bg-tint-violet-soft",
  "text-tint-amber bg-tint-amber-soft",
];

export function Pricing({ plans }: { plans: Plan[] }) {
  const { t } = useI18n();
  const p = t.landing.pricing;

  // The second-from-last paid tier reads as the "serious" choice — highlight it
  // rather than always the middle card, which breaks down at 4+ tiers.
  const highlightIndex = Math.min(plans.length - 2, plans.length - 1);

  return (
    <section id="pricing" className="border-t border-line py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            {p.kicker}
          </p>
          <h2 className="mt-3 text-balance-pretty text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl">
            {p.titleStart}{" "}
            <span className="font-display italic font-normal bg-gradient-to-r from-heading-blue-from to-heading-blue-to bg-clip-text text-transparent">
              {p.titleAccent}
            </span>{" "}
            {p.titleEnd}
          </h2>
          <p className="mt-4 text-balance-pretty text-ink-2">{p.sub}</p>
        </Reveal>

        <RevealGroup className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, i) => {
            const isFree = plan.price_cents === 0;
            const highlighted = i === highlightIndex && !isFree;
            return (
              <RevealItem key={plan.id}>
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  className={cn(
                    "relative flex h-full flex-col rounded-xl border p-6 shadow-raise",
                    highlighted
                      ? "border-accent bg-surface ring-2 ring-accent/20"
                      : "border-line bg-surface"
                  )}
                >
                  {highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-medium text-accent-ink">
                      {p.mostPopular}
                    </span>
                  )}

                  <span
                    className={cn(
                      "inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                      tints[i % tints.length]
                    )}
                  >
                    {plan.name}
                  </span>

                  <p className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-ink">
                    {formatPrice(plan.price_cents, plan.currency)}
                    {!isFree && (
                      <span className="text-sm font-normal text-ink-3">{p.perMonth}</span>
                    )}
                  </p>

                  <ul className="mt-5 space-y-2.5 text-[13px] text-ink-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 shrink-0 text-ok" />
                      {p.featureInvoices(plan.monthly_invoice_limit)}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 shrink-0 text-ok" />
                      {p.featureConfidence}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 shrink-0 text-ok" />
                      {p.featureExcel}
                    </li>
                  </ul>

                  <div className="mt-6 flex-1" />

                  <PricingButton
                    planKey={plan.key}
                    isFree={isFree}
                    highlighted={highlighted}
                    label={isFree ? p.startFree : p.choose(plan.name)}
                  />
                </motion.div>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <p className="mt-8 text-center text-[13px] text-ink-3">{p.note}</p>
      </div>
    </section>
  );
}
