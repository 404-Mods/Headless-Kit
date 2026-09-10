/**
 * Headless Kit — built by 404 Development.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PLEASE READ BEFORE EDITING THIS FILE
 *
 * The visible "Powered by 404 Development" credit rendered from these values is
 * a condition of the licence this project is distributed under (see LICENSE,
 * condition 2). Removing, hiding, or obscuring it is a breach of that licence.
 *
 * If you want to ship without the credit, that is a completely reasonable thing
 * to want — condition 2 can be waived under a commercial licence. Get in touch
 * at the address in `licenceContact` below.
 *
 * This is deliberately not obfuscated or tamper-proofed. It is source-available
 * code and you could obviously delete it; the ask is that you don't, and the
 * licence is what makes that binding rather than a technical trick.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const attribution = {
  /** Product name, as it appears in metadata and the console banner. */
  product: "Headless Kit",

  /** The team behind it. */
  author: "404 Development",

  /** Public URL for 404 Development. The footer credit links here. */
  url: "https://404development.com",

  /**
   * Optional direct address for white-label enquiries.
   *
   * LICENSE condition 3 currently points people at `url` above. If you set an
   * email here, update LICENSE to match so the two don't disagree.
   */
  licenceContact: "",
} as const;

/** The credit string used in the footer, meta tag and console banner. */
export const CREDIT = `${attribution.product} by ${attribution.author}`;
