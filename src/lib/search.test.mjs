import assert from 'node:assert/strict';
import { norm, score, querySearch } from './search.js';

const U = { r: '/rackets/', s: '/shoes/', b: '/balls/', m: '/brands/', sb: '/shoes/brand/', p: '/players/' };
const idx = {
  r: [['bullpadel-vertex-04', 'Bullpadel', 'Vertex 04', 2026, 1, ''], ['nox-at10', 'Nox', 'AT10', 2025, 0, '']],
  s: [['joma-spin-26', 'Joma', 'Joma Spin 26', 1]],
  b: [['head-padel-pro', 'Head', 'Head Padel Pro', 1]],
  m: [['bullpadel', 'Bullpadel', 0], ['asics', 'Asics', 1]],
  p: [['ale-galan', 'Ale Galán']],
};

assert.equal(norm('Bullpadel Vérité'), 'bullpadel verite');
assert.equal(score('zzzz', 'Bullpadel Vertex'), 0);
assert.ok(score(norm('vertex'), 'Bullpadel Vertex 04') > 0);
assert.ok(score(norm('galan'), 'Ale Galán') > score(norm('galan'), 'Ale something'));

const vertex = querySearch({ idx, pages: [['/shoes/', 'Shoes']], guides: [['/best/x/', 'Best power padel rackets']], q: 'vertex', U });
assert.ok(vertex.some(h => h.h === '/rackets/bullpadel-vertex-04/' && h.k === 'r'));
assert.ok(!vertex.some(h => h.t === 'Shoes'));

const brand = querySearch({ idx, pages: [], guides: [], q: 'bullpadel', U });
assert.equal(brand[0].k, 'm');
assert.equal(brand[0].h, '/brands/bullpadel/');
assert.ok(brand.some(h => h.h === '/rackets/bullpadel-vertex-04/'));

const shoeBrand = querySearch({ idx, pages: [], guides: [], q: 'asics', U });
assert.equal(shoeBrand[0].h, '/shoes/brand/asics/');

const player = querySearch({ idx, pages: [], guides: [], q: 'galán', U });
assert.equal(player[0].h, '/players/ale-galan/');

const shoe = querySearch({ idx, pages: [], guides: [], q: 'spin', U });
assert.equal(shoe[0].h, '/shoes/joma-spin-26/');

assert.equal(querySearch({ idx, pages: [], guides: [], q: 'a', U }).length, 0);
console.log('search ok');
