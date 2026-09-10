"use client";

/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { FavouriteIcon, ShoppingBag01Icon, Delete03Icon } from "@hugeicons/core-free-icons";
import { PackageCard } from "@/components/package-card";
import { usePackagesByIds } from "@/components/package-collection";
import { useWishlist, wishlistStore } from "@/lib/collections";
import { RecentlyViewed } from "@/components/recently-viewed";

export default function WishlistPage() {
  const ids = useWishlist();
  const { packages, isLoading } = usePackagesByIds(ids);

  // IDs with no matching package were delisted since they were saved.
  const missing = ids.length - packages.length;

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
            <HugeiconsIcon icon={FavouriteIcon} className="h-3 w-3" />
            Saved
          </p>
          <h1 className="text-3xl font-black text-fg sm:text-4xl">Saved for later</h1>
          <p className="mt-1 text-sm text-fg/40">
            {ids.length === 0
              ? "Nothing saved yet."
              : `${ids.length} item${ids.length === 1 ? "" : "s"} · kept in this browser`}
          </p>
        </div>

        {ids.length > 0 && (
          <button
            onClick={() => wishlistStore.clear()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-fg/8 px-3 py-2 text-xs font-semibold text-fg/40 transition-colors hover:border-red-500/30 hover:text-red-400"
          >
            <HugeiconsIcon icon={Delete03Icon} className="h-3.5 w-3.5" />
            Clear all
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: Math.min(ids.length, 6) }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-fg/5" style={{ aspectRatio: "4/5" }} />
          ))}
        </div>
      ) : packages.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
          {missing > 0 && (
            <p className="mt-6 text-xs text-fg/25">
              {missing} saved {missing === 1 ? "item is" : "items are"} no longer available in the store.
            </p>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-fg/10 bg-fg/2 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fg/5">
            <HugeiconsIcon icon={FavouriteIcon} className="h-6 w-6 text-fg/20" />
          </div>
          <div>
            <p className="text-base font-bold text-fg/50">
              {ids.length > 0 ? "Your saved items are no longer available" : "Nothing saved yet"}
            </p>
            <p className="mt-1 max-w-sm text-sm text-fg/25">
              Tap the heart on any product to keep it here for later.
            </p>
          </div>
          <Link
            href="/products"
            className="mt-1 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-hover"
          >
            <HugeiconsIcon icon={ShoppingBag01Icon} className="h-4 w-4" />
            Browse products
          </Link>
        </div>
      )}

      <RecentlyViewed className="mt-16" />
    </div>
  );
}
