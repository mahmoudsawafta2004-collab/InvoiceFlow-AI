"use client";

import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/wordmark";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function LandingNav() {
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
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Wordmark />
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Link href="/workspace">
            <Button variant="primary" size="sm">
              Try it free
            </Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
