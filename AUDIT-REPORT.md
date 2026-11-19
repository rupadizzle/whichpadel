# Code audit — whichpadel.com

Read-only audit of the Astro site (static output, Cloudflare Pages) on 9 November 2026. Six languages: EN, ES, FR, PT, IT, DE. No application code, content, config, or tests were changed. No migrations, deploys, or production data were touched.

**How this was checked.** Route map and catalogue were executed in Node (2,059 page records, 12,300 built URLs). Shop and affiliate anchors were searched in `src/`. `npm audit` was run against the lockfile (Astro 5.18.2). Unit tests were run with `node --test` (18 passed, 0 failed): `src/lib/shop-href.test.mjs`, `src/lib/profile.test.mjs`, `src/lib/search.test.mjs`, `functions/api/_acct.test.mjs`, `prices/test/parse.test.mjs`, `prices/test/snapshot.test.mjs`, `prices/test/export-local.test.mjs`. A full `npm run build` was not run: `scripts/fx.mjs` rewrites `data/fx.json`, and the build emits about twelve thousand HTML files. Canonical and hreflang behaviour on the built HTML is what `seoqa.mjs` already asserts; this report reviews the source of that logic.

**No Critical findings** in the deployed shape of the site (static files plus Pages Functions). The npm audit critical advisory is not exposed by this build. Highest real impact is wrong or stale prices, competing English URLs, and unauthenticated writes to the live subscribers namespace.

---

## Top 10

1. **High — Rankings and budget lists use recorded shop prices from September–October 2026, while the product page can show a different live price.** `priceChecked` on the 319 priced rackets runs from 2026-09-28 to 2026-10-19 (244 of them are 2026-10-13). The other 1,113 rackets have no price. Budget lists call `Pnum()`, which converts that recorded offer with `data/fx.json`, not the price worker. The product page then replaces the buy box from `/api/prices`. A racket can sit on “under £100” and open at another price. The published rule text still says the 20 October 2026 rate (`src/lib/data.js` 46–48) even where the code uses the newer FX file. The beginner list also treats a missing `priceGBPApprox` as eligible (`src/i18n/lists.js` 10), which contradicts its own rule (“recorded price up to £140”).

2. **High — US money pages are a snapshot from 23 October 2026, the copy claims an 8-hour check, and production is bound to preview price workers.** `data/us.json` is `updated: 2026-10-23` and is not refreshed by `npm run build`. The FAQ on those pages says prices are rechecked about every 8 hours and hidden after 48 hours (`src/views/VList.astro` 110). The racket worker actually rechecks after ~20 hours and hides after 72 hours (`prices/src/worker.js` 9–11). `wrangler.toml` 24–29 binds `US` and `SHOES` to `whichpadel-us-prices-preview` and `whichpadel-shoe-prices-preview`. The fallback URLs in `functions/api/_us.js` 3 are the same preview workers. One US offer for `bullpadel-vertex-04-2024` points at `packen-bullpadel-vertex-04-men`, which reads as a pack, not the racket.

3. **High — hreflang does not connect UK English and US English.** Every translated page emits `hreflang="en"|"es"|"fr"|"pt"|"it"|"de"` plus `x-default` → the unprefixed URL (`src/layouts/Base.astro` 37, `src/i18n/routes.js` 107–109). `<html lang>` is `en-GB` for that same URL (`LOCALE.en` is `en-GB`). `/us/` pages replace that cluster with a single self `hreflang="en-US"` (`Base.astro` 37, `VList.astro` 115) and the sitemap omits hreflang when a URL has only one alternate (`src/pages/sitemap.xml.js` 49). Nothing points back from `/best/...` to `/us/...`. Google can treat the UK “best rackets” URLs and the US “best rackets” URLs as competing English pages.

4. **High — Newsletter, deals-mail and finder-alert endpoints accept unauthenticated writes, and a missing Origin header is allowed.** `functions/api/subscribe.js` 4–18 writes any matching email into the live `SUBSCRIBERS` KV binding (`wrangler.toml` 6–8). `functions/api/news.js` and `functions/api/alert.js` do the same against D1 when `ACCT` is present. `originOk` returns true when the `Origin` header is absent (`functions/api/_acct.js` 7–9), so a non-browser client is not blocked. There is no rate limit. The honeypot only helps browsers that fill `website`.

