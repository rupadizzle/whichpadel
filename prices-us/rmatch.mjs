// US racket offers: USA Plays Padel (USD, US-based) + Padel Pro Shop's US store (en-us, ?currency=USD). Uses the strict racket matcher.
import fs from 'node:fs'; import {matchShop} from '../prices/match/match.mjs';
const upp=fs.readFileSync(new URL('./upp-urls.txt',import.meta.url),'utf8').split('\n').filter(u=>/\/product\//.test(u));
const out={'usaplayspadel.com':matchShop(upp)}; delete out['usaplayspadel.com']['bullpadel-neuron-02-2026']; // listing is the Neuron 02 Edge, a different racket
const M=JSON.parse(fs.readFileSync(new URL('../prices/match/matches.json',import.meta.url)));
out['us.padelproshop.com']=Object.fromEntries(Object.entries(M['padelproshop.com']||{}).map(([s,u])=>[s,u.replace('https://padelproshop.com/products/','https://padelproshop.com/en-us/products/')+'?currency=USD']));
fs.writeFileSync(new URL('./racket-matches.json',import.meta.url),JSON.stringify(out,null,1));
for(const [d,m] of Object.entries(out)) console.log(d,Object.keys(m).length);
console.log(out['usaplayspadel.com']);
