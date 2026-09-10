/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useEffect } from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import { CartProvider, useCart } from "./cart";
import { ToastProvider } from "./toast";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import type { TebexBasket } from "@/lib/types";

function basket(overrides: Partial<TebexBasket> = {}): TebexBasket {
  return {
    id: 1,
    ident: "abc123",
    complete: false,
    email: null,
    username: null,
    coupons: [],
    giftcards: [],
    creator_code: "",
    cancel_url: "",
    complete_url: null,
    complete_auto_redirect: true,
    country: "GB",
    ip: "",
    username_id: 99,
    base_price: 10,
    sales_tax: 0,
    total_price: 10,
    currency: "USD",
    packages: [],
    custom: null,
    links: { payment: "", checkout: "https://checkout.example/abc123" },
    ...overrides,
  };
}

/** Surfaces the bits of cart state the assertions care about. */
function Probe() {
  const { basketIdent, itemCount, appliedCodes, discountTotal, checkoutUrl } = useCart();
  return (
    <div>
      <span data-testid="ident">{basketIdent ?? "none"}</span>
      <span data-testid="count">{itemCount}</span>
      <span data-testid="codes">{appliedCodes.map((c) => `${c.type}:${c.code}`).join(",")}</span>
      <span data-testid="discount">{discountTotal}</span>
      <span data-testid="checkout">{checkoutUrl ?? "none"}</span>
    </div>
  );
}

function renderCart() {
  return render(
    <ToastProvider>
      <CartProvider>
        <Probe />
      </CartProvider>
    </ToastProvider>
  );
}

type CartApi = ReturnType<typeof useCart>;

/**
 * Renders the provider and hands back a handle to the live context value.
 * The capture happens in an effect, so nothing is written during render.
 */
function renderCartApi(): { current: CartApi | null } {
  const handle: { current: CartApi | null } = { current: null };

  function Capture() {
    const cart = useCart();
    useEffect(() => {
      handle.current = cart;
    });
    return null;
  }

  render(
    <ToastProvider>
      <CartProvider>
        <Capture />
      </CartProvider>
    </ToastProvider>
  );

  return handle;
}

/** Fetch mock for a basket that still needs a linked game account. */
function needsAuthApi() {
  return mockApi((url) => {
    if (url === "/api/basket") return { data: { ident: "new123" } };
    if (url.includes("/auth")) return [{ name: "Steam", url: "https://auth.example" }];
    if (url.includes("/api/basket/")) return { data: basket({ username_id: null }) };
    return undefined;
  });
}

/** Minimal router over the app's own API routes. */
function mockApi(handler: (url: string, init?: RequestInit) => unknown) {
  return vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input.toString();
    const body = handler(url, init);
    if (body === undefined) {
      return { ok: false, status: 404, json: async () => ({ error: "not found" }) } as Response;
    }
    return { ok: true, status: 200, json: async () => body } as Response;
  });
}

