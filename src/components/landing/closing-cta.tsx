"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion-primitives";
import { useI18n } from "@/lib/i18n/context";

export function ClosingCta() {
  const { t } = useI18n();
  const c = t.landing.closingCta;

  return (
    <section className="relative overflow-hidden border-t border-line py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(42% 62% at 30% 100%, rgb(var(--tint-iris) / 0.14), transparent 72%), radial-gradient(42% 62% at 70% 100%, rgb(var(--tint-teal) / 0.12), transparent 72%)",
        }}
      />
      <Reveal className="relative mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-balance-pretty text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-[2.6rem] sm:leading-[1.1]">
          {c.titleStart}{" "}
          <span className="font-display italic font-normal bg-gradient-to-r from-heading-blue-from to-heading-blue-to bg-clip-text text-transparent">
            {c.titleAccent}
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-balance-pretty text-ink-2">{c.sub}</p>
        <Link href="/signup" className="mt-9 inline-block">
          <Button variant="primary" size="lg" className="group">
            {c.cta}
            <ArrowRight className="rtl:-scale-x-100 transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
          </Button>
        </Link>
      </Reveal>
    </section>
  );
}
