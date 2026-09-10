/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

/**
 * A list of package IDs persisted in localStorage and shared across every
 * component that reads it.
 *
 * Built as an external store rather than React state so `useSyncExternalStore`
 * can subscribe to it: hearts scattered across product cards stay in sync with
 * each other and across browser tabs, with no provider and no setState-in-effect.
 */

export interface IdStore {
  subscribe: (onChange: () => void) => () => void;
  /** Stable reference between changes — required by useSyncExternalStore. */
  getSnapshot: () => number[];
  getServerSnapshot: () => number[];
  has: (id: number) => boolean;
  add: (id: number) => void;
  remove: (id: number) => void;
  toggle: (id: number) => void;
  clear: () => void;
}

const EMPTY: number[] = [];

export function createIdStore(key: string, limit?: number): IdStore {
  const listeners = new Set<() => void>();

  // Snapshot caching: getSnapshot must return the same reference until the data
  // actually changes, or React re-renders forever.
  let cachedRaw: string | null = null;
  let cached: number[] = EMPTY;

  function read(): number[] {
    try {
      const raw = localStorage.getItem(key);
      if (raw === cachedRaw) return cached;
      cachedRaw = raw;
      if (!raw) {
        cached = EMPTY;
      } else {
        const parsed: unknown = JSON.parse(raw);
        cached = Array.isArray(parsed)
          ? parsed.filter((n): n is number => typeof n === "number")
          : EMPTY;
      }
      return cached;
    } catch {
      // Storage blocked (private mode) or corrupt JSON — behave as if empty.
      return EMPTY;
    }
  }

  function write(next: number[]) {
    const capped = limit ? next.slice(0, limit) : next;
    try {
      localStorage.setItem(key, JSON.stringify(capped));
    } catch {
      // Nothing to do; keep the in-memory value so the UI still responds.
    }
    cachedRaw = JSON.stringify(capped);
    cached = capped;
    listeners.forEach((fn) => fn());
  }

  return {
    subscribe(onChange) {
      listeners.add(onChange);
      // Another tab changing the same key fires `storage` here.
      const onStorage = (e: StorageEvent) => {
        if (e.key === key) {
          cachedRaw = null; // force a re-read
          onChange();
        }
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(onChange);
        window.removeEventListener("storage", onStorage);
      };
    },
    getSnapshot: read,
    getServerSnapshot: () => EMPTY,
    has: (id) => read().includes(id),
    add(id) {
      const current = read();
      // Re-adding moves an entry to the front, which is what "recently viewed" wants.
      write([id, ...current.filter((x) => x !== id)]);
    },
    remove(id) {
      write(read().filter((x) => x !== id));
    },
    toggle(id) {
      const current = read();
      if (current.includes(id)) write(current.filter((x) => x !== id));
      else write([id, ...current]);
    },
    clear() {
      write([]);
    },
  };
}
