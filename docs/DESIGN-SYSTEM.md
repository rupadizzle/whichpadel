# WhichPadel design system

Every visual value lives in `src/styles/tokens.css`. Every shared component lives in `src/styles/components.css`, which loads last.

## Files

`src/layouts/Base.astro` loads these in this order. Order matters: a later file wins at equal specificity.

| File | Holds |
|---|---|
| `tokens.css` | Custom properties only |
| `parts/base.css` | Element defaults, text utilities, shared image slot |
| `parts/layout.css` | Container, `main` rhythm, panels, dark hero |
| `parts/header.css` | Utility bar, header, nav, dropdowns |
| `parts/footer.css` | Footer and newsletter |
| `parts/region.css` | Region, currency and language sheet, geo banner (after footer: the sheet opens from it) |
| `parts/dialogs.css` | Voice describe, price alert, picker sheet |
| `parts/home.css` | Home page |
| `parts/cards.css` | Card additions (the core card is in `hub.css`, loaded by `RkCard`) |
| `parts/compare.css` | Compare header, verdict, spec rows, buy row |
| `parts/product.css` | Gallery, price box, price sheet, sticky price bar |
| `parts/finder.css` | Finder shell |
| `parts/pages.css` | Tools, kit, saved, brand lists, guides |
| `shoes.css`, `search.css` | Shoe pages, site search |
| `components.css` | Canonical components (last) |

Page-only: `hub.css` (catalogues and cards), `bf.css` (Black Friday). Noindex experiments, not part of the system: `home2.css`, `home3.css`, `hero-page.css`.

## Lint

`npx stylelint "src/**/*.{css,astro}"` runs inside `deploy.sh` and `preview.sh` and blocks the build on:

- px spacing
- negative margins (except `margin-inline` full-bleed)
- raw hex colours outside `tokens.css`
- `!important` without a reason
- a z-index that isn't a `--z-*` layer (or a local 0–5)

## Principles

1. **Flat and compact.** Cards are bordered, not shadowed, and spacing comes from the 4px scale. Comparison views use the dense control height on desktop.
2. **Accessible by default.**
   - Every interactive target is at least 44px tall on touch.
   - Text meets 4.5:1 contrast (3:1 for large text and icons).
   - Focus always shows one 3px ring.
3. **One component per job, in every language.** Strings live in `src/i18n`, never in CSS.

## Tokens (summary)

| Group | Tokens |
|---|---|
| Brand | `--navy` `--navy-2` (footer/utility bar) `--navy-mid` `--navy-hover` `--green` (primary) `--green-2` (links, active, best) `--green-3` `--lime` (accent: on dark or as a filled button) `--lime-2` `--lime-ink` `--lime-tint` |
| Neutrals | `--ink` `--mut` (secondary text, 6.2:1) `--icon` (inactive icons, 4.4:1) `--line` `--line-2` (inputs, handles) `--bg` `--card` `--tint` (image wells, chips, callouts, best rows) |
| On dark | `--on-dark` `--on-dark-2` (body) `--on-dark-3` (meta, navy only) `--wash-1/2/3` (hover / hairline / outline) `--scrim` |
| State | `--ok` `--danger` `--focus` (`--focus-light` blue on light surfaces, `--focus-dark` lime on dark) |
| Type | `--fs-xs` 12 · `--fs-s` 13 · `--fs-m` 14 · `--fs-base` 16 · `--fs-l` 18 · `--fs-xl` 20 · `--fs-2xl` 24 · `--fs-3xl` 28 · `--fs-4xl` 32 · `--fs-h2` · `--title` (every h1) · `--display` (home and finder heroes) · `--display-xl` (Black Friday poster) |
| Weights | 400 body · 600 UI · 700 headings/buttons · 800 h1/prices (`--fw-*`) |
| Space | `--s0` 2 · `--s1` 4 · `--s2` 8 · `--s3` 12 · `--s4` 16 · `--s5` 24 · `--s6` 32 · `--s7` 48 · `--s8` 64 · `--gap` (24, or 32 from 900px) |
| Controls | `--tap` 44 (minimum hit area) · `--ctl` 44 (buttons, fields) · `--ctl-l` 48 (full-width CTA) · `--ctl-d` dense: 44 on touch, 36 on desktop with a mouse |
| Shape | `--r-xs` 4 · `--r-s` 8 (chips, small controls) · `--r` 12 (cards, buttons, panels, dialogs) · `--r-l` 16 (sheets) · `--r-pill` |
| Elevation | `--sh` none (cards) · `--sh-1` · `--sh-pop` (menus, dialogs) · `--sh-bar` (sticky bottom bars) · `--ring` |
| Motion | `--t-fast` .15s · `--t` .25s, both off under `prefers-reduced-motion` |
| Stacking | local 1–3 inside a component; global: `--z-sticky` 15 · `--z-header` 21 · `--z-header-top` 22 · `--z-bar` 25 · `--z-menu` 30 · `--z-panel` 40 · `--z-sheet` 60 · `--z-shade` 79 · `--z-drawer` 80 · `--z-nav-open` 100 |
| Breakpoints | **600** (phone → large phone/tablet), **900** (one → two columns; sticky price bar), **1180** (burger → full nav; matches JS `innerWidth > 1180`). Under 480px, small-phone tweaks only. |

