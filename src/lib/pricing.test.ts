/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import { describe, it, expect } from "vitest";
import { isDiscounted, discountPercent, savedAmount } from "./pricing";

const p = (base_price: number, total_price: number) => ({ base_price, total_price });

describe("isDiscounted", () => {
  it("is true only when the total is genuinely lower", () => {
    expect(isDiscounted(p(35, 29.75))).toBe(true);
    expect(isDiscounted(p(35, 35))).toBe(false);
  });

  // Regression: fixtures claimed a discount while both prices matched, so the
  // page rendered "15% OFF", the same price twice, and "You save USD 0.00".
  it("is false when the prices are equal, whatever the discount field says", () => {
    expect(isDiscounted(p(35, 35))).toBe(false);
  });

  it("is false for free items rather than dividing by zero", () => {
    expect(isDiscounted(p(0, 0))).toBe(false);
    expect(discountPercent(p(0, 0))).toBe(0);
  });

  it("is false if the total somehow exceeds the base", () => {
    expect(isDiscounted(p(10, 12))).toBe(false);
  });
});

describe("discountPercent", () => {
  it("derives the percentage from the prices", () => {
    expect(discountPercent(p(35, 29.75))).toBe(15);
    expect(discountPercent(p(40, 20))).toBe(50);
    expect(discountPercent(p(29, 21.75))).toBe(25);
  });

  it("rounds to a whole number", () => {
    expect(discountPercent(p(9.99, 6.66))).toBe(33);
  });

  it("is zero when there is no discount", () => {
    expect(discountPercent(p(19, 19))).toBe(0);
  });

  // The old UI rendered Tebex's `discount` field directly as a percentage, so a
  // $5.25 discount displayed as "5.25% OFF". Deriving from prices can't do that.
  it("ignores the amount-vs-percentage ambiguity entirely", () => {
    expect(discountPercent(p(35, 29.75))).toBe(15);
  });
});

describe("savedAmount", () => {
  it("returns the money saved", () => {
    expect(savedAmount(p(35, 29.75))).toBe(5.25);
  });

  it("avoids floating-point dust", () => {
    expect(savedAmount(p(29, 21.75))).toBe(7.25);
    expect(savedAmount(p(0.3, 0.1))).toBe(0.2);
  });

  it("is zero when nothing is discounted", () => {
    expect(savedAmount(p(12, 12))).toBe(0);
  });
});
