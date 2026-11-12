const SHOPS = new Set(['padelproshop.com']);
const REGIONS = new Set(['GB','IE','ES','PT','FR','IT','DE','NL','BE','SE','US','EU','ROW']);
const PIN = new Set(['pin.padelproshop.com']);
const DEST = { 'padelproshop.com': new Set(['padelproshop.com']) };
const LOCALE = { IT:'it', FR:'fr', ES:'es', PT:'pt', DE:'de' };
const PRODUCT = /^\/(?:(?:[a-z]{2}|en-us)\/)?products\//;
const MAX_URL = 2000;
const HDR = { 'cache-control': 'no-store' };

export function hostOf(u) {
  return u.hostname.replace(/^www\./, '').toLowerCase();
}

export function localeUrl(raw, region) {
  const loc = LOCALE[region];
  const u = new URL(raw);
  if (!loc) return u.toString();
  const path = u.pathname.replace(/^\/(?:[a-z]{2}|en-us)(?=\/)/, '');
  if (!path.startsWith('/products/')) return u.toString();
  u.pathname = '/' + loc + path;
  return u.toString();
}

const CTRL = /[\u0000-\u001f\u007f]/;

export function productUrl(raw, shop, region) {
  if (typeof raw !== 'string' || raw.length > MAX_URL || CTRL.test(raw)) return null;
  let u;
  try { u = new URL(raw); } catch { return null; }
  if (u.protocol !== 'https:') return null;
  if (u.port && u.port !== '443') return null;
  if (u.username || u.password) return null;
  u.hash = "";
  const host = hostOf(u);
  if (!(DEST[shop] || new Set()).has(host)) return null;
  if (!PRODUCT.test(u.pathname)) return null;
  u.hostname = host;
  u.protocol = 'https:';
  return localeUrl(u.toString(), region);
}

export function tracked(template, product) {
  if (typeof template !== 'string' || !template.startsWith('https://') || !template.includes('{url}')) return null;
  let out;
  try { out = new URL(template.replace('{url}', encodeURIComponent(product))); } catch { return null; }
  if (out.protocol !== 'https:') return null;
  if (out.port && out.port !== '443') return null;
  if (out.username || out.password) return null;
  if (!PIN.has(out.hostname.toLowerCase())) return null;
  return out.toString();
}

export function utm(product) {
  const u = new URL(product);
  if (!u.searchParams.has('utm_source')) {
    u.searchParams.set('utm_source', 'whichpadel');
    u.searchParams.set('utm_medium', 'referral');
  }
  return u.toString();
}

export function resolve({ shop, region, url, template }) {
  if (!SHOPS.has(shop) || !REGIONS.has(region)) return { status: 400 };
  const product = productUrl(url, shop, region);
  if (!product) return { status: 400 };
  const dest = tracked(template, product) || utm(product);
  if (!dest || dest.length > MAX_URL * 2 || CTRL.test(dest)) return { status: 400 };
  return { status: 302, location: dest };
}

export async function onRequestGet({ request, env }) {
  const q = new URL(request.url).searchParams;
  const shop = q.get('shop') || '';
  const region = (q.get('region') || '').toUpperCase();
  const url = q.get('url') || '';
  let template = null;
  if (env && env.AFFILIATE) {
    try { template = await env.AFFILIATE.get(shop + ':' + region); } catch {}
  }
  const r = resolve({ shop, region, url, template });
  if (r.status === 400) return new Response('Bad request', { status: 400, headers: HDR });
  return new Response(null, { status: 302, headers: { ...HDR, location: r.location } });
}

export const onRequest = () => new Response('Method not allowed', { status: 405, headers: HDR });
