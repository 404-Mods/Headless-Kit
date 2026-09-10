/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import { describe, it, expect, vi } from "vitest";
import { createIdStore } from "./persistent-ids";

describe("createIdStore", () => {
  it("starts empty", () => {
    const store = createIdStore("test:empty");
    expect(store.getSnapshot()).toEqual([]);
  });

  it("adds newest first", () => {
    const store = createIdStore("test:order");
    store.add(1);
    store.add(2);
    store.add(3);
    expect(store.getSnapshot()).toEqual([3, 2, 1]);
  });

  it("moves a re-added id to the front rather than duplicating it", () => {
    const store = createIdStore("test:readd");
    store.add(1);
    store.add(2);
    store.add(1);
    expect(store.getSnapshot()).toEqual([1, 2]);
  });

  it("toggles on and off", () => {
    const store = createIdStore("test:toggle");
    store.toggle(7);
    expect(store.has(7)).toBe(true);
    store.toggle(7);
    expect(store.has(7)).toBe(false);
  });

  it("enforces the limit, dropping the oldest", () => {
    const store = createIdStore("test:limit", 3);
    [1, 2, 3, 4, 5].forEach((n) => store.add(n));
    expect(store.getSnapshot()).toEqual([5, 4, 3]);
  });

  it("persists across store instances sharing a key", () => {
    createIdStore("test:persist").add(42);
    expect(createIdStore("test:persist").getSnapshot()).toEqual([42]);
  });

  // useSyncExternalStore re-renders forever if getSnapshot returns a new array
  // each call, so the reference must be stable between writes.
  it("returns a stable reference until the data changes", () => {
    const store = createIdStore("test:stable");
    store.add(1);
    expect(store.getSnapshot()).toBe(store.getSnapshot());

    const before = store.getSnapshot();
    store.add(2);
    expect(store.getSnapshot()).not.toBe(before);
  });

  it("notifies subscribers on write and stops after unsubscribe", () => {
    const store = createIdStore("test:notify");
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    store.add(1);
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    store.add(2);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("treats corrupt stored JSON as empty rather than throwing", () => {
    localStorage.setItem("test:corrupt", "{not json");
    expect(createIdStore("test:corrupt").getSnapshot()).toEqual([]);
  });

  it("ignores non-numeric entries", () => {
    localStorage.setItem("test:mixed", JSON.stringify([1, "two", null, 3]));
    expect(createIdStore("test:mixed").getSnapshot()).toEqual([1, 3]);
  });

  it("returns an empty list when storage throws", () => {
    const spy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage disabled");
    });
    expect(createIdStore("test:blocked").getSnapshot()).toEqual([]);
    spy.mockRestore();
  });

  it("clears everything", () => {
    const store = createIdStore("test:clear");
    store.add(1);
    store.add(2);
    store.clear();
    expect(store.getSnapshot()).toEqual([]);
  });
});
