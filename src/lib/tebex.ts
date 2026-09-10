/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import type { TebexCategory, TebexCategoryParent, TebexPackage, TebexBasket, TebexAuthLink } from "./types";
import { DEMO_MODE } from "@/config/demo";
import { DEMO_CATEGORIES, DEMO_PACKAGES } from "./demo-data";

const BASE = "https://headless.tebex.io/api";

/**
 * Catalog data (categories + packages) is identical for every visitor, so it is
 * cached and revalidated rather than re-fetched on every request. Without this,
 * every pageview costs a round trip to Tebex from the Worker — slow, and an easy
 * way to hit their rate limits.
 *
 * Basket calls are per-user and always bypass the cache.
 */
const CATALOG_TTL_SECONDS = 300;
export const CATALOG_TAG = "tebex-catalog";

const catalogCache = {
  next: { revalidate: CATALOG_TTL_SECONDS, tags: [CATALOG_TAG] },
};

function token(): string {
  const t = process.env.TEBEX_TOKEN;
  if (!t) throw new Error("TEBEX_TOKEN is not set");
  return t;
}

/**
 * Whether a Tebex token is configured. Lets pages tell "the store is empty"
 * apart from "the store was never connected" without catching a thrown error.
 * Server-side only — the token is never exposed to the browser.
 */
export function isStoreConnected(): boolean {
  return DEMO_MODE || Boolean(process.env.TEBEX_TOKEN);
}

/** True when setup guidance should be rendered instead of a neutral empty state. */
export function shouldShowSetupHelp(): boolean {
  return !isStoreConnected() && process.env.NODE_ENV !== "production";
}

// ── Category helpers ───────────────────────────────────────────────────────────

/** Returns true if the category is a subcategory (has a populated parent object) */
export function isSubcategory(cat: TebexCategory): boolean {
  return !!cat.parent && "id" in cat.parent;
}

/** Returns the parent info if this is a subcategory, otherwise null */
export function getParentInfo(cat: TebexCategory): TebexCategoryParent | null {
  if (cat.parent && "id" in cat.parent) return cat.parent as TebexCategoryParent;
  return null;
}

/** Returns all subcategories of a given parent category ID from a flat list */
export function getSubcategories(cats: TebexCategory[], parentId: number): TebexCategory[] {
  return cats
    .filter((c) => c.parent && "id" in c.parent && (c.parent as TebexCategoryParent).id === parentId)
    .sort((a, b) => a.order - b.order);
}

/** Returns only root (non-subcategory) categories from a flat list */
export function getRootCategories(cats: TebexCategory[]): TebexCategory[] {
  return cats.filter((c) => !isSubcategory(c)).sort((a, b) => a.order - b.order);
}

export async function getCategories(includePackages = false): Promise<TebexCategory[]> {
  if (DEMO_MODE) {
    return includePackages
      ? DEMO_CATEGORIES
      : DEMO_CATEGORIES.map((c) => ({ ...c, packages: [] }));
  }
  const url = `${BASE}/accounts/${token()}/categories${includePackages ? "?includePackages=1" : ""}`;
  const res = await fetch(url, catalogCache);
  if (!res.ok) throw new Error(`Tebex getCategories failed: ${res.status}`);
  const json = await res.json();
  return json.data as TebexCategory[];
}

export async function getCategory(categoryId: number, includePackages = true): Promise<TebexCategory> {
  if (DEMO_MODE) {
    const match = DEMO_CATEGORIES.find((c) => c.id === categoryId);
    if (!match) throw new Error("Demo category not found: " + categoryId);
    return includePackages ? match : { ...match, packages: [] };
  }
  const url = `${BASE}/accounts/${token()}/categories/${categoryId}${includePackages ? "?includePackages=1" : ""}`;
  const res = await fetch(url, catalogCache);
  if (!res.ok) throw new Error(`Tebex getCategory failed: ${res.status}`);
  const json = await res.json();
  // The single-category endpoint may return data as an object or as an array
  const raw = Array.isArray(json.data) ? json.data[0] : json.data;
  return { ...raw, packages: raw.packages ?? [] } as TebexCategory;
}

export async function getPackages(): Promise<TebexPackage[]> {
  if (DEMO_MODE) return DEMO_PACKAGES;
  const url = `${BASE}/accounts/${token()}/packages`;
  const res = await fetch(url, catalogCache);
  if (!res.ok) throw new Error(`Tebex getPackages failed: ${res.status}`);
  const json = await res.json();
  return json.data as TebexPackage[];
}

