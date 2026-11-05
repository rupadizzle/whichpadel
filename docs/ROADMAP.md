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

## Decided

- **Prices from `data/fill-gaps-oct29` are not used.** 957 prices and shop links checked around 29 Oct would add Buy buttons and affiliate links on week-old prices. Those rackets get prices through the normal price checks instead.
- **Shoe wide-fit and Vibram flags from that branch are not used.** They marked 89 standard models (e.g. Asics Gel Dedicate) as wide, which looks scraped from "also available in wide" text.

## Visual refresh plan

On its own branch:
  1. Agree a direction: 2–3 reference sites, plus what feels wrong today.
  2. Mock options on `/shells` (noindex design board).
  3. Change `tokens.css` and `components.css` first, then check each page type (home, catalogues, product, compare, guides) at 360/390/412/768/1280 on the preview.
  4. Merge in one go, so the live site is never half old and half new.
