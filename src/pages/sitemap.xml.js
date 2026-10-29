import { pages, url, LANGS, alternates } from '../i18n/routes.js';
import { allRackets } from '../lib/data.js';
import { shoes, SHOE_CHECKED } from '../lib/shoes.js';
import { balls, BALL_CHECKED } from '../lib/balls.js';
import { bags, BAG_CHECKED } from '../lib/bags.js';
import { FX } from '../lib/price.js';
import { REVIEWED } from '../lib/byline.js';

const iso = s => /^\d{4}-\d{2}-\d{2}$/.test(s || '') ? s : null;
const later = (...xs) => xs.map(iso).filter(Boolean).sort().at(-1) || REVIEWED;
const racketDate = Object.fromEntries(allRackets.map(r => [r.slug, later(r.priceChecked, REVIEWED)]));
const shoeDate = later(SHOE_CHECKED, REVIEWED);
const ballDate = later(BALL_CHECKED, REVIEWED);
const bagDate = later(BAG_CHECKED, REVIEWED);
const priceDate = later(REVIEWED, FX.date, ...Object.values(racketDate));
const EXTRA = {
  '/deals/': priceDate,
  '/black-friday/': priceDate,
  '/describe/': REVIEWED,
  '/describe-shoes/': shoeDate,
  '/my-kit/': REVIEWED,
  '/padel-vs-paddle-tennis/': REVIEWED,
  '/guides/how-to-hold-a-padel-racket/': REVIEWED,
  '/guides/padel-rules/': REVIEWED,
};
const PRICE_TYPES = new Set(['home', 'best', 'bestIndex', 'brand', 'brandYear', 'brands', 'rackets', 'year', 'years', 'vs', 'compare', 'player', 'players', 'bf', 'us', 'finder', 'tool']);

function dateFor(p) {
  if (p.type === 'racket') return racketDate[p.id] || REVIEWED;
  if (p.type === 'shoe' || p.type === 'shoeList' || p.type === 'shoes' || p.type === 'shoeCompare' || p.type === 'shoeBrand') return shoeDate;
  if (p.type === 'ball' || p.type === 'balls') return ballDate;
  if (p.type === 'bag' || p.type === 'bags') return bagDate;
  if (p.type === 'privacy') return '2026-10-24';
  if (PRICE_TYPES.has(p.type)) return priceDate;
  return REVIEWED;
}

export function GET() {
  const S = 'https://whichpadel.com';
  const dated = new Map();
  for (const p of pages()) {
    if (p.type === 'saved') continue;
    const d = dateFor(p);
    for (const l of LANGS) {
      const u = url(p.type, l, p.id);
      if (u) dated.set(u, d);
    }
  }
  for (const [u, d] of Object.entries(EXTRA)) dated.set(u, d);
  const urls = [...dated.keys()];
  const x = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.map(u => `<url><loc>${S}${u}</loc><lastmod>${dated.get(u)}</lastmod>${(() => { const a = alternates(u); return a && Object.keys(a).length > 1 ? Object.entries(a).map(([l, h]) => `<xhtml:link rel="alternate" hreflang="${l}" href="${S}${h}"/>`).join('') + `<xhtml:link rel="alternate" hreflang="x-default" href="${S}${a.en || u}"/>` : ''; })()}</url>`).join('\n')}\n</urlset>\n`;
  return new Response(x, { headers: { 'Content-Type': 'application/xml' } });
}
