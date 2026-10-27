# WhichPadel live prices (free-tier design)

Plain-English overview for anyone touching the price workers. Full runbook and estimates: `/workspace/library/engineering/whichpadel-prices.md`.

## What visitors see

Same as before:

- Current offers per shop, filtered to the visitor’s country
- Cheapest in-stock first
- 90-day price history chart (where shown)
- List / compare / deals pages, shoes, balls, bags, US offers

Prices refresh about **once per day**.

## What was wrong

Every product page asked `/api/prices`, and on each edge-cache miss the worker ran a full SQL JOIN over **all** `price_observations` for the last 90 days. That cache lived only 15 minutes **per Cloudflare colo**. Crawlers × 11k pages × many colos burned through D1’s free **5 million row reads/day**, and Cloudflare blocked further reads until midnight UTC.

## New design (stays on Workers Free)

1. **Daily check (cron)** — one trigger `*/2 * * * *` processes **3 oldest-due offers** per run (~720 runs/day ≈ 2,160 checks, enough for ~1,200–1,500 offers once/day). Fits free limits: 50 external subrequests/invocation, 5 cron triggers/account.
2. **Lean history** — write a `price_observations` row only when price/stock changes, or once per ~20h heartbeat (so charts and 90-day lows stay correct). Prune rows older than 90 days in small batches.
3. **Prebuilt snapshot** — after checks, about once per day the worker builds the same JSON the site already consumes and stores it in D1 table `price_exports` (chunked under D1’s 2 MB row limit).
4. **Page views never full-scan** — `/api/prices` reads the snapshot (a few rows) and edge-caches it for **24 hours** (`?v=snap-<built_at>`). List/compare clients are unchanged.

## Workers

| Worker | Role |
|--------|------|
| `whichpadel-prices` | EU/UK racket (+ shared engine) production route `whichpadel.com/api/prices` |
| `whichpadel-shoe-prices-preview` | Shoes/balls/bags D1 (preview URL) |
| `whichpadel-us-prices-preview` | US offers D1 (preview URL) |

Shoes and US re-use `prices/src/worker.js` (and the snapshot module). Pages Functions `functions/api/all-prices.js` / `shoe-prices.js` merge EU + US as before.

## Go-live needs Rupert’s OK

Merging this PR **does not** change live prices by itself. Still required, in order:

1. D1 migration `prices/migrations/0001_free_tier_snapshot.sql` on each prices database  
2. `wrangler deploy` for `prices/`, and the shoes/US workers if those previews should follow  
3. One snapshot rebuild (cron within ~20h, or `POST /api/prices/rebuild` with `REBUILD_SECRET`)

See the library doc for the exact commands and rollback.

## Roadmap

- **365-day trailing history** — deferred (Rupert, 27 Oct 2026); keep 90 days for now  
- **Workers Paid (~$5/mo)** — if free cron CPU (10 ms), 100k Worker requests/day, or 5-cron/account limits are outgrown  
