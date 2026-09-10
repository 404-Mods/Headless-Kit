/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import { NextResponse } from "next/server";
import {
  applyBasketCode,
  removeBasketCode,
  getBasket,
  BasketCodeError,
  type BasketCodeType,
} from "@/lib/tebex";

const VALID_TYPES: BasketCodeType[] = ["coupon", "giftcard", "creator-code"];

interface CodeBody {
  type: BasketCodeType;
  code: string;
}

function parseBody(body: unknown): CodeBody | null {
  if (typeof body !== "object" || body === null) return null;
  const { type, code } = body as Partial<CodeBody>;
  if (typeof code !== "string" || !code.trim()) return null;
  if (typeof type !== "string" || !VALID_TYPES.includes(type as BasketCodeType)) return null;
  return { type: type as BasketCodeType, code: code.trim() };
}

/**
 * Apply or remove a coupon / gift card / creator code.
 *
 * Tebex does not reliably return the updated basket from these endpoints, so
 * both handlers re-read it and return that — the client always gets accurate
 * totals without a second round trip.
 */
async function handle(
  req: Request,
  params: Promise<{ ident: string }>,
  action: "apply" | "remove"
) {
  const { ident } = await params;

  let parsed: CodeBody | null;
  try {
    parsed = parseBody(await req.json());
  } catch {
    parsed = null;
  }
  if (!parsed) {
    return NextResponse.json({ error: "Expected a code and a valid type." }, { status: 400 });
  }

  try {
    if (action === "apply") {
      await applyBasketCode(ident, parsed.type, parsed.code);
    } else {
      await removeBasketCode(ident, parsed.type, parsed.code);
    }
    const basket = await getBasket(ident);
    return NextResponse.json({ data: basket });
  } catch (err) {
    if (err instanceof BasketCodeError) {
      // A rejected code is expected input, not a server fault — pass the reason through.
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Couldn't update that code. Please try again." }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ ident: string }> }) {
  return handle(req, params, "apply");
}

export async function DELETE(req: Request, { params }: { params: Promise<{ ident: string }> }) {
  return handle(req, params, "remove");
}
