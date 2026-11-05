# Open work

The one list of what is still to do. Tick items off (or delete them) in the same PR that finishes them.

## How we work

- One job per branch. Merge within a day or two, then the branch is deleted (auto-delete is on).
- Every branch push gets a preview at `https://<branch>.whichpadel.pages.dev`. Check it before merging.
- A long job (more than a few days) merges `main` in every day or two so it never drifts.
- Nothing lives only in a chat thread: if it is not finished, it goes on this list.

## Now

- [ ] **Merge the photos PR**: 695 racket photos (from `data/fill-gaps-oct29`) for pages that show none, plus the 124 bag photos that bag pages already pointed at but were missing (broken images). It also corrects the Siux Empire photo and drops a wrong Wilson Cupra V2 photo. Keep `data/fill-gaps-oct29` until the decision below is made.

## Decide

- [ ] **Price and spec fills from `data/fill-gaps-oct29`**: that branch also fills gaps in `data/rackets.normalised.json` and `data/shoes.json`:
  - prices and shop links for 957 rackets that have none, checked around 29 Oct. They would add Buy buttons, affiliate links and Google price data, so check they are still current first;
  - balance for 429 rackets, plus a few core, weight, face and year values;
  - sole, year, wide-fit and cushioning details for about 100 shoes.

  It removes one price (one racket). Not merged: the photos PR takes only photos. Once this is decided (merge the fills or drop them), delete the branch.

## Next

- [ ] **Design tidy-ups** (see `docs/DESIGN-SYSTEM.md`):
  - Move the page-specific rules out of `src/styles/components.css`: home hero counts, saved-page placeholders, and the link-pill `line-height` that is set twice.
  - Remove the legacy aliases at the end of `src/styles/tokens.css` once nothing uses them.
  - Home page layout shift at 1280px (about 0.017 CLS under load; target 0).

## Later

- [ ] **Visual refresh**, on its own branch:
  1. Agree a direction: 2–3 reference sites, plus what feels wrong today.
  2. Mock options on `/shells` (noindex design board).
  3. Change `tokens.css` and `components.css` first, then check each page type (home, catalogues, product, compare, guides) at 360/390/412/768/1280 on the preview.
  4. Merge in one go, so the live site is never half old and half new.