5. **High — Security headers are not set, and dependencies include a critical Astro advisory plus several XSS advisories.** `public/_headers` sets cache lifetimes only. There is no `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, or framing policy. `npm audit` on the lockfile: 1 critical, 3 high, 1 moderate, 1 low. The critical item is GHSA-26w7-cxv4-gfx2 (Astro AVIF image-optimization RCE, Astro &lt; 7.2.8). This project is `output: 'static'` and does not use Astro’s image pipeline, so that endpoint is not what Pages serves. The relevant ones are the `define:vars` script-breakout (GHSA-j687-52p2-xcff) and related XSS advisories: `define:vars` is used on almost every page, including product names and shop config. Installed Astro is 5.18.2. `sharp` and `zod` high advisories come in through Astro.

6. **High — Every branch, including this one, is deployed to Cloudflare before tests, and a failing site check does not fail the job.** `.github/workflows/deploy.yml` runs on `push` to `**`, deploys `dist` with the production API token, and only then runs QA. The QA step is `continue-on-error: true`. `node scripts/translate-missing.mjs || true` drops missing-translation failures. The post-deploy curl checks only `/`, `/rackets/` and `/balls/`, and only on `main`.

7. **Medium — Recently viewed markup is built from `localStorage` without escaping the slug or the image URL.** `src/views/VProduct.astro` 323–324 interpolates `x.s` and `x.i` into `innerHTML`. Only the model name is stripped of `<>&`. A stored value such as a slug containing a quote and a tag becomes HTML on the next product view. This is same-origin (the writer must already be able to set `localStorage` on whichpadel.com). It is still an XSS sink on a page that also loads third-party scripts.

8. **Medium — 26 bag offers use `ninepadel.com`, which is not in `data/shops.json`.** Those offers (including in-range 2026 bags) get no delivery list and no affiliate template. `pick()` then treats the shop as “unknown” and can still show the price. Two shops that are in the file have no `affiliate` key at all: `padelreference.com` (`data/shops.json` 682) and `esprit-padel-shop.com` (703).

9. **Medium — The images the pages actually request are not covered by the long cache rule.** `public/_headers` 4–5 gives `/rackets/*.webp` a 7-day browser cache. Product photography is served from `/rackets/g/`, `/shoes/g/`, `/balls/g/` and `/bags/`. Those URLs fall through to the site-wide rule (`max-age=0`, `s-maxage=3600`). The homepage hero (`src/components/Home.astro` 60) loads three `/rackets/g/*-400.webp` files with no `fetchpriority="high"` and no preload. Inter is imported as the full variable package (`src/layouts/Base.astro` 2) with `font-display: swap`, which swaps after first paint.

10. **Medium — The affiliate programme is not wired, but the `rel` requirement is met.** Every shop or affiliate `<a>` found in `src/` includes `rel="sponsored nofollow"`. That includes the static buy button, the live price rows, the ball rows, the finder buy button, the static price sheet, the bag table in `VBags.astro`, and the two editorial shop links in `src/i18n/buying-guides.js` 33. Region changes rewrite `href` and leave `rel` in place (`src/components/Region.astro` 35–39). The gap is the target: 30 of 33 shops have `affiliate: "PLACEHOLDER"`, so `shopHref()` appends `utm_source=whichpadel` instead of an affiliate wrapper (`src/lib/shop-href.js` 4–12). Only `mantissport.com` has a real `https://` template (`data/shops.json` 115; the publisher id is on that line and is not copied here). The buy button still hardcodes `data-affiliate="PLACEHOLDER"` (`src/views/VProduct.astro` 278) even when the href is wrapped.

---

## 1. Bugs and correctness

### B1 — Recorded prices and live prices disagree

- **Severity:** High
- **Where:** `data/normalise.py` 3–14; `src/lib/data.js` 27, 46–48; `src/i18n/lists.js` 9–10, 22, 320–323; `src/views/parts/ProductPriceScript.astro` 7–12; `data/fx.json` (date `2026-11-02`)
- **Impact:** “Under £100/£150/£200”, “cheap”, value score and several tie-breaks are computed from the price stored on the racket (`r.price` / `priceGBPApprox`, FX baked on 20 October 2026 in `normalise.py`). `npm run build` refreshes `data/fx.json` from the ECB feed and does not recompute `priceGBPApprox`. The product page then loads `/api/prices` and can show another figure. The beginner rule text says the list stops at £140, but a null `priceGBPApprox` passes the filter.
- **Fix:** One price function for lists and the buy box. Drive budget lists from the same snapshot the product page uses, and drop rackets with no price from lists whose rule requires one. Regenerate GBP thresholds when FX changes, and update the “20 October 2026” sentences.
- **Effort:** M

### B2 — US catalogue is stale, mis-described, and pointed at preview workers

- **Severity:** High
- **Where:** `data/us.json` line 1; `src/lib/us.js` 1–7; `src/views/VList.astro` 107–112; `wrangler.toml` 24–29; `functions/api/_us.js` 3–26; `prices/src/worker.js` 9–11
- **Impact:** `/us/` pages are English money pages built only from `data/us.json` (50 rackets, 4 shoes, snapshot 23 October 2026). The on-page FAQ promises an 8-hour recheck and a 48-hour cutoff. The worker is ~20 hours and 72 hours, and the Pages merge caches the merged JSON for 24 hours. If both upstream workers fail, `mergeBody` still caches `{r:{}}` for that TTL, so a blip can hide prices for a day. Bindings and fallback hosts are preview worker names, so production Pages can show preview prices. The Vertex 04 2024 US row links to a “packen” URL.
- **Fix:** Point `US` and `SHOES` at the production workers. Refresh `data/us.json` in the build, or stop baking US prices and read the same API as the product page. Make the FAQ match `RECHECK` and `MAX_AGE`. Do not cache an empty `r` object. Drop the pack URL after a manual match check.
- **Effort:** M

### B3 — hreflang cluster splits UK and US English

- **Severity:** High
- **Where:** `src/layouts/Base.astro` 23–27, 34, 37; `src/i18n/routes.js` 7–11, 81–84, 107–109; `src/pages/sitemap.xml.js` 49; `src/views/VList.astro` 115–124; `src/pages/[...path].astro` 53
- **Impact:** UK pages advertise `hreflang="en"` (not `en-GB`) and `x-default` to themselves. US pages advertise only `en-US` to themselves. The pairs are not reciprocal, so the US best-racket URLs compete with the UK ones instead of being alternates. The sitemap agrees with the HTML for multi-language URLs and stays silent for `/us/`, which does not match the `en-US` tag in the page. `seoqa.mjs` currently encodes this shape, so the check will stay green while the cluster is wrong.
- **Fix:** Emit `en-GB` on unprefixed pages (matching `<html lang="en-GB">`). On `/us/` pages, emit `en-US` and `en-GB` (or `x-default`) as a real pair, and add the same pair on the UK counterpart. Teach `seoqa.mjs` the new contract. Keep self-only hreflang only for pages that have no other English URL (clothing brands, gift guides for men and women).
- **Effort:** M

### B4 — Women’s racket list includes rackets that are not women’s models

- **Severity:** Medium
- **Where:** `src/lib/data.js` 15–20; `src/lib/seo-content.js` 29–30; `src/i18n/lists.js` 321–323
- **Impact:** Audience is inferred from the model name (`W`, `Woman`, `Mujer`, `Lady`, plus `JR` / `Junior`). The women’s list then also keeps any non-junior racket with `weightMax <= 360` that is not high-balance or hard. A light unisex frame can rank as a women’s racket. The page title does not say that.
- **Fix:** Rank `audience === 'women'` first, and label any lighter unisex picks as a separate block, or drop them.
- **Effort:** S

### B5 — Literal internal links in `src/` match the route map

- **Severity:** Low (checked, no broken literal href found)
- **Where:** `src/i18n/routes.js` 99–104; `src/lib/nav-menu.js` 3; `src/components/NavL.astro` 10; `src/components/FooterL.astro` 11, 59–60
- **Impact:** The route builder produced 12,300 URLs and 0 path collisions. A scan of literal `href="/..."` in `src/` found no path the builder does not emit. Footer and nav drop shoe guides that are not in `SHOE_LIST_KEYS`, so the unpublished wide-fit slug (`padel-shoes-wide-feet` and its translations) is not linked. Footer entries whose `url()` returns null are filtered. This does not prove every sentence in the long HTML guides was rendered; those links go through `url()` or a path that exists for that language (clothing is EN+ES only, and the other languages do not link it).
- **Fix:** Add a build check that extracts `href` from `dist/**/*.html` and fails on a same-origin path that is not a file. `seoqa.mjs` already does the hreflang half of this.
- **Effort:** S

### B6 — Canonical is the request pathname, with no trailing-slash normaliser

- **Severity:** Low
- **Where:** `src/layouts/Base.astro` 27, 34
- **Impact:** Canonical and `og:url` are `new URL(Astro.url.pathname, Astro.site)`. There is no `trailingSlash` in `astro.config.mjs` (Astro default `ignore`). If the pathname at build time ever lacks the trailing slash the public URL uses, canonical and hreflang disagree. `seoqa.mjs` 8 fails the build output when that happens. It was not re-run here.
- **Fix:** Set `trailingSlash: 'always'` and build the canonical from `url()` rather than `Astro.url.pathname`.
- **Effort:** S

### B7 — Guide copy still says October 2026

- **Severity:** Low
- **Where:** `src/i18n/guide-de.js` 6, 20 (same sentence in the other `guide-*.js` files); `src/lib/data.js` 46–48; `src/i18n/gift-guide.js` (prices “checked 24 Oct / 27 Oct / 23 Oct”)
- **Impact:** The buying guide eyebrow says “Updated in October 2026” and quotes the 20 October FX rate. Gift copy quotes the October catalogue dates. The FX file on disk is 2 November 2026, and today is 9 November 2026. Readers are told the data is fresher or older than it is, depending on the page.
- **Fix:** Generate the “as of” date from `priceChecked`, `FX.date` and the catalogue `checked` fields.
- **Effort:** S

---

## 2. Security

### S1 — Unauthenticated subscriber writes

- **Severity:** High
- **Where:** `functions/api/subscribe.js` 4–18; `functions/api/news.js` 5–18; `functions/api/alert.js` 5–17; `functions/api/_acct.js` 7–9; `wrangler.toml` 6–8
- **Impact:** Anyone who can POST JSON can store an email address in production KV (`SUBSCRIBERS` is bound). `news` and `alert` do the same to D1 when the accounts database is attached. No `Origin` means the check passes. There is no rate limit, so the namespace can be filled or used to submit other people’s addresses. `@qa.invalid` is a dry run, which is fine for QA and does not stop the abuse above it.
- **Fix:** Require `Origin` (fail closed). Add a per-IP and per-email limit (Workers Rate Limiting or a KV counter). Confirm the address before it is treated as opted in. `news.js` already stores `confirmed = 0`; do not mail or export until that flips, and apply the same rule to the KV list.
- **Effort:** M

### S2 — No security headers

- **Severity:** High
- **Where:** `public/_headers` 1–10
- **Impact:** HTML responses do not set `X-Content-Type-Options: nosniff`, `Referrer-Policy`, or a framing policy. There is no CSP. The layout loads Google Analytics (after consent), Cloudflare Web Analytics, and, on `/` only, an AvantLink script (`src/layouts/Base.astro` 33–39). A missing referrer policy is how a magic-link token in the query string can leave the origin. Clickjacking of the sign-in dialog is possible without a frame ancestor restriction.
- **Fix:** Add `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `X-Frame-Options: DENY` (or CSP `frame-ancestors 'none'`). A strict CSP needs a nonce because the layout is full of inline scripts; start with the three headers above, then move inline scripts out.
- **Effort:** S for the three headers, L for a nonce CSP

