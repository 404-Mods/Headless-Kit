/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import { NextResponse } from "next/server";
import { getBasket } from "@/lib/tebex";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ident: string }> }
) {
  const { ident } = await params;
  try {
    const basket = await getBasket(ident);
    return NextResponse.json({ data: basket });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Basket not found" }, { status: 404 });
  }
}
