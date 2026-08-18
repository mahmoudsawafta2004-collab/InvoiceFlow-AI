import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <p className="text-sm text-neutral-500">
          © {new Date().getFullYear()} InvoiceFlow AI. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-sm text-neutral-500">
          <Link href="/workspace" className="hover:text-neutral-900">
            Convert
          </Link>
          <Link href="/dashboard" className="hover:text-neutral-900">
            Dashboard
          </Link>
          <Link href="/settings" className="hover:text-neutral-900">
            Settings
          </Link>
        </div>
      </div>
    </footer>
  );
}
