"use client";

import { motion } from "motion/react";
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
            <div className="flex min-w-0 items-center gap-2.5">
              <motion.div
                animate={
                  isCurrent
                    ? { scale: [1, 1.06, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-semibold transition-colors duration-300",
                  isDone && "bg-accent text-accent-ink",
                  isCurrent && "bg-accent text-accent-ink ring-4 ring-accent-soft",
                  !isDone && !isCurrent && "bg-surface-3 text-ink-3"
                )}
              >
                {isDone ? <Check className="h-3 w-3" /> : i + 1}
              </motion.div>
              <span
                className={cn(
                  "truncate text-[13px] font-medium transition-colors duration-300",
                  isCurrent ? "text-ink" : isDone ? "text-ink-2" : "text-ink-3",
                  !isCurrent && "hidden sm:inline"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="relative mx-3 h-px min-w-4 flex-1 bg-line">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-accent"
                  initial={false}
                  animate={{ width: isDone ? "100%" : "0%" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
