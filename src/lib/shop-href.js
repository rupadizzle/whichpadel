// Outbound shop link. A real https affiliate template wraps the product URL untouched.
// Every other shop URL gets utm_source=whichpadel and utm_medium=referral.
// The price, ball, finder and region scripts inline this same rule.
export const affTemplate = a => typeof a === 'string' && a.startsWith('https://') && a.includes('{url}') ? a : '';
export function shopHref(url, affiliate) {
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
