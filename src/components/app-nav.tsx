"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Menu, X, FileUp, LayoutDashboard, History, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/wordmark";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  {
    href: "/workspace",
    label: "Convert",
    hint: "Upload invoices and export",
    icon: FileUp,
    tint: "text-tint-iris bg-tint-iris-soft",
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    hint: "Totals across your batches",
    icon: LayoutDashboard,
    tint: "text-tint-teal bg-tint-teal-soft",
  },
  {
    href: "/history",
    label: "History",
    hint: "Re-download past exports",
    icon: History,
    tint: "text-tint-violet bg-tint-violet-soft",
  },
];

export function AppNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape and on any click outside the panel.
  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false);
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const current = links.find((l) => l.href === pathname);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Wordmark />
          {/* Naming the current page keeps orientation without a link bar. */}
          {current && (
            <>
              <span className="text-line-strong">/</span>
              <span className="text-[13px] font-medium text-ink-2">
                {current.label}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1" ref={panelRef}>
          <ThemeToggle />

          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={open}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                open ? "bg-surface-3 text-ink" : "text-ink-2 hover:bg-surface-3 hover:text-ink"
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -60, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 60, scale: 0.7 }}
                  transition={{ duration: 0.16 }}
                  className="flex"
                >
                  {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
                </motion.span>
              </AnimatePresence>
            </button>

            <AnimatePresence>
              {open && (
                <motion.nav
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-0 top-11 w-72 origin-top-right overflow-hidden rounded-xl border border-line bg-surface p-1.5 shadow-float"
                >
                  {links.map((link) => {
                    const active = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "group flex items-center gap-3 rounded-lg px-2.5 py-2.5 transition-colors",
                          active ? "bg-surface-2" : "hover:bg-surface-2"
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                            link.tint
                          )}
                        >
                          <link.icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-1.5 text-[13px] font-medium text-ink">
                            {link.label}
                            {active && (
                              <span className="h-1.5 w-1.5 rounded-full bg-tint-teal" />
                            )}
                          </span>
                          <span className="block truncate text-[12px] text-ink-3">
                            {link.hint}
                          </span>
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-ink-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    );
                  })}

                  <div className="my-1.5 h-px bg-line" />
                  <Link
                    href="/"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
                  >
                    <span className="flex h-8 w-8 items-center justify-center">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                    Back to home
                  </Link>
                </motion.nav>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
