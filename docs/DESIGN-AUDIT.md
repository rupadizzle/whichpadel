# WhichPadel design audit (Nov 2026)

Branch: `claude/design-audit-system-dbn27e`. The audit is below. The fixes are on the same branch, and the system they produce is documented in [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md).

## Outcome on this branch

| Measure | Before (main) | After |
|---|---:|---:|
| Distinct font sizes | 74 | 10-step scale + 3 fluid headings |
| Distinct hex colours outside tokens | 80 | 0 (lint-enforced) |
| Distinct border radii | 24 | 5 tokens (+ `50%` circles) |
| Distinct breakpoints | 47 | 600 / 900 / 1180 (+ small-phone tweaks under 480) |
| `:not(#_)` specificity hacks | 69 | 0 |
| `!important` | 35 | 6, all state utilities, annotated |
| stylelint errors (repo config) | 809 | 0 across CSS and `.astro` `<style>` blocks; stylelint now blocks `deploy.sh` / `preview.sh` |
| Dead CSS rules (classes used nowhere) | ~300 | 0 |
| Breadcrumb implementations | 15 hand-built | 1 component |
| Page-head patterns | 3 + ad hoc | light `page-hd` + dark `phero` |
| Button variants (measured) | 9 | 3 colours, 1 height (44px; 48px full-width CTA) |
| Callout styles | 8 (incl. off-palette yellow) | 1 |
| Stylesheet structure | 8 date-layered files overriding each other | 12 per-component files in `src/styles/parts/` + tokens + components |
| Global z-index values | 22 raw numbers | 10 named layers (lint-enforced) |
| `padqa` vertical rhythm | FAIL | PASS (32px above and below content on every page type) |
| Saved page layout shift (CLS, measured on the live preview) | 0.15–0.19 on production, up to 0.39 with items | 0.000 at 390 and 1280 with 0, 1 or 5 items |
| Functional `qa.mjs` checks | 10 failing (stale selectors) | 23/23 pass |
| Repo QA suite (smoke) | 9 of 12 failing or crashing | all pass except `qa.mjs` static check: 166 + 18 duplicate titles (pre-existing SEO) |
| Prices printed outside the currency converter (`curtextqa`) | 426 | 0 |
| Horizontal overflow at 360/390/412/768/1280 (30 page types, 6 languages on home) | n/a | none |

How it was verified:

- **Computed-style diffs.** Snapshots of every element on 20 page types were taken before and after each refactor: 81 states at 390/768/1280, including the open mobile menu and submenu, the desktop dropdown, search, the filter drawer, the alert dialog, the region sheet and the price sheets. Hack removal and the stylesheet split both produced zero changes. The split also kept an identical set of 1,060 rules.
- **Repo QA suite.** `layoutqa.mjs` shows no new violations; the remaining ones are scroll-strip peeks and the fanned hero art, both pre-existing. `geoqa` and `pickerqa` pass, and `padqa` passes.
- **New browser checks.** A tap-target, contrast and price-spacing check ran across 30 page types at four widths.

Known exceptions and what's left:

- **Dense controls.** Desktop filter controls are 36px when a mouse is detected (WCAG AA minimum is 24px). The compare-header swap and remove buttons have 36px-tall hit areas because they are stacked.
- **Data-driven inline styles** (column counts, bar widths, image sizes) stay inline by design; static ones were moved into components. JS strings are not linted.
- **Test pages.** `/homepage-2`, `/homepage-3`, `/hero` and `/shells` are noindex experiments with their own CSS. They are excluded from lint; delete them once decided.
- **Duplicate page titles (SEO, pre-existing).** 166 groups of different pages share a title in the same language (title shortening drops variant words, e.g. two Nox AT10 Genius editions), plus 18 pages share a title across languages. Not changed here because titles affect rankings; needs its own change.
- **`pxqa` API check** needs network access to whichpadel.com; `PXQA_OFFLINE=1` reports SKIP, never PASS.

## How this was measured

Per RULES.md 7–8, everything here comes from code or a browser, not from eyeballing:

