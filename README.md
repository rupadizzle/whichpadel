# WhichPadel v1 (local only)
Run: `npm install && npm run build && npx astro preview --port 4321`. Needs Node 22.23.4 or newer (Astro 7); CI uses Node 22. `npm run build` also refreshes FX and prices; `npx astro build` builds pages only.
Data: data/rackets.json (PadelTrue, CC BY 4.0, https://padeltrue.com/data), normalised by data/normalise.py -> data/rackets.normalised.json.
Attribution is required: "Data: PadelTrue (https://padeltrue.com/), CC BY 4.0", adapted. Brand/model names and photos are NOT licensed; no images included.
GBP prices are estimates at EUR->GBP 0.842481 (open.er-api.com, 20 Oct 2026).
Affiliate links: search for data-affiliate="PLACEHOLDER". Newsletter: form in src/layouts/Base.astro (not wired up).
<!-- deploy timing test 2026-10-23 -->
