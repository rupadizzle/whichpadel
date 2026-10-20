# WhichPadel global plan (not built yet)

Goal: one site at https://whichpadel.com that shows prices and shops for the visitor's region: UK (£), EU (€), US ($).

## 1. Keep pages static, make the region a layer on top
- Build every page once (as now). Data per racket gets an `offers` list: `{region: "uk"|"eu"|"us", retailer, url, price, currency, checkedOn, affiliate: true/false}`.
- Default HTML = a neutral version (e.g. EU €, which most dataset prices already are). Google sees one canonical page per racket; region must NOT change the URL for English pages.
- A small client script reads the region (see 2) and swaps the price, currency symbol and "Check price" links to that region's offers. If a region has no offer, show the original-currency price with "≈" converted estimate and a "no UK/US shop found yet" note. Never show a converted price as if it were a shop price.
- FX rates for estimates: refresh at build time, print the rate and date on the page.

## 2. Detecting country on a static host
- **Cloudflare Pages**: Cloudflare adds a `CF-IPCountry` header to requests. A tiny Pages Function / Worker (e.g. `/api/region`, or middleware) reads it and returns `{"country":"GB"}`, or sets a `region` cookie. Static pages stay cached.
- **Vercel**: requests carry `x-vercel-ip-country`; a small Edge Middleware or Edge Function does the same job.
- Map country -> region: GB -> uk; EU/EEA + CH -> eu; US -> us; everyone else -> eu (or us) by default, chosen later.
- **Manual switcher** in the header (🇬🇧 £ / 🇪🇺 € / 🇺🇸 $), saved in a cookie/localStorage. Manual choice always beats geo. Works with no edge function at all (fallback: `navigator.language`).
- Do not redirect by IP (bad for Googlebot, which crawls mostly from the US, and for travellers). Swap content only.
- Geo lookup by IP alone is not personal data storage, but the region cookie is a functional cookie; mention it in the privacy policy (strictly necessary/preference, no consent banner needed if no tracking).

## 3. Retailer links per region (affiliate programmes found so far; verify rates at signup)
- UK: Padel Market UK (Tradetracker), Decathlon UK (Awin), Padel Nuestro (CJ, ships to UK?) - check UK shipping/duties post-Brexit.
- EU/Spain: Zona de Padel, Padel Market (Awin), Padel Nuestro (CJ), Time2Padel.
- US: not researched yet - needs its own search (e.g. US padel shops, Amazon Associates US).
- Use retailer product feeds from the networks (Padel Market's Awin terms forbid scraping).

## 4. Spanish / Portuguese versions + hreflang
- Worth it, but in phase 2, after the English site has traffic. Spain is padel's biggest market and Portugal is strong; Spanish/Portuguese queries ("mejor pala de pádel", "melhor raquete de padel") are separate keyword sets - check volumes with DataForSEO before committing.
- Competition: Spanish-language padel sites are mature (Padelful has `es`, big shops publish guides), so the gain is uncertain.
- Structure: subfolders `/es/` and `/pt/` (Astro i18n routing), translated UI + guide text; specs and numbers come from the same data. Avoid machine-translated thin pages; at least the guides need human review.
- hreflang on every page: `en`, `es`, `pt` (optionally `en-GB`/`en-US` only if content truly differs; with currency swapped client-side, keep one `en`), plus `x-default` -> English. Each language page self-canonical. Astro `@astrojs/sitemap` can emit hreflang in the sitemap.
- Language follows URL, not IP. Offer a "Ver en español" banner based on `Accept-Language`, never auto-redirect.

## 5. Legal
- UK: ASA/CMA "Ad" labelling (done). EU: equivalent consumer-law ad disclosure, GDPR. US: FTC endorsement disclosure ("we may earn a commission") - current wording already covers it.
- Translate disclosure/privacy pages for /es/ and /pt/.

## 6. Order of work
1) offers data model + region switcher (manual only), 2) edge function for geo default, 3) US retailer research, 4) /es/ then /pt/ with hreflang.

