"use client";

/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */
import { useState } from "react";
import { useCart } from "@/context/cart";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Discount01Icon,
  GiftIcon,
  UserCircleIcon,
  Cancel01Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";
import type { BasketCodeType } from "@/lib/tebex";

const TYPES: { value: BasketCodeType; label: string; placeholder: string; icon: typeof Discount01Icon }[] = [
  { value: "coupon", label: "Coupon", placeholder: "Discount code", icon: Discount01Icon },
  { value: "giftcard", label: "Gift card", placeholder: "Card number", icon: GiftIcon },
  { value: "creator-code", label: "Creator", placeholder: "Creator code", icon: UserCircleIcon },
];

function iconFor(type: BasketCodeType) {
  return TYPES.find((t) => t.value === type)?.icon ?? Discount01Icon;
}

/**
 * Coupon / gift card / creator code entry for the cart drawer.
 *
 * Creator codes matter as much as discounts here — they are how a community
 * store attributes a sale back to the creator who drove it.
 */
export function BasketCodes() {
  const { appliedCodes, applyCode, removeCode, isLoading } = useCart();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<BasketCodeType>("coupon");
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const active = TYPES.find((t) => t.value === type)!;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const code = value.trim();
    if (!code || busy) return;

    setBusy(true);
    setError(null);
    const result = await applyCode(type, code);
    setBusy(false);

    if (result.ok) {
      setValue("");
      setOpen(false);
    } else {
      setError(result.message);
    }
  }

  async function drop(codeType: BasketCodeType, code: string) {
    setError(null);
    const result = await removeCode(codeType, code);
    if (!result.ok) setError(result.message);
  }

  return (
    <div className="space-y-2">
      {/* Applied codes */}
      {appliedCodes.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {appliedCodes.map(({ type: t, code }) => (
            <span
              key={`${t}:${code}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-info/25 bg-info/10 py-1 pl-2.5 pr-1 text-[11px] font-semibold text-info"
            >
              <HugeiconsIcon icon={iconFor(t)} className="h-3 w-3" />
              {code}
              <button
                type="button"
                onClick={() => drop(t, code)}
                disabled={isLoading}
                aria-label={`Remove ${code}`}
                className="flex h-4 w-4 items-center justify-center rounded-full text-info/60 transition-colors hover:bg-info/20 hover:text-fg disabled:opacity-40"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-[11px] font-semibold text-fg/35 transition-colors hover:text-brand"
        >
          Have a code?
        </button>
      ) : (
        <form onSubmit={submit} className="space-y-2">
          {/* Type selector */}
          <div className="flex gap-1 rounded-lg border border-fg/8 bg-surface p-0.5">
            {TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => { setType(t.value); setError(null); }}
                className={`flex-1 rounded-md px-2 py-1 text-[10px] font-bold transition-colors ${
                  type === t.value ? "bg-brand/20 text-fg" : "text-fg/35 hover:text-fg/70"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex gap-1.5">
            <input
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(null); }}
              placeholder={active.placeholder}
              aria-label={active.placeholder}
              autoFocus
              className="min-w-0 flex-1 rounded-lg border border-fg/8 bg-surface px-3 py-2 text-xs text-fg placeholder:text-fg/25 focus:border-brand/40 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!value.trim() || busy}
              className="shrink-0 rounded-lg bg-brand px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-hover disabled:opacity-40"
            >
              {busy ? "…" : "Apply"}
            </button>
            <button
              type="button"
              onClick={() => { setOpen(false); setValue(""); setError(null); }}
              aria-label="Cancel"
              className="shrink-0 rounded-lg border border-fg/8 px-2 text-fg/30 transition-colors hover:text-fg"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="h-3.5 w-3.5" />
            </button>
          </div>

          {error && (
            <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-red-400">
              <HugeiconsIcon icon={AlertCircleIcon} className="mt-px h-3 w-3 shrink-0" />
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
