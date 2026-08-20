"use client";

import { createContext, useContext, useMemo, useState } from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_META,
  type Locale,
} from "./locales";
import type { Dictionary } from "./dictionary-type";
import en from "./dictionaries/en";
import es from "./dictionaries/es";
import ar from "./dictionaries/ar";
import fr from "./dictionaries/fr";
import de from "./dictionaries/de";

const DICTIONARIES: Record<Locale, Dictionary> = { en, es, ar, fr, de };

interface I18nValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nValue | null>(null);

/**
 * The locale arrives already resolved from the server (read from the cookie in
 * the root layout), so the first render — server and client alike — is in the
 * visitor's language. Switching writes the cookie and updates state in place;
 * no reload, and the next request is already correct.
 */
export function I18nProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const value = useMemo<I18nValue>(() => {
    function setLocale(next: Locale) {
      const dir = LOCALE_META[next].dir;
      document.documentElement.lang = next;
      document.documentElement.dir = dir;
      document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
      setLocaleState(next);
    }

    return {
      locale,
      setLocale,
      t: DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE],
      dir: LOCALE_META[locale].dir,
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
