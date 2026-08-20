"use client";

import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import { useI18n } from "@/lib/i18n/context";

export function LandingFooter() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-6 py-9 sm:flex-row">
        {/* Names the product and says plainly what it does — the sentence an
            OAuth reviewer looks for when matching a consent screen to a site. */}
        <div className="flex flex-col items-center gap-1.5 sm:items-start">
          <Wordmark />
          <p className="max-w-xs text-center text-[12px] leading-relaxed text-ink-3 sm:text-start">
            {t.landing.footer.tagline}
          </p>
        </div>
        <p className="text-[13px] text-ink-3">{t.landing.footer.rights(new Date().getFullYear())}</p>
        <div className="flex items-center gap-6 text-[13px] text-ink-2">
          <Link href="/workspace" className="transition-colors hover:text-ink">
            {t.nav.convert}
          </Link>
          <Link href="/dashboard" className="transition-colors hover:text-ink">
            {t.nav.dashboard}
          </Link>
          <Link href="/history" className="transition-colors hover:text-ink">
            {t.nav.history}
          </Link>
          <Link href="/terms" className="transition-colors hover:text-ink">
            {t.nav.terms}
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-ink">
            {t.nav.privacy}
          </Link>
        </div>
      </div>
    </footer>
  );
}
