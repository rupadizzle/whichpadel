// Price-engine QA: parser fixtures, racket pages carry the live-price hooks in all 6 languages, public API shape.
import fs from 'node:fs'; import {execSync} from 'node:child_process';
let bad=0; const out=execSync('node prices/test/parse.test.mjs').toString(); if(!out.includes('PARSE PASS')){bad++;console.log(out);}
const dirs={en:'rackets',es:'es/palas',fr:'fr/raquettes',pt:'pt/raquetes',it:'it/racchette',de:'de/schlaeger'};
for(const [l,d] of Object.entries(dirs)){const f=`dist/${d}/adidas-2026-world-cup-argentina/index.html`; const h=fs.existsSync(f)?fs.readFileSync(f,'utf8'):'';
 for(const k of ['id="pxlive"','id="pxdrop"','/api/all-prices','"low30"']) if(!h.includes(k)){bad++;console.log('missing',k,l);}}
try{const r=await fetch('https://whichpadel.com/api/prices'); const j=await r.json(); if(!j.updated||typeof j.r!=='object'){bad++;console.log('api shape');}
 for(const [s,e] of Object.entries(j.r)) if(!(e.p>0&&e.min30>0&&e.min30<=e.p&&['EUR','GBP','USD','SEK'].includes(e.c)&&e.u.startsWith('https://'))){bad++;console.log('api entry',s);break;}
 console.log('api entries',Object.keys(j.r).length);}catch(e){bad++;console.log('api',e.message);}
console.log(bad?'PXQA FAIL':'PXQA PASS');
