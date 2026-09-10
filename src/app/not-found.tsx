/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingBag01Icon,
  Home01Icon,
  ArrowRight01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[120px]" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* 404 number */}
        <div className="relative select-none">
          <span className="text-[9rem] font-black leading-none tracking-tighter text-fg/5 sm:text-[12rem]">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-brand/20 bg-brand/10">
              <HugeiconsIcon icon={Search01Icon} className="h-9 w-9 text-brand" />
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="max-w-sm">
          <h1 className="mb-3 text-2xl font-black text-fg">Page not found</h1>
          <p className="text-sm leading-relaxed text-fg/40">
            This page doesn&apos;t exist or may have moved. Head back to the store to keep browsing.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/products"
            className="group flex items-center gap-2 rounded-full bg-brand px-7 py-3 text-sm font-bold text-white transition-all hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            <HugeiconsIcon icon={ShoppingBag01Icon} className="h-4 w-4" />
            Browse Products
            <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full border border-fg/10 bg-fg/5 px-7 py-3 text-sm font-bold text-fg/60 transition-all hover:bg-fg/10 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/30 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            <HugeiconsIcon icon={Home01Icon} className="h-4 w-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