export async function getPackage(packageId: number): Promise<TebexPackage> {
  if (DEMO_MODE) {
    const match = DEMO_PACKAGES.find((p) => p.id === packageId);
    if (!match) throw new Error("Demo package not found: " + packageId);
    return match;
  }
  const url = `${BASE}/accounts/${token()}/packages/${packageId}`;
  const res = await fetch(url, catalogCache);
  if (!res.ok) throw new Error(`Tebex getPackage failed: ${res.status}`);
  const json = await res.json();
  // data may be an object or an array depending on API version
  return (Array.isArray(json.data) ? json.data[0] : json.data) as TebexPackage;
}

export async function createBasket(completeUrl: string, cancelUrl: string): Promise<TebexBasket> {
  const url = `${BASE}/accounts/${token()}/baskets`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ complete_url: completeUrl, cancel_url: cancelUrl, complete_auto_redirect: true }),
  });
  if (!res.ok) throw new Error(`Tebex createBasket failed: ${res.status}`);
  const json = await res.json();
  return json.data as TebexBasket;
}

export async function getBasket(basketIdent: string): Promise<TebexBasket> {
  const url = `${BASE}/accounts/${token()}/baskets/${basketIdent}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Tebex getBasket failed: ${res.status}`);
  const json = await res.json();
  return json.data as TebexBasket;
}

export async function addPackageToBasket(basketIdent: string, packageId: number, quantity = 1): Promise<TebexBasket> {
  const url = `${BASE}/baskets/${basketIdent}/packages`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ package_id: packageId, quantity }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "(no body)");
    throw new Error(`Tebex addPackage failed: ${res.status} — ${body}`);
  }
  const json = await res.json();
  return (json.data ?? json) as TebexBasket;
}

export async function removePackageFromBasket(basketIdent: string, packageId: number): Promise<TebexBasket> {
  const url = `${BASE}/baskets/${basketIdent}/packages/remove`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ package_id: packageId }),
  });
  if (!res.ok) throw new Error(`Tebex removePackage failed: ${res.status}`);
  const json = await res.json();
  return (json.data ?? json) as TebexBasket;
}

export async function getBasketAuthLinks(basketIdent: string, returnUrl: string): Promise<TebexAuthLink[]> {
  const url = `${BASE}/accounts/${token()}/baskets/${basketIdent}/auth?returnUrl=${encodeURIComponent(returnUrl)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Tebex getBasketAuthLinks failed: ${res.status}`);
  return res.json() as Promise<TebexAuthLink[]>;
}

// ── Basket codes (coupons, gift cards, creator codes) ─────────────────────────

/** The three kinds of code a basket can carry. */
export type BasketCodeType = "coupon" | "giftcard" | "creator-code";

/** Endpoint segment and request field for each code type. */
const CODE_ENDPOINTS: Record<BasketCodeType, { path: string; field: string }> = {
  coupon: { path: "coupons", field: "coupon_code" },
  giftcard: { path: "giftcards", field: "card_number" },
  "creator-code": { path: "creator-codes", field: "creator_code" },
};

/**
 * A rejected code — a typo, an expired coupon, a gift card with no balance.
 * Carries a message safe to show the shopper, because "that code didn't work"
 * is the whole point of the interaction.
 */
export class BasketCodeError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "BasketCodeError";
    this.status = status;
  }
}

/** Pull a human-readable reason out of Tebex's error body, whatever shape it took. */
function extractErrorMessage(body: string, fallback: string): string {
  try {
    const json = JSON.parse(body);
    const msg = json.detail ?? json.message ?? json.error ?? json.title;
    if (typeof msg === "string" && msg.trim()) return msg.trim();
  } catch {
    // not JSON — fall through
  }
  return fallback;
}

async function basketCodeRequest(
  basketIdent: string,
  type: BasketCodeType,
  code: string,
  action: "apply" | "remove"
): Promise<void> {
  const { path, field } = CODE_ENDPOINTS[type];
  const suffix = action === "remove" ? "/remove" : "";
  const url = `${BASE}/accounts/${token()}/baskets/${basketIdent}/${path}${suffix}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ [field]: code }),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new BasketCodeError(
      extractErrorMessage(body, `That ${LABELS[type]} could not be applied.`),
      res.status
    );
  }
}

const LABELS: Record<BasketCodeType, string> = {
  coupon: "coupon",
  giftcard: "gift card",
  "creator-code": "creator code",
};

/** Human label for a code type, for messages and UI. */
export function codeTypeLabel(type: BasketCodeType): string {
  return LABELS[type];
}

/**
 * Apply a code to the basket. Tebex's response body for these endpoints is not
 * consistently the full basket, so callers should re-read the basket afterwards.
 */
export async function applyBasketCode(basketIdent: string, type: BasketCodeType, code: string): Promise<void> {
  await basketCodeRequest(basketIdent, type, code, "apply");
}

/** Remove a previously applied code. */
export async function removeBasketCode(basketIdent: string, type: BasketCodeType, code: string): Promise<void> {
  await basketCodeRequest(basketIdent, type, code, "remove");
}
