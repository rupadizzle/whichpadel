# WhichPadel standing rules (from Rupert)

1. No shortcuts. Thorough process every time, even if slower.
2. Never name or link any data source. Only exception: one plain-text, unlinked CC BY line on the English About page (remove once data is rebuilt from other sources). Not in footer; nothing links to About for it.
3. No outbound links except shop ("Check price") buttons.
4. One currency per view. Currency is user-selectable; the visitor's location decides which shops show.
5. One shared component per page type for every language. No per-language copies, cut-down views or shortcuts. Strings live only in `src/i18n/*`. See I18N.md.
6. Flat, compact design with consistent spacing, no overlaps.
7. Measure layout in code (layoutqa.mjs, parity.mjs), never by eye alone.
8. Mobile-first QA (360/390/412/768) before saying anything is fixed.
9. Never print tokens or secrets.
10. Deploy only via `./deploy.sh` (build → QA → preview → QA on preview → main).
