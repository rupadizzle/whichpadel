// Outbound shop link. A real https affiliate template wraps the product URL untouched.
// Every other shop URL gets utm_source=whichpadel and utm_medium=referral.
export const affTemplate = a => typeof a === 'string' && a.startsWith('https://') && a.includes('{url}') ? a : '';
export function goHref(shop, region, url) {
  const q = new URLSearchParams();
  q.set('shop', shop);
  q.set('region', region || '');
  q.set('url', url);
  return '/api/go?' + q.toString();
}
export function shopSn(k, s = {}) {
  const name = s.name && s.name !== k ? s.name : k.replace(/\.(com|net|co\.uk|es|de|fr|it|pt)$/, '');
  return [name, affTemplate(s.affiliate), !!s.go, Array.isArray(s.affRegions) ? s.affRegions : []];
}
export function shopHref(url, affiliate, opts) {
  if (opts && opts.go && opts.shop) return goHref(opts.shop, opts.region || '', url);
  if (affTemplate(affiliate)) return affiliate.replace('{url}', encodeURIComponent(url));
  try {
    const u = new URL(url);
    if (!u.searchParams.has('utm_source')) {
      u.searchParams.set('utm_source', 'whichpadel');
      u.searchParams.set('utm_medium', 'referral');
    }
    return u.toString();
  } catch { return url; }
}
export const shopOpts = (s, d, region) => ({ go: !!(s && s.go), shop: d, region });