beforeEach(() => {
  vi.stubGlobal("fetch", mockApi(() => ({ data: basket() })));
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("CartProvider", () => {
  it("starts with no basket", async () => {
    renderCart();
    expect(screen.getByTestId("ident").textContent).toBe("none");
  });

  it("restores a saved basket ident from localStorage", async () => {
    localStorage.setItem(STORAGE_KEYS.basketIdent, "abc123");
    renderCart();
    await waitFor(() => expect(screen.getByTestId("ident").textContent).toBe("abc123"));
  });

  it("exposes the checkout url once the basket loads", async () => {
    localStorage.setItem(STORAGE_KEYS.basketIdent, "abc123");
    renderCart();
    await waitFor(() =>
      expect(screen.getByTestId("checkout").textContent).toBe("https://checkout.example/abc123")
    );
  });

  // Regression: a completed basket used to stay in localStorage, so a returning
  // shopper saw the items they had already paid for still sitting in the cart.
  it("discards a completed basket instead of showing paid-for items", async () => {
    localStorage.setItem(STORAGE_KEYS.basketIdent, "abc123");
    vi.stubGlobal(
      "fetch",
      mockApi(() => ({
        data: basket({
          complete: true,
          packages: [
            { id: 1, name: "Paid item", quantity: 1, image: null, base_price: 10, total_price: 10, currency: "USD", qty: 1, type: "single" },
          ],
        }),
      }))
    );

    renderCart();

    await waitFor(() => {
      expect(localStorage.getItem(STORAGE_KEYS.basketIdent)).toBeNull();
      expect(screen.getByTestId("count").textContent).toBe("0");
    });
  });

  it("forgets a basket the API no longer recognises", async () => {
    localStorage.setItem(STORAGE_KEYS.basketIdent, "expired");
    vi.stubGlobal("fetch", mockApi(() => undefined));

    renderCart();

    await waitFor(() => expect(localStorage.getItem(STORAGE_KEYS.basketIdent)).toBeNull());
  });

  it("counts quantities rather than line items", async () => {
    localStorage.setItem(STORAGE_KEYS.basketIdent, "abc123");
    vi.stubGlobal(
      "fetch",
      mockApi(() => ({
        data: basket({
          packages: [
            { id: 1, name: "A", quantity: 2, image: null, base_price: 10, total_price: 20, currency: "USD", qty: 2, type: "single" },
            { id: 2, name: "B", quantity: 3, image: null, base_price: 5, total_price: 15, currency: "USD", qty: 3, type: "single" },
          ],
        }),
      }))
    );

    renderCart();

    await waitFor(() => expect(screen.getByTestId("count").textContent).toBe("5"));
  });

  it("flattens coupons, gift cards and creator codes into one list", async () => {
    localStorage.setItem(STORAGE_KEYS.basketIdent, "abc123");
    vi.stubGlobal(
      "fetch",
      mockApi(() => ({
        data: basket({
          coupons: [{ coupon_code: "SUMMER10" }],
          giftcards: [{ card_number: "GC-1" }],
          creator_code: "ada",
        }),
      }))
    );

    renderCart();

    await waitFor(() =>
      expect(screen.getByTestId("codes").textContent).toBe("coupon:SUMMER10,giftcard:GC-1,creator-code:ada")
    );
  });

  it("derives the discount from what the totals no longer add up to", async () => {
    localStorage.setItem(STORAGE_KEYS.basketIdent, "abc123");
    vi.stubGlobal(
      "fetch",
      mockApi(() => ({ data: basket({ base_price: 100, sales_tax: 20, total_price: 90 }) }))
    );

    renderCart();

    await waitFor(() => expect(screen.getByTestId("discount").textContent).toBe("30"));
  });

  it("never reports a negative discount", async () => {
    localStorage.setItem(STORAGE_KEYS.basketIdent, "abc123");
    vi.stubGlobal(
      "fetch",
      mockApi(() => ({ data: basket({ base_price: 10, sales_tax: 0, total_price: 12 }) }))
    );

    renderCart();

    await waitFor(() => expect(screen.getByTestId("discount").textContent).toBe("0"));
  });
});

describe("pending package across the auth redirect", () => {
  // Regression: the package being added was held in React state, which does not
  // survive the full page navigation out to Tebex and back, so the retry after
  // linking an account silently did nothing.
  it("persists the pending package to sessionStorage when auth is required", async () => {
    vi.stubGlobal("fetch", needsAuthApi());
    const cart = renderCartApi();
    await waitFor(() => expect(cart.current).not.toBeNull());

    await act(async () => {
      await cart.current!.addToCart(7, "Alpha Toolkit", null, 5, "USD", 2);
    });

    const stored = sessionStorage.getItem(STORAGE_KEYS.pendingPackage);
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored!)).toMatchObject({ id: 7, name: "Alpha Toolkit", quantity: 2 });
  });

  it("reports needs-auth rather than claiming the item was added", async () => {
    vi.stubGlobal("fetch", needsAuthApi());
    const cart = renderCartApi();
    await waitFor(() => expect(cart.current).not.toBeNull());

    let result: Awaited<ReturnType<CartApi["addToCart"]>> | undefined;
    await act(async () => {
      result = await cart.current!.addToCart(7, "Alpha Toolkit", null, 5, "USD");
    });

    expect(result).toEqual({ status: "needs-auth" });
  });

  it("clears the pending package when the shopper dismisses the auth prompt", async () => {
    vi.stubGlobal("fetch", needsAuthApi());
    const cart = renderCartApi();
    await waitFor(() => expect(cart.current).not.toBeNull());

    await act(async () => {
      await cart.current!.addToCart(7, "Alpha Toolkit", null, 5, "USD");
    });
    expect(sessionStorage.getItem(STORAGE_KEYS.pendingPackage)).not.toBeNull();

    await act(async () => {
      cart.current!.clearAuth();
    });
    expect(sessionStorage.getItem(STORAGE_KEYS.pendingPackage)).toBeNull();
  });

  it("reports already-in-cart for a package the basket already holds", async () => {
    localStorage.setItem(STORAGE_KEYS.basketIdent, "abc123");
    vi.stubGlobal(
      "fetch",
      mockApi(() => ({
        data: basket({
          packages: [
            { id: 7, name: "Alpha", quantity: 1, image: null, base_price: 5, total_price: 5, currency: "USD", qty: 1, type: "single" },
          ],
        }),
      }))
    );

    const cart = renderCartApi();
    await waitFor(() => expect(cart.current).not.toBeNull());

    let result: Awaited<ReturnType<CartApi["addToCart"]>> | undefined;
    await act(async () => {
      result = await cart.current!.addToCart(7, "Alpha", null, 5, "USD");
    });

    expect(result).toEqual({ status: "already-in-cart" });
  });
});
