/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

/**
 * Single source of truth for everything brand-facing.
 *
 * This is the only file most people need to edit to make the storefront their
 * own. Colours live alongside it in `src/app/globals.css` (the `@theme` block).
 *
 * Anything left as an empty string is treated as "not configured" and the UI
 * hides it rather than rendering a dead link.
 */

export interface SocialLink {
  /** Key used to pick the icon. */
  platform: "discord" | "x" | "youtube" | "instagram" | "tiktok" | "github";
  /** Full URL. Leave empty to hide this social entirely. */
  url: string;
}

export const site = {
  /** Store name. Used in the navbar, page titles, metadata and legal copy. */
  name: "Storefront",

  /** Second line under the logo in the navbar. Keep it short. */
  wordmarkSuffix: "STORE",

  /** One-line positioning statement, used on the home hero. */
  tagline: "Built by the community.",

  /** Default meta description, and the fallback social card description. */
  description:
    "A community marketplace for digital goods — scripts, templates, assets and tools, sold direct by the people who make them.",

  /**
   * Canonical public URL. Set NEXT_PUBLIC_STORE_URL in the environment
   * (or wrangler.toml `[vars]`) rather than editing this.
   */
  url: process.env.NEXT_PUBLIC_STORE_URL ?? "http://localhost:3000",

  /** Path to the logo mark, relative to /public. */
  logo: "/assets/logos/logo.svg",

  /**
   * Optional link back to a main community site — shown in the navbar.
   * Leave `url` empty to hide the button entirely.
   */
  parentSite: {
    label: "",
    url: "",
  },

  /** Social links. Empty URLs are filtered out of the footer. */
  socials: [
    { platform: "discord", url: "" },
    { platform: "x", url: "" },
    { platform: "youtube", url: "" },
    { platform: "instagram", url: "" },
    { platform: "tiktok", url: "" },
  ] as SocialLink[],

  /**
   * Handle used for Twitter/X card attribution (including the @).
   * Leave empty to omit the tag from metadata.
   */
  xHandle: "",

  /** Where support enquiries go. Used in the FAQ and legal pages. */
  supportEmail: "support@example.com",

  /** Where aspiring creators apply. Falls back to supportEmail when empty. */
  creatorApplyUrl: "",

  /** Legal entity named in the Terms and Privacy pages. */
  legalEntity: "Storefront",

  /** Keywords for metadata. */
  keywords: ["marketplace", "digital goods", "creator store", "storefront"],

  /**
   * Headline figures on the home page. Delete entries or set to an empty array
   * to hide the strip.
   */
  stats: [
    { value: "100%", label: "Creator Revenue" },
    { value: "24/7", label: "Support" },
    { value: "Instant", label: "Delivery" },
    { value: "Open", label: "Source" },
  ],
} as const;

/** Socials that have actually been configured. */
export const activeSocials = site.socials.filter((s) => s.url.length > 0);
