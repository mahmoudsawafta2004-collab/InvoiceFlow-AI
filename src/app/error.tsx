"use client";

import { useEffect } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Catches anything an inner page throws without a more specific boundary.
 * Without this file, an uncaught Server Component error rendered nothing
 * inside the surrounding layout — this is the difference between that blank
 * state and a page the visitor can actually recover from.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bad-soft">
        <TriangleAlert className="h-6 w-6 text-bad" />
      </div>
      <div>
        <h1 className="text-lg font-semibold text-ink">Something went wrong</h1>
        <p className="mt-1 max-w-sm text-sm text-ink-2">
          That&apos;s on us, not something you did. Try again in a moment.
        </p>
      </div>
      <Button variant="primary" onClick={reset}>
        <RotateCcw className="h-4 w-4" />
        Try again
      </Button>
    </div>
  );
}