### S3 — Dependency vulnerabilities (npm audit)

- **Severity:** High
- **Where:** `package.json` 6–14 (Astro `^5.0.0`, resolved 5.18.2); lockfile
- **Impact:** `npm audit` reports 6 issues (1 critical, 3 high, 1 moderate, 1 low), all reachable through Astro except the nested `sharp` / `zod` advisories that Astro pulls in.

  | Advisory | Audit severity | Note for this repo |
  |---|---|---|
  | GHSA-26w7-cxv4-gfx2 Astro AVIF RCE | critical | Image optimizer is not used. Static `public/` WebP is not passed through it. Still upgrade. |
  | GHSA-2pvr-wf23-7pc7 Host-header SSRF in prerendered error fetch | high | Static hosting. Low exposure. |
  | GHSA-8hv8-536x-4wqp XSS via slot name | high | Worth upgrading. |
  | GHSA-j687-52p2-xcff `define:vars` `</script>` breakout | moderate | This codebase uses `define:vars` on every layout. No product name currently contains `<`. |
  | GHSA-f88m-g3jw-g9cj and two further `sharp` issues | high | Build-time native dependency. |
  | GHSA-mrhx-c7xc-m3w5 Zod memory exhaustion | high | Transitive. |
  | GHSA-g7r4-m6w7-qqqr esbuild dev-server file read on Windows | low | Dev only. |

