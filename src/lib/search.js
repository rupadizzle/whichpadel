// Client-side ranking for the site search. The catalogue arrives from /search-index.json; pages and guides are already localised.
const ORDER = ['pg', 'm', 'r', 's', 'b', 'p', 'g'];
const CAP = { pg: 4, m: 4, r: 6, s: 4, b: 3, p: 3, g: 4 };
const SLUG = /^[a-z0-9-]{1,80}$/;

export function norm(s) {
  return String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}

export function score(q, text) {
  const n = norm(text);
  if (!q || !n) return 0;
  const words = q.split(' ').filter(Boolean);
  if (!words.length || !words.every(w => n.includes(w))) return 0;
  if (n === q) return 120;
  let s = 36;
  if (n.startsWith(q)) s += 48;
  else if (n.includes(q)) s += 18;
  const nw = n.split(' ');
  for (const w of words) {
    if (nw.some(x => x === w)) s += 14;
    else if (nw.some(x => x.startsWith(w))) s += 7;
  }
  return s;
}

function add(bag, k, sc, item) {
  if (sc > 0 && item.h) bag[k].push({ ...item, k, sc });
}

export function querySearch({ idx, pages, guides, q: raw, U }) {
  const q = norm(raw);
  if (q.length < 2) return [];
  const bag = { pg: [], m: [], r: [], s: [], b: [], p: [], g: [] };
  for (const [h, t] of pages || []) add(bag, 'pg', score(q, t), { h, t, meta: '', img: '', y: 0 });
  for (const [h, t] of guides || []) add(bag, 'g', score(q, t), { h, t, meta: '', img: '', y: 0 });
  if (idx) {
    for (const [slug, name, shoe] of idx.m || []) {
      if (!SLUG.test(slug)) continue;
      add(bag, 'm', score(q, name), { h: (shoe ? U.sb : U.m) + slug + '/', t: name, meta: '', img: '', y: 0 });
    }
    for (const [slug, brand, model, year, img, player] of idx.r || []) {
      if (!SLUG.test(slug)) continue;
      const y = year || 0;
      const sc = Math.max(score(q, model), score(q, `${brand} ${model} ${y || ''} ${player || ''}`));
      add(bag, 'r', sc, { h: U.r + slug + '/', t: model, meta: y ? `${brand} · ${y}` : brand, img: img ? `/rackets/${slug}.webp` : '', y });
    }
    for (const [slug, brand, name, img] of idx.s || []) {
      if (!SLUG.test(slug)) continue;
      const meta = name.toLowerCase().startsWith(String(brand).toLowerCase()) ? '' : brand;
      add(bag, 's', score(q, `${brand} ${name}`), { h: U.s + slug + '/', t: name, meta, img: img ? `/shoes/g/${slug}-0-400.webp` : '', y: 0 });
    }
    for (const [slug, brand, name, img] of idx.b || []) {
      if (!SLUG.test(slug)) continue;
      const meta = name.toLowerCase().startsWith(String(brand).toLowerCase()) ? '' : brand;
      add(bag, 'b', score(q, `${brand} ${name}`), { h: U.b + slug + '/', t: name, meta, img: img ? `/balls/g/${slug}-400.webp` : '', y: 0 });
    }
    for (const [slug, name] of idx.p || []) {
      if (!SLUG.test(slug)) continue;
      add(bag, 'p', score(q, name), { h: U.p + slug + '/', t: name, meta: '', img: '', y: 0 });
    }
  }
  const out = [];
  for (const k of ORDER) {
    bag[k].sort((a, b) => b.sc - a.sc || b.y - a.y || a.t.localeCompare(b.t));
    out.push(...bag[k].slice(0, CAP[k]));
  }
  return out;
}
