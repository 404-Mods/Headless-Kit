/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import { describe, it, expect } from "vitest";
import { slugify, decodeHtmlEntities, stripHtmlAndMarkdown, processDescription } from "./utils";
import { tint } from "./color";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Alpha Toolkit")).toBe("alpha-toolkit");
  });

  it("collapses runs of punctuation into a single hyphen", () => {
    expect(slugify("Pro   Pack --- v2")).toBe("pro-pack-v2");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("!!! Bundle !!!")).toBe("bundle");
  });

  it("keeps digits", () => {
    expect(slugify("Next.js 16 Starter")).toBe("next-js-16-starter");
  });

  // Product URLs are built by slugifying names, so two packages whose names
  // differ only by punctuation collide. Worth knowing about.
  it("collides for names differing only in punctuation", () => {
    expect(slugify("Pro Pack")).toBe(slugify("Pro-Pack"));
  });
});

describe("decodeHtmlEntities", () => {
  it("decodes the entities Tebex returns", () => {
    expect(decodeHtmlEntities("&lt;p&gt;Hi &amp; bye&lt;/p&gt;")).toBe("<p>Hi & bye</p>");
  });

  it("handles both apostrophe entities", () => {
    expect(decodeHtmlEntities("it&#039;s &apos;quoted&apos;")).toBe("it's 'quoted'");
  });

  it("returns an empty string for null or undefined", () => {
    expect(decodeHtmlEntities(null)).toBe("");
    expect(decodeHtmlEntities(undefined)).toBe("");
  });
});

describe("stripHtmlAndMarkdown", () => {
  it("removes tags and markdown emphasis", () => {
    expect(stripHtmlAndMarkdown("<p>A **bold** and *italic* line</p>")).toBe("A bold and italic line");
  });

  it("reduces links to their label and images to alt text", () => {
    expect(stripHtmlAndMarkdown("See [the docs](https://example.com)")).toBe("See the docs");
    expect(stripHtmlAndMarkdown("![a diagram](/x.png)")).toBe("a diagram");
  });

  it("strips heading markers", () => {
    expect(stripHtmlAndMarkdown("### Features")).toBe("Features");
  });
});

describe("processDescription", () => {
  it("renders markdown that is not wrapped in raw HTML", async () => {
    const html = await processDescription("**bold** and *italic*");
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toContain("<em>italic</em>");
  });

  it("decodes escaped HTML from Tebex into real tags", async () => {
    const html = await processDescription("&lt;p&gt;Plain&lt;/p&gt;");
    expect(html).toContain("<p>Plain</p>");
  });

  // Per CommonMark, markdown inside a raw HTML block is left alone. Tebex's
  // editor can emit exactly that shape, so `**bold**` wrapped in <p> tags
  // renders literally rather than as bold. Pinned here so the behaviour is a
  // known quantity rather than a surprise in a product description.
  it("leaves markdown inside a raw HTML block unprocessed", async () => {
    const html = await processDescription("&lt;p&gt;**bold**&lt;/p&gt;");
    expect(html).toContain("**bold**");
    expect(html).not.toContain("<strong>");
  });

  it("converts single newlines to breaks", async () => {
    const html = await processDescription("line one\nline two");
    expect(html).toContain("<br>");
  });

  it("supports GFM tables", async () => {
    const html = await processDescription("| a | b |\n| --- | --- |\n| 1 | 2 |");
    expect(html).toContain("<table>");
  });

  it("returns an empty string for missing input", async () => {
    expect(await processDescription(null)).toBe("");
  });
});

describe("tint", () => {
  it("builds a color-mix that works with CSS custom properties", () => {
    expect(tint("var(--color-brand)", 8)).toBe(
      "color-mix(in srgb, var(--color-brand) 8%, transparent)"
    );
  });

  it("works with plain hex too", () => {
    expect(tint("#7172b2", 25)).toBe("color-mix(in srgb, #7172b2 25%, transparent)");
  });
});