- **Fix:** Upgrade Astro to a release that clears these advisories (audit says the fix is a major bump) and re-run `npm audit`. Add `npm audit --audit-level=high` to CI.
- **Effort:** M

### S4 — Recently viewed `innerHTML` sink

- **Severity:** Medium
- **Where:** `src/views/VProduct.astro` 322–325
- **Impact:** `x.s` and `x.i` from `localStorage` are concatenated into HTML. The escaper used for the model name is not applied to them, and it would not be enough inside an attribute anyway. Exploit requires a write to `localStorage` on this origin.
- **Fix:** Build the nodes with `createElement` / `textContent`, or run the slug through the same `^[a-z0-9-]{1,80}$` check used in `Base.astro` 117 and allow only `/rackets/` and `/shoes/` image paths.
- **Effort:** S

### S5 — Magic-link sign-in has no rate limit (latent)

- **Severity:** Medium
- **Where:** `functions/api/auth/start.js` 25–46; `functions/api/auth/finish.js` 3–15; `functions/api/_acct.js` 40–42, 78–80; `wrangler.toml` 10–15
- **Impact:** `ACCT` is commented out, so these routes return 503 today. When email sending is turned on, `start` will mail a link to any syntactically valid address with no throttle. The raw token is in the query string (`t`). `safeNext` blocks off-site redirects (covered by `functions/api/_acct.test.mjs`). The session cookie is `HttpOnly`, `SameSite=Lax`, and `Secure` on HTTPS, for 60 days. A same-origin landing page can still put the token into `Referrer` for analytics because the finish URL is the referrer of `/saved/?sync=1` after the 302. The token is single-use, so this is leakage into logs, not a replay.
- **Fix:** Rate-limit before enabling `ACCT`. Put the token in the URL fragment or a one-time path that is not logged, and set `Referrer-Policy` (S2). Keep the 60-day cookie only if that matches the product; otherwise shorten it.
- **Effort:** M

