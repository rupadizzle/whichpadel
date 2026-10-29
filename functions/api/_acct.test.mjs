import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanItems, unionItems, toggleItem, setAlertItem, safeNext, sha256, CAP } from './_acct.js';

test('cleanItems keeps kind and slug, drops junk, caps at 40', ()=>{
 const junk=[{t:'r',s:'ok-1'},{t:'x',s:'no'},{t:'r',s:'Bad'},{t:'r',s:'ok-1'},{t:'s',s:'shoe-1'},{t:'g',s:'bag-1'},{t:'b',s:'ball-1'}, null];
 assert.deepEqual(cleanItems(junk), [{t:'r',s:'ok-1'},{t:'s',s:'shoe-1'},{t:'g',s:'bag-1'},{t:'b',s:'ball-1'}]);
 const many=Array.from({length:50},(_,i)=>({t:'r',s:'r-'+i}));
 assert.equal(cleanItems(many).length, CAP);
 assert.equal(cleanItems(many)[0].s, 'r-0');
});

test('union keeps this device first, then account-only items', ()=>{
 const account=[{t:'r',s:'old'},{t:'r',s:'both'}];
 const device=[{t:'r',s:'new'},{t:'r',s:'both'}];
 assert.deepEqual(unionItems(account, device).map(x=>x.s), ['new','both','old']);
});

test('alert flag stays on the saved product', ()=>{
 const on=setAlertItem([{t:'r',s:'a'}], 's', 'shoe-1', true);
 assert.deepEqual(on, [{t:'s',s:'shoe-1',a:1},{t:'r',s:'a'}]);
 assert.deepEqual(setAlertItem(on, 's', 'shoe-1', false), [{t:'s',s:'shoe-1'},{t:'r',s:'a'}]);
 assert.deepEqual(toggleItem(on, 's', 'shoe-1'), [{t:'r',s:'a'}]);
 const merged=unionItems([{t:'r',s:'both',a:1}], [{t:'r',s:'both'}]);
 assert.equal(merged.find(x=>x.s==='both').a, 1);
});

test('toggle adds then removes', ()=>{
 const added=toggleItem([{t:'r',s:'a'}], 'r', 'b');
 assert.deepEqual(added.map(x=>x.s), ['b','a']);
 assert.deepEqual(toggleItem(added, 'r', 'b').map(x=>x.s), ['a']);
 assert.deepEqual(toggleItem([{t:'r',s:'a'}], 'nope', 'b'), [{t:'r',s:'a'}]);
});

test('safeNext allows site paths only', ()=>{
 assert.equal(safeNext('/es/guardadas/'), '/es/guardadas/');
 assert.equal(safeNext('//evil.com'), '/saved/');
 assert.equal(safeNext('https://whichpadel.com/saved/'), '/saved/');
 assert.equal(safeNext('/saved/?x=1'), '/saved/');
 assert.equal(safeNext(null), '/saved/');
});

test('sha256 is stable hex', async ()=>{
 assert.equal(await sha256('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
});
