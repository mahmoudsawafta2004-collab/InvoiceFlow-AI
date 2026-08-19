import { cn } from "@/lib/utils";

/**
 * Three tiers, because a continuous colour ramp gives the reader nothing to
 * act on. Green means trust it, amber means glance at it, red means fix it.
 */
export function ConfidenceBadge({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100);
  const tier = pct >= 90 ? "high" : pct >= 70 ? "medium" : "low";

  const styles = {
    high: "bg-ok-soft text-ok",
    medium: "bg-warn-soft text-warn",
    low: "bg-bad-soft text-bad",
  } as const;

  const dot = { high: "bg-ok", medium: "bg-warn", low: "bg-bad" } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-1.5 py-0.5 font-mono text-[10px] font-medium tabular",
        styles[tier]
      )}
    >
      <span className={cn("h-1 w-1 rounded-full", dot[tier])} />
      {pct}%
    </span>
  );
}
