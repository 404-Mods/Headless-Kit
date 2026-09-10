"use client";

/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */
import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBag01Icon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";
import { useCart } from "@/context/cart";
import { useToast } from "@/context/toast";
import type { TebexPackage } from "@/lib/types";
import { toastAddResult } from "@/lib/cart-feedback";
import { isDiscounted, discountPercent } from "@/lib/pricing";

export function MobileStickyCTA({ pkg }: { pkg: TebexPackage }) {
  const { addToCart, openCart, items, isLoading } = useCart();
  const { toast } = useToast();
  const [visible, setVisible] = useState(false);

  const inCart = items.some((i) => i.packageId === pkg.id);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleAdd() {
    if (inCart) {
      openCart();
      return;
    }
    const result = await addToCart(pkg.id, pkg.name, pkg.image, pkg.total_price, pkg.currency, 1);
    toastAddResult(result, pkg.name, toast);
  }

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-50 lg:hidden transition-transform duration-300 ease-out ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="border-t border-fg/8 bg-surface/95 backdrop-blur-xl px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-bold text-fg">{pkg.name}</p>
            <p className="text-[11px] text-fg/50">
              {pkg.currency} {pkg.total_price.toFixed(2)}
              {isDiscounted(pkg) && (
                <span className="ml-1.5 text-accent">{discountPercent(pkg)}% off</span>
              )}
            </p>
          </div>
          <button
            onClick={handleAdd}
            disabled={isLoading}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-fg transition-all disabled:opacity-60 ${
              inCart
                ? "border border-brand/50 bg-brand/30"
                : "bg-brand hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/30"
            }`}
          >
            <HugeiconsIcon icon={inCart ? CheckmarkCircle01Icon : ShoppingBag01Icon} className="h-4 w-4" />
            {isLoading ? "Adding…" : inCart ? "In Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
