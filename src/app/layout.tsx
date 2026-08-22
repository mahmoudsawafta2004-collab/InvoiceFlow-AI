import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono, Noto_Sans_Arabic } from "next/font/google";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeScript } from "@/components/theme-script";
import { I18nProvider } from "@/lib/i18n/context";
import { RecoveryRedirect } from "@/components/auth/recovery-redirect";
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALE_META, isLocale } from "@/lib/i18n/locales";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const sans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

/** Used only for display accents — the contrast against the sans is the point. */
const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

/** Instrument Sans has no Arabic glyphs; this covers Arabic only, wired in by
 * globals.css when <html dir="rtl">, so Latin locales never load it. */
const sansArabic = Noto_Sans_Arabic({
  variable: "--font-sans-ar",
  subsets: ["arabic"],
  display: "swap",
});

const TITLE = "InvoiceFlow — Bulk Invoice PDF to Excel Converter";
const DESCRIPTION =
  "Upload up to 50 invoice PDFs and get a clean, structured Excel file in minutes. AI-powered extraction built for accountants and finance teams.";
const OG_ALT = "InvoiceFlow — 50 invoice PDFs in. One clean spreadsheet out.";

/**
 * The preview image is served from `public/` and named below rather than using
 * the `opengraph-image.png` file convention on purpose: the convention bakes
 * the absolute URL at build time, so a deployment that sets the domain only at
 * runtime would keep advertising localhost. Resolving it against metadataBase
 * per request means the preview works either way.
 */
export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "InvoiceFlow",
  openGraph: {
    type: "website",
    siteName: "InvoiceFlow",
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: OG_ALT }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: OG_ALT }],
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Resolved here, on the server, so the markup ships in the right language and
  // direction — no post-hydration flip from English to the stored preference.
  const stored = (await cookies()).get(LOCALE_COOKIE)?.value;
  const locale = stored && isLocale(stored) ? stored : DEFAULT_LOCALE;

  return (
    <html
      lang={locale}
      dir={LOCALE_META[locale].dir}
      suppressHydrationWarning
      className={`${sans.variable} ${display.variable} ${mono.variable} ${sansArabic.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col bg-canvas text-ink">
        <I18nProvider initialLocale={locale}>
          <RecoveryRedirect />
          <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
          <Toaster position="top-right" richColors closeButton />
        </I18nProvider>
      </body>
    </html>
  );
}
