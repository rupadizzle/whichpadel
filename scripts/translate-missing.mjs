// Runs before every build (deploy.sh). For each language: finds keys that exist in en.js (and the English home block) but not in
// <lang>.js / its home block, fills them from src/i18n/tm/<lang>.js (merged at import by src/i18n/fill.js), and fails, listing
// every key that has no translation yet. No external service: translations are written by hand (padel-correct terms) in the tm file.
// Never fills with English.
import fs from 'fs'; import { missing } from '../src/i18n/fill.js';
const langs=fs.readdirSync('src/i18n').map(f=>f.match(/^([a-z]{2})\.js$/)?.[1]).filter(l=>l&&l!=='en');
const en=(await import('../src/i18n/en.js')).default; const { HOME }=await import('../src/i18n/home.js');
const get=(o,k)=>k.split('.').reduce((a,x)=>a?.[x],o); const show=v=>typeof v==='function'?v.toString():JSON.stringify(v);
let bad=0, filled=0;
for(const l of langs){
 const raw=(await import(`../src/i18n/${l}.js`)).default; const f=`src/i18n/tm/${l}.js`; const tm=fs.existsSync(f)?(await import('../'+f)).default:{};
 const need=missing(en,raw), filledHome=Object.keys(tm).filter(k=>k.startsWith('home.')).length;
 const todo=[...need.filter(k=>!(k in tm)), ...(HOME[l]?missing(HOME.en,HOME[l]).map(k=>'home.'+k):['home (no block)'])];
 filled+=need.length-need.filter(k=>!(k in tm)).length+filledHome;
 for(const k of todo){bad++; console.log(`MISSING ${l} ${k}  en: ${show(k.startsWith('home.')?get(HOME.en,k.slice(5)):get(en,k))?.slice(0,140)}`);}
}
console.log(bad?`translate-missing: ${bad} untranslated key(s); add them to src/i18n/tm/<lang>.js`:`translate-missing: ${langs.join('/')} complete (${filled} key(s) from translation memory)`);
process.exit(bad?1:0);
