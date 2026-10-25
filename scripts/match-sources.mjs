// Match catalogue product URLs onto racket slugs.
// Writes data/source-urls.json. Does not edit the PadelTrue catalogue
// (data/rackets.json, data/rackets.normalised.json, data/normalise.py).
import fs from 'node:fs';
import { blockedUrl, matchShop } from '../prices/match/match.mjs';

const UA = 'WhichPadelSpecBot/1.0 (+https://whichpadel.com/about/; hello@whichpadel.com)';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const CACHE = new URL('../data/catalogue-urls.json', import.meta.url);
const OUT = new URL('../data/source-urls.json', import.meta.url);

function locs(xml) {
  const out = [];
  for (const m of xml.matchAll(/<loc>\s*(?:<!\[CDATA\[)?\s*([^<]+?)\s*(?:\]\]>)?\s*<\/loc>/g)) {
    const u = m[1].replace(/&amp;/g, '&').replace(/\s+/g, '').trim();
    if (u) out.push(u);
  }
  return out;
}

async function get(url) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 90000);
  try {
    const r = await fetch(url, { headers: { 'user-agent': UA, accept: 'application/xml,text/xml,text/html,*/*' }, signal: ac.signal, redirect: 'follow' });
    if (!r.ok) throw new Error(r.status + ' ' + url);
    return await r.text();
  } finally { clearTimeout(t); }
}

function shopifyProduct(loc) {
  try {
    const path = new URL(loc).pathname;
    return /\/sitemap_products_\d+\.xml$/.test(path) && !/^\/[a-z]{2}(-[a-z]{2})?\//i.test(path);
  } catch { return false; }
}

async function fromSitemaps(starts, acceptChild, padelOnly) {
  const seen = new Set();
  const q = [...starts];
  const urls = new Set();
  let n = 0;
  while (q.length && n < 50) {
    const u = q.shift();
    if (seen.has(u)) continue;
    seen.add(u);
    n++;
    let xml;
    try { xml = await get(u); }
    catch (e) { console.log('  fail', e.message); continue; }
    console.log('  file', n, xml.length, u.slice(0, 120));
    await sleep(400);
    const found = locs(xml);
    if (/<sitemapindex[\s>]/.test(xml)) {
      for (const loc of found) if (!acceptChild || acceptChild(loc)) q.push(loc);
    } else {
      for (const loc of found) {
        if (!/^https?:\/\//i.test(loc)) continue;
        if (/\.(jpg|jpeg|png|webp|gif|svg|pdf)(\?|$)/i.test(loc)) continue;
        if (padelOnly && !/padel/i.test(loc)) continue;
        urls.add(loc.split('#')[0]);
      }
    }
  }
  if (q.length) console.log('  stopped with', q.length, 'sitemaps still queued');
  return [...urls];
}

async function fromCategory(bases) {
  const urls = new Set();
  for (const base of bases) {
    const url = base + (base.includes('?') ? '&' : '?') + 'resultsPerPage=9999999';
    let html;
    try { html = await get(url); }
    catch (e) { console.log('  fail', e.message); continue; }
    let added = 0;
    for (const m of html.matchAll(/href="([^"]+)"/g)) {
      let abs;
      try { abs = new URL(m[1], url).href; } catch { continue; }
      if (!/allforpadel\.com\/en\/(?:padel-rackets|all-padel-rackets)\/\d+-/.test(abs) || !abs.includes('.html')) continue;
      abs = abs.split('#')[0].split('?')[0];
      if (!urls.has(abs)) { urls.add(abs); added++; }
    }
    console.log('  ', added, url);
    await sleep(450);
  }
  return [...urls];
}

const HOST_BRAND = {
  'noxsport.com': 'nox',
  'starvie.com': 'starvie',
  'siuxpadel.com': 'siux',
  'oxdogpadel.com': 'oxdog',
  'kombatpadel.com': 'kombat',
  'es.dropshotstore.com': 'drop shot',
  'viborapadel.com': 'vibora',
  'royalpadel.com': 'royal padel',
  'wilson.com': 'wilson',
};

