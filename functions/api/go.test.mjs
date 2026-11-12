import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve, productUrl, tracked, utm, onRequestGet, onRequest } from './go.js';

const IT = 'https://pin.padelproshop.com/t/t?a=1952832735&as=2129249905&t=2&tk=1&url={url}';
const FR = 'https://pin.padelproshop.com/t/t?a=2048842705&as=2129250299&t=2&tk=1&url={url}';
const ES = 'https://pin.padelproshop.com/t/t?a=1883995083&as=2129249735&t=2&tk=1&url={url}';
const raw = 'https://padelproshop.com/products/adidas-metalbone-2026';
const itUrl = 'https://padelproshop.com/it/products/adidas-metalbone-2026';
const frUrl = 'https://padelproshop.com/fr/products/adidas-metalbone-2026';
const esUrl = 'https://padelproshop.com/es/products/adidas-metalbone-2026';

function kv(map) {
  return { get: async k => (map[k] ?? null) };
}
async function go(qs, env) {
  const res = await onRequestGet({ request: new Request('https://whichpadel.com/api/go?' + qs), env: env || {} });
  return { status: res.status, location: res.headers.get('location'), cache: res.headers.get('cache-control') };
}

test('IT/FR/ES templates 302 to pin.padelproshop.com with locale product URL', () => {
  const it = resolve({ shop: 'padelproshop.com', region: 'IT', url: raw, template: IT });
  assert.equal(it.status, 302);
  const itLoc = new URL(it.location);
  assert.equal(itLoc.hostname, 'pin.padelproshop.com');
  assert.equal(itLoc.searchParams.get('url'), itUrl);
  assert.equal(itLoc.searchParams.get('a'), '1952832735');
  assert.equal(itLoc.searchParams.get('as'), '2129249905');

  const fr = resolve({ shop: 'padelproshop.com', region: 'FR', url: raw, template: FR });
  assert.equal(new URL(fr.location).searchParams.get('url'), frUrl);
  assert.equal(new URL(fr.location).searchParams.get('a'), '2048842705');

  const es = resolve({ shop: 'padelproshop.com', region: 'ES', url: raw, template: ES });
  assert.equal(new URL(es.location).searchParams.get('url'), esUrl);
  assert.equal(new URL(es.location).searchParams.get('a'), '1883995083');
});

test('locale rewrite is idempotent and replaces a wrong locale', () => {
  assert.equal(productUrl(itUrl, 'padelproshop.com', 'IT'), itUrl);
  assert.equal(productUrl('https://padelproshop.com/fr/products/adidas-metalbone-2026', 'padelproshop.com', 'IT'), itUrl);
  assert.equal(productUrl('https://padelproshop.com/en-us/products/adidas-metalbone-2026?currency=USD', 'padelproshop.com', 'IT'), itUrl + '?currency=USD');
  assert.equal(productUrl('https://www.padelproshop.com/products/foo', 'padelproshop.com', 'FR'), 'https://padelproshop.com/fr/products/foo');
});

test('missing KV template falls back to UTM on the locale URL', () => {
  const r = resolve({ shop: 'padelproshop.com', region: 'IT', url: raw, template: null });
  assert.equal(r.status, 302);
  assert.equal(r.location, utm(itUrl));
  const pt = resolve({ shop: 'padelproshop.com', region: 'PT', url: raw, template: null });
  assert.equal(pt.location, 'https://padelproshop.com/pt/products/adidas-metalbone-2026?utm_source=whichpadel&utm_medium=referral');
});

test('unknown shop or region is 400', () => {
  assert.equal(resolve({ shop: 'evil.com', region: 'IT', url: raw, template: IT }).status, 400);
  assert.equal(resolve({ shop: 'padelproshop.com', region: 'XX', url: raw, template: IT }).status, 400);
  assert.equal(resolve({ shop: 'padelproshop.com', region: '', url: raw, template: IT }).status, 400);
  assert.equal(resolve({ shop: 'us.padelproshop.com', region: 'US', url: 'https://us.padelproshop.com/products/x', template: IT }).status, 400);
});

test('open-redirect attempts are rejected', () => {
  const bad = [
    'https://evil.com/products/foo',
    'https://padelproshop.com.evil.com/products/foo',
    'https://pin.padelproshop.com/products/foo',
    'https://us.padelproshop.com/products/foo',
    'http://padelproshop.com/products/foo',
    'javascript:alert(1)',
    '//evil.com',
    '/products/foo',
    'https://evil.com%2f@padelproshop.com/products/foo',
    'https://user:pass@padelproshop.com/products/foo',
    'https://padelproshop.com/not-a-product/foo',
    'https://padelproshop.com:8443/products/foo',
    'https://padelproshop.com/products/foo\nLocation: https://evil.com',
  ];
  for (const url of bad) {
    const r = resolve({ shop: 'padelproshop.com', region: 'IT', url, template: IT });
    assert.equal(r.status, 400, url);
    assert.equal(r.location, undefined, url);
  }
});

test('a malicious KV template never 302s off pin.padelproshop.com', () => {
  const r = resolve({ shop: 'padelproshop.com', region: 'IT', url: raw, template: 'https://evil.com/?u={url}' });
  assert.equal(r.status, 302);
  assert.equal(r.location, utm(itUrl));
  const r2 = resolve({ shop: 'padelproshop.com', region: 'IT', url: raw, template: 'https://pin.padelproshop.com.evil.com/?u={url}' });
  assert.equal(r2.location, utm(itUrl));
  assert.equal(tracked('not-https/{url}', raw), null);
  assert.equal(tracked('https://pin.padelproshop.com/t', raw), null);
});

test('onRequestGet uses KV and refuses non-GET', async () => {
  const env = { AFFILIATE: kv({ 'padelproshop.com:IT': IT }) };
  const ok = await go('shop=padelproshop.com&region=it&url=' + encodeURIComponent(raw), env);
  assert.equal(ok.status, 302);
  assert.equal(ok.cache, 'no-store');
  assert.equal(new URL(ok.location).hostname, 'pin.padelproshop.com');
  assert.equal(new URL(ok.location).searchParams.get('url'), itUrl);

  const miss = await go('shop=padelproshop.com&region=GB&url=' + encodeURIComponent(raw), env);
  assert.equal(miss.status, 302);
  assert.match(miss.location, /utm_source=whichpadel/);
  assert.match(miss.location, /padelproshop\.com\/products\//);

  const bad = await go('shop=evil.com&region=IT&url=' + encodeURIComponent('https://evil.com/'), env);
  assert.equal(bad.status, 400);
  assert.equal(bad.location, null);

  const open = await go('shop=padelproshop.com&region=IT&url=' + encodeURIComponent('https://evil.com/products/x'), env);
  assert.equal(open.status, 400);

  const post = onRequest();
  assert.equal(post.status, 405);
});
