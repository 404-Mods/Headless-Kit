/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import type { TebexCategory, TebexPackage } from "./types";

/**
 * A fixture catalogue used when demo mode is on.
 *
 * Two jobs:
 *  1. Powers the public demo, so it doesn't depend on a live Tebex store that
 *     could change or go down underneath it.
 *  2. Gives anyone who clones this a working storefront on `npm run dev` before
 *     they have a token — browsing, search, filters, cart and codes all work.
 *
 * Deleting `src/lib/demo-data.ts` and `public/assets/demo/` removes it entirely.
 */

const DAY = 24 * 60 * 60 * 1000;
const ago = (days: number) => new Date(Date.now() - days * DAY).toISOString();

function pkg(
  id: number,
  name: string,
  /** Full price before any discount. */
  price: number,
  /** Percentage off, e.g. 15. Converted to an amount below. */
  discountPct: number,
  category: { id: number; name: string },
  image: string,
  createdDaysAgo: number,
  description: string
): TebexPackage {
  const totalPrice = Math.round(price * (1 - discountPct / 100) * 100) / 100;

  return {
    id,
    name,
    description,
    image,
    type: "single",
    category,
    base_price: price,
    sales_tax: 0,
    total_price: totalPrice,
    currency: "USD",
    // Tebex reports an amount here, not a percentage.
    discount: Math.round((price - totalPrice) * 100) / 100,
    disable_quantity: false,
    disable_gifting: false,
    expiration_date: null,
    created_at: ago(createdDaysAgo),
    updated_at: ago(createdDaysAgo),
  };
}

const CATS = {
  scripts: { id: 9001, name: "Scripts" },
  templates: { id: 9002, name: "Templates" },
  assets: { id: 9003, name: "Assets" },
  tools: { id: 9004, name: "Tools" },
};

export const DEMO_PACKAGES: TebexPackage[] = [
  pkg(
    91001,
    "Analytics Dashboard",
    29,
    25,
    CATS.templates,
    "/assets/demo/analytics.svg",
    3,
    "<p>A drop-in analytics dashboard with charts, filters and CSV export.</p><ul><li>Six chart types, all responsive</li><li>Date-range and segment filtering</li><li>Dark and light themes included</li></ul>"
  ),
  pkg(
    91002,
    "Commerce Starter",
    49,
    0,
    CATS.templates,
    "/assets/demo/commerce.svg",
    12,
    "<p>A production-ready storefront scaffold: catalogue, cart, checkout and order history.</p><ul><li>Framework-agnostic cart logic</li><li>Fully typed API layer</li><li>Ships with seeded demo data</li></ul>"
  ),
  pkg(
    91003,
    "Auth Toolkit",
    19,
    0,
    CATS.scripts,
    "/assets/demo/auth.svg",
    28,
    "<p>Session handling, role checks and account linking that you can actually read.</p><ul><li>No external auth service required</li><li>Rotating sessions with sane defaults</li><li>Under 800 lines, fully commented</li></ul>"
  ),
  pkg(
    91004,
    "UI Component Kit",
    35,
    15,
    CATS.assets,
    "/assets/demo/ui-kit.svg",
    7,
    "<p>Forty accessible components built on CSS custom properties, so they re-theme in one line.</p><ul><li>Keyboard navigable throughout</li><li>No component holds a hardcoded colour</li><li>Zero runtime dependencies</li></ul>"
  ),
  pkg(
    91005,
    "Realtime Sync",
    0,
    0,
    CATS.tools,
    "/assets/demo/realtime.svg",
    45,
    "<p>A small WebSocket layer with presence, reconnection and optimistic updates. Free and source-available.</p><ul><li>Automatic backoff and replay</li><li>Presence out of the box</li><li>Works on edge runtimes</li></ul>"
  ),
  pkg(
    91006,
    "Icon Pack",
    12,
    0,
    CATS.assets,
    "/assets/demo/icons.svg",
    60,
    "<p>Six hundred icons in a consistent grid, as inline SVG and as a sprite sheet.</p><ul><li>Optical alignment across the set</li><li>currentColor throughout</li><li>Figma source included</li></ul>"
  ),
];

