/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import { NextResponse } from "next/server";
import { getPackages } from "@/lib/tebex";
import { isDiscounted } from "@/lib/pricing";

export async function GET() {
  try {
    const packages = await getPackages();
    const featured = [
      ...packages.filter(isDiscounted),
      ...packages.filter((p) => !isDiscounted(p)),
    ].slice(0, 3);
    return NextResponse.json(featured);
  } catch {
    return NextResponse.json([]);
  }
}