### S6 — Third-party parameters committed in the layout

- **Severity:** Low
- **Where:** `src/layouts/Base.astro` 33 and 38. Values are not reproduced here.
- **Impact:** Line 33 is an AvantLink confirmation script, homepage only, with a long `authResponse` parameter in the source. Line 38 is the Cloudflare Web Analytics site token, which is public by design. No private keys, cloud tokens, or `.env` secrets were found in the tree. The KV namespace id in `wrangler.toml` 8 is an identifier, not a credential.
- **Fix:** If the AvantLink parameter is an account secret, rotate it and inject it at build time. Leave the Web Analytics token as a public site id.
- **Effort:** S

### S7 — JSON-LD is injected with `set:html`

- **Severity:** Low
- **Where:** `src/layouts/Base.astro` 36
- **Impact:** `JSON.stringify` does not escape `<`. A model name containing `</script>` would break out of the JSON-LD script. No racket, shoe, ball or bag name currently contains `<` or `>`. Editorial pages also pass author HTML through `set:html` (`src/views/VGuide.astro`, `VArticle.astro`, `VBuyingGuide.astro`). That HTML is repo content, not user input.
- **Fix:** Replace `<` with `\u003c` in every `set:html={JSON.stringify(...)}`. The hub data scripts already do this.
- **Effort:** S

---

## 3. Data integrity

### D1 — Catalogue coverage and the price used for rankings

- **Severity:** High
- **Where:** same as B1; `src/lib/price.js` 7, 12–14
- **Impact:** 1,113 of 1,432 rackets have neither `price` nor `offs`. Value score is null without `priceGBPApprox` (`src/lib/data.js` 27–31), so value lists and “under £X” lists are a minority of the catalogue. `offersOf()` drops out-of-stock rows when any sibling is in stock. That is reasonable for a “from” price and means the card can hide a cheaper out-of-stock shop without saying so. Shoe (318), ball (32) and bag (857) offer rows all have `d`, `p`, `c` and `u`. No duplicate racket, shoe or ball slugs. No product URL is shared by two slugs.
- **Fix:** Show “price not recorded” as a count on list pages. Prefer the live snapshot for anything labelled as a current price. Keep the out-of-stock row visible when it is the only row, which the code already does.
- **Effort:** M

### D2 — `ninepadel.com` offers and two shops with no affiliate field

- **Severity:** Medium
- **Where:** `data/bags.json` (26 bags, including `adidas-control-racket-bag-26`); `data/shops.json` 682–721
- **Impact:** Unknown shops skip delivery rules and affiliate wrapping. A UK visitor can be shown a ninepadel price the shop file never agreed to ship.
- **Fix:** Add the shop to `shops.json` with a checked delivery list, or drop the offers until that exists. Give every shop an explicit `affiliate` value (`PLACEHOLDER` or a real template) so a missing key is a validation error.
- **Effort:** S

### D3 — Affiliate templates are mostly placeholders (rel attribute is correct)

- **Severity:** Medium for tracking, Low for the `rel` requirement
- **Where:** `src/lib/shop-href.js` 4–12; `data/shops.json` 115 and the `"affiliate": "PLACEHOLDER"` entries; `src/views/VProduct.astro` 278; `src/views/parts/ProductPriceScript.astro` 28–33; `src/views/parts/ProductBallScript.astro` 26; `src/views/VFinder.astro` 166; `src/views/VProduct.astro` 349; `src/i18n/buying-guides.js` 33
- **Impact:** See Top 10 item 10. Schema.org `Offer.url` is the merchant URL inside JSON-LD, not an `<a>`, so it correctly has no `rel`. `VBags.astro` also has `rel="sponsored nofollow"` on its shop button, but that view is not mounted (C1).
- **Fix:** Replace `PLACEHOLDER` with the real template per shop. Stop hardcoding `data-affiliate="PLACEHOLDER"` on the button; set it from the same string `shopHref` used. Keep `rel="sponsored nofollow"` on every outbound shop anchor, including ones that are still UTM-only if the business wants them treated as commercial.
- **Effort:** S for the attribute, M to turn on real programmes

