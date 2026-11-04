// Racket <title> core ("Nox AT10 Genius 18K Alum Tapia 2026"), kept within the 65-character title budget.
// Shortening drops words, so two variants can end up with the same title (e.g. the Buenos Aires and London
// editions of one racket). titleCore() builds every racket's title once per budget, finds those collisions and,
// for colliding rackets only, keeps the words that tell them apart. Every other title is unchanged.
import { allRackets } from './data.js';

export const titleModel = (r) => {
  let m = String(r.model || '');
  m = m.replace(/\s+by\s+\S(?:.*\S)?$/i, '').trim();
  let disamb = '';
  if (r.player) {
    const esc = String(r.player).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const before = m;
    m = m.replace(new RegExp('\\s+' + esc + '\\s*$', 'i'), '').trim();
    if (before !== m) {
      const parts = String(r.player).trim().split(/\s+/).filter(Boolean);
      disamb = parts.length ? parts[parts.length - 1] : '';
    }
  }
  if (r.year != null) {
    const y = String(r.year);
    const idx = m.search(new RegExp('\\s+' + y + '\\b'));
    if (idx >= 0) {
      const after = m.slice(idx + y.length + 1).trim();
      m = m.slice(0, idx).trim();
      if (after) disamb = after.split(/\s+/).filter(Boolean).pop() || disamb;
    }
  }
  return { core: m || String(r.model || ''), disamb };
};

// The title core as it has always been built: model clipped to the room left by the language template,
// then the player surname (or trailing variant word) and the year.
function plainCore(r, overhead, max) {
  const tm = titleModel(r);
  let bare = tm.core;
  const year = r.year != null ? String(r.year) : '';
  const yearLen = year ? year.length + 1 : 0;
  const disLen = tm.disamb ? tm.disamb.length + 1 : 0;
  if (bare.length + disLen + yearLen + overhead > max) {
    const room = Math.max(8, max - overhead - yearLen - disLen);
    bare = bare.slice(0, room);
    const sp = bare.lastIndexOf(' ');
    if (sp > room * 0.5) bare = bare.slice(0, sp);
  }
  if (tm.disamb) bare = `${bare} ${tm.disamb}`.trim();
  if (year) bare = `${bare} ${year}`.trim();
  return bare;
}

// Words of the full model name (minus "by Player", the player, the year and stray punctuation) in order.
const words = (r) => {
  let m = String(r.model || '').replace(/\s+by\s+\S(?:.*\S)?$/i, '');
  if (r.player) m = m.replace(new RegExp('\\s+' + String(r.player).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i'), ' ');
  if (r.year != null) m = m.replace(new RegExp('\\b' + r.year + '\\b'), ' ');
  return m.split(/\s+/).filter(w => w && /[\p{L}\p{N}]/u.test(w));
};

// For a racket whose title collides: the words its rivals lack are required, so is the year; then the model's
// own words fill the budget in order (brand and line first), and the player surname only if there is room left.
function distinctCore(r, rivals, overhead, max) {
  const tm = titleModel(r);
  const dis = (tm.disamb || '').toLowerCase();
  const own = words(r).filter(w => w.toLowerCase() !== dis);
  const others = rivals.filter(x => x !== r).map(x => new Set(words(x).map(w => w.toLowerCase())));
  // fewest words that tell this racket apart from every rival (greedy set cover, earliest word wins ties)
  const need = new Set(others.map((_, i) => i)); const keep = own.map(() => false);
  while (need.size) {
    let best = -1, hit = [];
    own.forEach((w, i) => { if (keep[i]) return; const h = [...need].filter(k => !others[k].has(w.toLowerCase())); if (h.length > hit.length) { best = i; hit = h; } });
    if (best < 0) break; keep[best] = true; hit.forEach(k => need.delete(k));
  }
  const isKey = w => others.some(o => !o.has(w.toLowerCase()));
  const unique = w => others.every(o => !o.has(w.toLowerCase()));
  // keep multi-word names whole: a kept word's neighbours that no rival has ("Buenos" + "Aires")
  for (let pass = 0; pass < 3; pass++) own.forEach((w, i) => { if (keep[i] && unique(w)) for (const j of [i - 1, i + 1]) if (j >= 0 && j < own.length && !keep[j] && unique(own[j])) keep[j] = true; });
  const year = r.year != null ? String(r.year) : '';
  const room = max - overhead - (year ? year.length + 1 : 0);
  let len = own.reduce((n, w, i) => n + (keep[i] ? w.length + 1 : 0), 0);
  for (let i = 0; i < own.length; i++) if (!keep[i] && len + own[i].length + 1 <= room) { keep[i] = true; len += own[i].length + 1; }
  const disKey = tm.disamb && isKey(tm.disamb) && need.size > 0;
  const withDis = tm.disamb && (disKey || len + tm.disamb.length + 1 <= room);
  return [...own.filter((_, i) => keep[i]), ...(withDis ? [tm.disamb] : []), year].filter(Boolean).join(' ');
}

const cache = new Map();
export function titleCore(r, overhead, max = 65) {
  const key = overhead + '|' + max;
  if (!cache.has(key)) {
    const title = new Map(allRackets.map(x => [x.slug, plainCore(x, overhead, max)]));
    const rivals = new Map(allRackets.map(x => [x.slug, new Set([x])]));
    // Resolve collisions until none are left: each round, rackets sharing a title learn about each other
    // and keep the words that tell them apart.
    for (let round = 0; round < 6; round++) {
      const by = new Map(); for (const x of allRackets) { const t = title.get(x.slug); if (!by.has(t)) by.set(t, []); by.get(t).push(x); }
      const clash = [...by.values()].filter(xs => xs.length > 1); if (!clash.length) break;
      for (const xs of clash) for (const x of xs) { const set = rivals.get(x.slug); xs.forEach(y => set.add(y)); title.set(x.slug, distinctCore(x, [...set], overhead, max)); }
    }
    // Same words, different product: say which one from the slug (rare).
    const by = new Map(); for (const x of allRackets) { const t = title.get(x.slug); if (!by.has(t)) by.set(t, []); by.get(t).push(x); }
    for (const xs of by.values()) if (xs.length > 1) xs.forEach((x, i) => i && title.set(x.slug, `${title.get(x.slug)} ${i + 1}`));
    cache.set(key, title);
  }
  return cache.get(key).get(r.slug) ?? plainCore(r, overhead, max);
}
