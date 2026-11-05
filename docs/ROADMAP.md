# Open work

The one list of what is still to do. Tick items off (or delete them) in the same PR that finishes them.

## How we work

- One job per branch. Merge within a day or two, then the branch is deleted (auto-delete is on).
- Every branch push gets a preview at `https://<branch>.whichpadel.pages.dev`. Check it before merging.
- A long job (more than a few days) merges `main` in every day or two so it never drifts.
- Nothing lives only in a chat thread: if it is not finished, it goes on this list.

## Now

- [ ] **Merge PR #19**: removes `/homepage-2`, `/homepage-3`, `/hero` (301 to `/`) and fixes `_redirects`. Cloudflare silently dropped every rule after the 100th following the first wildcard, so about 90 old URLs returned 404. Wildcard rules now sit at the end, and `scripts/redirectsqa.mjs` fails the build if this happens again.

## Next

- [ ] **Racket and bag photos**: branch `data/fill-gaps-oct29` has photos for about 216 live racket pages that show none, plus 124 bag photos under old names. Bring them onto `main` on a fresh branch, then delete the old branch.
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
