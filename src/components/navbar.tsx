"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileSpreadsheet, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/workspace", label: "Convert" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/history", label: "History" },
];

export function Navbar() {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <FileSpreadsheet className="h-4.5 w-4.5 text-white" strokeWidth={2.25} />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-neutral-900">
            InvoiceFlow <span className="text-indigo-600">AI</span>
          </span>
        </Link>

        {!isLanding && (
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-neutral-100 text-neutral-900"
                    : "text-neutral-500 hover:text-neutral-900"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {isLanding ? (
            <>
              <Link href="/workspace" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/workspace">
                <Button variant="primary" size="sm">
                  Try it free
                </Button>
              </Link>
            </>
          ) : (
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100 md:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      {!isLanding && menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-neutral-200 bg-white px-6 py-3 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-neutral-100 text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-900"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
