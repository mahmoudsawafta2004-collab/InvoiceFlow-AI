import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Privacy Policy — InvoiceFlow" };

/**
 * Describes the real architecture (Supabase + Stripe + Gemini) truthfully —
 * update it if that architecture changes. Still a starting point, not legal
 * advice: if you serve EU users, a lawyer needs to confirm GDPR compliance
 * specifically (lawful basis, DPA with each subprocessor, data residency).
 */
export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="[DATE]">
      <p className="rounded-lg border border-warn/30 bg-warn-soft px-4 py-3 text-[13px] text-warn">
        Template — fill in the bracketed placeholders and have this reviewed
        by a lawyer, especially if you have users in the EU/UK (GDPR) or
        California (CCPA).
      </p>

      <section>
        <h2 className="text-lg font-semibold text-ink">1. What we collect</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Account info: name, email, and authentication data (including via Google sign-in, if you use it).</li>
          <li>Billing info: handled directly by Stripe — we never see or store your card number.</li>
          <li>Invoice files you upload, for the time it takes to extract their data.</li>
          <li>Usage data: which plan you&apos;re on and how many invoices you&apos;ve processed, to enforce plan limits.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">2. How invoice files are handled</h2>
        <p className="mt-2">
          Uploaded PDFs are sent to Google&apos;s Gemini API for extraction and are
          not stored on our servers afterward — we keep a file in memory only
          long enough to forward it and return the result. We do not use your
          invoice content to train any model.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">3. Who we share data with</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li><strong>Supabase</strong> — hosts our database and handles authentication.</li>
          <li><strong>Stripe</strong> — processes payments and stores billing details.</li>
          <li><strong>Google (Gemini API)</strong> — processes invoice content to extract data.</li>
        </ul>
        <p className="mt-2">We do not sell your data.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">4. Data retention</h2>
        <p className="mt-2">
          We keep account and usage records for as long as your account is
          active. You can request deletion of your account and associated
          data at any time by contacting us.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">5. Your rights</h2>
        <p className="mt-2">
          Depending on where you live, you may have the right to access,
          correct, or delete your personal data, and to object to certain
          processing. Contact us to exercise these rights.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">6. Security</h2>
        <p className="mt-2">
          Data is encrypted in transit. Access to production data is limited
          to what&apos;s needed to operate the Service.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">7. Contact</h2>
        <p className="mt-2">Questions about this policy: [CONTACT EMAIL].</p>
      </section>
    </LegalPage>
  );
}
