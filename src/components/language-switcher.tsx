"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import { LOCALES, LOCALE_META } from "@/lib/i18n/locales";

/**
 * A compact dropdown, not an inline row of flags or language names — an
 * inline list would eat into the header's open space, which is exactly what
 * was asked not to happen. It sits at the end of the header, beside the
 * primary CTA / theme toggle, and only expands on demand.
 */
export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t.nav.language}
        aria-expanded={open}
        className={cn(
          "flex h-9 items-center gap-1.5 rounded-lg px-2 text-[13px] font-medium transition-colors",
          open ? "bg-surface-3 text-ink" : "text-ink-2 hover:bg-surface-3 hover:text-ink"
        )}
      >
        <Globe className="h-4 w-4" />
        <span className="uppercase tracking-wide">{locale}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute end-0 top-11 z-50 w-44 overflow-hidden rounded-xl border border-line bg-surface p-1.5 shadow-float"
          >
            {LOCALES.map((code) => {
              const meta = LOCALE_META[code];
              const active = code === locale;
              return (
                <button
                  key={code}
                  onClick={() => {
                    setLocale(code);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-start text-[13px] transition-colors",
                    active ? "bg-surface-2 font-medium text-ink" : "text-ink-2 hover:bg-surface-2 hover:text-ink"
                  )}
                >
                  {meta.nativeLabel}
                  {active && <Check className="h-3.5 w-3.5 text-accent" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
