# SEO push (20 Oct 2026) — NOT deployed

## SERP findings (DataForSEO, Google UK, desktop, en)
- **padel racket** (90.5k, KD 8): mixed intent. YouTube explainer #1, padelreference.com (comparison DB) #2, tennisnuts list #3, padelunderground.co.uk "no-affiliate buying guide by level" #4, rest are shop category pages and racketguide.com. Weak SERP: a deep guide + database can rank. PAA: good beginner racket, why expensive.
- **best padel racket**: coach-picks articles (padelandtennis.co.uk), shop lists, ukpadel.org budget article, Reddit, YouTube. PAA: cost, number one racket.
- **padel racket for beginners**: shop category pages + Decathlon "how to choose" + padelmarket guide + Guardian. PAA: "what shape for beginners", "beginner vs intermediate".
- **best padel racket 2026**: listicles (sportofpadel, padelunderground, padeldrivers, carbopadel), YouTube.
- **brand terms** (adidas/babolat/nox): brand official sites + UK shops + padelful.com brand pages ("Reviews, Ratings & Best Prices"), a few "top 5 [brand]" articles. PAA: "Is X a good brand", "Which X racket is best", "What country is Nox from" → answered in new brand FAQs.
- Winners: long buyer's guides by level (1.5–3k words) with tables, plus brand pages with model lists. Head/Bullpadel/Wilson SERPs not pulled (time).

## New files
| File | URL | Target keywords |
|---|---|---|
| src/pages/padel-rackets.astro | /padel-rackets/ | padel racket(s), padel racket uk, how to choose, shapes (~2,280 words, Article+FAQPage+Breadcrumb, 10 FAQs, 5 data tables) |
| src/pages/best/best-padel-racket-2026.astro | /best/best-padel-racket-2026/ | best padel racket 2026, best padel racket (188 qualify) |
| src/pages/best/best-intermediate-padel-rackets.astro | /best/best-intermediate-padel-rackets/ | best intermediate padel racket (32) |
| src/pages/best/best-advanced-padel-rackets.astro | /best/best-advanced-padel-rackets/ | best padel racket advanced (93) |
| src/pages/best/best-cheap-padel-rackets.astro | /best/best-cheap-padel-rackets/ | cheap / cheapest padel racket (≤£80, 44) |
| src/pages/best/best-womens-padel-rackets.astro | /best/best-womens-padel-rackets/ | women's padel racket (13 brand-labelled W/Woman/Mujer models) |
| src/seo/BestPage.astro | — | shared template for the 5 lists (ItemList+FAQPage+Breadcrumb) |
| src/lib/seo-content.js | — | extraLists, brand copy+FAQ (adidas, babolat, nox, head, bullpadel, wilson), guide stats |
| data/vs-plan.json | — | 17 curated vs pairs (validated slugs), proposed URL /compare/{a}-vs-{b}/ |

**Pink padel racket (1.9k):** NOT built — dataset has no colour field. Needs colour data (from images/shop feeds) first.

## Edited (allowed scope)
- src/pages/sitemap.xml.js: adds /padel-rackets/ + 5 new best lists (359 URLs).
- src/pages/brands/[brand].astro: optional brandContent() → extra intro sentence, data facts line, FAQ section + FAQPage schema (only for the top 6 brands; others unchanged).

