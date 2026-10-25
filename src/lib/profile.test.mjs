import test from 'node:test';
import assert from 'node:assert/strict';
import { profileOf, suitKey, steps, weightTie, BEGINNER } from './profile.js';

const racket = (over) => ({ shape: null, balance: null, weightMax: null, coreHardness: null, brand: 'Head', ratings: { power: 99 }, ...over });

test('round soft light low balance is an easy beginner racket', () => {
  const p = profileOf(racket({ shape: 'round', balance: 'low', weightMax: 350, coreHardness: 'soft' }));
  assert.deepEqual(p, { head: 'round', swing: 'easy', feel: 'soft', balance: 'low' });
  assert.equal(suitKey(p), 'beginner-soft');
  assert.equal(steps(p, BEGINNER), 0);
});

test('diamond hard heavy high balance is demanding and firm', () => {
  const p = profileOf(racket({ shape: 'diamond', balance: 'high', weightMax: 375, coreHardness: 'hard' }));
  assert.deepEqual(p, { head: 'diamond', swing: 'demanding', feel: 'firm', balance: 'high' });
  assert.equal(suitKey(p), 'attack');
});

test('Head Gravity Team 2024 specs resolve without using ratings', () => {
  const p = profileOf(racket({ shape: 'round', balance: 'medium', weightMax: 360, coreHardness: 'soft' }));
  assert.equal(p.head, 'round');
  assert.equal(p.swing, 'moderate');
  assert.equal(p.feel, 'soft');
  assert.equal(suitKey(p), 'beginner-soft');
});

test('missing balance leaves swing empty', () => {
  const p = profileOf(racket({ shape: 'round', weightMax: 360, coreHardness: 'soft' }));
  assert.equal(p.swing, null);
  assert.equal(suitKey(p), null);
  assert.equal(steps(p, BEGINNER), null);
});

test('a millimetre balance is not turned into a bucket', () => {
  const p = profileOf(racket({ shape: 'diamond', balance: '26 cm (10.2 in)', weightMax: 370, coreHardness: 'hard' }));
  assert.equal(p.balance, null);
  assert.equal(p.swing, null);
});

test('medium-soft stays unmapped until that brand ladder says otherwise', () => {
  const bare = profileOf(racket({ coreHardness: 'medium-soft', brand: 'Adidas' }));
  assert.equal(bare.feel, null);
  const mapped = profileOf(racket({ coreHardness: 'medium-soft', brand: 'Adidas' }), { adidas: { 'medium-soft': 'soft' } });
  assert.equal(mapped.feel, 'soft');
});

test('maxima within 5 g tie, and a teardrop medium is further from beginner than a round soft', () => {
  assert.equal(weightTie(370, 374), true);
  assert.equal(weightTie(360, 370), false);
  const round = profileOf(racket({ shape: 'round', balance: 'low', weightMax: 350, coreHardness: 'soft' }));
  const tear = profileOf(racket({ shape: 'teardrop', balance: 'medium', weightMax: 365, coreHardness: 'medium' }));
  assert.ok(steps(tear, BEGINNER) > steps(round, BEGINNER));
});
