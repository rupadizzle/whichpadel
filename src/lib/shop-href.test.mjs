import assert from 'node:assert/strict';
import { shopHref } from './shop-href.js';

const raw = 'https://shop.example/rackets/foo';
const tag = 'utm_source=whichpadel&utm_medium=referral';

assert.equal(shopHref(raw, 'PLACEHOLDER'), `${raw}?${tag}`);
assert.equal(shopHref(raw, ''), `${raw}?${tag}`);
assert.equal(shopHref(`${raw}?size=2`, null), `${raw}?size=2&${tag}`);
assert.equal(shopHref(`${raw}?utm_source=keep&x=1`, 'nope'), `${raw}?utm_source=keep&x=1`);
assert.equal(shopHref(`${raw}#reviews`, undefined), `${raw}?${tag}#reviews`);
assert.equal(shopHref(raw, 'https://clk.example/?u={url}'), 'https://clk.example/?u=' + encodeURIComponent(raw));
assert.equal(shopHref('not a url', ''), 'not a url');
