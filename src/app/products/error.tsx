"use client";

/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, RefreshIcon } from "@hugeicons/core-free-icons";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
        <HugeiconsIcon icon={AlertCircleIcon} className="h-7 w-7 text-red-400" />
      </div>
      <div className="max-w-sm">
        <h2 className="mb-2 text-lg font-black text-fg">Something went wrong</h2>
        <p className="text-sm text-fg/40">
          {error.message?.includes("fetch") || error.message?.includes("network")
            ? "Couldn't reach the store. Check your connection and try again."
            : "An unexpected error occurred loading this page."}
        </p>
      </div>
      <button
        onClick={reset}
        className="flex items-center gap-2 rounded-full border border-fg/10 bg-fg/5 px-6 py-2.5 text-sm font-bold text-fg/60 transition-all hover:bg-fg/10 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <HugeiconsIcon icon={RefreshIcon} className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}