### D4 — No schema check on the catalogues

- **Severity:** Medium
- **Where:** `data/rackets.json`, `data/shoes.json`, `data/balls.json`, `data/bags.json`, `data/shops.json`. No JSON Schema file in the repo.
- **Impact:** Bad rows are caught only by accident. The US pack URL (B2) and the missing shop (D2) are the kind of row a schema plus a “domain must exist in `shops.json`” check would reject. Dates are not validated against “older than N days”.
- **Fix:** A small validator in CI: required fields, `https` URLs, currency in `EUR|GBP|USD|SEK`, shop domain known, `priceChecked` / `checked` not older than an agreed window, affiliate is either `PLACEHOLDER` or an `https` template containing `{url}`.
- **Effort:** M

### D5 — Image files match the catalogues

- **Severity:** Low (no broken local image found)
- **Where:** `data/gallery.json`, `data/images.json`, `public/rackets/`, `public/shoes/g/`, `public/balls/g/`, `public/bags/`
- **Impact:** All 288 gallery slugs have both 400 and 800 WebP files. All 1,333 `images.json` `ok` slugs have `/rackets/{slug}.webp`. No missing shoe, ball or bag image for a row that claims one.
- **Fix:** Keep this as a CI check so a partial image sync fails the build.
- **Effort:** S

---

## 4. Performance and rendering

There are no Astro client islands (`client:load` is unused). Pages are static HTML plus inline scripts. That avoids hydration cost. The cost is elsewhere: CSS, fonts, image caching, and scripts parsed on every page.

### P1 — Gallery images are cached like HTML

- **Severity:** Medium
- **Where:** `public/_headers` 1–7; `src/components/Home.astro` 60; `src/components/RkCard.astro` 22–25; `src/lib/rp2.js` 4
- **Impact:** The file the browser requests for a racket photo is `/rackets/g/{slug}-{i}-400.webp` (and 800). The 7-day rule is `/rackets/*.webp`. Shoe, ball and bag images have no long-cache rule. Repeat visits re-download the LCP image. Cards below the fold correctly use `loading="lazy"` and width/height, so image CLS on cards is in good shape.
- **Fix:** Add rules for `/rackets/g/*`, `/shoes/g/*`, `/balls/g/*` and `/bags/*` with `max-age=604800` (or longer if filenames stay content-addressed). Add `fetchpriority="high"` and a preload for the first hero image only.
- **Effort:** S

### P2 — Font swap and a large global stylesheet

- **Severity:** Medium
- **Where:** `src/layouts/Base.astro` 2–18; `@fontsource-variable/inter` (`font-display: swap` on every face). The package ships 42 woff2 files, about 1.9 MB on disk. Browsers only download the unicode-range they need (Latin variable is about 48 KB), but the CSS enumerates every subset, and `swap` repaints text after the font arrives.
- **Impact:** Layout shift on every page when Inter replaces the fallback. The homepage also loads the AvantLink script and the Cloudflare beacon in `<head>`, which compete with the hero image.
- **Fix:** Import `@fontsource-variable/inter/latin` only (italic too if you use it). Use `font-display: optional` or a size-adjusted fallback so the swap does not move the hero. Preload the one Latin woff2.
- **Effort:** S

### P3 — Inline scripts on every document

- **Severity:** Medium
- **Where:** `src/layouts/Base.astro` 51–137 (saved rackets, account dialog, and on English pages the voice UI, lines 66–99); `src/components/Region.astro`; `src/components/GeoBanner.astro`
- **Impact:** The voice recogniser, compare tray and saved-racket store are parsed on pages that do not need them. There is no code splitting because the scripts are `is:inline`. The geo banner is `position: fixed` and stays in layout while `hidden` (the comment in `GeoBanner.astro` 33–34), so it does not push content. That part is fine.
- **Fix:** Load `describe-voice.js` only after the AI button is used (the parse script already does this). Move the saved-racket store to one external file with a hashed URL so it can be cached (`public/sub.js` is already external; the big block in the layout is not).
- **Effort:** M

### P4 — Price JSON is cached for 24 hours at the edge

- **Severity:** Medium (freshness more than speed)
- **Where:** `prices/src/worker.js` 11, 200–211; `functions/api/_us.js` 4–26; `functions/api/deals.js` 20–60
- **Impact:** A fast repeat view of prices is also a stale view. Combined with B2, a failed merge is stored. Deals use a single cache key (`https://whichpadel.com/__wp_deals_v1`) and `max-age=3600`.
- **Fix:** Cache only non-empty payloads, with a short TTL (minutes, not 24 hours) on the merged response. Let the worker’s own snapshot cache do the long hold.
- **Effort:** S

