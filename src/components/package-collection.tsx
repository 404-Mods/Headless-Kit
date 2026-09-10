"use client";

/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */
import { useEffect, useState } from "react";
import type { TebexPackage } from "@/lib/types";

interface State {
  packages: TebexPackage[] | null;
  failed: boolean;
}

/**
 * Resolves stored package IDs into live packages.
 *
 * The wishlist and recently-viewed list persist IDs only, so prices and names
 * are always current rather than frozen at the moment they were saved. The
 * catalogue request rides the shared 5-minute cache.
 */
export function usePackagesByIds(ids: number[]): {
  packages: TebexPackage[];
  isLoading: boolean;
  failed: boolean;
} {
  const [state, setState] = useState<State>({ packages: null, failed: false });

  // The catalogue is fetched whole and filtered below, so only the transition
  // between "no IDs" and "some IDs" should trigger a request — not every add.
  const hasIds = ids.length > 0;

  useEffect(() => {
    if (!hasIds) return;
    let cancelled = false;

    fetch("/api/packages")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("request failed"))))
      .then((json) => {
        if (cancelled) return;
        const all: TebexPackage[] = Array.isArray(json?.data) ? json.data : [];
        setState({ packages: all, failed: false });
      })
      .catch(() => {
        if (!cancelled) setState({ packages: [], failed: true });
      });

    return () => { cancelled = true; };
  }, [hasIds]);

  if (!hasIds) {
    return { packages: [], isLoading: false, failed: false };
  }
  if (state.packages === null) {
    return { packages: [], isLoading: true, failed: false };
  }

  // Preserve the stored order (most recently added first).
  const byId = new Map(state.packages.map((p) => [p.id, p]));
  const packages = ids
    .map((id) => byId.get(id))
    .filter((p): p is TebexPackage => Boolean(p));

  return { packages, isLoading: false, failed: state.failed };
}
