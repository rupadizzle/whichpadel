// Seeds pilot shops + one offer per racket productUrl on pilot domains. Prints SQL (idempotent).
import fs from 'node:fs';
const PILOT={'padelnuestro.com':['www.padelnuestro.com','Padel Nuestro'],'allforpadel.com':['allforpadel.com','All For Padel'],'noxsport.com':['noxsport.com','Nox']};
// not scraped: padelmarket (terms forbid scraping: feed only), decathlon.co.uk (blocks automated fetches: 403)
const q=s=>s==null?'NULL':`'${String(s).replace(/'/g,"''")}'`;
const R=JSON.parse(fs.readFileSync(new URL('../data/rackets.normalised.json',import.meta.url))).rackets;
let sql=Object.entries(PILOT).map(([d,[h,n]])=>`INSERT INTO shops(domain,host,name) VALUES(${q(d)},${q(h)},${q(n)}) ON CONFLICT(domain) DO UPDATE SET host=excluded.host,name=excluded.name;`).join('\n')+'\n';
let n=0; for(const r of R){if(!r.productUrl) continue; const d=new URL(r.productUrl).hostname.replace(/^www\./,''); if(!PILOT[d]) continue; n++;
 sql+=`INSERT OR IGNORE INTO offers(racket_id,shop,url,country,currency) VALUES(${q(r.slug)},${q(d)},${q(r.productUrl)},NULL,${q(r.currency)});\n`;}
fs.writeFileSync(new URL('./seed.sql',import.meta.url),sql); console.log('offers',n);
