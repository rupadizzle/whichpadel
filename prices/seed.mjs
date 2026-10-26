// Seeds pilot shops + one offer per racket productUrl on pilot domains. Prints SQL (idempotent).
import fs from 'node:fs';
const PILOT={'padelnuestro.com':['www.padelnuestro.com','Padel Nuestro'],'allforpadel.com':['allforpadel.com','All For Padel'],'noxsport.com':['noxsport.com','Nox'],
 'zonadepadel.es':['www.zonadepadel.es','Zona de Padel'],'streetpadel.com':['www.streetpadel.com','StreetPadel'],'padel-point.de':['www.padel-point.de','Padel-Point'],
 'padelproshop.com':['padelproshop.com','Padel Pro Shop'],'pdhsports.com':['pdhsports.com','PDH Sports'],
 'padelreference.com':['www.padelreference.com','Padel Reference'],'esprit-padel-shop.com':['esprit-padel-shop.com','Esprit Padel Shop']};
// Phase 2 (26 Oct 2026): robots.txt allows product pages for both; no scraping ban found in their terms. Skipped: padelmarket.com (terms ban scraping), totalpadel.com (no racket product URLs in sitemap), misterpadel.com (no sitemap found).
// skipped: padelusa.com (terms forbid crawling/scraping)
const M=JSON.parse(fs.readFileSync(new URL('./match/matches.json',import.meta.url)));
// not scraped: padelmarket (terms forbid scraping: feed only), decathlon.co.uk (blocks automated fetches: 403)
const q=s=>s==null?'NULL':`'${String(s).replace(/'/g,"''")}'`;
const R=JSON.parse(fs.readFileSync(new URL('../data/rackets.normalised.json',import.meta.url))).rackets;
let sql=Object.entries(PILOT).map(([d,[h,n]])=>`INSERT INTO shops(domain,host,name) VALUES(${q(d)},${q(h)},${q(n)}) ON CONFLICT(domain) DO UPDATE SET host=excluded.host,name=excluded.name;`).join('\n')+'\n';
let n=0; for(const r of R){if(!r.productUrl) continue; const d=new URL(r.productUrl).hostname.replace(/^www\./,''); if(!PILOT[d]) continue; n++;
 sql+=`INSERT OR IGNORE INTO offers(racket_id,shop,url,country,currency) VALUES(${q(r.slug)},${q(d)},${q(r.productUrl)},NULL,${q(r.currency)});\n`;}
for(const [d,m] of Object.entries(M)) if(PILOT[d]) for(const [slug,u] of Object.entries(m)){n++; sql+=`INSERT OR IGNORE INTO offers(racket_id,shop,url,country,currency) VALUES(${q(slug)},${q(d)},${q(u)},NULL,NULL);\n`;}
fs.writeFileSync(new URL('./seed.sql',import.meta.url),sql); console.log('offers',n);
