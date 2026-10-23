// Match shop product URLs to our racket slugs by tokens. Strict: brand + every model token + year (if either side has one) must agree.
import fs from 'node:fs';
const R=JSON.parse(fs.readFileSync(new URL('../../data/rackets.normalised.json',import.meta.url))).rackets;
const urls=JSON.parse(fs.readFileSync(new URL('./urls.json',import.meta.url)));
const tok=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').split(/[^a-z0-9]+/).filter(Boolean);
const STOP=new Set(['padel','pala','racket','raquette','raqueta','racchetta','schlaeger','by','the','de','la','el','and','x','with','en','es','p','products','product','html']);
const BAD=['junior','jr','kids','nino','enfant','bag','paletero','grip','overgrip','protector','funda','cover','mochila','backpack','shoe','zapatilla','balls','pelotas','camiseta','shirt','pack','kit','set','tshirt','short','falda','skirt','cap','gorra','sock','llavero','keyring','keychain','mini','minipala','bolsa','toalla','bottle','wristband','munequera','bag','thermobag','sticker','replica'];
const BRAND_ALIAS={'star vie':'starvie','starvie':'starvie','black crown':'black','royal padel':'royal','siux':'siux','oxdog':'oxdog','drop shot':'dropshot'};
export function matchShop(list){const idx=list.map(u=>{let p; try{p=new URL(u).pathname}catch{return null} return {u,t:new Set(tok(p.replace(/\d{5,}/g,' ')))}}).filter(Boolean);
 const res={}; for(const r of R){const b=(BRAND_ALIAS[r.brand.toLowerCase()]||r.brand.toLowerCase()); const bt=tok(b);
  const mt=tok(r.slug).filter(x=>!STOP.has(x)&&!bt.includes(x)); const yr=r.year?String(r.year):null; const mtn=mt.filter(x=>x!==yr);
  if(mtn.length===0) continue; let best=null;
  for(const c of idx){ if(!bt.every(x=>c.t.has(x))) continue; if(!mtn.every(x=>c.t.has(x))) continue;
   const ys=[...c.t].map(x=>/^20[12]\d$/.test(x)?x:/^2[2-8]$/.test(x)&&!mt.includes(x)?'20'+x:null).filter(Boolean); if(yr&&ys.length&&!ys.includes(yr)) continue; if(!yr&&ys.length) continue;
   if(BAD.some(x=>c.t.has(x)&&!mt.includes(x))) continue;
   const extra=[...c.t].filter(x=>!STOP.has(x)&&!bt.includes(x)&&!mt.includes(x)&&!/^\d+$/.test(x)&&x.length>2).length;
   if(extra>3) continue; const sc=extra*100+(/\/(en|en-gb|en-us)\//.test(c.u)?0:50)+c.u.length; if(!best||sc<best.sc) best={u:c.u,sc};}
  if(best) res[r.slug]=best.u;}
 // a URL claimed by several slugs (usually a yearless listing): keep only the newest-year racket
 const by={}; for(const [s,u] of Object.entries(res))(by[u]??=[]).push(s);
 const yr=Object.fromEntries(R.map(r=>[r.slug,r.year||0]));
 for(const ss of Object.values(by)) if(ss.length>1){ss.sort((a,b)=>yr[b]-yr[a]||a.length-b.length); ss.slice(1).forEach(s=>delete res[s]);}
 return res;}
if(process.argv[1].endsWith('match.mjs')){const all={}; for(const [d,l] of Object.entries(urls)){const m=matchShop(l); all[d]=m; console.log(d,Object.keys(m).length);}
 fs.writeFileSync(new URL('./matches.json',import.meta.url),JSON.stringify(all,null,1));}