---

## 5. Dead code and reorganisation

### C1 — `VBags.astro` is never imported

- **Severity:** Low
- **Where:** `src/views/VBags.astro` (the live bag guide is `src/views/parts/BagGuide.astro`, mounted from `src/views/VHub.astro` 17 and 239)
- **Impact:** Two bag-guide implementations. The unused one still has a correct `rel="sponsored nofollow"` shop button. Edits to one will not reach the site.
- **Fix:** Delete `VBags.astro` or make it the only bag article.
- **Effort:** S

### C2 — Route handlers that no longer generate pages

- **Severity:** Low
- **Where:** `src/pages/[...path].astro` 42 (`shoeBrand`); `src/i18n/routes.js` 46–47 (`compare`, `shoeCompare`) and 77 (`shoeBrand`); `src/lib/nav-menu.js` 3 (`wide` is in `SHOE_GUIDES` but `SHOE_LIST_KEYS` drops it, `src/lib/shoes.js` 19–36)
- **Impact:** `pages()` never emits `shoeBrand`, `compare` or `shoeCompare`. Redirects in `public/_redirects` and `src/middleware.js` cover the old URLs. Middleware does not run on Cloudflare Pages static hosting; `_redirects` does, and it is the one that matters in production. The wide-fit slug is maintained in six languages and then hidden.
- **Fix:** Delete the unused view branch. Keep the redirect targets. Remove `wide` from the menu data until the list has enough shoes (`LIST_MIN` is 3 per language).
- **Effort:** S

### C3 — Design gallery is a public URL

- **Severity:** Low
- **Where:** `src/pages/shells.astro` 1–2, 55
- **Impact:** `/shells/` is built and `noindex`. It is still a public page of internal card shells.
- **Fix:** Move it out of `src/pages` or gate it with a build flag.
- **Effort:** S

### C4 — Price-feed adapters are stubs

- **Severity:** Low
- **Where:** `prices/src/feeds.js` 3–5
- **Impact:** Awin, CJ, TradeTracker and Zona de Padel feeds return `[]`. Prices come from HTML fetches in the worker instead. The file documents a path that is not live.
- **Fix:** Delete the stubs until a feed is actually implemented, so nobody assumes Awin prices are ingested.
- **Effort:** S

### Suggested shape

Keep the route map (`src/i18n/routes.js`) as the only URL source. It is already doing that job well (0 duplicate paths).

- Put the root QA scripts (`seoqa.mjs`, `qa.mjs`, `pxqa.mjs`, and the rest) under `scripts/qa/` and call them from `package.json`.
- One price package. `prices/`, `prices-us/`, `prices-shoes/` and `data/us.json` are four sources for one fact. The US snapshot is how B2 happened.
- Split `src/i18n/buying-guides.js` and `src/i18n/lists.js` by page, not by pasting another language into the same file. The dictionary check in `src/i18n/index.js` 20–25 is the right guard; keep it.
- Do not add a new bag or shoe view without deleting the old one (C1).

---

## 6. Test and CI gaps

### T1 — Deploy runs before checks, and checks cannot fail the workflow

- **Severity:** High
- **Where:** `.github/workflows/deploy.yml` 3–42
- **Impact:** A push to any branch, including a docs-only branch, builds and runs `wrangler pages deploy` with `CLOUDFLARE_API_TOKEN`. QA (`curtext`, `mix`, `px`, `seo`, `qa`, `layout`, `pad`, `geo`, `cmp`, `picker`) runs afterwards against a local preview, with `continue-on-error: true`. A red QA step is a warning. `translate-missing.mjs` is allowed to fail. Production `main` only curls three URLs.
- **Fix:** Run unit tests, `translate-missing.mjs`, `seoqa.mjs` and `npm audit --audit-level=high` before `pages deploy`. Remove `|| true` and `continue-on-error` for those steps. Limit `on.push.branches` so audit and dependabot branches do not deploy. Preview deploys should not receive production KV if a branch can change `functions/`.
- **Effort:** M

### T2 — Unit tests exist and pass, and CI does not run them

- **Severity:** Medium
- **Where:** `package.json` `scripts` (only `dev`, `build`, `preview`); test files listed in the introduction
- **Impact:** This audit ran them: 18 passed. They cover shop hrefs, profile scoring, search, account item merging, `safeNext`, price parsing and the snapshot chunker. They do not cover hreflang, the beginner price filter, US snapshot age, or `rel="sponsored nofollow"`.
- **Fix:** `"test": "node --test src/lib/*.test.mjs functions/api/*.test.mjs prices/test/*.test.mjs"` and call it from the workflow before deploy. Add one test that every shop `<a>` template contains `rel="sponsored nofollow"`, and one that `pickL('best-padel-rackets-for-beginners')` excludes null prices.
- **Effort:** S

