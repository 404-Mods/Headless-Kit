/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import { NextResponse } from "next/server";
import { listReviews, submitReview, getRatingSummary, reviewsEnabled } from "@/lib/reviews";

export const dynamic = "force-dynamic";

function packageIdFrom(url: string): number | null {
  const raw = new URL(url).searchParams.get("packageId");
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(req: Request) {
  const packageId = packageIdFrom(req.url);
  if (packageId === null) {
    return NextResponse.json({ error: "A numeric packageId is required." }, { status: 400 });
  }

  const [reviews, summary] = await Promise.all([
    listReviews(packageId),
    getRatingSummary(packageId),
  ]);

  return NextResponse.json({ enabled: reviewsEnabled(), reviews, summary });
}

interface Body {
  packageId?: unknown;
  author?: unknown;
  rating?: unknown;
  title?: unknown;
  body?: unknown;
  /** Hidden field — bots fill it in, humans never see it. */
  website?: unknown;
}

export async function POST(req: Request) {
  let payload: Body;
  try {
    payload = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  // Honeypot: silently accept and discard so the bot doesn't learn anything.
  if (typeof payload.website === "string" && payload.website.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  const packageId = Number(payload.packageId);
  if (!Number.isInteger(packageId) || packageId <= 0) {
    return NextResponse.json({ error: "A numeric packageId is required." }, { status: 400 });
  }
  if (typeof payload.author !== "string" || typeof payload.body !== "string") {
    return NextResponse.json({ error: "A name and review text are required." }, { status: 400 });
  }

  const result = await submitReview({
    packageId,
    author: payload.author,
    rating: Number(payload.rating),
    title: typeof payload.title === "string" ? payload.title : undefined,
    body: payload.body,
    // Cloudflare sets CF-Connecting-IP; the fallback keeps local dev working.
    clientKey:
      req.headers.get("cf-connecting-ip") ??
      req.headers.get("x-forwarded-for") ??
      "local-dev",
  });

  if (!result.ok) {
    const status = result.reason === "rate-limited" ? 429 : result.reason === "disabled" ? 503 : 400;
    return NextResponse.json({ error: result.message }, { status });
  }

  return NextResponse.json({ review: result.review }, { status: 201 });
}
