"use client";

/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { TebexBasket, TebexAuthLink, CartItem } from "@/lib/types";
import type { BasketCodeType } from "@/lib/tebex";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import { DEMO_MODE } from "@/config/demo";
import { demoBasket } from "@/lib/demo-basket";

/**
 * Outcome of an add-to-cart attempt. Callers need this to show honest feedback —
 * previously every call site toasted "Added to cart" even when the item was
 * already in the basket, the user still had to link a game account, or the
 * request failed outright.
 */
export type AddToCartResult =
  | { status: "added" }
  | { status: "already-in-cart" }
  | { status: "needs-auth" }
  | { status: "error"; message: string };

/** Outcome of applying or removing a basket code. */
export type CodeResult = { ok: true } | { ok: false; message: string };

/** A code currently applied to the basket, normalised across the three types. */
export interface AppliedCode {
  type: BasketCodeType;
  code: string;
}

interface PendingPackage {
  id: number;
  name: string;
  image: string | null;
  price: number;
  currency: string;
  quantity: number;
}

interface CartContextValue {
  basketIdent: string | null;
  basket: TebexBasket | null;
  items: CartItem[];
  itemCount: number;
  isLoading: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (packageId: number, name: string, image: string | null, price: number, currency: string, quantity?: number) => Promise<AddToCartResult>;
  removeFromCart: (packageId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  updateQuantity: (packageId: number, quantity: number) => Promise<void>;
  refreshBasket: () => Promise<void>;
  checkoutUrl: string | null;
  // codes
  appliedCodes: AppliedCode[];
  discountTotal: number;
  applyCode: (type: BasketCodeType, code: string) => Promise<CodeResult>;
  removeCode: (type: BasketCodeType, code: string) => Promise<CodeResult>;
  // auth
  needsAuth: boolean;
  authLinks: TebexAuthLink[];
  clearAuth: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const BASKET_KEY = STORAGE_KEYS.basketIdent;
/**
 * Linking a game account sends the user to Tebex and back via a full page load,
 * so the package they were trying to buy cannot live in React state — it has to
 * survive the navigation.
 */
const PENDING_KEY = STORAGE_KEYS.pendingPackage;

function readPending(): PendingPackage | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as PendingPackage) : null;
  } catch {
    return null;
  }
}

