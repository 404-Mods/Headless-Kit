/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import { NextResponse } from "next/server";
import { createBasket } from "@/lib/tebex";
import { site } from "@/config/site";

const STORE_URL = site.url;

export async function POST() {
  try {
    const basket = await createBasket(
      `${STORE_URL}/checkout/success`,
      `${STORE_URL}/checkout/cancel`
    );
    return NextResponse.json({ data: basket });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create basket" }, { status: 500 });
  }
}
