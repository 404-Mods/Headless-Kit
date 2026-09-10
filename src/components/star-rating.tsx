"use client";

/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

const SIZES = { sm: "h-3 w-3", md: "h-4 w-4", lg: "h-5 w-5" } as const;

interface StarRatingProps {
  /** 0–5, fractional values are rendered as a partial star. */
  value: number;
  size?: keyof typeof SIZES;
  className?: string;
}

/** Read-only star display. */
export function StarRating({ value, size = "md", className }: StarRatingProps) {
  const clamped = Math.min(5, Math.max(0, value));

  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={`${clamped} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        // Portion of this particular star that should be filled.
        const fill = Math.min(1, Math.max(0, clamped - star + 1));
        return (
          <span key={star} className="relative inline-block">
            <HugeiconsIcon icon={StarIcon} className={cn(SIZES[size], "text-fg/15")} />
            {fill > 0 && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <HugeiconsIcon icon={StarIcon} className={cn(SIZES[size], "text-accent")} />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

interface StarInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

/** Interactive 1–5 picker. Radio semantics so it works from the keyboard. */
export function StarInput({ value, onChange, disabled }: StarInputProps) {
  return (
    <div role="radiogroup" aria-label="Rating" className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star === 1 ? "" : "s"}`}
          disabled={disabled}
          onClick={() => onChange(star)}
          className="rounded p-0.5 transition-transform hover:scale-110 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <HugeiconsIcon
            icon={StarIcon}
            className={cn("h-6 w-6 transition-colors", star <= value ? "text-accent" : "text-fg/20")}
          />
        </button>
      ))}
    </div>
  );
}
