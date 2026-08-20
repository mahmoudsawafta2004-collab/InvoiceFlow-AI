"use client";

import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/wordmark";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function LandingNav() {
  const { t } = useI18n();
  const { scrollY } = useScroll();
  const [lifted, setLifted] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setLifted(y > 12));

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        lifted && "border-b border-line/70 bg-canvas/80 backdrop-blur-xl"
      )}
    >
      {/* Wordmark at the start, controls at the end — the space between is
          deliberately empty and must stay that way, not get filled in. */}
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Wordmark />
        <div className="flex items-center gap-1.5">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link href="/signup">
            <Button variant="primary" size="sm">
              {t.landing.nav.tryFree}
            </Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