const JOBS = [
  { host: 'padelnuestro.com', starts: ['https://www.padelnuestro.com/media/sitemap_product.xml'] },
  { host: 'allforpadel.com', category: ['https://allforpadel.com/en/54-padel-rackets', 'https://allforpadel.com/en/62-padel-rackets-outlet'] },
  { host: 'zonadepadel.es', starts: ['https://www.zonadepadel.es/module/lgsitemaps/sitemap?fc=module&name=product_1_1'], accept: loc => /name=product_1_/.test(loc) },
  { host: 'zonadepadel.nl', starts: ['https://www.zonadepadel.nl/module/lgsitemaps/sitemap?fc=module&name=product_10_1'], accept: loc => /name=product_10_/.test(loc) },
  { host: 'streetpadel.com', starts: ['https://www.streetpadel.com/sitemap.xml'], accept: shopifyProduct },
  { host: 'siuxpadel.com', starts: ['https://www.siuxpadel.com/sitemap.xml'], accept: shopifyProduct },
  { host: 'noxsport.com', starts: ['https://noxsport.com/sitemap.xml'], accept: shopifyProduct },
  { host: 'starvie.com', starts: ['https://starvie.com/sitemap.xml'], accept: shopifyProduct },
  { host: 'oxdogpadel.com', starts: ['https://oxdogpadel.com/sitemap.xml'], accept: shopifyProduct },
  { host: 'kombatpadel.com', starts: ['https://kombatpadel.com/sitemap.xml'], accept: shopifyProduct },
  { host: 'es.dropshotstore.com', starts: ['https://es.dropshotstore.com/sitemap.xml'], accept: shopifyProduct },
  { host: 'viborapadel.com', starts: ['https://viborapadel.com/sitemap.xml'] },
  { host: 'royalpadel.com', starts: ['https://royalpadel.com/product-sitemap.xml'], accept: loc => /product-sitemap/.test(loc) },
  { host: 'padel-point.de', starts: ['https://www.padel-point.de/sitemap.xml'], accept: shopifyProduct },
  { host: 'padelproshop.com', starts: ['https://padelproshop.com/sitemap_1.xml'], accept: loc => /\/en-eu-products-sitemap/.test(loc) },
  { host: 'pdhsports.com', starts: ['https://pdhsports.com/sitemap.xml'], accept: shopifyProduct },
  { host: 'wilson.com', starts: ['https://www.wilson.com/sitemap.xml'], accept: shopifyProduct, padelOnly: true },
];

const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
const refresh = process.argv.includes('--refresh');

for (const job of JOBS) {
  if (!refresh && Array.isArray(cache[job.host]) && cache[job.host].length) {
    console.log(job.host, 'cached', cache[job.host].length);
    continue;
  }
  console.log('fetch', job.host);
  const urls = job.category
    ? await fromCategory(job.category)
    : await fromSitemaps(job.starts, job.accept, job.padelOnly);
  console.log(job.host, urls.length);
  if (urls.length) {
    cache[job.host] = urls;
    fs.writeFileSync(CACHE, JSON.stringify(cache));
  }
}

const raw = JSON.parse(fs.readFileSync(new URL('../data/rackets.normalised.json', import.meta.url), 'utf8'));
const images = JSON.parse(fs.readFileSync(new URL('../data/images.json', import.meta.url), 'utf8'));
const matches = JSON.parse(fs.readFileSync(new URL('../prices/match/matches.json', import.meta.url), 'utf8'));
const by = {};
let blocked = 0;
const add = (slug, url) => {
  if (!url || !/^https?:\/\//i.test(url) || /padeltrue\.com/i.test(url)) return;
  if (blockedUrl(url)) { blocked++; return; }
  (by[slug] ??= new Set()).add(url.split('#')[0]);
};
const before = {};
for (const r of raw.rackets) {
  if (r.productUrl) add(r.slug, r.productUrl);
  if (r.sourceUrl) add(r.slug, r.sourceUrl);
  if (images[r.slug]?.url) add(r.slug, images[r.slug].url);
}
for (const map of Object.values(matches)) for (const [slug, url] of Object.entries(map)) add(slug, url);
for (const r of raw.rackets) before[r.slug] = by[r.slug] ? by[r.slug].size : 0;

const contributed = {};
for (const [host, list] of Object.entries(cache)) {
  if (!Array.isArray(list) || !list.length) continue;
  console.log('match', host, list.length);
  const t = Date.now();
  const m = matchShop(list, HOST_BRAND[host]);
  console.log(' ', Object.keys(m).length, 'rackets', ((Date.now() - t) / 1000).toFixed(1) + 's');
  contributed[host] = Object.keys(m).length;
  for (const [slug, url] of Object.entries(m)) add(slug, url);
}

const rackets = {};
for (const slug of Object.keys(by).sort()) rackets[slug] = [...by[slug]].sort();
const missing = raw.rackets.filter(r => !by[r.slug]).map(r => r.slug);
const gained = raw.rackets.filter(r => before[r.slug] === 0 && by[r.slug]).length;
const brands = {};
for (const r of raw.rackets) if (!by[r.slug]) brands[r.brand] = (brands[r.brand] || 0) + 1;
const out = {
  fetched: '2026-10-25',
  note: 'Product-page URLs matched from catalogues already used. Strict match: brand, every model token, and year must agree. Not written back into the PadelTrue files.',
  coverage: {
    total: raw.rackets.length,
    withUrl: raw.rackets.length - missing.length,
    unsourcedBefore: raw.rackets.filter(r => before[r.slug] === 0).length,
    gained,
    stillMissing: missing.length,
  },
  byHost: contributed,
  missingByBrand: Object.fromEntries(Object.entries(brands).sort((a, b) => b[1] - a[1])),
  rackets,
  missing,
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('blocked urls', blocked);
console.log(JSON.stringify(out.coverage));
console.log('still missing by brand', out.missingByBrand);
