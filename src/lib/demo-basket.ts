/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import type { TebexBasket, TebexBasketPackage } from "./types";
import { DEMO_COUPONS, DEMO_PACKAGES } from "./demo-data";
import { STORAGE_KEYS } from "./storage-keys";

/**
 * A basket that lives entirely in the browser, used when demo mode is on.
 *
 * Demo mode never calls Tebex, so the cart needs somewhere to live. This keeps
 * the same `TebexBasket` shape the real API returns, which means the drawer,
 * totals, codes UI and checkout button all work unchanged.
 */

const KEY = `${STORAGE_KEYS.basketIdent}:demo`;

interface DemoState {
  lines: { packageId: number; quantity: number }[];
  coupons: string[];
  giftcards: string[];
  creatorCode: string;
}

const EMPTY: DemoState = { lines: [], coupons: [], giftcards: [], creatorCode: "" };

function read(): DemoState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<DemoState>;
    return {
      lines: Array.isArray(parsed.lines) ? parsed.lines : [],
      coupons: Array.isArray(parsed.coupons) ? parsed.coupons : [],
      giftcards: Array.isArray(parsed.giftcards) ? parsed.giftcards : [],
      creatorCode: typeof parsed.creatorCode === "string" ? parsed.creatorCode : "",
    };
  } catch {
    return EMPTY;
  }
}

function write(state: DemoState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage blocked — the basket just won't survive a reload.
  }
}

/** Percentage off from every applied coupon, capped so totals never go negative. */
function discountPercent(state: DemoState): number {
  const total = state.coupons.reduce((sum, code) => sum + (DEMO_COUPONS[code] ?? 0), 0);
  return Math.min(100, total);
}

function toBasket(state: DemoState): TebexBasket {
  const packages: TebexBasketPackage[] = state.lines.flatMap((line) => {
    const pkg = DEMO_PACKAGES.find((p) => p.id === line.packageId);
    if (!pkg) return [];
    return [
      {
        id: pkg.id,
        name: pkg.name,
        quantity: line.quantity,
        image: pkg.image,
        base_price: pkg.base_price,
        total_price: pkg.total_price * line.quantity,
        currency: pkg.currency,
        qty: line.quantity,
        type: pkg.type,
      },
    ];
  });

  const basePrice = packages.reduce((sum, p) => sum + p.total_price, 0);
  const percent = discountPercent(state);
  const totalPrice = Math.round(basePrice * (1 - percent / 100) * 100) / 100;

  return {
    id: 0,
    ident: "demo",
    complete: false,
    email: null,
    username: "Demo shopper",
    coupons: state.coupons.map((coupon_code) => ({ coupon_code })),
    giftcards: state.giftcards.map((card_number) => ({ card_number })),
    creator_code: state.creatorCode,
    cancel_url: "",
    complete_url: null,
    complete_auto_redirect: false,
    country: "US",
    ip: "",
    // Non-null so the cart never asks a demo visitor to link a game account.
    username_id: 1,
    base_price: basePrice,
    sales_tax: 0,
    total_price: totalPrice,
    currency: "USD",
    packages,
    custom: null,
    // Empty so the drawer renders its "checkout unavailable" state rather than
    // sending a demo visitor to a real payment page.
    links: { payment: "", checkout: "" },
  };
}

export const demoBasket = {
  get(): TebexBasket {
    return toBasket(read());
  },

  add(packageId: number, quantity = 1): TebexBasket {
    const state = read();
    const existing = state.lines.find((l) => l.packageId === packageId);
    if (existing) existing.quantity += quantity;
    else state.lines.push({ packageId, quantity });
    write(state);
    return toBasket(state);
  },

  remove(packageId: number): TebexBasket {
    const state = read();
    state.lines = state.lines.filter((l) => l.packageId !== packageId);
    write(state);
    return toBasket(state);
  },

  setQuantity(packageId: number, quantity: number): TebexBasket {
    const state = read();
    const line = state.lines.find((l) => l.packageId === packageId);
    if (line) line.quantity = Math.max(1, quantity);
    write(state);
    return toBasket(state);
  },

  clear(): TebexBasket {
    write(EMPTY);
    return toBasket(EMPTY);
  },

  has(packageId: number): boolean {
    return read().lines.some((l) => l.packageId === packageId);
  },

  applyCode(
    type: "coupon" | "giftcard" | "creator-code",
    code: string
  ): { ok: true; basket: TebexBasket } | { ok: false; message: string } {
    const state = read();
    const value = code.trim();

    if (type === "coupon") {
      const upper = value.toUpperCase();
      if (!(upper in DEMO_COUPONS)) {
        const valid = Object.keys(DEMO_COUPONS).join(" or ");
        return { ok: false, message: `Not a valid code. In this demo, try ${valid}.` };
      }
      if (state.coupons.includes(upper)) {
        return { ok: false, message: "That coupon is already applied." };
      }
      state.coupons.push(upper);
    } else if (type === "giftcard") {
      if (state.giftcards.includes(value)) {
        return { ok: false, message: "That gift card is already applied." };
      }
      state.giftcards.push(value);
    } else {
      state.creatorCode = value;
    }

    write(state);
    return { ok: true, basket: toBasket(state) };
  },

  removeCode(type: "coupon" | "giftcard" | "creator-code", code: string): TebexBasket {
    const state = read();
    if (type === "coupon") state.coupons = state.coupons.filter((c) => c !== code);
    else if (type === "giftcard") state.giftcards = state.giftcards.filter((c) => c !== code);
    else state.creatorCode = "";
    write(state);
    return toBasket(state);
  },
};
