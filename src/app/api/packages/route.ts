/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import { NextResponse } from "next/server";
import { getPackages } from "@/lib/tebex";

/**
 * The full catalogue, for client-side views that hold package IDs rather than
 * package data — the wishlist and the recently-viewed rail.
 *
 * Storing only IDs in localStorage means prices and names are never stale; the
 * trade-off is this one request, which rides the same 5-minute catalogue cache
 * as the rest of the app.
 */
export async function GET() {
  try {
    const packages = await getPackages();
    return NextResponse.json({ data: packages });
  } catch {
    // A missing token or Tebex outage should leave these views empty, not broken.
    return NextResponse.json({ data: [] });
  }
}
