import type { ReactNode } from "react";
import { Wordmark } from "@/components/wordmark";
import { LandingFooter } from "@/components/landing/landing-footer";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-canvas text-ink">
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-6">
          <Wordmark />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="text-3xl font-semibold tracking-[-0.02em] text-ink">{title}</h1>
        <p className="mt-2 text-[13px] text-ink-3">Last updated: {updated}</p>
        <div className="prose-legal mt-10 space-y-8 text-[15px] leading-relaxed text-ink-2">
          {children}
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
