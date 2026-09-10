/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import type { MetadataRoute } from "next";
import { site } from "@/config/site";

const STORE_URL = site.url;

export default function robots(): MetadataRoute.Robots {
  return {
    sitemap: `${STORE_URL}/sitemap.xml`,
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/checkout/"],
      },
    ],
  };
}
