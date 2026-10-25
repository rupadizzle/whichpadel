// Compact catalogue for /search-index.json. Labels that depend on language (guides, page names) stay on the page.
import { allRackets, brandList, players } from './data.js';
import { shoes, shoeBrands, shoeBrandTarget } from './shoes.js';
import { balls } from './balls.js';

export function searchIndex() {
  const seen = new Set();
  const brands = [];
  for (const b of brandList) {
    seen.add(b.slug);
    brands.push([b.slug, b.name, 0]);
  }
  for (const b of shoeBrands) {
    if (seen.has(b.slug)) continue;
    const t = shoeBrandTarget(b.slug);
    if (!t) continue;
    seen.add(b.slug);
    brands.push([b.slug, b.name, t.type === 'shoeBrand' ? 1 : 0]);
  }
  const pseen = new Set();
  const pls = [];
  for (const p of players) {
    if (pseen.has(p.slug)) continue;
    pseen.add(p.slug);
    pls.push([p.slug, p.name]);
  }
  return {
    r: allRackets.map(r => [r.slug, r.brand, r.model, r.year || 0, r.image ? 1 : 0, r.player || '']),
    s: shoes.map(s => [s.slug, s.brand, s.name, s.imgs ? 1 : 0]),
    b: balls.map(b => [b.slug, b.brand, b.name, b.imgs ? 1 : 0]),
    m: brands,
    p: pls,
  };
}
