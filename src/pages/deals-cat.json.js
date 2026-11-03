import { allRackets } from '../lib/data.js';
import { gallery } from '../lib/rp2.js';
import { shoes, shoeImg } from '../lib/shoes.js';
import { balls, ballImg } from '../lib/balls.js';
import { bags, bagImg } from '../lib/bags.js';
import { url } from '../i18n/index.js';

const escRe = s => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const short = (brand, name, year) => {
  let s = name || '';
  if (brand) s = s.replace(new RegExp('^' + escRe(brand) + '\\s+', 'i'), '');
  if (year) s = s.replace(new RegExp('\\s+' + year + '\\s*$'), '');
  return s.trim() || name;
};
const racketImg = r => {
  const g = gallery(r)[0];
  if (g && !g.one) return g.s;
  return r.image || '';
};
const CAT = {};
const add = (key, kind, slug, brand, year, name, href, img) => {
  CAT[key] = { k: kind, s: slug, b: brand || '', y: year || '', m: short(brand, name, year), u: href, i: img || '' };
};
for (const r of allRackets) add(r.slug, 'r', r.slug, r.brand, r.year, r.model, url('racket', 'en', r.slug), racketImg(r));
for (const s of shoes) add(s.slug, 's', s.slug, s.brand, s.year, s.name, url('shoe', 'en', s.slug), shoeImg(s) || '');
for (const b of balls) add('ball-' + b.slug, 'b', b.slug, b.brand, '', b.model || b.name, url('ball', 'en', b.slug), ballImg(b) || '');
for (const g of bags) add(g.id || ('bag-' + g.slug), 'g', g.slug, g.brand, g.year, g.name, url('bag', 'en', g.slug), bagImg(g) || '');

export function GET() {
  return new Response(JSON.stringify(CAT), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600, s-maxage=86400' } });
}