function writePending(pkg: PendingPackage | null) {
  try {
    if (pkg) sessionStorage.setItem(PENDING_KEY, JSON.stringify(pkg));
    else sessionStorage.removeItem(PENDING_KEY);
  } catch {
    // storage unavailable — the user just has to click Add to Cart again
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [basketIdent, setBasketIdent] = useState<string | null>(null);
  const [basket, setBasket] = useState<TebexBasket | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [authLinks, setAuthLinks] = useState<TebexAuthLink[]>([]);

  // Load basket ident from localStorage on mount
  useEffect(() => {
    if (DEMO_MODE) {
      // No Tebex round trip in demo mode — the basket lives in the browser.
      setBasketIdent("demo");
      setBasket(demoBasket.get());
      return;
    }
    const stored = localStorage.getItem(BASKET_KEY);
    if (stored) setBasketIdent(stored);
  }, []);

  // Sync items from basket packages
  useEffect(() => {
    if (!basket) { setItems([]); return; }
    setItems(
      (basket.packages ?? []).map((pkg) => ({
        packageId: pkg.id,
        name: pkg.name,
        image: pkg.image ?? null,
        price: pkg.total_price ?? pkg.base_price ?? 0,
        currency: pkg.currency ?? basket.currency,
        quantity: pkg.qty ?? pkg.quantity ?? 1,
      }))
    );
  }, [basket]);

  /** Forget the local basket entirely (expired, or already paid for). */
  const forgetBasket = useCallback(() => {
    localStorage.removeItem(BASKET_KEY);
    writePending(null);
    setBasketIdent(null);
    setBasket(null);
  }, []);

  const refreshBasket = useCallback(async () => {
    if (DEMO_MODE) {
      setBasket(demoBasket.get());
      return;
    }
    const ident = basketIdent ?? localStorage.getItem(BASKET_KEY);
    if (!ident) return;
    try {
      const res = await fetch(`/api/basket/${ident}`);
      if (!res.ok) {
        // Basket may be expired — clear it
        forgetBasket();
        return;
      }
      const data = await res.json();
      const fetched: TebexBasket | null = data.data ?? null;
      // A completed basket is a finished order. Keeping it would leave the
      // purchased items sitting in the cart the next time the user visits.
      if (fetched?.complete) {
        forgetBasket();
        return;
      }
      setBasket(fetched);
    } catch {
      // ignore
    }
  }, [basketIdent, forgetBasket]);

  // Refresh basket whenever ident changes
  useEffect(() => {
    if (basketIdent) refreshBasket();
  }, [basketIdent, refreshBasket]);

  async function ensureBasket(): Promise<string> {
    const existing = basketIdent ?? localStorage.getItem(BASKET_KEY);
    if (existing) return existing;

    const res = await fetch("/api/basket", { method: "POST" });
    if (!res.ok) throw new Error("Failed to create basket");
    const data = await res.json();
    const ident: string = data.data.ident;
    localStorage.setItem(BASKET_KEY, ident);
    setBasketIdent(ident);
    return ident;
  }

  async function addToCart(
    packageId: number,
    name: string,
    image: string | null,
    price: number,
    currency: string,
    quantity = 1
  ): Promise<AddToCartResult> {
    if (DEMO_MODE) {
      if (demoBasket.has(packageId)) {
        setIsOpen(true);
        return { status: "already-in-cart" };
      }
      setBasket(demoBasket.add(packageId, quantity));
      setIsOpen(true);
      return { status: "added" };
    }

    setIsLoading(true);
    try {
      const ident = await ensureBasket();

      // Fetch latest basket to check if user is authenticated
      const basketRes = await fetch(`/api/basket/${ident}`);
      const basketData = basketRes.ok ? await basketRes.json() : null;
      const currentBasket: TebexBasket | null = basketData?.data ?? null;
      if (currentBasket) setBasket(currentBasket);

      if (!currentBasket?.username_id) {
        // Need game account auth before adding packages. Persist the intent so we
        // can finish the job when Tebex redirects back.
        writePending({ id: packageId, name, image, price, currency, quantity });
        const returnUrl = `${window.location.origin}${window.location.pathname}?auth_return=1`;
        const authRes = await fetch(`/api/basket/${ident}/auth?returnUrl=${encodeURIComponent(returnUrl)}`);
        if (!authRes.ok) {
          writePending(null);
          return { status: "error", message: "Couldn't start account linking. Please try again." };
        }
        const links: TebexAuthLink[] = await authRes.json();
        setAuthLinks(links);
        setNeedsAuth(true);
        return { status: "needs-auth" };
      }

      // Don't add if already in basket
      const alreadyInCart = (currentBasket?.packages ?? []).some((p) => p.id === packageId);
      if (alreadyInCart) {
        setIsOpen(true);
        return { status: "already-in-cart" };
      }

      // Optimistic update: add item immediately before API resolves
      const alreadyOptimistic = items.some((i) => i.packageId === packageId);
      if (!alreadyOptimistic) {
        setItems((prev) => [
          ...prev,
          { packageId, name, image, price, currency, quantity },
        ]);
      }

      const res = await fetch(`/api/basket/${ident}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ package_id: packageId, quantity }),
      });
      if (!res.ok) {
        // Revert optimistic update on failure
        await refreshBasket();
        return { status: "error", message: "Couldn't add that to your cart. Please try again." };
      }
      const data = await res.json();
      setBasket(data);
      setIsOpen(true);
      return { status: "added" };
    } catch (err) {
      console.error(err);
      return { status: "error", message: "Something went wrong. Please try again." };
    } finally {
      setIsLoading(false);
    }
  }

  // Called when the user dismisses the auth modal without linking an account
  const clearAuth = useCallback(() => {
    setNeedsAuth(false);
    setAuthLinks([]);
    writePending(null);
  }, []);

  // After auth return: refresh basket and retry the package the user wanted
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (!params.has("auth_return")) return;
    // Strip the query param from the URL
    const url = new URL(window.location.href);
    url.searchParams.delete("auth_return");
    window.history.replaceState({}, "", url.toString());
    // Refresh basket, then retry the pending item
    refreshBasket().then(() => {
      const pending = readPending();
      if (!pending) return;
      writePending(null);
      addToCart(pending.id, pending.name, pending.image, pending.price, pending.currency, pending.quantity);
    });
  // Only run on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function removeFromCart(packageId: number) {
    if (DEMO_MODE) {
      setBasket(demoBasket.remove(packageId));
      return;
    }
    if (!basketIdent) return;
    // Optimistic: remove item immediately
    setItems((prev) => prev.filter((i) => i.packageId !== packageId));
    setIsLoading(true);
    try {
      const res = await fetch(`/api/basket/${basketIdent}/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ package_id: packageId }),
      });
      if (!res.ok) {
        await refreshBasket();
        throw new Error("Failed to remove from cart");
      }
      const data = await res.json();
      setBasket(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  async function clearCart() {
    if (DEMO_MODE) {
      setBasket(demoBasket.clear());
      return;
    }
    if (!basketIdent || items.length === 0) return;
    const snapshot = [...items];
    setItems([]);
    setIsLoading(true);
    try {
      // Sequential, not parallel: concurrent mutations of the same Tebex basket
      // race each other and can leave items behind.
      for (const item of snapshot) {
        await fetch(`/api/basket/${basketIdent}/remove`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ package_id: item.packageId }),
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      await refreshBasket();
      setIsLoading(false);
    }
  }

  async function updateQuantity(packageId: number, quantity: number) {
    if (quantity < 1) { await removeFromCart(packageId); return; }
    if (DEMO_MODE) {
      setBasket(demoBasket.setQuantity(packageId, quantity));
      return;
    }
    if (!basketIdent) return;
    // Optimistic update
    setItems((prev) =>
      prev.map((i) => (i.packageId === packageId ? { ...i, quantity } : i))
    );
    setIsLoading(true);
    try {
      // Tebex: remove then re-add with new quantity
      await fetch(`/api/basket/${basketIdent}/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ package_id: packageId }),
      });
      const res = await fetch(`/api/basket/${basketIdent}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ package_id: packageId, quantity }),
      });
      if (res.ok) {
        const data = await res.json();
        setBasket(data);
      } else {
        await refreshBasket();
      }
    } catch (err) {
      console.error(err);
      await refreshBasket();
    } finally {
      setIsLoading(false);
    }
  }
  /** Every code on the basket, flattened into one list for the UI. */
  const appliedCodes: AppliedCode[] = [
    ...(basket?.coupons ?? []).map((c) => ({ type: "coupon" as const, code: c.coupon_code })),
    ...(basket?.giftcards ?? []).map((g) => ({ type: "giftcard" as const, code: g.card_number })),
    ...(basket?.creator_code ? [{ type: "creator-code" as const, code: basket.creator_code }] : []),
  ];

  /**
   * What the codes took off. Tebex reports the post-discount total, so the
   * saving is whatever the line items and tax add up to beyond it.
   */
  const discountTotal = basket
    ? Math.max(0, (basket.base_price ?? 0) + (basket.sales_tax ?? 0) - (basket.total_price ?? 0))
    : 0;

  async function mutateCode(
    type: BasketCodeType,
    code: string,
    method: "POST" | "DELETE"
  ): Promise<CodeResult> {
    if (DEMO_MODE) {
      if (method === "DELETE") {
        setBasket(demoBasket.removeCode(type, code));
        return { ok: true };
      }
      const result = demoBasket.applyCode(type, code);
      if (!result.ok) return { ok: false, message: result.message };
      setBasket(result.basket);
      return { ok: true };
    }

    const ident = basketIdent ?? localStorage.getItem(BASKET_KEY);
    if (!ident) return { ok: false, message: "Your cart is empty." };

    setIsLoading(true);
    try {
      const res = await fetch(`/api/basket/${ident}/codes`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, code }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        return { ok: false, message: data?.error ?? "That code could not be applied." };
      }
      if (data?.data) setBasket(data.data);
      return { ok: true };
    } catch {
      return { ok: false, message: "Couldn't reach the store. Please try again." };
    } finally {
      setIsLoading(false);
    }
  }

  const applyCode = (type: BasketCodeType, code: string) => mutateCode(type, code, "POST");
  const removeCode = (type: BasketCodeType, code: string) => mutateCode(type, code, "DELETE");

  const checkoutUrl = basket?.links?.checkout ?? null;

  return (
    <CartContext.Provider value={{
      basketIdent,
      basket,
      items,
      itemCount,
      isLoading,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addToCart,
      removeFromCart,
      clearCart,
      updateQuantity,
      refreshBasket,
      checkoutUrl,
      appliedCodes,
      discountTotal,
      applyCode,
      removeCode,
      needsAuth,
      authLinks,
      clearAuth,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
