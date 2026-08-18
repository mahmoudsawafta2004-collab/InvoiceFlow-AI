import { cn } from "@/lib/utils";

export function ConfidenceBadge({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100);
  const tier =
    pct >= 90 ? "high" : pct >= 70 ? "medium" : "low";

  const styles = {
    high: "bg-emerald-50 text-emerald-700",
    medium: "bg-amber-50 text-amber-700",
    low: "bg-red-50 text-red-700",
  } as const;

  const dot = {
    high: "bg-emerald-500",
    medium: "bg-amber-500",
    low: "bg-red-500",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums",
        styles[tier]
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dot[tier])} />
      {pct}%
    </span>
  );
}
