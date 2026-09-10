/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import { NextResponse } from "next/server";
import { removePackageFromBasket } from "@/lib/tebex";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ ident: string }> }
) {
  const { ident } = await params;
  try {
    const body = await req.json() as { package_id: number };
    const basket = await removePackageFromBasket(ident, body.package_id);
    return NextResponse.json(basket);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to remove package" }, { status: 500 });
  }
}
