"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/wordmark";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/workspace", label: "Convert" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/history", label: "History" },
];

export function AppNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Wordmark />

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors",
                  active ? "text-ink" : "text-ink-3 hover:text-ink"
                )}
              >
                {/* Shared layout id slides the pill between tabs. */}
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg bg-surface-3"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-2 transition-colors hover:bg-surface-3 hover:text-ink md:hidden"
          >
            {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      {open && (
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden border-t border-line bg-surface px-6 py-2 md:hidden"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-surface-3 text-ink"
                  : "text-ink-2 hover:text-ink"
              )}
            >
              {link.label}
            </Link>
          ))}
        </motion.nav>
      )}
    </header>
  );
}
