// Compact shoe, ball and bag cards for the kit finder. Live prices overlay these from /api/shoe-prices.
import { shoes, shoeImg } from '../lib/shoes.js';
import { balls, ballImg } from '../lib/balls.js';
import { bags, bagImg } from '../lib/bags.js';
const off = x => (x.offs || []).filter(o => o.p > 0 && typeof o.u === 'string' && o.u.startsWith('https://')).slice(0, 8).map(o => ({ d: o.d, p: o.p, c: o.c, u: o.u, s: o.s ? 1 : 0 }));
export function GET() {
  const out = {
    shoes: shoes.map(s => ({ s: s.slug, b: s.brand, m: s.model, g: s.gender, y: s.year || 0, so: s.sole || [], cu: (s.cushion && s.cushion[0]) || '', i: shoeImg(s) || '', px: s.slug, o: off(s) })),
    balls: balls.map(b => ({ s: b.slug, b: b.brand, m: b.model, sp: b.speed, tr: b.tour || '', i: ballImg(b) || '', px: 'ball-' + b.slug, o: off(b) })),
    bags: bags.map(b => ({ s: b.slug, b: b.brand, m: b.model, y: b.year || 0, t: b.type === 'backpack' ? 'pack' : 'bag', rk: b.rackets ?? null, th: b.thermal || '', sh: b.shoe || '', i: bagImg(b) || '', px: b.id || ('bag-' + b.slug), o: off(b) })),
  };
  return new Response(JSON.stringify(out), { headers: { 'Content-Type': 'application/json' } });
}
