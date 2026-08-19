import Link from "next/link";

export function Wordmark({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="group flex items-center gap-2.5">
      <span className="relative flex h-8 w-8 items-center justify-center rounded-[9px] bg-accent">
        {/* A sheet with a diagonal flow line — the PDF-to-sheet idea in one mark. */}
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" aria-hidden="true">
          <path
            d="M6 3.75h7.5L18.25 8.5v11.75H6z"
            fill="none"
            stroke="rgb(var(--accent-ink))"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M13 3.9V8.6h4.7"
            fill="none"
            stroke="rgb(var(--accent-ink))"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M8.9 16.4l2.3-2.6 1.9 1.5 2.3-3"
            fill="none"
            stroke="rgb(var(--accent-ink))"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="text-[15px] font-semibold tracking-[-0.02em] text-ink">
        InvoiceFlow
        <span className="ml-1 text-accent">AI</span>
      </span>
    </Link>
  );
}
