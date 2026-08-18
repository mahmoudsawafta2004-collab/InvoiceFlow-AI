import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step {
  key: string;
  label: string;
}

export function StepIndicator({
  steps,
  currentIndex,
}: {
  steps: Step[];
  currentIndex: number;
}) {
  return (
    <ol className="flex w-full items-center">
      {steps.map((step, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <li key={step.key} className="flex min-w-0 flex-1 items-center last:flex-none">
            <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  isDone && "bg-indigo-600 text-white",
                  isCurrent && "bg-indigo-600 text-white ring-4 ring-indigo-100",
                  !isDone && !isCurrent && "bg-neutral-100 text-neutral-400"
                )}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span
                className={cn(
                  "truncate text-sm font-medium",
                  isCurrent ? "text-neutral-900" : isDone ? "text-neutral-600" : "text-neutral-400",
                  !isCurrent && "hidden sm:inline"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-px min-w-4 flex-1 transition-colors sm:mx-3",
                  isDone ? "bg-indigo-600" : "bg-neutral-200"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
