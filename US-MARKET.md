# US market (preview, feat/us-market)

## Prices
- Separate preview Worker `whichpadel-us-prices-preview` + D1 `whichpadel-us-preview` (prices-us/). Same engine as production
  (robots, parser, sanity checks, recheck 8h, hide after 48h). Production Worker/D1 untouched.
- Pages functions `/api/prices` and `/api/shoe-prices` append the US offers (functions/api/_us.js).
- Static pages use the snapshot `data/us.json` — refresh before each build: `node prices-us/snapshot.mjs`.
- Strict US rule (Region.astro `STRICT`): in the US a shop counts only if it delivers to the US AND the offer is in USD.
  No converted EU prices. If none: "No US shop yet".

## Shops
| Shop | Status |
|---|---|
| USA Plays Padel (usaplayspadel.com) | live — terms/robots allow, USD |
| Padel Pro Shop US store (padelproshop.com/en-us, ?currency=USD) | live — USD, ships to US |
| Padel USA | skipped (terms) — needs a feed |
| Tennis Warehouse, Padelcart (NOX US), Casas Padel, Holabird, Tennis Express, Racket Central, Padelmarket US, Amazon, Dick's | skipped (terms forbid bots / blocked) — feed/affiliate only |
| PDH Sports | GBP only on /en-us → excluded by USD rule |

Affiliate links for the two live shops are plain links until programmes are approved.

## Hreflang (decision)
- Shared English pages stay one set (`en` + x-default), no en-GB/en-US split: same URL, prices localise in the browser, so
  an en-US alternate to the same content adds nothing and risks duplicate signals.
- `/us/...` pages are unique US content (USD-only lists): self-canonical, `lang="en-US"`, a single self `hreflang="en-US"`,
  no translated twins. These pages always open in US/USD (without changing the saved choice).
- Pages are published only with >= 3 real items; under-$X pages that would repeat a smaller one are dropped.
- Balls page deferred (no balls catalogue yet). Shoe pages appear once >= 3 US shoes are in stock.
