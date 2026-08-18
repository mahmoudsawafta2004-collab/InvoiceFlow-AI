"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileSpreadsheet } from "lucide-react";
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

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
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
              <Link href="/workspace">
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
            <Link href="/settings">
              <Button variant="outline" size="sm">
                Settings
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
