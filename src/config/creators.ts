/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

/**
 * Creator roster shown on /creators.
 *
 * Ships empty — the page renders a "no creators yet" state until you add
 * entries. Fill this in with the people making things for your store.
 *
 * Example:
 *
 *   export const creators: Creator[] = [
 *     {
 *       handle: "ada",
 *       name: "Ada",
 *       role: "Script Developer",
 *       bio: "Builds tooling and automation for the community.",
 *       tags: ["Scripts", "Tools"],
 *       accent: "var(--color-brand)",
 *       initials: "AD",
 *       socials: [
 *         { platform: "GitHub", url: "https://github.com/example" },
 *       ],
 *     },
 *   ];
 */

export type CreatorPlatform = "Discord" | "X" | "GitHub";

export interface CreatorSocial {
  platform: CreatorPlatform;
  url: string;
}

export interface Creator {
  /** Unique key — also used for the React list key. */
  handle: string;
  name: string;
  /** Shown under the name, e.g. "Script Developer". */
  role: string;
  bio: string;
  tags: string[];
  /** Any CSS colour. Use a theme token so it re-themes with the store. */
  accent: string;
  /** Two letters shown in the avatar tile. */
  initials: string;
  socials: CreatorSocial[];
}

export const creators: Creator[] = [];
