"use client";

/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */
import { HugeiconsIcon } from "@hugeicons/react";
import { FavouriteIcon } from "@hugeicons/core-free-icons";
import { useWishlist, wishlistStore } from "@/lib/collections";
import { useToast } from "@/context/toast";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  packageId: number;
  packageName: string;
  /** `card` sits on a product tile; `detail` is the larger product-page control. */
  variant?: "card" | "detail";
  className?: string;
}

export function WishlistButton({
  packageId,
  packageName,
  variant = "card",
  className,
}: WishlistButtonProps) {
  const wishlist = useWishlist();
  const { toast } = useToast();
  const saved = wishlist.includes(packageId);

  function onClick(e: React.MouseEvent) {
    // Cards wrap the whole tile in a link — don't navigate when saving.
    e.preventDefault();
    e.stopPropagation();
    wishlistStore.toggle(packageId);
    toast(saved ? "Removed from saved" : "Saved for later", { subtitle: packageName, type: saved ? "info" : "success" });
  }

  if (variant === "detail") {
    return (
      <button
        onClick={onClick}
        aria-pressed={saved}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
          saved
            ? "border-accent/50 bg-accent/15 text-fg"
            : "border-fg/10 bg-fg/5 text-fg/60 hover:border-fg/20 hover:text-fg",
          className
        )}
      >
        <HugeiconsIcon
          icon={FavouriteIcon}
          className={cn("h-4 w-4", saved && "text-accent")}
        />
        {saved ? "Saved" : "Save for later"}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${packageName} from saved` : `Save ${packageName} for later`}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-lg border backdrop-blur-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
        saved
          ? "border-accent/50 bg-accent/20 text-accent"
          : "border-fg/10 bg-black/40 text-fg/50 hover:border-fg/25 hover:text-fg",
        className
      )}
    >
      <HugeiconsIcon icon={FavouriteIcon} className="h-3.5 w-3.5" />
    </button>
  );
}
