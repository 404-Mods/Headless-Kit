import { attribution } from "@/config/attribution";

/**
 * The "Powered by 404 Development" credit.
 *
 * Rendering this is a condition of the licence (see LICENSE, condition 2). It
 * is styled to sit alongside the rest of the footer at the same legibility —
 * deliberately not hidden, and deliberately not shouting.
 *
 * To ship without it, see condition 3 of the licence.
 */
export function PoweredBy({ className }: { className?: string }) {
  const label = (
    <>
      Powered by <span className="font-bold text-fg/45">{attribution.author}</span>
    </>
  );

  // Falls back to plain text until a URL is configured, so the credit is never
  // rendered as a dead link.
  if (!attribution.url) {
    return <p className={`text-xs text-fg/30 ${className ?? ""}`}>{label}</p>;
  }

  return (
    <a
      href={attribution.url}
      target="_blank"
      rel="noopener"
      className={`text-xs text-fg/30 transition-colors hover:text-fg/60 ${className ?? ""}`}
    >
      {label}
    </a>
  );
}
