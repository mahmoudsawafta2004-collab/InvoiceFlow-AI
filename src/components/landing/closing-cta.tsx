"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion-primitives";

export function ClosingCta() {
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
          Stop retyping invoices into{" "}
          <span className="font-display italic font-normal text-tint-iris">
            spreadsheets
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-balance-pretty text-ink-2">
          Upload a batch and watch the table fill itself. It takes about as long as
          reading this page.
        </p>
        <Link href="/workspace" className="mt-9 inline-block">
          <Button variant="primary" size="lg" className="group">
            Convert your first batch
            <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Button>
        </Link>
      </Reveal>
    </section>
  );
}
