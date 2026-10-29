// Outbound shop link. A real https affiliate template wraps the product URL untouched.
// Every other shop URL gets utm_source=whichpadel and utm_medium=referral.
// The price, ball, finder, describe-shoes and region scripts inline this same rule.
export function shopHref(url, affiliate) {
  if (typeof affiliate === 'string' && affiliate.startsWith('https://')) return affiliate.replace('{url}', encodeURIComponent(url));
  try {
    const u = new URL(url);
    if (!u.searchParams.has('utm_source')) {
      u.searchParams.set('utm_source', 'whichpadel');
      u.searchParams.set('utm_medium', 'referral');
    }
    return u.toString();
  } catch { return url; }
}
