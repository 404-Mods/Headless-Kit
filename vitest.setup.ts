import { afterEach, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";

// jsdom keeps storage between tests; a leaked wishlist or basket ident would
// make later tests pass or fail depending on order.
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

afterEach(() => {
  cleanup();
});
