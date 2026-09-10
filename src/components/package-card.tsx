"use client";

/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cart";
import { useToast } from "@/context/toast";
import { toastAddResult } from "@/lib/cart-feedback";
import { WishlistButton } from "@/components/wishlist-button";
import { isDiscounted, discountPercent } from "@/lib/pricing";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBag01Icon, Add01Icon, Discount01Icon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";
import type { TebexPackage } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { SaleCountdown } from "@/components/sale-countdown";

interface PackageCardProps {
  pkg: TebexPackage;
}

export function PackageCard({ pkg }: PackageCardProps) {
  const { addToCart, isLoading, items } = useCart();
  const { toast } = useToast();
  const inCart = items.some((i) => i.packageId === pkg.id);

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    const result = await addToCart(pkg.id, pkg.name, pkg.image, pkg.total_price, pkg.currency);
    toastAddResult(result, pkg.name, toast);
  }

  const hasDiscount = isDiscounted(pkg);
  const isLimited = !!pkg.expiration_date;

  return (
    <Link
      href={`/products/${slugify(pkg.name)}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-fg/5 bg-fg/2 transition-all duration-300 hover:border-brand/20 hover:bg-fg/4 hover:shadow-xl hover:shadow-brand/5"
    >
      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-surface-raised">
        {pkg.image ? (
          <Image
            src={pkg.image}
            alt={pkg.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <HugeiconsIcon icon={ShoppingBag01Icon} className="h-10 w-10 text-fg/10" />
          </div>
        )}

        {/* Save for later — sits above the tile link so it doesn't navigate */}
        <div className="absolute right-3 top-3 z-10">
          <WishlistButton packageId={pkg.id} packageName={pkg.name} />
        </div>

        {/* Discount badge */}
        {hasDiscount && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-accent/90 px-2.5 py-1 text-[10px] font-bold text-surface backdrop-blur-sm">
            <HugeiconsIcon icon={Discount01Icon} className="h-3 w-3" />
            {discountPercent(pkg)}% OFF
          </div>
        )}

        {/* Limited-time badge */}
        {isLimited && !hasDiscount && (
          <div className="absolute left-3 top-3">
            <SaleCountdown expirationDate={pkg.expiration_date!} variant="card" />
          </div>
        )}
        {/* Sits below the wishlist heart, which owns the top-right corner. */}
        {isLimited && hasDiscount && (
          <div className="absolute right-3 top-13">
            <SaleCountdown expirationDate={pkg.expiration_date!} variant="card" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-brand">
            {pkg.category.name}
          </p>
          <h3 className="line-clamp-2 text-sm font-bold text-fg transition-colors group-hover:text-info">
            {pkg.name}
          </h3>
          {pkg.description && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-fg/30">
              {pkg.description.replace(/(<[^>]*>|\*\*?)/g, "").slice(0, 120)}
            </p>
          )}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-fg">
              {pkg.currency} {pkg.total_price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-fg/30 line-through">
                {pkg.currency} {pkg.base_price.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-50 ${
              inCart
                ? "bg-brand/30 text-fg"
                : "bg-brand/15 text-brand hover:bg-brand hover:text-white"
            }`}
          >
            <HugeiconsIcon icon={inCart ? CheckmarkCircle01Icon : Add01Icon} className="h-3.5 w-3.5" />
            {inCart ? "In Cart" : "Add"}
          </button>
        </div>
      </div>
    </Link>
  );
}
