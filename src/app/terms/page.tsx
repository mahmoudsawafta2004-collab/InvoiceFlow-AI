import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Terms of Service — InvoiceFlow" };

/**
 * Starting-point terms, not a substitute for legal review. The bracketed
 * placeholders (company name, jurisdiction, contact email) must be filled in
 * before this is relied on, and a lawyer should check it against wherever
 * the business is actually incorporated and who it actually sells to.
 */
export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="[DATE]">
      <p className="rounded-lg border border-warn/30 bg-warn-soft px-4 py-3 text-[13px] text-warn">
        Template — replace the bracketed placeholders below and have this
        reviewed by a lawyer before relying on it, particularly the
        cancellation/refund terms and the governing-law clause.
      </p>

      <section>
        <h2 className="text-lg font-semibold text-ink">1. Who this agreement is with</h2>
        <p className="mt-2">
          These Terms govern your use of InvoiceFlow (the &quot;Service&quot;), operated
          by [COMPANY NAME] (&quot;we&quot;, &quot;us&quot;). By creating an account you agree to
          these Terms and to our{" "}
          <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a>.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">2. What the Service does</h2>
        <p className="mt-2">
          InvoiceFlow accepts invoice PDFs you upload, sends them to a
          third-party AI model to extract structured data, and lets you export
          the results as a spreadsheet. We do not verify the accuracy of
          extracted data — you are responsible for reviewing it before relying
          on it for accounting, tax, or financial reporting purposes.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">3. Accounts</h2>
        <p className="mt-2">
          You must provide accurate information when creating an account and
          keep your credentials secure. You are responsible for activity under
          your account.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">4. Plans, billing, and cancellation</h2>
        <p className="mt-2">
          Paid plans are billed monthly in advance and renew automatically
          until cancelled. You can cancel at any time from your dashboard;
          cancellation takes effect at the end of the current billing period,
          and we do not provide refunds for partial periods except where
          required by law. We may change plan prices or limits; changes apply
          to future billing periods, not one already paid for.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">5. Acceptable use</h2>
        <p className="mt-2">
          Don&apos;t use the Service to process documents you don&apos;t have the
          right to process, to attempt to disrupt or overload the Service, or
          to circumvent usage limits.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">6. Disclaimers</h2>
        <p className="mt-2">
          The Service is provided &quot;as is&quot;. AI-extracted data may contain
          errors — that is why every field carries a confidence score, and you
          are expected to review low-confidence fields before use. We are not
          liable for decisions made based on extracted data.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">7. Termination</h2>
        <p className="mt-2">
          We may suspend or terminate accounts that violate these Terms. You
          may stop using the Service and delete your account at any time.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">8. Governing law</h2>
        <p className="mt-2">These Terms are governed by the laws of [JURISDICTION].</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">9. Contact</h2>
        <p className="mt-2">Questions about these Terms: [CONTACT EMAIL].</p>
      </section>
    </LegalPage>
  );
}
