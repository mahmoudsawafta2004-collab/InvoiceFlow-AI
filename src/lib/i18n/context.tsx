"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { DEFAULT_LOCALE, isLocale, LOCALE_META, type Locale } from "./locales";
import type { Dictionary } from "./dictionary-type";
import en from "./dictionaries/en";
import es from "./dictionaries/es";
import ar from "./dictionaries/ar";
import fr from "./dictionaries/fr";
import de from "./dictionaries/de";

const DICTIONARIES: Record<Locale, Dictionary> = { en, es, ar, fr, de };
const STORAGE_KEY = "invoiceflow.locale";

type Listener = () => void;
const listeners = new Set<Listener>();

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * The inline LocaleScript sets <html lang> before hydration based on
 * localStorage/navigator.language, which the server cannot know. Reading it
 * with useSyncExternalStore — server snapshot pinned to English, client
 * snapshot the real DOM value — is what lets the very first client render
 * show the visitor's language without a hydration mismatch on every
 * translated string on the page.
 */
function getSnapshot(): Locale {
  const attr = document.documentElement.lang;
  return isLocale(attr) ? attr : DEFAULT_LOCALE;
}

function getServerSnapshot(): Locale {
  return DEFAULT_LOCALE;
}

export function setLocale(locale: Locale) {
  document.documentElement.lang = locale;
  document.documentElement.dir = LOCALE_META[locale].dir;
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {}
  for (const listener of listeners) listener();
}

interface I18nValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const value = useMemo<I18nValue>(
    () => ({
      locale,
      setLocale,
      t: DICTIONARIES[locale],
      dir: LOCALE_META[locale].dir,
    }),
    [locale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
