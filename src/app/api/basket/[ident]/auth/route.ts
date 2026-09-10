/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import { NextResponse } from "next/server";
import { getBasketAuthLinks } from "@/lib/tebex";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ ident: string }> }
) {
  const { ident } = await params;
  const { searchParams } = new URL(req.url);
  const returnUrl = searchParams.get("returnUrl") ?? process.env.NEXT_PUBLIC_STORE_URL ?? "/";
  try {
    const links = await getBasketAuthLinks(ident, returnUrl);
    return NextResponse.json(links);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to get auth links" }, { status: 500 });
  }
}
