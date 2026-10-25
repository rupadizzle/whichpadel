# Paused 25 Oct 2026

Two pieces of work are stopped on purpose. Neither is live on the site.

## Do not

- Edit or delete `data/rackets.json`, `data/rackets.normalised.json`, or `data/normalise.py`. Those are the PadelTrue path. Revert ratings by leaving `RATING_MODE` as `'padeltrue'` in `src/lib/rating-mode.js`.
- Set `RATING_MODE` to `'traits'`. Pages do not read that file yet. Flipping it would thin the 319 scored rackets.
- Copy `data/source-urls.json` back into the catalogue until a racket’s new review is as useful as the current one.
- Treat a millimetre balance as low, medium, or high. `src/lib/hub.js` `balN` still does that for the old lists. The new model must not.
- Impute a missing spec as average. Leave it blank.

## Source URLs

`node scripts/match-sources.mjs` reads `data/catalogue-urls.json` (sitemap cache, about 3 MB) and writes `data/source-urls.json`. It does not edit the catalogue. `--refresh` downloads the sitemaps again.

Match rules are in `prices/match/match.mjs`: brand, every model token, and year must agree. A shop id such as `/7463-name` is ignored. Brand sites with no brand in the path (Nox, StarVie, Wilson, and the other keys in `HOST_BRAND` inside the script) are credited with their own brand. Accessory pages (bags, keychains, grips, pickleball, beach tennis) are dropped. A colour or model word on the page that is not in the slug (`blue`, `play`, `mujer`, `light`) rejects the page.

Counted on 25 Oct 2026:

- 1,432 rackets.
- 724 have at least one product URL. 515 of those have more than one.
- 258 of the 961 that had no URL anywhere gained one.
- 708 are still in `missing` inside `data/source-urls.json`. Largest gaps: Siux 107, Drop Shot 66, Bullpadel 65, StarVie 52, Wilson 42, Nox 39, Kuikma 32.

Shops already fetched: Padel Nuestro, All For Padel (current English racket category only, about 106 products), Zona de Padel `.es` and `.nl`, Street Padel, Siux, Nox, StarVie, Oxdog, Kombat, Drop Shot store, Vibora, Royal Padel, Padel-Point, Padel Pro Shop, PDH Sports, Wilson. Vibora’s sitemap matched nothing useful. Babolat’s French product sitemap has no padel rackets. Bullpadel.com returned a Cloudflare challenge. Head.com returned 429. Kuikma is Decathlon and was not crawled.

A yearless page is kept for the newest racket whose whole name is on that page. If the newer model adds a word the page does not use, the older racket keeps the URL. StarVie Metheora is an example: `starvie.com/products/pala-metheora` is attached to the 2024 model because the later slugs say “plus”.

`data/spec-checks.json` is a separate balance-line fetch (106 pages, 25 Oct 2026). It is not applied. 29 lines were usable words, 39 were millimetres only, 34 were not a spec, 4 came back HTTP 403.

## Traits, not wired up

`src/lib/profile.js` and `src/lib/profile.test.mjs` (`node --test src/lib/profile.test.mjs`). Three ordinal traits, not 0–100 bars.

- Head is the published shape: round, hybrid, teardrop, diamond.
- Swing needs a balance word (low, medium, or high) and `weightMax`. Balance is 0, 1, or 2. Weight is 0 under 355 g, 1 from 355 to 370 g, 2 above 370 g. Sum 0–1 is easy, 2 is moderate, 3–4 is demanding. Maxima within 5 g tie.
- Feel maps soft, medium, and hard to soft, medium, and firm. `medium-soft` and `medium-hard` stay blank until that brand’s foam map is passed in. Face material does not move feel.
- Suit sentence, first match: round + easy or moderate + soft → beginners; teardrop or hybrid + moderate + medium → all-round; diamond + demanding + firm → attack; any head + easy + soft → lighter softer setup.
- Lists stay filter plus one sort. The quiz, when built, is step distance on these three ladders. Value is a price cap on a fit list.

Coverage if this were turned on today is too thin (about 114 rackets with all three traits, about 41 with a suit line). Do not turn it on.
