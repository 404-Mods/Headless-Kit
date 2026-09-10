# Theme presets

The whole storefront is driven by nine colour tokens. To re-theme it, replace the `@theme` block **and** the light-theme block in [`src/app/globals.css`](./src/app/globals.css) with one of the presets below.

Nothing else needs to change — components reference the tokens through Tailwind utilities (`bg-brand`, `text-fg/45`, `border-info/30`) or `var(--color-*)`, and the logo is inline SVG that reads the same variables.

## How the three theme states work

| `data-theme` on `<html>` | Result |
| --- | --- |
| absent | Follows the operating system (`prefers-color-scheme`) |
| `"light"` | Forces light |
| `"dark"` | Forces dark |

The toggle in the navbar cycles System → Light → Dark and saves the choice. An inline script in the root layout applies it before first paint, so there's no flash.

To ship a single fixed appearance, delete `<ThemeToggle />` from the navbar and drop whichever block you don't want.

---

## Midnight (default)

Violet and blush on near-black.

```css
@theme {
  --color-brand: #7172b2;
  --color-brand-hover: #8384c8;
  --color-accent: #e5b5c1;
  --color-info: #83afc4;
  --color-surface: #0b0b16;
  --color-surface-raised: #0d0d1a;
  --color-surface-panel: #111125;
  --color-surface-elevated: #1a1a35;
  --color-fg: #ffffff;
}
```

```css
/* light */
--color-surface: #f5f5fa;
--color-surface-raised: #ffffff;
--color-surface-panel: #ffffff;
--color-surface-elevated: #ebebf5;
--color-fg: #14141f;
--color-brand: #55568f;
--color-brand-hover: #454673;
--color-accent: #a4566c;
--color-info: #3f7189;
```

## Ember

Warm amber and rust. Suits stores selling tooling and hardware-adjacent goods.

```css
@theme {
  --color-brand: #e0783f;
  --color-brand-hover: #f08d52;
  --color-accent: #d9534f;
  --color-info: #d4a843;
  --color-surface: #150f0b;
  --color-surface-raised: #1c1510;
  --color-surface-panel: #221a13;
  --color-surface-elevated: #2c2118;
  --color-fg: #ffffff;
}
```

```css
/* light */
--color-surface: #faf7f4;
--color-surface-raised: #ffffff;
--color-surface-panel: #ffffff;
--color-surface-elevated: #f0e8e0;
--color-fg: #1c150f;
--color-brand: #a2521f;
--color-brand-hover: #85431a;
--color-accent: #9c3b38;
--color-info: #7d6019;
```

## Forest

Deep green with a sand accent. Calmer, less "gaming".

```css
@theme {
  --color-brand: #4ea87a;
  --color-brand-hover: #62bd8e;
  --color-accent: #d9b169;
  --color-info: #4a9ba8;
  --color-surface: #0a1210;
  --color-surface-raised: #0e1815;
  --color-surface-panel: #121e1a;
  --color-surface-elevated: #172820;
  --color-fg: #ffffff;
}
```

```css
/* light */
--color-surface: #f4f8f5;
--color-surface-raised: #ffffff;
--color-surface-panel: #ffffff;
--color-surface-elevated: #e6efe9;
--color-fg: #0f1a16;
--color-brand: #2c6f4f;
--color-brand-hover: #225840;
--color-accent: #7a5c1e;
--color-info: #2d6b78;
```

## Mono

Near-neutral greys with a single blue. The safest choice if you plan to add your own brand colour later.

```css
@theme {
  --color-brand: #6b8afd;
  --color-brand-hover: #849dfe;
  --color-accent: #9aa4b8;
  --color-info: #7f8da3;
  --color-surface: #0d0f14;
  --color-surface-raised: #12151b;
  --color-surface-panel: #171b22;
  --color-surface-elevated: #1e232c;
  --color-fg: #ffffff;
}
```

```css
/* light */
--color-surface: #f6f7f9;
--color-surface-raised: #ffffff;
--color-surface-panel: #ffffff;
--color-surface-elevated: #eceef2;
--color-fg: #14161c;
--color-brand: #3a55cc;
--color-brand-hover: #2e4499;
--color-accent: #56607a;
--color-info: #48566a;
```

---

## Rolling your own

Two rules keep a custom palette working:

1. **Light-theme brand colours usually need darkening.** A colour picked to sit on near-black rarely clears 4.5:1 against white. Check `--color-brand`, `--color-accent` and `--color-info` against `--color-surface-raised`.
2. **`--color-fg` is ink, not decoration.** Every body copy shade and hairline border is `fg` at some opacity, so it must contrast with `--color-surface`. Text on a *solid brand fill* stays literal `text-white` in both themes and is unaffected.

For translucent fills in inline styles, use the `tint` helper rather than appending a hex alpha — CSS variables don't support the `#rrggbbaa` shorthand:

```tsx
import { tint } from "@/lib/color";

<div style={{ backgroundColor: tint("var(--color-brand)", 8) }} />
```
