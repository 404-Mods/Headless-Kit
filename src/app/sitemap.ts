/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import type { MetadataRoute } from "next";
import { getPackages, getCategories } from "@/lib/tebex";
import { slugify } from "@/lib/utils";
import { site } from "@/config/site";

const STORE_URL = site.url;

// Rebuilt on the same cadence as the catalog cache.
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: STORE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${STORE_URL}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${STORE_URL}/categories`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${STORE_URL}/creators`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${STORE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${STORE_URL}/faq`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${STORE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${STORE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  // A Tebex outage must not fail the build or blank the sitemap.
  const [packages, categories] = await Promise.all([
    getPackages().catch(() => []),
    getCategories().catch(() => []),
  ]);

  const productRoutes: MetadataRoute.Sitemap = packages.map((pkg) => ({
    url: `${STORE_URL}/products/${slugify(pkg.name)}`,
    lastModified: pkg.updated_at ? new Date(pkg.updated_at) : undefined,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${STORE_URL}/category/${slugify(cat.name)}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
