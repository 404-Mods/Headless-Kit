"use client";

/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */
import { useState } from "react";
import { useCart } from "@/context/cart";
import { useToast } from "@/context/toast";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBag01Icon, CheckmarkCircle01Icon, MinusSignIcon, PlusSignIcon } from "@hugeicons/core-free-icons";
import type { TebexPackage } from "@/lib/types";
import { toastAddResult } from "@/lib/cart-feedback";

export function AddToCartButton({ pkg }: { pkg: TebexPackage }) {
  const { addToCart, openCart, items, isLoading } = useCart();
  const { toast } = useToast();
  const [qty, setQty] = useState(1);

  const inCart = items.some((i) => i.packageId === pkg.id);
  const allowQty = !pkg.disable_quantity;

  async function handleAdd() {
    if (inCart) {
      openCart();
      return;
    }
    const result = await addToCart(pkg.id, pkg.name, pkg.image, pkg.total_price, pkg.currency, qty);
    toastAddResult(result, pkg.name, toast);
  }

  return (
    <div className="space-y-3">
      {/* Quantity stepper — only when quantity is allowed and item not yet in cart */}
      {allowQty && !inCart && (
        <div className="flex items-center justify-between rounded-xl border border-fg/8 bg-surface/60 px-4 py-2.5">
          <span className="text-xs font-semibold text-fg/40">Quantity</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              className="flex h-6 w-6 items-center justify-center rounded-md border border-fg/10 text-fg/50 transition-colors hover:border-brand/40 hover:text-fg disabled:opacity-30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand"
            >
              <HugeiconsIcon icon={MinusSignIcon} className="h-3 w-3" />
            </button>
            <span className="min-w-6 text-center text-sm font-bold text-fg">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="flex h-6 w-6 items-center justify-center rounded-md border border-fg/10 text-fg/50 transition-colors hover:border-brand/40 hover:text-fg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand"
            >
              <HugeiconsIcon icon={PlusSignIcon} className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleAdd}
        disabled={isLoading}
        className={`relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-3.5 text-sm font-bold text-fg transition-all duration-200 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
          inCart
            ? "bg-brand/30 border border-brand/50 hover:bg-brand/40"
            : "bg-brand hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/20 shimmer-btn"
        }`}
      >
        <HugeiconsIcon icon={inCart ? CheckmarkCircle01Icon : ShoppingBag01Icon} className="h-4 w-4" />
        {isLoading ? "Adding…" : inCart ? "View in Cart" : `Add to Cart${allowQty && qty > 1 ? ` (×${qty})` : ""}`}
      </button>
    </div>
  );
}