### T3 — No typecheck, lint, or audit gate

- **Severity:** Medium
- **Where:** `package.json`; `.stylelintrc.json` exists; no `astro check` script; no ESLint config
- **Impact:** `src/` is JavaScript plus Astro, with no `tsc` or `astro check` step. Stylelint is configured and not invoked in CI. `npm audit` is not a required check, which is how Astro 5.18.2 is still current in the lockfile.
- **Fix:** Add `astro check` (even if it starts non-blocking) and `stylelint` on `src/**/*.css` and `src/**/*.astro`. Audit as in T1.
- **Effort:** M

### T4 — Post-deploy QA does not see production headers or the price worker

- **Severity:** Low
- **Where:** `.github/workflows/deploy.yml` 24–42; `seoqa.mjs` 1–4
- **Impact:** QA hits `astro preview` on the runner, not `https://whichpadel.com`. It will not catch a bad `_headers` rule, a preview-worker binding, or a KV write. `seoqa.mjs` also allows the current one-way `en-US` hreflang, so it will not catch B3.
- **Fix:** After a production deploy, fetch `/`, one racket URL, one `/us/` URL and `/api/prices` and assert status, `x-content-type-options`, and a non-empty price body. Update `seoqa.mjs` when B3 is fixed.
- **Effort:** S

---

## Summary

| ID | Severity | Area | Finding | Effort |
|---|---|---|---|---|
| B1 | High | Correctness | Recorded Sept/Oct prices drive lists; product page can show a live price; beginner list allows a missing price | M |
| B2 | High | Correctness | US pages frozen at 23 Oct 2026, FAQ overclaims freshness, bindings target preview workers, one pack URL | M |
| B3 | High | i18n / SEO | `hreflang="en"` on UK pages, self-only `en-US` on `/us/`, not reciprocal | M |
| S1 | High | Security | Unauthenticated email writes; missing Origin allowed; no rate limit | M |
| S2 | High | Security | No CSP, nosniff, referrer policy, or frame policy | S |
| S3 | High | Security | npm audit: 1 critical, 3 high on Astro 5.18.2 (critical path not served) | M |
| T1 | High | CI | Deploy-all-branches before QA; QA cannot fail the job | M |
| S4 | Medium | Security | `localStorage` recently-viewed `innerHTML` | S |
| S5 | Medium | Security | Magic-link flow has no rate limit once `ACCT` is enabled | M |
| B4 | Medium | Correctness | Women’s list includes light non-women’s rackets | S |
| D2 | Medium | Data | 26 bag offers on `ninepadel.com`, absent from `shops.json`; 2 shops lack `affiliate` | S |
| D3 | Medium | Data | 30/33 affiliate templates are `PLACEHOLDER`; `rel="sponsored nofollow"` is present on every shop anchor found | S |
| D4 | Medium | Data | No schema or staleness check on catalogues | M |
| P1 | Medium | Performance | Long cache misses `/rackets/g/` and other galleries | S |
| P2 | Medium | Performance | Full Inter import, `font-display: swap` | S |
| P3 | Medium | Performance | Large inline scripts on every page | M |
| P4 | Medium | Performance | 24h edge cache can store an empty price book | S |
| T2 | Medium | Tests | 18 unit tests pass locally and are not in CI | S |
| T3 | Medium | Tests | No typecheck, stylelint, or npm audit in CI | M |
| B5 | Low | Correctness | No broken literal internal href in `src/` | S |
| B6 | Low | Correctness | Canonical does not force the trailing slash | S |
| B7 | Low | Correctness | Guide and gift copy still say October | S |
| S6 | Low | Security | AvantLink parameter and analytics token committed (lines only, values omitted) | S |
| S7 | Low | Security | JSON-LD `set:html` does not escape `<` | S |
| D1 | High | Data | 1,113/1,432 rackets have no price (same root as B1) | M |
| D5 | Low | Data | Image files on disk match the catalogues | S |
| C1 | Low | Dead code | `VBags.astro` unused | S |
| C2 | Low | Dead code | `shoeBrand` / compare handlers and unpublished wide-fit slug | S |
| C3 | Low | Dead code | `/shells/` is a public noindex gallery | S |
| C4 | Low | Dead code | Price-feed adapters return empty arrays | S |
| T4 | Low | Tests | QA never hits production headers or the price worker | S |

**Affiliate `rel` check.** Pass. Every outbound shop and affiliate anchor found in `src/` has `rel="sponsored nofollow"`. The follow-up is D3: almost all of those links are UTM referrals, not affiliate redirects, and two shops are missing the field entirely.
