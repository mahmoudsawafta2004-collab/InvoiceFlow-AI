import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Redrawn as inline SVG to match the supplied brand mark exactly — a document
 * with a folded corner and header lines, a spreadsheet badge overlapping its
 * bottom-right corner, and three motion strokes reading the transformation
 * left to right. Vector rather than a raster asset, so it stays crisp at any
 * size and recolors correctly between themes.
 */
export function Wordmark({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("group flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 40 32" className="h-7 w-9" aria-hidden="true">
        <defs>
          <linearGradient id="wm-doc" x1="4" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="rgb(var(--tint-iris))" />
            <stop offset="1" stopColor="rgb(var(--tint-violet))" />
          </linearGradient>
          <linearGradient id="wm-badge" x1="24" y1="18" x2="38" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="rgb(var(--tint-violet))" />
            <stop offset="1" stopColor="rgb(var(--tint-iris))" />
          </linearGradient>
        </defs>

        {/* Motion strokes */}
        <g stroke="rgb(var(--tint-iris))" strokeWidth="2" strokeLinecap="round">
          <line x1="0" y1="11" x2="7" y2="11" opacity="0.35" />
          <line x1="0" y1="16" x2="9" y2="16" opacity="0.55" />
          <line x1="0" y1="21" x2="6" y2="21" opacity="0.35" />
        </g>

        {/* Document with folded corner */}
        <path
          d="M10 2h11l7 7v19a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"
          fill="url(#wm-doc)"
        />
        <path d="M21 2v7h7" fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="1.4" strokeLinejoin="round" />
        <line x1="12.5" y1="14" x2="21" y2="14" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.92" />
        <line x1="12.5" y1="18" x2="24" y2="18" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.6" />

        {/* Spreadsheet badge */}
        <circle cx="30" cy="24" r="8" fill="rgb(var(--surface))" />
        <circle cx="30" cy="24" r="6.5" fill="url(#wm-badge)" />
        <g stroke="white" strokeWidth="1" strokeOpacity="0.95">
          <rect x="26.2" y="20.6" width="7.6" height="6.8" rx="1" fill="none" />
          <line x1="26.2" y1="23" x2="33.8" y2="23" />
          <line x1="26.2" y1="25.2" x2="33.8" y2="25.2" />
          <line x1="30" y1="20.6" x2="30" y2="27.4" />
        </g>
      </svg>

      <span className="text-[16px] font-semibold tracking-[-0.02em]">
        <span className="text-ink">Invoice</span>
        <span className="bg-gradient-to-r from-tint-iris to-tint-violet bg-clip-text text-transparent">
          Flow
        </span>
      </span>
    </Link>
  );
}
