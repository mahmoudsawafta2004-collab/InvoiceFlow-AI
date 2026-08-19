import type { Metadata } from "next";
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono, Noto_Sans_Arabic } from "next/font/google";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeScript } from "@/components/theme-script";
import { LocaleScript } from "@/components/locale-script";
import { I18nProvider } from "@/lib/i18n/context";
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

export const metadata: Metadata = {
  title: "InvoiceFlow — Bulk Invoice PDF to Excel Converter",
  description:
    "Upload up to 50 invoice PDFs and get a clean, structured Excel file in minutes. AI-powered extraction built for accountants and finance teams.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${display.variable} ${mono.variable} ${sansArabic.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
        <LocaleScript />
      </head>
      <body className="min-h-full flex flex-col bg-canvas text-ink">
        <I18nProvider>
          <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
          <Toaster position="top-right" richColors closeButton />
        </I18nProvider>
      </body>
    </html>
  );
}
