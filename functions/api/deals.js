import { merged } from './_us.js';

const MIN_DAYS = 21, MIN_PTS = 10, DAY = 864e5;
const med = a => { const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
function verdict(e) {
  if (!e || !Array.isArray(e.h) || e.h.length < MIN_PTS || !(e.p > 0)) return null;
  const h = e.h.filter(x => x && x[1] > 0), span = (Date.parse(h[h.length - 1][0]) - Date.parse(h[0][0])) / DAY;
  if (h.length < MIN_PTS || span < MIN_DAYS) return null;
  const cur = e.p, past = h.slice(0, -1).map(x => x[1]), usual = med(past), low = Math.min(...past);
  const pct = Math.round((1 - cur / usual) * 100);
  const cutoff = Date.parse(h[h.length - 1][0]) - 30 * DAY, recent = h.slice(0, -1).filter(x => Date.parse(x[0]) >= cutoff).map(x => x[1]);
  const peak = recent.length ? Math.max(...recent) : 0;
  if (peak > usual * 1.08 && cur >= usual * 0.95 && cur < peak * 0.97) return { k: 'inflated', pct };
  if (cur <= low && pct >= 3) return { k: 'lowest', pct };
  if (pct >= 10) return { k: 'drop', pct };
  if (pct >= 3) return { k: 'small', pct };
  return { k: 'normal', pct };
}
const card = (c, e, pct) => ({ k: c.s, kind: c.k, m: c.m, b: c.b, y: c.y, u: c.u, i: c.i, p: e.p, c: e.c, shop: e.n || e.d || '', pct: pct || 0, s: e.s });
const HDR = { 'content-type': 'application/json', 'cache-control': 'public, max-age=3600' };

export async function onRequestGet(ctx) {
  try {
    const cache = caches.default;
    const key = new Request('https://whichpadel.com/__wp_deals_v1');
    const hit = await cache.match(key);
    if (hit) return hit;
    const origin = new URL(ctx.request.url).origin;
    const cat = await fetch(origin + '/deals-cat.json').then(r => r.ok ? r.json() : null).catch(() => null);
    if (!cat) return new Response(JSON.stringify({ cut: [], real: [], low: [] }), { headers: HDR });
    const [pr, sh] = await Promise.all([
      merged(ctx.env, 'PRICES', '/api/prices', '/api/prices', ctx).then(r => r.clone().json()).catch(() => null),
      merged(ctx.env, 'SHOES', '/api/prices', '/api/shoe-prices', ctx).then(r => r.clone().json()).catch(() => null),
    ]);
    const items = [];
    for (const j of [pr, sh]) {
      for (const [k, e] of Object.entries((j && j.r) || {})) {
        const c = cat[k];
        if (c && e && e.p > 0) items.push({ c, e, v: verdict(e) });
      }
    }
    const inS = items.filter(x => x.e.s !== 0);
    const take = (xs, pctOf) => {
      const byKind = { r: [], s: [], g: [], b: [] };
      for (const x of xs) {
        const arr = byKind[x.c.k];
        if (arr && arr.length < 12) arr.push(card(x.c, x.e, pctOf(x)));
      }
      return [...byKind.r, ...byKind.s, ...byKind.g, ...byKind.b];
    };
    const byDrop = [...inS.filter(x => x.e.drop >= 5)].sort((a, b) => b.e.drop - a.e.drop);
    const byPct = xs => [...xs].sort((a, b) => (b.v?.pct || 0) - (a.v?.pct || 0));
    const out = {
      cut: take(byDrop, x => x.e.drop),
      real: take(byPct(inS.filter(x => x.v && (x.v.k === 'drop' || x.v.k === 'lowest'))), x => x.v.pct),
      low: take(byPct(inS.filter(x => x.v && x.v.k === 'lowest')), x => x.v.pct),
    };
    const res = new Response(JSON.stringify(out), { headers: HDR });
    const put = cache.put(key, res.clone());
    if (ctx.waitUntil) ctx.waitUntil(put); else await put;
    return res;
  } catch {
    return new Response(JSON.stringify({ cut: [], real: [], low: [], err: true }), { status: 200, headers: HDR });
  }
}