## Components

| Component | Markup | Notes |
|---|---|---|
| Breadcrumbs | `<Crumbs label items/>` (`src/components/Crumbs.astro`) | On phones, the current page is screen-reader only when it is the third crumb or later, so it does not repeat the h1. |
| Page head, light | `<header class="page-hd"><h1/><p/></header>` | Catalogues (hubs), tools, account, legal, 404. Compact inside `.cat`. |
| Page head, dark | `.phero` / `<PageHero/>` | Editorial pages: best lists, guides, brands, players, compare, articles. Optional `.eyebrow` pill above the h1, then a byline. |
| Button | `.btn` (green) · `.btn-accent` / `.aff` (lime, the money action) · `.btn-line` (secondary) · `.btn-sm` (narrower) · `.btn-lg` (full width, 48px) · `.btn-row` | All 44px, `--r`, weight 700. Context rules may change layout (width, flex), never colour or height. |
| Callout | `.rulebox` | Tint background, green left rule. Used for "How this list is built". |
| Tag | `.chip` | Static, tint, pill. |
| Link pill | `.gchips a`, `.hub-pre a`, `.brandlinks a` | White, `--line` border, pill, one line. 44px; 36px only in desktop filter UIs. |
| Long link list | `<details class="linkset"><summary>Label <small>n</small></summary><p class="brandlinks">…</p></details>` | Keeps internal links crawlable without a wall of pills. |
| Data table | `.tw > table` | Scrolls sideways on phones with a sticky first column; never breaks words. |
| Product card | `RkCard.astro` (`.rk.rk-card`) | One card for rackets, shoes, balls and bags. Photos blend into the `--tint` well. Save and alert icons are 18px glyphs with 44px hit areas. |
| Icon button hit area | `position:relative` + `::after{inset:calc(50% - var(--tap)/2) …}` | Used by save, alert, compare toggles and byline links. |
| Focus | global `:focus-visible` | Dark surfaces (`.hdr`, `.ftr`, `.phero`, `.hero`, `.bf-hero`, `.verdict`, `.offer`, `.hub-tray`, open nav) switch `--focus` to lime. Light islands inside them (dropdowns, popovers, dialogs) switch it back. |

## Page rhythm

- **Header or hero to content:** `--s6` (32px) on every page type, measured by `padqa.mjs`.
- **Content to footer:** `--s6`. The last child's bottom margin is zeroed, skipping scripts.
- **Catalogue hubs** (`main > .crumbs + .cat`): compact `--s2` top.

## Rules for new work

- Use a token, never a raw value. If no token fits, add one to `tokens.css` with a comment.
- Prefer an existing component. If a page needs a variant, add it to `components.css`, not to a page file.
- No `:not(#_)` or `!important` to win the cascade. Delete or lower the rule that is winning instead. `!important` is reserved for state utilities (`[hidden]`, honeypot, reduced motion) and needs a `stylelint-disable` comment with a reason.
- Check any new page at 360/390/412/768/1280 with `layoutqa.mjs` and `padqa.mjs`.
