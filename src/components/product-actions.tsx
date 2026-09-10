"use client";

/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */
import { useState } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Link01Icon,
  CheckmarkCircle01Icon,
  ExpandIcon,
  ShoppingBag01Icon,
  Discount01Icon,
  PlayIcon,
} from "@hugeicons/core-free-icons";
import { ImageLightbox } from "@/components/image-lightbox";
import { useToast } from "@/context/toast";

// ── ProductImage (with gallery strip) ─────────────────────────

interface ProductImageProps {
  image: string | null;
  name: string;
  hasDiscount: boolean;
  discount: number;
  galleryImages?: string[];
}

export function ProductImage({
  image,
  name,
  hasDiscount,
  discount,
  galleryImages = [],
}: ProductImageProps) {
  const allImages = [
    ...(image ? [image] : []),
    ...galleryImages.filter((i) => i !== image),
  ];
  const [selected, setSelected] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const currentImage = allImages[selected] ?? null;

  return (
    <>
      <div className="space-y-2">
        {/* Main image */}
        <div
          className={`group relative aspect-video w-full overflow-hidden rounded-2xl border border-fg/8 bg-surface-raised shadow-2xl shadow-black/40 ${currentImage ? "cursor-zoom-in" : ""}`}
          onClick={() => currentImage && setLightboxOpen(true)}
        >
          {currentImage ? (
            <Image
              src={currentImage}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <HugeiconsIcon icon={ShoppingBag01Icon} className="h-16 w-16 text-fg/10" />
            </div>
          )}
          {hasDiscount && (
            <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-accent/90 px-3 py-1.5 text-xs font-black text-surface shadow-lg backdrop-blur-sm">
              <HugeiconsIcon icon={Discount01Icon} className="h-3 w-3" />
              {discount}% OFF
            </div>
          )}
          {currentImage && (
            <div className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg border border-fg/10 bg-black/50 text-fg/50 opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-sm">
              <HugeiconsIcon icon={ExpandIcon} className="h-4 w-4" />
            </div>
          )}
          {allImages.length > 1 && (
            <div className="absolute bottom-3 left-3 rounded-full bg-black/50 px-2 py-1 text-[10px] font-bold text-fg/60 backdrop-blur-sm">
              {selected + 1} / {allImages.length}
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border transition-all duration-200 ${
                  i === selected
                    ? "border-brand/80 ring-1 ring-brand/40"
                    : "border-fg/8 opacity-50 hover:opacity-80"
                }`}
              >
                <Image
                  src={img}
                  alt={`${name} screenshot ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && currentImage && (
        <ImageLightbox src={currentImage} alt={name} onClose={() => setLightboxOpen(false)} />
      )}
    </>
  );
}

// ── ProductVideo (YouTube embed extracted from description) ────

interface ProductVideoProps {
  description: string;
  name: string;
}

export function ProductVideo({ description, name }: ProductVideoProps) {
  const match = description.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  const videoId = match?.[1];
  if (!videoId) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-fg/5 bg-fg/2">
      <div className="flex items-center gap-2 px-6 pt-5 pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-fg/35">
        <span className="h-px flex-1 bg-fg/8" />
        <HugeiconsIcon icon={PlayIcon} className="h-3 w-3" />
        Preview
        <span className="h-px flex-1 bg-fg/8" />
      </div>
      <div className="relative aspect-video w-full">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
          title={`${name} preview`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}

// ── CopyLinkButton ─────────────────────────────────────────────

export function CopyLinkButton({ name }: { name: string }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast("Link copied!", { subtitle: "Share it with your friends" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — silently ignore
    }
  }

  return (
    <button
      onClick={handleCopy}
      title={`Copy link for ${name}`}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-fg/8 bg-fg/3 px-4 py-2.5 text-xs font-bold text-fg/50 transition-all hover:bg-fg/6 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <HugeiconsIcon icon={copied ? CheckmarkCircle01Icon : Link01Icon} className="h-3.5 w-3.5" />
      {copied ? "Copied!" : "Copy Link"}
    </button>
  );
}

// Keep ShareButton as a re-export alias for backwards compatibility
export { CopyLinkButton as ShareButton };
