"use client";

/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */
import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Message01Icon, AlertCircleIcon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";
import { StarRating, StarInput } from "@/components/star-rating";
import type { Review, RatingSummary } from "@/lib/reviews";

interface Payload {
  enabled: boolean;
  reviews: Review[];
  summary: RatingSummary;
}

const EMPTY: Payload = {
  enabled: false,
  reviews: [],
  summary: { average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
};

function formatDate(iso: string): string {
  const d = new Date(iso.includes("T") ? iso : iso.replace(" ", "T") + "Z");
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function ProductReviews({ packageId, packageName }: { packageId: number; packageName: string }) {
  const [data, setData] = useState<Payload | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  // Bumped after a successful submission to re-run the fetch below.
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      let next: Payload;
      try {
        const res = await fetch(`/api/reviews?packageId=${packageId}`);
        next = res.ok ? await res.json() : EMPTY;
      } catch {
        next = EMPTY;
      }
      if (!cancelled) setData(next);
    })();

    return () => { cancelled = true; };
  }, [packageId, reloadToken]);

  // Still loading, or reviews aren't configured on this store — render nothing.
  if (!data || !data.enabled) return null;

  const { summary, reviews } = data;

  return (
    <section className="border-t border-fg/5 pt-10">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-fg">Reviews</h2>
          {summary.count > 0 ? (
            <div className="mt-1.5 flex items-center gap-2">
              <StarRating value={summary.average} />
              <span className="text-sm font-bold text-fg">{summary.average.toFixed(1)}</span>
              <span className="text-xs text-fg/35">
                {summary.count} review{summary.count === 1 ? "" : "s"}
              </span>
            </div>
          ) : (
            <p className="mt-1 text-sm text-fg/35">No reviews yet — be the first.</p>
          )}
        </div>

        {!formOpen && (
          <button
            onClick={() => setFormOpen(true)}
            className="rounded-xl border border-fg/10 bg-fg/5 px-4 py-2 text-xs font-bold text-fg/70 transition-colors hover:border-brand/40 hover:text-fg"
          >
            Write a review
          </button>
        )}
      </div>

      {/* Rating breakdown */}
      {summary.count > 0 && (
        <div className="mb-8 space-y-1.5">
          {([5, 4, 3, 2, 1] as const).map((star) => {
            const n = summary.distribution[star];
            const pct = summary.count === 0 ? 0 : (n / summary.count) * 100;
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="w-8 shrink-0 text-[11px] font-semibold text-fg/40">{star}★</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-fg/8">
                  <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-6 shrink-0 text-right text-[11px] tabular-nums text-fg/30">{n}</span>
              </div>
            );
          })}
        </div>
      )}

      {formOpen && (
        <ReviewForm
          packageId={packageId}
          packageName={packageName}
          onDone={() => { setFormOpen(false); setReloadToken((t) => t + 1); }}
          onCancel={() => setFormOpen(false)}
        />
      )}

      {reviews.length > 0 && (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-2xl border border-fg/5 bg-fg/2 p-5">
              <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <StarRating value={r.rating} size="sm" />
                <span className="text-sm font-bold text-fg">{r.author}</span>
                <span className="text-[11px] text-fg/25">{formatDate(r.createdAt)}</span>
              </div>
              {r.title && <p className="mb-1 text-sm font-bold text-fg/80">{r.title}</p>}
              <p className="whitespace-pre-line text-sm leading-relaxed text-fg/55">{r.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ReviewForm({
  packageId,
  packageName,
  onDone,
  onCancel,
}: {
  packageId: number;
  packageName: string;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId, author, rating, title, body, website }),
      });
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        setError(json?.error ?? "Couldn't post that review.");
        return;
      }
      setDone(true);
      // Let the confirmation land before the list refreshes underneath.
      setTimeout(onDone, 900);
    } catch {
      setError("Couldn't reach the store. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="mb-8 flex items-center gap-3 rounded-2xl border border-info/25 bg-info/8 p-5">
        <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-5 w-5 shrink-0 text-info" />
        <p className="text-sm font-semibold text-fg">Thanks — your review is live.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mb-8 space-y-4 rounded-2xl border border-fg/8 bg-fg/2 p-5">
      <div className="flex items-center gap-3">
        <HugeiconsIcon icon={Message01Icon} className="h-4 w-4 text-brand" />
        <p className="text-sm font-bold text-fg">Review {packageName}</p>
      </div>

      <div>
        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-fg/40">Rating</label>
        <StarInput value={rating} onChange={setRating} disabled={busy} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="review-author" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-fg/40">
            Name
          </label>
          <input
            id="review-author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            maxLength={40}
            required
            className="w-full rounded-lg border border-fg/8 bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg/25 outline-none focus:border-brand/50"
          />
        </div>
        <div>
          <label htmlFor="review-title" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-fg/40">
            Title <span className="font-normal normal-case text-fg/25">(optional)</span>
          </label>
          <input
            id="review-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
            className="w-full rounded-lg border border-fg/8 bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg/25 outline-none focus:border-brand/50"
          />
        </div>
      </div>

      <div>
        <label htmlFor="review-body" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-fg/40">
          Review
        </label>
        <textarea
          id="review-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          minLength={10}
          maxLength={2000}
          required
          className="w-full resize-y rounded-lg border border-fg/8 bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg/25 outline-none focus:border-brand/50"
        />
        <p className="mt-1 text-right text-[10px] text-fg/25">{body.length}/2000</p>
      </div>

      {/* Honeypot — hidden from people, irresistible to bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      {error && (
        <p className="flex items-start gap-1.5 text-xs text-red-400">
          <HugeiconsIcon icon={AlertCircleIcon} className="mt-px h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={busy || rating === 0}
          className="rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-hover disabled:opacity-40"
        >
          {busy ? "Posting…" : "Post review"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-fg/10 px-5 py-2.5 text-sm font-semibold text-fg/50 transition-colors hover:text-fg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