export const DEMO_CATEGORIES: TebexCategory[] = [
  {
    id: CATS.scripts.id,
    name: "Scripts",
    slug: "scripts",
    parent: {},
    description: "Server-side logic and integrations you can read end to end.",
    packages: DEMO_PACKAGES.filter((p) => p.category.id === CATS.scripts.id),
    order: 1,
    display_type: "grid",
  },
  {
    id: CATS.templates.id,
    name: "Templates",
    slug: "templates",
    parent: {},
    description: "Production-ready starting points, not toy examples.",
    packages: DEMO_PACKAGES.filter((p) => p.category.id === CATS.templates.id),
    order: 2,
    display_type: "grid",
  },
  {
    id: CATS.assets.id,
    name: "Assets",
    slug: "assets",
    parent: {},
    description: "Components, icons and design resources.",
    packages: DEMO_PACKAGES.filter((p) => p.category.id === CATS.assets.id),
    order: 3,
    display_type: "grid",
  },
  {
    id: CATS.tools.id,
    name: "Tools",
    slug: "tools",
    parent: {},
    description: "Small utilities that do one thing well.",
    packages: DEMO_PACKAGES.filter((p) => p.category.id === CATS.tools.id),
    order: 4,
    display_type: "grid",
  },
];


/**
 * Per-product features and requirements for the demo catalogue.
 *
 * Without these the product page renders "No requirements listed yet", which
 * makes the demo look half-finished. Mirrors the shape of src/lib/products.json,
 * which is where a real store keeps this, keyed by Tebex package ID.
 */
export const DEMO_META: Record<string, {
  features?: { label: string; description?: string }[];
  requirements?: { label: string; description: string; color: string }[];
}> = {
  "91001": {
    features: [
      { label: "Six chart types", description: "Line, bar, area, donut, scatter and sparkline" },
      { label: "CSV + JSON export", description: "Client side, no server round trip" },
      { label: "Saved views", description: "Filters and ranges persist per user" },
    ],
    requirements: [
      { label: "React 19", description: "Peer dependency", color: "var(--color-brand)" },
      { label: "Modern browser", description: "CSS custom properties required", color: "var(--color-info)" },
    ],
  },
  "91002": {
    features: [
      { label: "Catalogue + cart", description: "Typed, framework-agnostic cart logic" },
      { label: "Checkout ready", description: "Drop in your payment provider" },
      { label: "Seeded demo data", description: "Runs before you connect anything" },
    ],
    requirements: [
      { label: "Node.js 20+", description: "Runtime requirement", color: "var(--color-brand)" },
      { label: "Next.js 16", description: "App Router", color: "var(--color-accent)" },
    ],
  },
  "91003": {
    features: [
      { label: "Rotating sessions", description: "Sane defaults, no config needed" },
      { label: "Role checks", description: "Composable guards for routes and actions" },
      { label: "Under 800 lines", description: "Fully commented, meant to be read" },
    ],
    requirements: [
      { label: "Node.js 20+", description: "Runtime requirement", color: "var(--color-brand)" },
      { label: "Any datastore", description: "Adapters for SQL, KV and memory", color: "var(--color-info)" },
    ],
  },
  "91004": {
    features: [
      { label: "Forty components", description: "Buttons, inputs, overlays, navigation" },
      { label: "Keyboard navigable", description: "Focus management handled throughout" },
      { label: "Re-themes in one line", description: "Every colour is a CSS custom property" },
    ],
    requirements: [
      { label: "React 19", description: "Peer dependency", color: "var(--color-brand)" },
      { label: "Tailwind v4", description: "Uses the @theme block", color: "var(--color-accent)" },
      { label: "No runtime deps", description: "Nothing ships to your bundle", color: "var(--color-info)" },
    ],
  },
  "91005": {
    features: [
      { label: "Presence built in", description: "Who is online, per room" },
      { label: "Automatic backoff", description: "Reconnects and replays missed messages" },
      { label: "Edge compatible", description: "Runs on Workers and Deno" },
    ],
    requirements: [
      { label: "WebSocket support", description: "Any modern runtime", color: "var(--color-info)" },
    ],
  },
  "91006": {
    features: [
      { label: "600 icons", description: "Drawn on a consistent 24px grid" },
      { label: "Inline SVG + sprite", description: "Use whichever suits your build" },
      { label: "Figma source", description: "Included, with components set up" },
    ],
    requirements: [
      { label: "No dependencies", description: "Plain SVG, works anywhere", color: "var(--color-info)" },
    ],
  },
};

/** Coupon codes the demo basket accepts, so the codes UI is actually testable. */
export const DEMO_COUPONS: Record<string, number> = {
  DEMO10: 10,
  DEMO25: 25,
};
