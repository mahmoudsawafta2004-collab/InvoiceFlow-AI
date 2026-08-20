"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Wordmark } from "@/components/wordmark";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LandingFooter } from "@/components/landing/landing-footer";
import { useI18n } from "@/lib/i18n/context";

interface LegalSection {
  heading: string;
  body?: string;
  items?: string[];
}

export function LegalPage({ kind }: { kind: "terms" | "privacy" }) {
  const { t } = useI18n();
  const doc = t.legal[kind];
  const sections = doc.sections as LegalSection[];

  return (
    <div className="bg-canvas text-ink">
      {/* Same chrome as the rest of the app (wordmark, language, theme) plus
          an explicit back link — these pages previously had no way back
          except the browser button. */}
      <header className="sticky top-0 z-40 border-b border-line bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-[13px] font-medium text-ink-2 transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" />
            {t.legal.backToHome}
          </Link>
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-14">
        <Wordmark className="mb-8" />
        <h1 className="text-3xl font-semibold tracking-[-0.02em] text-ink">{doc.title}</h1>
        <p className="mt-2 text-[13px] text-ink-3">{t.legal.lastUpdated(doc.updated)}</p>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-ink-2">
          {sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-lg font-semibold text-ink">{section.heading}</h2>
              {section.items && (
                <ul className="mt-2 list-disc space-y-1 ps-5">
                  {section.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              )}
              {section.body && <p className="mt-2">{section.body}</p>}
            </section>
          ))}
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
