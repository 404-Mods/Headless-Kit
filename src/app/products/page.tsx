/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import { Suspense } from "react";
import Image from "next/image";
import { getCategories, shouldShowSetupHelp } from "@/lib/tebex";
import { HugeiconsIcon } from "@hugeicons/react";
import { GridViewIcon, ShoppingBag01Icon, BrushIcon, FlashIcon } from "@hugeicons/core-free-icons";
import { ProductsBrowser } from "@/components/products-browser";
import { StoreSetupNotice } from "@/components/store-setup-notice";
import type { Metadata } from "next";
import { site } from "@/config/site";
import { tint } from "@/lib/color";

// Catalog-backed page: re-rendered on the same cadence as src/lib/tebex.ts.
// Without this the page would be prerendered once at build time and never update.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Products",
  description: `Browse every package on ${site.name} — scripts, templates, assets and tools built by the community.`,
  openGraph: {
    title: `Products — ${site.name}`,
    description: `Browse every package on ${site.name} — scripts, templates, assets and tools built by the community.`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Products — ${site.name}`,
    description: `Browse every package on ${site.name} — scripts, templates, assets and tools built by the community.`,
  },
};

function ProductsPageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-3 w-40 animate-pulse rounded-full bg-fg/5" />
        <div className="h-9 w-36 animate-pulse rounded-xl bg-fg/5" />
        <div className="h-3 w-28 animate-pulse rounded-full bg-fg/5" />
      </div>
      {/* Search bar */}
      <div className="h-11 w-full animate-pulse rounded-xl bg-fg/5" />
      {/* Tabs */}
      <div className="flex gap-2">
        {[80, 96, 72, 88].map((w) => (
          <div key={w} className="h-7 animate-pulse rounded-full bg-fg/5" style={{ width: w }} />
        ))}
      </div>
      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-2xl bg-fg/5" style={{ aspectRatio: "4/5" }} />
        ))}
      </div>
    </div>
  );
}

async function ProductsContent() {
  // Matches /categories: degrade to an empty state rather than throwing. A throw
  // here fails the production build during prerender.
  const categories = await getCategories(true).catch(() => []);

  // Deduplicated flat list
  const allPackages = Array.from(
    new Map(
      categories.flatMap((c) => c.packages ?? []).map((p) => [p.id, p])
    ).values()
  );

  // Categories that have packages
  const populatedCategories = categories
    .filter((c) => (c.packages ?? []).length > 0)
    .map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-10">

      {/* Browser (search + tabs + grid) */}
      {allPackages.length > 0 ? (
        <ProductsBrowser packages={allPackages} categories={populatedCategories} />
      ) : shouldShowSetupHelp() ? (
        <StoreSetupNotice />
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-fg/5">
            <HugeiconsIcon icon={GridViewIcon} className="h-7 w-7 text-fg/20" />
          </div>
          <div>
            <p className="text-base font-bold text-fg/50">No packages yet</p>
            <p className="mt-1 text-sm text-fg/25">Check back soon — items are coming.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <>
      {/* ── Hero ── */}
      <div className="relative overflow-hidden border-b border-fg/5">
        {/* Background image */}
        <Image
          src="/assets/backgrounds/hero.svg"
          alt=""
          fill
          priority
          className="object-cover opacity-20"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-linear-to-b from-surface/60 via-surface/40 to-surface" />
        <div className="absolute inset-0 bg-linear-to-r from-surface/80 via-transparent to-surface/80" />
        {/* Purple glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-150 -translate-x-1/2 rounded-full bg-brand/15 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 sm:py-20">
          {/* Eyebrow */}
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-accent backdrop-blur-sm">
            <HugeiconsIcon icon={ShoppingBag01Icon} className="h-3 w-3" />
            {site.name}
          </p>

          <h1 className="mb-4 max-w-xl text-4xl font-black leading-tight text-fg sm:text-5xl">
            Everything built by{" "}
            <span className="bg-linear-to-r from-brand via-info to-accent bg-clip-text text-transparent">
              the community.
            </span>
          </h1>

          <p className="mb-8 max-w-md text-base leading-relaxed text-fg/45">
            Scripts, templates, assets and tools — built by the community and sold direct. Every purchase goes straight to the people who made it.
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3">
            {[
              { icon: ShoppingBag01Icon, label: "All products in one place", color: "var(--color-brand)" },
              { icon: BrushIcon, label: "Made by creators", color: "var(--color-accent)" },
              { icon: FlashIcon, label: "Instant delivery", color: "var(--color-info)" },
            ].map(({ icon, label, color }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold text-fg/60 backdrop-blur-sm"
                style={{ borderColor: tint(color, 19), backgroundColor: tint(color, 6) }}
              >
                <HugeiconsIcon icon={icon} className="h-3.5 w-3.5" style={{ color }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Suspense fallback={<ProductsPageSkeleton />}>
        <ProductsContent />
      </Suspense>
    </>
  );
}
