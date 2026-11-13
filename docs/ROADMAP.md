# Open work

The one list of what is still to do. Tick items off (or delete them) in the same PR that finishes them.

## How we work

- One job per branch. Merge within a day or two, then the branch is deleted (auto-delete is on).
- Every branch push gets a preview at `https://<branch>.whichpadel.pages.dev`. Check it before merging.
- A long job (more than a few days) merges `main` in every day or two so it never drifts.
- Nothing lives only in a chat thread: if it is not finished, it goes on this list.

## Now

- [ ] **Merge the spec-fills PR**, then delete the `data/fill-gaps-oct29` branch on GitHub. Everything worth keeping from it is then on `main`.
- [ ] **Visual refresh**: needs a direction first (see below).
- [ ] **Set up accounts (sign-in and synced saved lists).** Create the `whichpadel-accounts` D1 database and Cloudflare Email Sending for `noreply@whichpadel.com`, bind both in `wrangler.toml` (`ACCT`, `EMAIL`), then set `ACCOUNTS = true` in `src/lib/features.js`. Until then `/api/auth/*`, `/api/saved`, `/api/news` and `/api/alert` return 503, Sign in is hidden, and price alerts and Black Friday signups go to `/api/subscribe` (#34).
- [ ] **Test a real signup on a phone.** Since #32, Turnstile loads only when a form nears the screen and shows only if Cloudflare needs an interaction. Submit the footer newsletter and a racket price alert once on whichpadel.com and confirm both arrive. (Automated test browsers get no Turnstile token, before or after #32, so this needs a real device.)
- [ ] **Fill racket specs and shop links.** Only 319 of 1,432 rackets have ratings, shop links and an indexed page; balance is missing on more than half. Biggest gaps by brand are in `PAUSED.md`. This is the main lever for traffic and income.
- [ ] **About page translations are shorter than English.** English has four headed sections; es/fr/pt/it/de have one. `qa/parity.mjs` flags it on every run.
- [ ] **Missing-spec sentence contradicts the specs on some rackets.** Example: Siux Obsidian Elite 2027 says the core and weight are not published, while the same overview gives 360 g and EVA Soft. Check how `inputsMissing` is built in the racket data.
- [ ] **Local Node is too old.** Astro 7 needs Node 22.23.4 or newer (`engines` in `package.json`); the default local Node is 20.19. Run `nvm install 22 && nvm alias default 22`.

## Decided

- **Prices from `data/fill-gaps-oct29` are not used.** 957 prices and shop links checked around 29 Oct would add Buy buttons and affiliate links on week-old prices. Those rackets get prices through the normal price checks instead.
- **Confirming a country never changes the page language** (#32). Country sets currency and shops; language changes only through the language picker.
- **Mobile racket pages show the price alert twice** (#32): the in-page panel and a lime "Alert me" button in the bottom bar. The alert form is a bottom sheet on phones.
- **Black Friday's "today's prices" link is English-only**: `VBf.astro` links to `/deals/` and the other languages leave the `now` string empty. `qa/parity.mjs` reports it; that is expected unless the link is localised.
- **Shoe wide-fit and Vibram flags from that branch are not used.** They marked 89 standard models (e.g. Asics Gel Dedicate) as wide, which looks scraped from "also available in wide" text.

## Visual refresh plan

On its own branch:
  1. Agree a direction: 2–3 reference sites, plus what feels wrong today.
  2. Mock options on `/shells` (noindex design board).
  3. Change `tokens.css` and `components.css` first, then check each page type (home, catalogues, product, compare, guides) at 360/390/412/768/1280 on the preview.
  4. Merge in one go, so the live site is never half old and half new.
