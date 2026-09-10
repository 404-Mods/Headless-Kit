"use client";

/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, ShoppingBag01Icon } from "@hugeicons/core-free-icons";
import { usePackagesByIds } from "@/components/package-collection";
import { useRecentlyViewed, recentlyViewedStore } from "@/lib/collections";
import { slugify, cn } from "@/lib/utils";

/**
 * Records a product view. Mounted on the product page; renders nothing.
 *
 * The write happens in an effect (not during render) so it runs once the view
 * is real, and never during a server render or a discarded concurrent attempt.
 */
export function RecordProductView({ packageId }: { packageId: number }) {
  useEffect(() => {
    recentlyViewedStore.add(packageId);
  }, [packageId]);
  return null;
}

interface RecentlyViewedProps {
  /** Hide this package — no point showing the page you're already on. */
  excludeId?: number;
  className?: string;
}

export function RecentlyViewed({ excludeId, className }: RecentlyViewedProps) {
  const ids = useRecentlyViewed();
  const visibleIds = excludeId === undefined ? ids : ids.filter((id) => id !== excludeId);
  const { packages, isLoading } = usePackagesByIds(visibleIds);

  // Nothing worth showing for a single item, or before anything is browsed.
  if (isLoading || packages.length === 0) return null;

  return (
    <section className={cn("border-t border-fg/5 pt-8", className)}>
      <div className="mb-4 flex items-center gap-2">
        <HugeiconsIcon icon={Clock01Icon} className="h-3.5 w-3.5 text-fg/25" />
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-fg/30">
          Recently viewed
        </h2>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {packages.map((pkg) => (
          <Link
            key={pkg.id}
            href={`/products/${slugify(pkg.name)}`}
            className="group flex w-40 shrink-0 flex-col gap-2 rounded-xl border border-fg/5 bg-fg/2 p-2.5 transition-all hover:border-brand/20 hover:bg-fg/4"
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-surface-raised">
              {pkg.image ? (
                <Image src={pkg.image} alt={pkg.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <HugeiconsIcon icon={ShoppingBag01Icon} className="h-6 w-6 text-fg/10" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-fg group-hover:text-info">{pkg.name}</p>
              <p className="text-[11px] text-fg/35">
                {pkg.currency} {pkg.total_price.toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
