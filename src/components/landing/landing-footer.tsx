import Link from "next/link";
import { Wordmark } from "@/components/wordmark";

export function LandingFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-6 py-9 sm:flex-row">
        <Wordmark />
        <p className="text-[13px] text-ink-3">
          © {new Date().getFullYear()} InvoiceFlow AI
        </p>
        <div className="flex items-center gap-6 text-[13px] text-ink-2">
          <Link href="/workspace" className="transition-colors hover:text-ink">
            Convert
          </Link>
          <Link href="/dashboard" className="transition-colors hover:text-ink">
            Dashboard
          </Link>
          <Link href="/history" className="transition-colors hover:text-ink">
            History
          </Link>
        </div>
      </div>
    </footer>
  );
}
