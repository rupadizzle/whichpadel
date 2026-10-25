// Black Friday cuts: cheapest in-stock shop vs dearest, same currency.
// Not a crossed-out launch price. Live offers come from /api/all-prices.
import fx from '../../data/fx.json';

const MIN = 0.15;
const conv = (n, from, to) => n / fx.rates[from] * fx.rates[to];

let hit = null;

export async function loadPriceMap() {
  if (hit && hit.exp > Date.now()) return hit;
  try {
    const r = await fetch('https://whichpadel.com/api/all-prices', { signal: AbortSignal.timeout(15000) });
    if (!r.ok) throw new Error(String(r.status));
    const j = await r.json();
    hit = { exp: Date.now() + 10 * 60 * 1000, map: j.r || {}, updated: j.updated || '' };
  } catch {
    if (!hit) hit = { exp: Date.now() + 30 * 1000, map: {}, updated: '' };
  }
  return hit;
}

export function bfDeals(map, rackets, cur) {
  const out = [];
  for (const r of rackets) {
    if (!r.image || r.audience === 'junior') continue;
    const os = (map?.[r.slug]?.o || []).filter(o => o && o.p > 0 && o.s !== 0 && o.c && fx.rates[o.c]);
    const groups = {};
    for (const o of os) (groups[o.c] ??= []).push(o);
    let best = null;
    for (const [c, arr] of Object.entries(groups)) {
      if (arr.length < 2) continue;
      let lo = arr[0], hi = arr[0];
      for (const o of arr) {
        if (o.p < lo.p) lo = o;
        if (o.p > hi.p) hi = o;
      }
      if (!(hi.p > lo.p)) continue;
      const cut = (hi.p - lo.p) / hi.p;
      if (cut < MIN || cut > 0.62) continue;
      const pref = c === cur ? 1 : 0;
      if (!best || pref > best.pref || (pref === best.pref && cut > best.cut)) best = { c, lo, hi, cut, n: arr.length, pref };
    }
    if (!best) continue;
    const local = conv(best.lo.p, best.c, cur);
    out.push({
      r, cut: Math.round(best.cut * 100), lo: best.lo.p, hi: best.hi.p, c: best.c, n: best.n,
      loName: best.lo.n || best.lo.d || '', hiName: best.hi.n || best.hi.d || '',
      local, band: local <= 100 ? '0' : local <= 200 ? '1' : '2',
    });
  }
  out.sort((a, b) => b.cut - a.cut || b.n - a.n || a.local - b.local);
  return out.slice(0, 30);
}
