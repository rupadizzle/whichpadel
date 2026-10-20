# WhichPadel shops & price engine plan (2026-10-20)

Data: research/shops-candidates.json (20 candidates). Verified = Awin profiles for Padel-Point DE/FR and Padel Market, NINEPADEL affiliate page. Everything else (shipping countries, commissions) must be confirmed at signup; shipping pages were not fetchable from here.

## 1. Recommended 12 shops (fewest signups: Awin, CJ, AvantLink, 2 direct, Amazon)
| Shop | Network | Countries |
|---|---|---|
| Padel Nuestro | CJ | ES PT FR IT DE NL BE IE GB SE US(?) |
| Padel Market | Awin | ES IT SE GB PT FR DE NL BE IE |
| Padel-Point DE / FR / UK | Awin | DE AT NL BE FR GB ES IT SE |
| Zona de Padel | direct | ES PT FR IT DE NL BE GB IE |
| NINEPADEL | direct (public feed) | GB IE |
| Decathlon UK + EU | Awin | GB FR ES IT DE NL BE PT |
| Time2Padel | Awin | GB |
| Holabird + Tennis Warehouse | AvantLink | US |
| Amazon UK/ES/US | Associates (later) | GB ES US |

Coverage matrix: GB 7, IE 4, ES 6, PT 5, FR 5, IT 5, DE 5, NL 5, BE 5, SE 3, US 3.
Gaps: Sweden thin (add Adtraction shop, e.g. Padelzon); US thin & padel-specific shops (Padel USA) unknown programme; Ireland relies on EU shops' shipping. Amazon gives no feed (PA-API needs 3 sales) -> phase 2.

## 2. Price engine (all free tier, £0)
- GitHub Actions cron daily 05:00 UTC (or Worker cron): download Awin (product feed API), CJ (Product Search API), AvantLink datafeed, NINEPADEL XML. No scraping of shops whose terms ban it (Padel Market: feed images only).
- Matching: 1) EAN/GTIN exact vs rackets.json (store learned EANs); 2) normalised brand + model tokens + year (strip "padel racket", colours, sizes), score >=0.9 auto, 0.75-0.9 -> research/review-queue.csv, else drop. Safeguards: price sanity band (±50% of median for that racket), reject junior/"pack"/"bundle"/used, one offer per shop per racket, manual overrides file matches.overrides.json, weekly report of match rate.
- Storage: Cloudflare D1 (free 5GB): offers(racket_id, shop, country, price, currency, in_stock, url, seen_at) and price_history(racket_id, shop, date, price, currency) append-only. Country set comes from shop config (ships_to), not feed.
- Serving: tiny Worker /api/offers?racket=&country= (cached 1h) + nightly static export offers-by-country/{CC}.json for listings. Rebuild not needed daily.
- Front end: country from picker/CF-IPCountry; hide rackets with zero in-stock deliverable offers, "Show all rackets" toggle; racket page shows best price + up to 3 shops, "Not sold in your country" fallback; 90-day price chart from history (inline SVG). Stale offers (>48h) hidden.
- Costs: GitHub Actions free, D1/Workers free tiers, networks free = £0.

## 3. Owner to-do (in order)
1. Give name, email, country, individual/company (needed for all).
2. Awin publisher signup (~£5 refundable deposit may be asked - confirm) -> apply Padel Market, Padel-Point DE/FR/UK, Decathlon, Time2Padel.
3. CJ publisher signup -> apply Padel Nuestro.
4. Approve email to Zona de Padel + NINEPADEL code signup.
5. AvantLink signup (US) -> Holabird, Tennis Warehouse.
6. Later: Amazon Associates UK/ES/US; Adtraction for Sweden.
7. Then give API keys (Awin, CJ) to set as secrets.
