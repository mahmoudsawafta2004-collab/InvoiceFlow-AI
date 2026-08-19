"use client";

import { motion } from "motion/react";
import { Gauge, Layers, ShieldCheck, Table2, Coins } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion-primitives";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";

const icons = [Gauge, Layers, Table2, ShieldCheck, Coins];
const spans = ["lg:col-span-3", "lg:col-span-3", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2"];
const tints = [
  "text-tint-iris bg-tint-iris-soft",
  "text-tint-teal bg-tint-teal-soft",
  "text-tint-violet bg-tint-violet-soft",
  "text-tint-rose bg-tint-rose-soft",
  "text-tint-amber bg-tint-amber-soft",
];
const glows = [
  "rgb(var(--tint-iris) / 0.12)",
  "rgb(var(--tint-teal) / 0.12)",
  "rgb(var(--tint-violet) / 0.12)",
  "rgb(var(--tint-rose) / 0.12)",
  "rgb(var(--tint-amber) / 0.12)",
];

export function Features() {
  const { t } = useI18n();
  const h = t.landing.features;

  return (
    <section className="border-t border-line py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-xl text-center">
          {/* Headings stay in the brand blue rather than each section
              claiming its own hue — the categorical tints below are reserved
              for labelling the five feature cards, not for headline colour. */}
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            {h.kicker}
          </p>
          <h2 className="mt-3 text-balance-pretty text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl">
            {h.titleStart}{" "}
            <span className="font-display italic font-normal bg-gradient-to-r from-heading-blue-from to-heading-blue-to bg-clip-text text-transparent">
              {h.titleAccent}
            </span>
          </h2>
          <p className="mt-4 text-balance-pretty text-ink-2">{h.sub}</p>
        </Reveal>

        <RevealGroup className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {h.cards.map((card, i) => (
            <RevealItem key={card.title} className={cn(spans[i])}>
              <FeatureCard
                icon={icons[i]}
                title={card.title}
                body={card.body}
                tint={tints[i]}
                glow={glows[i]}
              />
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
