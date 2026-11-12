import assert from 'node:assert/strict';
import { shopHref, affTemplate, goHref, shopSn, shopOpts } from './shop-href.js';

const raw = 'https://shop.example/rackets/foo';
const tag = 'utm_source=whichpadel&utm_medium=referral';

assert.equal(shopHref(raw, 'PLACEHOLDER'), `${raw}?${tag}`);
assert.equal(shopHref(raw, ''), `${raw}?${tag}`);
assert.equal(shopHref(`${raw}?size=2`, null), `${raw}?size=2&${tag}`);
assert.equal(shopHref(`${raw}?utm_source=keep&x=1`, 'nope'), `${raw}?utm_source=keep&x=1`);
assert.equal(shopHref(`${raw}#reviews`, undefined), `${raw}?${tag}#reviews`);
assert.equal(shopHref(raw, 'https://clk.example/?u={url}'), 'https://clk.example/?u=' + encodeURIComponent(raw));
assert.equal(shopHref('not a url', ''), 'not a url');
assert.equal(shopHref(raw, 'https://clk.example/no-placeholder'), `${raw}?${tag}`);
assert.equal(affTemplate('PLACEHOLDER'), '');
assert.equal(affTemplate('https://clk.example/no-placeholder'), '');
assert.equal(affTemplate('https://clk.example/?u={url}'), 'https://clk.example/?u={url}');

const go = 'https://padelproshop.com/products/foo';
assert.equal(
  shopHref(go, 'PLACEHOLDER', { go: true, shop: 'padelproshop.com', region: 'IT' }),
  '/api/go?shop=padelproshop.com&region=IT&url=' + encodeURIComponent(go),
);
assert.equal(
  goHref('padelproshop.com', 'FR', go),
  '/api/go?shop=padelproshop.com&region=FR&url=' + encodeURIComponent(go),
);
assert.equal(shopHref(go, 'PLACEHOLDER', { go: false, shop: 'padelproshop.com', region: 'IT' }), `${go}?${tag}`);
assert.deepEqual(shopSn('padelproshop.com', { name: 'Padel Pro Shop', affiliate: 'PLACEHOLDER', go: true, affRegions: ['IT', 'FR', 'ES'] }), ['Padel Pro Shop', '', true, ['IT', 'FR', 'ES']]);
assert.deepEqual(shopSn('mantissport.com', { name: 'Mantis', affiliate: 'https://www.awin1.com/cread.php?awinmid=130947&awinaffid=3131639&ued={url}' }), ['Mantis', 'https://www.awin1.com/cread.php?awinmid=130947&awinaffid=3131639&ued={url}', false, []]);
assert.deepEqual(shopOpts({ go: true }, 'padelproshop.com', 'ES'), { go: true, shop: 'padelproshop.com', region: 'ES' });
assert.deepEqual(shopOpts({ affiliate: 'PLACEHOLDER' }, 'other.com', 'GB'), { go: false, shop: 'other.com', region: 'GB' });
