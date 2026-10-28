// Padel bag catalogue (data/bags.json). Ids are bag-<slug>, the same pattern balls use (ball-<slug>) on the shoe price engine.
// Hub and product pages list only confirmed 2025-27 models (range === "in-range"); year-unknown models stay in the data, flagged.
import raw from '../../data/bags.json'; import { pick, SHOPS, DEFAULT_REGION } from './price.js'; import { brandList } from './data.js';
export const BAG_CHECKED = raw.checked;
export const allBags = raw.bags;
export const bags = raw.bags.filter(b => b.range === 'in-range');
export const bagBySlug = Object.fromEntries(bags.map(b => [b.slug, b]));
export const bagImg = b => b.img ? `/bags/${b.slug}.webp` : null;
export const bagTypeKey = b => (b.type || '').replace(/\s+/g, '-'); // racket-bag | backpack | holdall
// best offer for the region (same rules as rackets/shoes/balls)
export const bagOffer = (b, region) => { const p = pick(b, region); return p.none ? null : p; };
export const bagPrice = (b, lang) => { const q = bagOffer(b, DEFAULT_REGION(lang)); return q ? q.v : null; };
const byPrice = region => (a, b) => ((bagOffer(a, region)?.v ?? 1e9) - (bagOffer(b, region)?.v ?? 1e9)) || a.name.localeCompare(b.name);
export const rankBags = (list, lang) => [...list].sort(byPrice(DEFAULT_REGION(lang)));
export const bagGroups = region => ({ bags: bags.filter(b => b.type !== 'backpack').sort(byPrice(region)), packs: bags.filter(b => b.type === 'backpack').sort(byPrice(region)) });
const med = a => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor((s.length - 1) / 2)] : null; };
export const bagStats = region => {
  const g = bagGroups(region); const price = l => med(l.map(b => bagOffer(b, region)?.v).filter(v => v != null)); const cap = l => med(l.map(b => b.rackets).filter(Boolean));
  const yes = k => bags.filter(b => b[k] === 'yes').length;
  return { n: bags.length, nBags: g.bags.length, nPacks: g.packs.length, brands: new Set(bags.map(b => b.brand)).size, priceBags: price(g.bags), pricePacks: price(g.packs), capBags: cap(g.bags), capPacks: cap(g.packs), thermal: yes('thermal'), shoe: yes('shoe'), cur: bagOffer(g.bags[0], region)?.cur };
};
export const bagBrand = (name, region) => { const l = bags.filter(b => b.brand === name).sort(byPrice(region)); const slug = brandList.find(x => x.name.toLowerCase() === name.toLowerCase())?.slug || null; return { name, slug, list: l, n: l.length, from: l.length ? bagOffer(l[0], region) : null }; };
export const bagHref = o => { const a = SHOPS[o.d]?.affiliate; return typeof a === 'string' && a.startsWith('https://') ? a.replace('{url}', encodeURIComponent(o.u)) : o.u; };
export const bagComp = v => v === 'yes' || v === 'no' ? v : 'ns';
