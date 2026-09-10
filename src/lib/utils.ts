/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

import { marked } from "marked";

/** Decode HTML entities that Tebex may return in description strings (e.g. &lt;p&gt; → <p>) */
export function decodeHtmlEntities(str: string | null | undefined): string {
  if (!str) return "";
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'");
}

/**
 * Process a Tebex product description — decodes HTML entities then runs it
 * through marked so all Markdown syntax (bold, italic, headings, lists, links,
 * code, blockquotes, horizontal rules, etc.) is converted to proper HTML.
 * marked preserves existing HTML blocks, so the mixed HTML+Markdown that the
 * Tebex editor produces is handled correctly.
 */
/** Strip all HTML tags and common Markdown syntax for plain-text previews. */
export function stripHtmlAndMarkdown(str: string | null | undefined): string {
  if (!str) return "";
  return str
    .replace(/<[^>]*>/g, "")          // strip HTML tags
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1") // ***bold italic***, **bold**, *italic*
    .replace(/_{1,3}([^_]+)_{1,3}/g, "$1")   // __bold__, _italic_
    .replace(/`([^`]+)`/g, "$1")      // inline code
    .replace(/^#{1,6}\s*/gm, "")      // headings
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1") // images → alt text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")  // links → label
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .trim();
}

export async function processDescription(str: string | null | undefined): Promise<string> {
  if (!str) return "";
  const decoded = decodeHtmlEntities(str);
  return await marked.parse(decoded, {
    gfm: true,   // GitHub-flavoured Markdown (tables, strikethrough, task lists)
    breaks: true, // Single newlines become <br>
  });
}
