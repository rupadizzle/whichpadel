// Collect product URLs (+ image titles where present) from each candidate shop's sitemaps. Polite: sequential, 1s gap.
import fs from 'node:fs';
const UA='WhichPadelPriceBot/1.0 (+https://whichpadel.com/about/; hello@whichpadel.com)';
const SHOPS=JSON.parse(fs.readFileSync(new URL('./candidates.json',import.meta.url)));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function get(u){try{const r=await fetch(u,{headers:{'user-agent':UA}}); return r.ok?await r.text():''}catch{return ''}}
const out={};
for(const [d,{start}] of Object.entries(SHOPS)){const seen=new Set(), q=[...start], urls=new Set(); let n=0;
 while(q.length&&n<60){const u=q.shift(); if(seen.has(u)) continue; seen.add(u); n++; const x=await get(u); await sleep(800);
  for(const m of x.matchAll(/<sitemap>\s*<loc>\s*([^<\s]+)/g)){const s=m[1].replace(/&amp;/g,'&'); if(!/blog|page|collection|categor|cms|post|article|image|video|brand|manufacturer|supplier|tag/i.test(s)||/product/i.test(s)) q.push(s);}
  for(const m of x.matchAll(/<url>\s*<loc>\s*([^<\s]+)/g)) urls.add(m[1].replace(/&amp;/g,'&'));}
 out[d]=[...urls].filter(u=>/pala|racket|raquet|schlaeger|schläger|padel/i.test(u)); console.log(d,urls.size,'->',out[d].length);}
fs.writeFileSync(new URL('./urls.json',import.meta.url),JSON.stringify(out));
