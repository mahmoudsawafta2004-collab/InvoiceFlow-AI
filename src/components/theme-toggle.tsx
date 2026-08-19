"use client";

import { motion, AnimatePresence } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useIsDark, toggleTheme } from "@/lib/theme";

export function ThemeToggle() {
  const dark = useIsDark();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg text-ink-2 transition-colors hover:bg-surface-3 hover:text-ink"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? "moon" : "sun"}
          initial={{ opacity: 0, rotate: -70, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 70, scale: 0.6 }}
          transition={{ type: "spring", stiffness: 340, damping: 22 }}
          className="flex"
        >
          {dark ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