- **Static scan** of every `.css` file and every `<style>` / `style=""` in `src/**/*.astro`, tallying each raw value (colour, size, radius, shadow, breakpoint, etc.).
- **Built site** (`npm run build`, 12,309 pages) served locally, with **20 page types** screenshotted at 390px and 1280px.
- **Computed styles** read in Chromium at 390px for h1, h2 and every visible button on each page type.
- **`layoutqa.mjs`** and **stylelint** (the repo's own config) run against the build and the source.
- **WCAG contrast** calculated for the main colour pairs.

Page types covered: home, racket product, racket guide, best list, brand, brands, compare, finder, deals, Black Friday, shoes hub, bags hub, balls hub, players, gift guide, tool, privacy, saved, my kit, 404.

---

## 1. Verdict

The site has a **good core** that drifted. The token set in `site.css` (4px spacing scale, navy/green/lime, Inter, `--r: 12px`) is sensible, and `rk-card` is a solid shared card. Since then, **seven patch layers (`v4.css` → `v10.css`)** and per-feature sheets were stacked on top. Each one hard-codes its own values and overrides the one before it.

The result:

| Measure | Now | Target |
|---|---:|---:|
| Distinct font sizes | **74** | 8 |
| Distinct hex colours | **80** (+59 distinct `rgb()` values) | ~16 tokens |
| Distinct border radii | **24** | 4 |
| Distinct box shadows | **34** | 2–3 |
| Distinct media-query breakpoints | **47** | 3 |
| Distinct z-index values | **22** | 6 named layers |
| Distinct `padding` values | **174** | from the 4px scale only |
| `:not(#_)` specificity hacks | **69** | 0 |
| `!important` | **35** | 0 |
| stylelint errors (repo's own config) | **809** (658 are px spacing) | 0 |
| Measured button styles on 20 pages | **9 variants** (44–60px tall, radius 8/9/10/12, 13–16px text, weight 600–700) | 3 variants × 2 sizes |
| Page-header patterns | **3** | 1 component with 2 tones |

The inconsistencies you're seeing don't come from bad decisions on individual pages. They come from **no single source of truth**: tokens exist, but most of the code doesn't use them. The fix is to rebuild the foundation first, then migrate components onto it, then delete the layers.

---

## 2. Foundations (the design system)

### 2.1 Colour

**What's there.** `site.css` defines 13 colour tokens. The code then uses **80 hex values and 59 `rgb()` values**, mostly near-duplicates:

- **Muted text:** `--mut #4f5f69` (token) and `#5b6670` (hard-coded 21×). There's also `var(--muted, #5b6670)`, but **`--muted` is never defined**.
- **Text on dark backgrounds:** `#c9d8df`, `#d6e2e8`, `#d5e3ea`, `#9fb6c0`, `#b9ccd4`, `#b9c7cf`, `#c8d3da`, `#c5d0d6` — eight greys doing three jobs.
- **Light green tints:** `#eef4f1`, `#eef8f3`, `#e6f2ec`, `#e8f0ec`, `#e7f3ee`, `#f1fbf6`, `#f1faf6`, `#f3f6f4`, `#f3f6f5`, `#d5e3da`, `#d5e4df`, `#c5d5cc`.
- **Borders:** `--line #e1e7ec` plus `#e3e9ee`, `#e3eaee`, `#e3e8ec`, `#dde3e6`, `#d9dee3`, `#d7dee3`, `#cfd6db`, `#e8edf0`, `#e8eef1`.
- **Red/danger:** `#c0392b`, `#c62828`, `#e11d48`, `#b4442c` — four reds and no token.
- **Brand green:** `--green2 #13795c` is hard-coded 31× instead of using the token.
- **One-offs off-palette:** yellow callout `#fffde8`/`#efe7a6`, focus blue `#1d6fd8`, `#111` in the utility bar (it isn't navy), `#070d12` on Black Friday, footer `#071c28` (no token).
- **The same colour written three ways:** `rgb(255,255,255,.08)`, `rgb(255 255 255 / .08)` and `rgba(255,255,255,.08)` all appear.

**Contrast failures:**

| Pair | Ratio | Needs | Used for |
|---|---:|---:|---|
| `#8b98a1` on white | 2.96 | 3.0 (icon) | Bell and heart icons on every card |
| `#8b9c93` on white | 2.89 | 4.5 (text) | Meta text |
| `--lime2 #b8e620` on white | 1.46 | 3.0 | Input focus outline, ★ "best" marker in compare |
| `#9fb6c0` on `--green` | 3.81 | 4.5 | Byline text on the green end of the hero gradient |
| Focus blue `#1d6fd8` on navy | 3.06 | 3.0 | Passes, but only just, on the header |

**Proposed tokens.** These keep the brand and collapse the duplicates. Every existing value maps onto one of them.

```
/* brand */
--navy   #0b2a3c   header, dark hero start
--navy-2 #071c28   footer, deepest surface (replaces #111, #070d12)
--green  #0f5b46   primary button
--green-2 #13795c  links, hover, active state
--lime   #d4ff3a   accent ON DARK ONLY (CTA on navy, logo, pills on dark)
--lime-2 #b8e620   lime hover

/* neutrals */
--ink    #0f1c24   body text
--mut    #4f5f69   secondary text (absorbs #5b6670, #8b9c93, #8a949c)
--icon   #6b7a84   inactive icons (≥3:1; replaces #8b98a1)
--line   #e1e7ec   all borders (absorbs the 9 near-greys)
--bg     #f5f7f8   page
--card   #fff
--tint   #eef4f1   green-tinted surface: image wells, chips, group rows, callouts

/* on dark */
--on-dark    #fff
--on-dark-2  #c9d8df  body copy on dark
--on-dark-3  #9fb6c0  meta on navy only (not on green)
--on-dark-line rgb(255 255 255 / .15)
--on-dark-hover rgb(255 255 255 / .08)

/* state */
--danger #c0392b
--focus  #1d6fd8 on light; var(--lime) on dark
```

Drop the yellow callout and use `--tint` with a `--green-2` left rule, the same as `.alert-panel`.

### 2.2 Typography

**What's there.** One family (Inter Variable, good), but **74 font sizes** in four unit systems: `.8125rem`, `13px`, `var(--fs-s)` and `.82rem` all sit within half a pixel of each other. Specifics:

- **Small text uses ~14 sizes between 11 and 14px:** `.6875rem`, `.68rem`, `.7rem`, `.72rem`, `.72em`, `.75rem`, `.78rem`, `.8rem`, `.82rem`, `.8125rem`, `13px`, `.85rem`, `.875rem`, `14px`.
- **Weights:** seven are used (400, 500, 600, 650, 700, 750, 800).
- **Line heights:** 25 distinct values. **Letter spacing:** 13.
- **h1 (measured):** consistent at 21.6px on most templates, but 31.2px on home and **32px on finder** (a different scale from the other tools).
- **h2 (measured):** drifts between 17.6, 18 and 18.4px on the same page, because `main h2`, `.hub h2` and `.pg h2` all set their own size.
- **Uppercase labels:** five different tracking values (`.04`, `.05`, `.06`, `.08`, `.14em`) for the same "eyebrow label" pattern.

**Proposed scale** (rem, 16px base):

| Token | Size | Use |
|---|---|---|
| `--fs-xs` | .75rem / 12px | Legal, disclaimers, uppercase labels |
| `--fs-s` | .8125rem / 13px | Card meta, bylines, chips |
| `--fs-m` | .875rem / 14px | Secondary UI, table cells, small buttons |
| `--fs-base` | 1rem / 16px | Body, buttons, inputs |
| `--fs-l` | 1.125rem / 18px | h3, lead text |
| `--fs-h2` | clamp(1.125rem, 1.6vw, 1.3rem) | h2 |
| `--title` | clamp(1.35rem, 2.2vw, 1.65rem) | h1 on every template |
| `--display` | clamp(1.95rem, 4.4vw, 3.25rem) | Home hero only |

- **Weights:** 400 body · 600 UI/labels · 700 headings and buttons · 800 h1/display.
- **Line heights:** 1.15 headings · 1.35 UI · 1.6 body.
- **Uppercase labels:** one class (`.label`) at `--fs-xs`, weight 700, `.06em` tracking.

### 2.3 Spacing

The scale already exists (`--s1`…`--s8` = 4/8/12/16/24/32/48/64), and stylelint already forbids px in margin, padding and gap. The rule is being ignored, not missing:

- **658 stylelint errors** are px spacing (`gap: 8px` alone appears 56×). There are **174 distinct padding values**, with rem values off-scale (`.3125rem`, `.5625rem`, `.9375rem`, `.85rem`).
- **There are two parallel token names for the same scale** (`--s2` and `--sp-1`), and `--sp-6` is never used.
- **`main` padding is set in five places** (site.css, v5, v6, v9, v10, plus hub and shoes).
- **18 negative margins** are banned by the repo's own lint config.
- **Measured:** crumbs to content is 6px on /bags/ and 8px on /deals/, but 16–24px elsewhere.

**Proposal:** keep `--s1`…`--s8` as the only spacing tokens, delete `--sp-*`, and make stylelint a blocking step in `deploy.sh`.

### 2.4 Radius, shadow, motion, layers

- **Radius:** 24 values. Buttons use 8, 9, 10 and 12 (measured), and pills use `99px`, `999px` and `50%`. **Proposal:** `--r-s 8px` (small controls, chips) · `--r 12px` (cards, buttons, panels, dialogs) · `--r-l 16px` (bottom sheets) · `--r-pill 999px`.
- **Shadow:** 34 distinct values, which works against the "flat" rule in RULES.md 6. **Proposal:** cards stay flat (border only). Use exactly three tokens: `--sh-pop` (menus, popovers, dialogs), `--sh-bar` (upward, for sticky bottom bars) and `--ring` (selected state, `inset 0 0 0 2px var(--green-2)`).
- **Motion:** 13 transitions. **Proposal:** `--t-fast .15s ease` (hover/colour) and `--t .25s ease-out` (sheets/drawers), both under `prefers-reduced-motion`.
- **z-index:** 22 values, from 1 to 100, plus a stray comment. **Proposal:** named layers: `--z-raised 2`, `--z-sticky 20` (sticky bars), `--z-header 30`, `--z-nav 40`, `--z-popover 50`, `--z-dialog 60`.

### 2.5 Breakpoints

There are **47 distinct media queries**, including the off-by-one pairs 860/861, 899/900/901 and 600/601, plus 640, 700, 720, 760, 800, 980, 1100 and 1180. Some components switch layout at 860px and their neighbours at 900px, which produces the in-between widths where things collide.

**Proposal:** three breakpoints only: **600** (phone → large phone/tablet), **900** (single → two-column), **1180** (burger → full nav, already established). Use the `width >= / <` range syntax throughout, written mobile-first.

---

## 3. CSS architecture

| Problem | Evidence | Impact |
|---|---|---|
| **Seven patch layers loaded globally** | `Base.astro` imports `site.css` + `v4`–`v10` + `shoes` + `search` on every page | Each layer overrides the last; changing a component means finding all of its definitions |
| **Specificity hacks** | `:not(#_)` ×69, `!important` ×35, `[hidden][hidden][hidden]` | Proof the layers fight each other; every fix escalates |
| **Same component defined in many places** | `main` in 9 files, `.rcard` in 4, `.crumbs` in 3, `.phero` in 3, `.hdr` in 3 | Unpredictable results |
| **Dead CSS** | `.rcard` (+ `.rimg`, `.rbody`, `.minibars`, `.cmpbox`, `.cmpbar`, `.rank`) and `.gcard` render on **0 pages**; `.hero`, `.quiz` and `.filters` remain from the old home | Weight and confusion |
| **Undefined variables** | `--muted`, `--f-max`, `--stack`, `--cluster`, `--min` | Silent fallbacks |
| **Two container systems** | `.wrap` (1200px, site.css) and `.container` (75rem, v5) | Two different page widths |
| **Test pages with their own design** | `/homepage-2`, `/homepage-3`, `/hero` ship `home2.css`, `home3.css` and `hero-page.css` (noindex) | Keep them out of the system; delete once decided |

**Proposed structure:**

```
src/styles/
  tokens.css      every custom property; nothing else
  base.css        reset, element defaults (body, headings, links, form fields, focus)
  layout.css      .wrap, main rhythm, .stack/.cluster/.grid primitives
  components/     one file per component: button, card, page-head, callout,
                  chip, tabs, table, dialog, sheet, nav, footer, form
  pages/          only page-specific layout that no other page uses
```

Migrate one component at a time. When a component's rules are all in its file, delete the matching rules from `v4`–`v10`. When a `vN.css` file is empty, delete it.

---

## 4. Components

### 4.1 Page header (most visible inconsistency)

Three patterns serve the same job:

| Pattern | Used on |
|---|---|
| **Dark gradient `.phero`** with crumbs, h1, byline, intro | best lists, racket guide, brand, brands, compare, shoes hub, players, gift guides |
| **Light, h1 in page flow** | racket product, deals, bags hub, balls hub, tool, privacy, saved, my kit, 404 |
| **Dark home hero** | home only (fine as an exception) |

Worst cases:

- **Shoes hub uses the dark header; bags and balls hubs, the same page type, use light.**
- **The h1's measured top position at 390px ranges from 136px to 310px.** On the racket product page it sits at 310px because the page shows crumbs, then the product name repeated as plain text, then a brand/year line, then the h1.
- **Crumbs repeat the h1.** On best lists, compare and racket pages, the last crumb is the page title as plain text, immediately above the h1 that says the same thing.
- **Inconsistent metadata.** The byline and "Updated October 2026 · 10 rackets" pill appear on some editorial pages but not others (brand pages have a byline but no updated pill; deals has neither).

**Proposal:** one `PageHead` component (you already have `PageHero.astro`; extend it) with two tones:

- `tone="dark"` for editorial and listing pages (lists, guides, hubs, brands, compare).
- `tone="light"` for task pages (product, tools, account, legal, 404).

The slots are fixed: crumbs (without the current page) → eyebrow pill (optional) → h1 → byline (optional) → intro. Every hub (shoes, bags, balls, rackets) gets the same tone.

### 4.2 Buttons

**Measured on 20 pages: 9 visual variants.**

- **Primary green** appears at 45px/r10/16px/650, 48px/r12/15px/700 (product), 48px/r10 (404), 46px (kit) and **60px/r10/13px (compare sticky CTA)**.
- **Lime accent** appears at 46px and 47px.
- **Line button** is 44px/r8/13.6px.
- **Filter button** is 36px/r9/13px, **below the 44px tap rule**.

The compare sticky CTA wraps to three lines at 390px ("from £326 · 1 / shop approx.").

**Proposal:** three variants × two sizes, one component.

| Variant | Use |
|---|---|
| `btn` (green) | Primary action on light |
| `btn-accent` (lime on navy text) | The single money action: Check price / Finder; also primary on dark |
| `btn-line` (white, `--line` border, green text) | Secondary |

Sizes: default 48px, `btn-sm` 44px (never smaller). Every variant uses `--r` 12px, `--fs-base`/`--fs-m`, weight 700. Drop `btn-ghost` and `btn-lg`, and keep CTA labels to one line.

### 4.3 Icon buttons (save ♡ and alert 🔔)

- **The tap target is 16–18px** (`v10.css:149`, `hub.css:373`) with no expanded hit area, on every product card site-wide. **This breaks the 44px rule in RULES.md and WCAG 2.5.8.**
- **The icon colour `#8b98a1` is 2.96:1**, below the 3:1 minimum for icons.

**Fix:** keep the 18px glyph inside a 44×44 button (or use a `::before` with `inset:-13px`) and colour it `--icon`.

### 4.4 Cards

- **`rk-card`** is the live card for rackets, shoes, balls and bags, used on 1,292 pages. Good. `/shells` already lists the four card shells to keep, so finish that consolidation.
- **The image well is a grey `--tint` box around white-background product photos**, which leaves visible grey bars either side of the photo (home strips, best lists). Either make the well white with a `--line` border, or `mix-blend-mode: multiply` the photo onto the tint, and use one approach everywhere.
- **In peek strips (home, 390px), the second card's price is cut mid-word** ("from"). Size cards so the peek shows image, not price, or snap whole cards.
- **Delete `.rcard` and `.gcard`** (no pages use them).

### 4.5 Callouts and notes

There are **eight callout styles** for "here's some context": `.rulebox` (yellow, 253 pages), `.hub-note`, `.note`, `.bf-note`, `.brand-note`, `.pxalert-note`, `.hv-note` and `.geo-card`, plus `.alert-panel`.

**Proposal:** one `.callout` (`--tint` background, `--r`, `--s4` padding, optional `--green-2` left rule) and one `.callout--warn` if needed.

### 4.6 Chips, pills and tags

- **Pill classes:** `.chip`, `.chips`, `.kchips`, `.gchips`, `.chipset`, `.eyebrow`, `.updated`, `.rank` and `.medal`, with five radii and five tracking values.
- **Brand and bags pages show a wall of 60–100 model-name pills** before the product grid. At 390px the brand page's racket grid starts several phone screens down, below the pill wall, and the bags hub's filter area is more than a full phone screen of pills. Visually this is the heaviest thing on the site.

**Proposal:**

- **Pills:** two types only. `.chip` is a static tag (`--tint`, `--fs-s`, `--r-pill`). `.chip-btn` is a toggle or filter (white, `--line` border, 44px, pressed state = navy).
- **Model lists:** collapse to the first ~12 with a "Show all N" control, or move them below the grid.

### 4.7 Focus states

There are three different focus rings: blue `#1d6fd8` 3px (v4, links and buttons), lime 2px (header), and **lime-2 2px on inputs, which is 1.46:1 on white and effectively invisible**. **Proposal:** a single `:focus-visible` rule, a 3px `--focus` ring with a 2px offset, and `--focus` switches to lime inside dark surfaces.

### 4.8 Forms

- **Selects and inputs are 44px high with radius 10**, while buttons beside them use radius 10 or 12.
- **Field labels:** the old `.quiz`/`.filters` uppercase label style is still in `site.css` but no longer rendered; standardise on the tool page's sentence-case labels at `--fs-s` weight 600.

Give fields the same radius as buttons.

### 4.9 Footer

- **Bug:** `.ftr li a {display:inline-flex}` turns the currency `<span class="mz">` into a separate flex item. That produces **"Padel shoes under£60"** with the space missing (desktop) and "Best padel rackets under … £150" split across two columns (mobile). Fix: give the anchor `display:inline-block` with block padding, or wrap the text in a single span.
- **Height:** on mobile the footer plus newsletter runs to roughly two phone screens, with 40+ links. Consider collapsible column groups below 600px.

### 4.10 Header and utility bar

- **The utility bar uses `#111`**, a third dark that is neither `--navy` nor the footer colour.
- **Header height `62px` is hard-coded 11 times** (`top: calc(62px + var(--bf))`, `calc(100svh - 62px)`, etc.). Make it `--hdr-h`.

---

## 5. Page-by-page notes (390px unless stated)

| Page | Finding |
|---|---|
| Home | "0 paid placements" stat wraps onto its own row under the other four. Peek strips clip the price on the second card. Racket photos sit in grey wells. |
| Racket product | Light header while every editorial page is dark; h1 at 310px; product name appears twice above the h1; spec chips under the h1 overflow ("Soft c…") with no visual cue that they scroll. |
| Best list | "How this list is built" yellow box is the only yellow on the site; the crumb repeats the h1. |
| Racket guide | Comparison table squeezes headers into broken words at 390px ("Racket/s", "Forgiv/eness", "Media/n price"); needs horizontal scroll or a stacked layout. |
| Brand | ~70 model pills before the grid (see 4.6); tabs (Rackets 64 / Shoes 75 / …) overflow at 390px without a scroll affordance. |
| Compare | The sticky top bar plus sticky bottom CTA take ~30% of the viewport; the CTA text wraps to three lines; the ★ "best" marker uses lime-2 on white (1.46:1). |
| Deals | Light header; crumbs-to-content gap of 8px (layoutqa); the empty state "No price cuts recorded this week" is plain muted text with no visual container. |
| Bags / Balls hubs | Light header while the shoes hub is dark; filter button 36px; the bags hub has ~100 model pills; crumbs gap 6px (layoutqa). |
| 404 | Centred layout, unlike every other light page. |
| Finder | h1 is 32px against 21.6px for every other template. |

---

## 6. Recommended plan

Each phase is a separate branch/PR, with `layoutqa.mjs`, `parity.mjs` and the 360/390/412/768 QA run before merge (RULES.md 7–8).

1. **Tokens.** Create `tokens.css` with the tokens in §2. Map every existing hex, size and radius to a token with a codemod (mechanical, low risk, no visual change except the contrast fixes). Remove the `--sp-*` aliases and define the missing `--muted`.
2. **Base and focus.** Element defaults, one focus ring, the h2 size, form fields.
3. **Quick wins that are bugs, not taste.** 44px save/alert tap targets, the footer "under£60" spacing, the 36px filter button, lime-2 contrast, and the "0 paid placements" wrap.
4. **Components, one at a time.** Button → PageHead → callout → chip → card image well → footer. For each one, write the component file, then delete its rules from `v4`–`v10`.
5. **Delete dead code.** Remove `.rcard`, `.gcard`, the old hero/quiz/filters, and every emptied `vN.css`. Decide on and remove the test homepages.
6. **Lock it in.** Add stylelint to `deploy.sh` as a blocking step. Add `declaration-property-value-allowed-list` rules so `color`, `font-size`, `border-radius` and `box-shadow` only accept `var(--…)`. Then the drift can't come back.

Suggested starting point: phase 1 + phase 3 in one PR. The tokens make everything else mechanical, and phase 3 fixes things users actually hit.
