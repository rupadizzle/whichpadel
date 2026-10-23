// Seeds the US preview D1: US shops + strict racket/shoe offers. Prints seed.sql (idempotent). Re-run after refreshing matches.
import fs from 'node:fs'; import {matchShoes} from './shoematch.mjs';
const SHOPS={'usaplayspadel.com':['usaplayspadel.com','USA Plays Padel'],'us.padelproshop.com':['padelproshop.com','Padel Pro Shop']};
const q=s=>s==null?'NULL':`'${String(s).replace(/'/g,"''")}'`;
const RM=JSON.parse(fs.readFileSync(new URL('./racket-matches.json',import.meta.url)));
const shoes=matchShoes(JSON.parse(fs.readFileSync(new URL('./pps-shoes.json',import.meta.url))));
let sql=Object.entries(SHOPS).map(([d,[h,n]])=>`INSERT INTO shops(domain,host,name) VALUES(${q(d)},${q(h)},${q(n)}) ON CONFLICT(domain) DO UPDATE SET host=excluded.host,name=excluded.name;`).join('\n')+'\n';
let n=0; for(const [d,m] of Object.entries(RM)) for(const [slug,u] of Object.entries(m)){n++; sql+=`INSERT OR IGNORE INTO offers(racket_id,shop,url,country,currency) VALUES(${q(slug)},${q(d)},${q(u)},'US','USD');\n`;}
for(const [slug,c] of Object.entries(shoes)){n++; sql+=`INSERT OR IGNORE INTO offers(racket_id,shop,url,country,currency) VALUES(${q('shoe:'+slug)},'us.padelproshop.com',${q('https://padelproshop.com/en-us/products/'+c.h+'?currency=USD')},'US','USD');\n`;}
fs.writeFileSync(new URL('./seed.sql',import.meta.url),sql); console.log('offers',n);