---
# Phase 1 status (live 2026-10-20)
- Language = URL subfolder (/ = en-GB, /es/). Region/currency = user setting (localStorage `wp_region`; geo default `wp_geo` from `/api/geo` Pages Function, request.cf.country). Never in the URL; pages stay static + canonical.
- `src/lib/price.js` (REGIONS, pick/best-offer), `src/components/Price.astro` (static default GBP on en, EUR on /es/; hydrated by `src/components/Region.astro`), `data/fx.json` (date-stamped), `data/shops.json` (delivers / unknown / no per region + affiliate placeholder).
- One price, one currency everywhere. Converted prices: dotted underline + title tooltip. Shop known not to deliver → "Check price". Delivery unknown → price still shown (flagged as unknown in shops.json).
- JSON-LD Offer stays in source currency.

# Phase 2 plan: i18n framework and full rollout
## 1. Framework (week 1)
- `src/i18n/{en,es,fr,pt,it,de}.json`: UI string dictionaries (nav, buttons, labels, spec names, shape/balance/core values, rating names, disclaimers, FAQ stems). `t(lang,key,vars)` helper with en fallback + build-time check that every key exists in every enabled language (fail build on missing).
- `src/i18n/routes.js`: per-page-type slug map per language (e.g. rackets→`/es/palas/`, brands→`/es/marcas/`, best→`/es/mejores/`, players→`/es/jugadores/`, compare→`/es/comparador-palas-padel/`). One `alternates(pageType, id)` function generates hreflang for every page (all enabled languages + x-default=en), replacing the manual `alt` prop.
- `Base.astro` takes `lang` and pulls header/footer/newsletter strings from the dictionary (removes the current `es ?` branches).
- Number/price formatting via `Intl.NumberFormat(locale,{currency})` in both build and hydration code.

## 2. Templated generated copy (week 1–2)
- Move generated prose (racket `intro()`, brand intro/FAQ, best-list rules/FAQs, player summaries/FAQs, vs intros/verdicts, 2027 pages) into per-language template functions `copy/<lang>/<pageType>.js` that take the same data stats. Translate templates once (human-reviewed), not per page → stays factual and consistent.
- Hand-written pages (buying guide, Black Friday, tools) get one translated file per language; native-speaker review before indexing.

## 3. Page type rollout order for /es/ (week 2–3)
1. Racket pages `/es/palas/<slug>/` (319) → 2. Brands + 2027 → 3. Best lists → 4. Players → 5. vs pages → 6. Tools, Black Friday, legal (privacy/affiliate in Spanish).
Each step: build, qa, layoutqa, 390px check, sitemap + hreflang check, IndexNow.

## 4. Further languages (week 4+)
- Order by padel demand and affiliate fit: /fr/ (France), /it/ (Italy), /pt/ (Portugal), /de/ (Germany/Austria, smaller market).
- Per language: dictionary + copy templates + keyword research for the money pages (local terms: "raquette de padel", "racchetta da padel", "raquete de padel", "Padelschläger"), default region (FR/IT/PT/DE → EUR).
- Shop data: add local shops per market to `shops.json` with verified delivery countries; multiple offers per racket so `pick()` can choose the best delivering shop.

## 5. Quality gates
- Build fails on: missing i18n key, page without hreflang set, mixed-language UI strings (lint for English stopwords on non-en pages), any "≈" or dual-currency marker.
- Translated pages stay `noindex` until a native review flag is set in the dictionary.

## Phase 2 status (2026-10-20): DONE
- /es/ and /fr/ fully live: every page type, localized slugs, hreflang (en/es/fr + x-default) from src/i18n/routes.js, language switcher in header and footer.
- Add a language: new src/i18n/<lang>.js (checkDicts enforces same keys as es.js), guide-<lang>.js, path entries in routes.js, add it to WP_LANGS.
- Run `node mixqa.mjs` after every copy change.
