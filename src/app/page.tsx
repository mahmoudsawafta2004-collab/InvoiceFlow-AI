import type { Metadata } from "next";
import { LandingNav } from "@/components/landing/landing-nav";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import { ClosingCta } from "@/components/landing/closing-cta";
import { LandingFooter } from "@/components/landing/landing-footer";
import { AccountProvider } from "@/components/account-provider";
import { getPublicPlans } from "@/lib/get-public-plans";
import { getAccountSummary } from "@/lib/account-summary";

export const metadata: Metadata = {
  title: "InvoiceFlow — Bulk Invoice PDF to Excel Converter",
};

export default async function LandingPage() {
  const [plans, account] = await Promise.all([getPublicPlans(), getAccountSummary()]);

  return (
    <AccountProvider account={account}>
      <div className="bg-canvas text-ink">
        <LandingNav />
        <main>
          <Hero />
          <HowItWorks />
          <Features />
          <Pricing plans={plans} />
          <ClosingCta />
        </main>
        <LandingFooter />
      </div>
    </AccountProvider>
  );
}
