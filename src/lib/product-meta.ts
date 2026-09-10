/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import productsJson from "./products.json";
import { DEMO_MODE } from "@/config/demo";
import { DEMO_META } from "./demo-data";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface RequirementInfo {
  label: string;
  description: string;
  color: string;
}

export interface FeatureInfo {
  label: string;
  description?: string;
}

export interface ProductMeta {
  requirements?: RequirementInfo[];
  features?: FeatureInfo[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

type ProductsData = Record<string, ProductMeta>;

const data = productsJson as ProductsData;

/** Return stored metadata for a Tebex package ID, or an empty object. */
export function getProductMeta(packageId: number): ProductMeta {
  const key = String(packageId);
  // Demo fixtures carry their own metadata so the demo never shows empty
  // "no requirements listed" panels.
  if (DEMO_MODE && DEMO_META[key]) return DEMO_META[key];
  return data[key] ?? {};
}

/** Return the requirements array for a product, or empty array if not set. */
export function getRequirements(packageId: number): RequirementInfo[] {
  return getProductMeta(packageId).requirements ?? [];
}

/** Return the features array for a product, or empty array if not set. */
export function getFeatures(packageId: number): FeatureInfo[] {
  return getProductMeta(packageId).features ?? [];
}
