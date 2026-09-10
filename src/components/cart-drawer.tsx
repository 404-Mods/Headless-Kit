"use client";

/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/context/cart";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Delete02Icon,
  ShoppingBag01Icon,
  ArrowRight01Icon,
  ShoppingCart01Icon,
  MinusSignIcon,
  PlusSignIcon,
  Delete03Icon,
} from "@hugeicons/core-free-icons";
import type { TebexPackage } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { BasketCodes } from "@/components/basket-codes";
import { isDiscounted, discountPercent } from "@/lib/pricing";
import { DEMO_MODE } from "@/config/demo";

export function CartDrawer() {
  const { isOpen, closeCart, items, removeFromCart, clearCart, updateQuantity, isLoading, basket, checkoutUrl, basketIdent, discountTotal } = useCart();
  const [suggestions, setSuggestions] = useState<TebexPackage[]>([]);

  // Fetch suggestions once when the drawer is first opened and cart is empty
  useEffect(() => {
    if (!isOpen || items.length > 0 || suggestions.length > 0) return;
    fetch("/api/featured")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setSuggestions(data))
      .catch(() => {});
  }, [isOpen, items.length, suggestions.length]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Drawer — slides up from bottom on mobile, from right on desktop */}
      <div
        className={`fixed z-50 flex flex-col bg-surface-raised shadow-2xl transition-transform duration-300 ease-in-out
          bottom-0 left-0 right-0 h-[85dvh] rounded-t-2xl border-t border-fg/5
          sm:bottom-auto sm:left-auto sm:right-0 sm:top-0 sm:h-full sm:w-full sm:max-w-sm sm:rounded-none sm:border-l sm:border-t-0
          ${isOpen ? "translate-y-0 sm:translate-x-0" : "translate-y-full sm:translate-y-0 sm:translate-x-full"}
        `}
      >
        {/* Mobile drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-fg/15" />
        </div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-fg/5 px-5 py-4">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={ShoppingBag01Icon} className="h-4 w-4 text-brand" />
            <h2 className="text-sm font-bold text-fg">Your Cart</h2>
            {items.length > 0 && (
              <span className="rounded-full bg-brand/20 px-2 py-0.5 text-[10px] font-bold text-brand">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                disabled={isLoading}
                title="Clear cart"
                className="flex h-7 w-7 items-center justify-center rounded-md text-fg/25 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
              >
                <HugeiconsIcon icon={Delete03Icon} className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={closeCart}
              className="flex h-7 w-7 items-center justify-center rounded-md text-fg/40 transition-colors hover:bg-fg/5 hover:text-fg"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Skeleton while basket is being fetched for the first time */}
          {basketIdent && !basket ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex animate-pulse items-center gap-3 rounded-xl border border-fg/5 bg-fg/2 p-3"
                >
                  <div className="h-12 w-12 shrink-0 rounded-lg bg-fg/8" />
                  <div className="flex-1 space-y-2 py-0.5">
                    <div className="h-3 w-3/4 rounded bg-fg/8" />
                    <div className="h-2.5 w-1/3 rounded bg-fg/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col gap-4 py-6">
              {/* Empty state icon + text */}
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fg/5">
                  <HugeiconsIcon icon={ShoppingCart01Icon} className="h-6 w-6 text-fg/20" />
                </div>
                <p className="text-sm text-fg/30">Your cart is empty</p>
                <Link
                  href="/products"
                  onClick={closeCart}
                  className="text-xs font-semibold text-brand hover:underline"
                >
                  Browse products →
                </Link>
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div>
                  <p className="mb-3 px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-fg/25">
                    You might like
                  </p>
                  <div className="space-y-2">
                    {suggestions.map((pkg) => (
                      <Link
                        key={pkg.id}
                        href={`/products/${slugify(pkg.name)}`}
                        onClick={closeCart}
                        className="group flex items-center gap-3 rounded-xl border border-fg/5 bg-fg/2 p-3 transition-all hover:border-brand/20 hover:bg-fg/4"
                      >
                        {pkg.image ? (
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                            <Image src={pkg.image} alt={pkg.name} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10">
                            <HugeiconsIcon icon={ShoppingBag01Icon} className="h-4 w-4 text-brand/50" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-fg group-hover:text-info">
                            {pkg.name}
                          </p>
                          <p className="text-[10px] text-fg/35">
                            {pkg.currency} {pkg.total_price.toFixed(2)}
                            {isDiscounted(pkg) && (
                              <span className="ml-1.5 text-accent">−{discountPercent(pkg)}%</span>
                            )}
                          </p>
                        </div>
                        <HugeiconsIcon icon={ArrowRight01Icon} className="h-3.5 w-3.5 shrink-0 text-fg/20 transition-transform group-hover:translate-x-0.5 group-hover:text-fg/40" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.packageId}
                  className="flex items-center gap-3 rounded-xl border border-fg/5 bg-fg/2 p-3"
                >
                  {item.image ? (
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand/10">
                      <HugeiconsIcon icon={ShoppingBag01Icon} className="h-5 w-5 text-brand/60" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-fg">{item.name}</p>
                    <p className="text-xs text-fg/40">
                      {item.currency} {(item.price ?? 0).toFixed(2)}
                      {item.quantity > 1 && (
                        <span className="ml-1 text-fg/25">× {item.quantity} = {item.currency} {((item.price ?? 0) * item.quantity).toFixed(2)}</span>
                      )}
                    </p>
                  </div>
                  {/* Quantity stepper */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.packageId, item.quantity - 1)}
                      disabled={isLoading}
                      className="flex h-6 w-6 items-center justify-center rounded-md border border-fg/8 text-fg/30 transition-colors hover:border-fg/20 hover:text-fg disabled:opacity-40"
                    >
                      <HugeiconsIcon icon={MinusSignIcon} className="h-3 w-3" />
                    </button>
                    <span className="min-w-4 text-center text-xs font-bold text-fg">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.packageId, item.quantity + 1)}
                      disabled={isLoading}
                      className="flex h-6 w-6 items-center justify-center rounded-md border border-fg/8 text-fg/30 transition-colors hover:border-fg/20 hover:text-fg disabled:opacity-40"
                    >
                      <HugeiconsIcon icon={PlusSignIcon} className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.packageId)}
                    disabled={isLoading}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-fg/20 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                  >
                    <HugeiconsIcon icon={Delete02Icon} className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-fg/5 px-5 py-4 space-y-3">
            <BasketCodes />

            {/* Totals */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-fg/50">Subtotal</span>
                <span className="font-semibold text-fg">
                  {basket?.currency ?? "USD"} {(basket?.base_price ?? 0).toFixed(2)}
                </span>
              </div>
              {discountTotal > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-info">Discount</span>
                  <span className="font-semibold text-info">
                    −{basket?.currency ?? "USD"} {discountTotal.toFixed(2)}
                  </span>
                </div>
              )}
              {(basket?.sales_tax ?? 0) > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-fg/30">Tax</span>
                  <span className="text-fg/50">{basket?.currency} {basket?.sales_tax.toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-fg/5 pt-1.5 text-sm font-bold">
                <span className="text-fg">Total</span>
                <span className="text-brand">
                  {basket?.currency ?? "USD"} {(basket?.total_price ?? 0).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            {checkoutUrl ? (
              <a
                href={checkoutUrl}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/20"
              >
                Proceed to Checkout
                <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
              </a>
            ) : DEMO_MODE ? (
              <div className="rounded-xl border border-info/20 bg-info/10 px-4 py-3 text-center text-xs text-fg/50">
                Checkout is disabled in this demo.
              </div>
            ) : (
              <div className="rounded-xl bg-fg/5 px-4 py-3 text-center text-xs text-fg/30">
                Loading checkout…
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