## TODO for merge (shared files I did NOT touch)
1. **Base.astro header/footer**: add "Buying guide" → /padel-rackets/ in nav; footer links to all 5 new best lists.
2. **index.astro**: link "How to choose a padel racket" → /padel-rackets/ near quiz/hero; add new lists to any "best lists" block.
3. **lib/data.js `lists`**: optionally merge `extraLists` so best/[list].astro "Other buying guides" links to the new 5 (or import extraLists there). Avoid duplicate slugs.
4. **rackets/[slug].astro**: add a link to /padel-rackets/ and to the relevant level list (by shape: round→beginners, teardrop/hybrid→intermediate, diamond→advanced; women's models→womens list).
5. **brands/index.astro**: link to /padel-rackets/#brands.
6. Build curated vs pages from data/vs-plan.json (static compare pages with verdict + table).
7. Next: Head/Bullpadel/Wilson SERP pull; "padel racket shapes" (390), "teardrop padel racket" (720), "cork padel racket" landing pages; submit sitemap in Search Console.

## 2026-10-20 15:30 deploy
- 17 vs pages live at /compare/<a>-vs-<b>/ (src/lib/vs.js, src/pages/compare/[pair].astro), in sitemap, linked from racket pages; /compare/?r= gets JS noindex.
- Data-derived intros+FAQs for all brands (genericCopy in seo-content.js).
- CF Web Analytics site created (site_tag 6cdfdc00212645bda041a36611804bf2), beacon in Base.astro.
- Spanish: /es/, /es/palas-padel/, /es/mejores-palas-padel/, /es/comparador-palas-padel/ with hreflang (Base alt prop). Racket pages still EN only.
- IndexNow key public/814cced742bc4ab48dd4a4ccaefbefbf.txt; 380 sitemap URLs submitted (200).

## 2026-10-20 15:40 batch 2 deploy
- /players/ + 38 player pages (player field joined from data/rackets.json; name aliases merged in data.js ALIAS). Header/footer link; "Used by" on racket pages.
- valueScore in data.js (VALUE_FORMULA); /best/best-value-padel-rackets/ (+methodology), most-comfortable, most-powerful lists.
- Homepage swipe rows (v8.css .hrow, contained scroller). Mobile nav: scrollable, Racket finder first.
- IndexNow: 44 new URLs submitted (200).

## 2026-10-20 15:50 batch 3 deploy
- /brands/<b>/2027/ for Nox, Bullpadel, Vibora, StarVie, Siux, Oxdog (src/lib/extra.js y27; 2026 match = same model name minus years/version numbers, exact match only). [brand].astro moved to brands/[brand]/index.astro.
- /tools/real-weight/ (head-feel index = avg weight × (balance cm − 10) ÷ 100; word balances mapped low 25.5/medium 26.5/high 27.5).
- /black-friday-padel-rackets/ (recorded prices, value tiers, tips, placeholder alert). In Best lists menu + home chips.
- IndexNow: 32 URLs (200).

## 2026-10-20 16:15 global phase 1 deploy
- Region picker + /api/geo Pages Function (functions/api/geo.js), price.js/Price.astro/Region.astro, data/fx.json, data/shops.json. No ≈ anywhere (qa.mjs checks). Offer schema in source currency on racket pages. GLOBAL.md phase 2 plan written. IndexNow full sitemap resubmitted.

## 2026-10-20 Phase 2: Spanish live
- i18n framework: src/i18n (routes.js route map + hreflang, es.js/fr.js dicts, checkDicts build check), catch-all src/pages/[...i18n].astro + src/views/V*.astro, mixqa.mjs (mixed-language check).
- /es/ full: 427 indexable pages + /es/404.html. Deployed (build with WP_LANGS=en,es), IndexNow 200 for 427 URLs.
- Next: fr.js translation (currently Spanish copy), guide-fr.js, build with WP_LANGS=en,es,fr.
- 2026-10-20 ~16:55 Lisbon: /fr/ live (427 + /fr/404.html), French pillar /fr/raquette-padel/ (targets "raquette padel" 49.5k, "raquette de padel" 9.9k). Default build now en,es,fr. IndexNow 200 for all 1281 sitemap URLs.
- QA: qa.mjs clean, layoutqa 0 violations (incl. 27 es/fr pages), mixqa.mjs clean (0 mixed-language issues).
- Fixes along the way: Astro hoisted the racket spec table out of <table> (added <tbody>); localized racket image alt/labels; material strings translated via terms.mat (also in compare client via TX.FM); PadelTrue CC BY attribution added to es/fr footers; duplicate player slug deduped in sitemap.
