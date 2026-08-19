import type { Metadata } from "next";
import { LandingNav } from "@/components/landing/landing-nav";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { ClosingCta } from "@/components/landing/closing-cta";
import { LandingFooter } from "@/components/landing/landing-footer";

export const metadata: Metadata = {
  title: "InvoiceFlow — Bulk Invoice PDF to Excel Converter",
};

export default function LandingPage() {
  return (
    <div className="bg-canvas text-ink">
      <LandingNav />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <ClosingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
