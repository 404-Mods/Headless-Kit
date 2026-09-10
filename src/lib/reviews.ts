/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { D1Database } from "@cloudflare/workers-types";

/**
 * Product reviews, stored in Cloudflare D1.
 *
 * Reviews are OPTIONAL. The template ships without a database bound, and every
 * function here degrades to "no reviews" rather than throwing — so a fresh clone
 * runs fine and enabling reviews is a deliberate opt-in (see README).
 */

export interface Review {
  id: number;
  packageId: number;
  author: string;
  rating: number;
  title: string | null;
  body: string;
  createdAt: string;
}

export interface RatingSummary {
  /** Mean rating, rounded to one decimal. 0 when there are no reviews. */
  average: number;
  count: number;
  /** How many reviews gave each star rating, indexed 1-5. */
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export const REVIEW_LIMITS = {
  authorMax: 40,
  titleMax: 80,
  bodyMin: 10,
  bodyMax: 2000,
  /** Reviews accepted from one IP per hour, before we start rejecting. */
  perHour: 3,
} as const;

const EMPTY_SUMMARY: RatingSummary = {
  average: 0,
  count: 0,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
};

/** The bound D1 database, or null when reviews aren't configured. */
function db(): D1Database | null {
  try {
    const env = getCloudflareContext().env as unknown as { DB?: D1Database };
    return env.DB ?? null;
  } catch {
    // No Cloudflare context at all (plain `next build` prerender, tests).
    return null;
  }
}

/** Whether reviews are available. Used to hide the UI entirely when they're not. */
export function reviewsEnabled(): boolean {
  return db() !== null;
}

interface ReviewRow {
  id: number;
  package_id: number;
  author: string;
  rating: number;
  title: string | null;
  body: string;
  created_at: string;
}

function toReview(row: ReviewRow): Review {
  return {
    id: row.id,
    packageId: row.package_id,
    author: row.author,
    rating: row.rating,
    title: row.title,
    body: row.body,
    createdAt: row.created_at,
  };
}

export async function listReviews(packageId: number, limit = 20): Promise<Review[]> {
  const database = db();
  if (!database) return [];

  try {
    const { results } = await database
      .prepare(
        `SELECT id, package_id, author, rating, title, body, created_at
         FROM reviews
         WHERE package_id = ?1 AND status = 'published'
         ORDER BY created_at DESC
         LIMIT ?2`
      )
      .bind(packageId, limit)
      .all<ReviewRow>();
    return (results ?? []).map(toReview);
  } catch (err) {
    // A missing table shouldn't take the product page down with it.
    console.error("listReviews failed", err);
    return [];
  }
}

export async function getRatingSummary(packageId: number): Promise<RatingSummary> {
  const database = db();
  if (!database) return EMPTY_SUMMARY;

  try {
    const { results } = await database
      .prepare(
        `SELECT rating, COUNT(*) AS n
         FROM reviews
         WHERE package_id = ?1 AND status = 'published'
         GROUP BY rating`
      )
      .bind(packageId)
      .all<{ rating: number; n: number }>();

    const distribution = { ...EMPTY_SUMMARY.distribution };
    let total = 0;
    let count = 0;

    for (const row of results ?? []) {
      const star = Math.min(5, Math.max(1, Math.round(row.rating))) as 1 | 2 | 3 | 4 | 5;
      distribution[star] += row.n;
      total += star * row.n;
      count += row.n;
    }

    return {
      average: count === 0 ? 0 : Math.round((total / count) * 10) / 10,
      count,
      distribution,
    };
  } catch (err) {
    console.error("getRatingSummary failed", err);
    return EMPTY_SUMMARY;
  }
}

export type SubmitResult =
  | { ok: true; review: Review }
  | { ok: false; reason: "disabled" | "invalid" | "rate-limited"; message: string };

export interface SubmitInput {
  packageId: number;
  author: string;
  rating: number;
  title?: string;
  body: string;
  /** Hashed before storage — only ever used for rate limiting. */
  clientKey: string;
}

/** One-way hash so raw IPs are never written to the database. */
async function hashKey(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function submitReview(input: SubmitInput): Promise<SubmitResult> {
  const database = db();
  if (!database) {
    return { ok: false, reason: "disabled", message: "Reviews aren't enabled on this store." };
  }

  const author = input.author.trim().slice(0, REVIEW_LIMITS.authorMax);
  const title = input.title?.trim().slice(0, REVIEW_LIMITS.titleMax) || null;
  const body = input.body.trim();
  const rating = Math.round(input.rating);

  if (!author) {
    return { ok: false, reason: "invalid", message: "Please add a name." };
  }
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return { ok: false, reason: "invalid", message: "Pick a rating between 1 and 5 stars." };
  }
  if (body.length < REVIEW_LIMITS.bodyMin) {
    return { ok: false, reason: "invalid", message: `Please write at least ${REVIEW_LIMITS.bodyMin} characters.` };
  }
  if (body.length > REVIEW_LIMITS.bodyMax) {
    return { ok: false, reason: "invalid", message: "That review is too long." };
  }

  const clientHash = await hashKey(input.clientKey);

  try {
    const recent = await database
      .prepare(
        `SELECT COUNT(*) AS n FROM reviews
         WHERE client_hash = ?1 AND created_at > datetime('now', '-1 hour')`
      )
      .bind(clientHash)
      .first<{ n: number }>();

    if ((recent?.n ?? 0) >= REVIEW_LIMITS.perHour) {
      return {
        ok: false,
        reason: "rate-limited",
        message: "You've posted a few reviews already. Try again later.",
      };
    }

    const row = await database
      .prepare(
        `INSERT INTO reviews (package_id, author, rating, title, body, client_hash, status)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'published')
         RETURNING id, package_id, author, rating, title, body, created_at`
      )
      .bind(input.packageId, author, rating, title, body, clientHash)
      .first<ReviewRow>();

    if (!row) {
      return { ok: false, reason: "invalid", message: "Couldn't save that review." };
    }
    return { ok: true, review: toReview(row) };
  } catch (err) {
    console.error("submitReview failed", err);
    return { ok: false, reason: "invalid", message: "Couldn't save that review. Please try again." };
  }
}
