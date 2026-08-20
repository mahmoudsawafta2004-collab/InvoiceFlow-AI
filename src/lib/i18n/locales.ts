export const LOCALES = ["en", "es", "ar", "fr", "de"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_META: Record<Locale, { label: string; nativeLabel: string; dir: "ltr" | "rtl" }> = {
  en: { label: "English", nativeLabel: "English", dir: "ltr" },
  es: { label: "Spanish", nativeLabel: "Español", dir: "ltr" },
  ar: { label: "Arabic", nativeLabel: "العربية", dir: "rtl" },
  fr: { label: "French", nativeLabel: "Français", dir: "ltr" },
  de: { label: "German", nativeLabel: "Deutsch", dir: "ltr" },
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Locale lives in a cookie rather than localStorage so the server renders
 * <html lang/dir> and every translated string in the right language on the
 * very first byte. localStorage is invisible to the server, which meant a
 * signed-in visitor's language could only be applied after hydration — the
 * page would paint in English and visibly flip afterwards.
 */
export const LOCALE_COOKIE = "invoiceflow.locale";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
