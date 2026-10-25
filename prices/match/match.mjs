// Match shop product URLs to our racket slugs by tokens. Strict: brand + every model token + year (if either side has one) must agree.
import fs from 'node:fs';
const R=JSON.parse(fs.readFileSync(new URL('../../data/rackets.normalised.json',import.meta.url))).rackets;
const tok=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').split(/[^a-z0-9]+/).filter(Boolean);
const STOP=new Set(['padel','pala','racket','raquette','raqueta','racchetta','schlaeger','padelschlaeger','by','the','de','la','el','and','x','with','en','es','p','products','product','html']);
const BAD=['testschlaeger','demo','test','used','segunda','zz','padelschuh','junior','jr','kids','nino','enfant','bag','paletero','grip','overgrip','protector','funda','cover','mochila','backpack','shoe','zapatilla','balls','pelotas','camiseta','shirt','pack','kit','set','tshirt','short','falda','skirt','cap','gorra','sock','llavero','keyring','keychain','sleutelhanger','polsband','wristband','munequera','mini','minipala','bolsa','toalla','bottle','sticker','replica','padelschuh','schuh','rucksack','tasche','schlaegertasche','shoe','shoes','backpack','tripack','copia','playa','beach','pickleball'];
const VARIANT=new Set(['reserve','superlight','multiweight','legend','evo','vibe','one','zero','speed','extreme','radical','gravity','instinct','boom','delta','graphene','hybrid','2nd','light','lite','soft','hard','pro','team','plus','ctrl','control','power','attack','hybrid','elite','master','comfort','woman','women','w','lady','mujer','hombre','junior','tour','motion','max','air','ultra','carbon','advance','advanced','xtrem','xtreme','geo','limited','edition','ltd','premier','cup','luxury','genius','play','classics','classic','bt','pk','blue','red','black','white','green','yellow','orange','pink','purple','gold','silver','grey','gray','azul','rojo','negro','blanco','verde']);
const BRAND_ALIAS={'star vie':'starvie','starvie':'starvie','black crown':'black','royal padel':'royal','siux':'siux','oxdog':'oxdog','drop shot':'dropshot'};
// Brand may be one word in the path (dropshot) or split (drop-shot, star-vie).
function brandTokens(brand, tokens){
 const key=brand.toLowerCase(); const raw=tok(brand); const alias=tok(BRAND_ALIAS[key]||'');
 if(raw.length&&raw.every(x=>tokens.has(x))) return raw;
 if(alias.length&&alias.every(x=>tokens.has(x))) return alias;
 const compact=(BRAND_ALIAS[key]||key).replace(/[^a-z0-9]/g,''); if(!compact) return null;
 const list=[...tokens];
 for(let i=0;i<list.length;i++){let acc=''; for(let j=i;j<list.length&&j<i+3;j++){acc+=list[j]; if(acc===compact) return list.slice(i,j+1); if(acc.length>compact.length) break;}}
 return null;
}
// Tokens in the slug that spell the brand (star-vie, starvie) are not part of the model.
function brandSpan(brand, tokens){
 const key=brand.toLowerCase(); const compact=(BRAND_ALIAS[key]||key).replace(/[^a-z0-9]/g,'');
 const drop=new Set(tok(brand));
 for(let i=0;i<tokens.length;i++){let acc=''; for(let j=i;j<tokens.length&&j<i+3;j++){acc+=tokens[j]; if(acc===compact){for(let k=i;k<=j;k++) drop.add(tokens[k]); break;} if(acc.length>compact.length) break;}}
 return drop;
}
export function blockedUrl(url){let p; try{p=new URL(url).pathname}catch{return true}
 p=p.replace(/^(\/(?:[a-z]{2}(?:-[a-z]{2})?|int))+(?=\/)/i,'').replace(/\/\d{3,}(?=-)/g,'/').replace(/\d{5,}/g,' ');
 const t=new Set(tok(p)); return BAD.some(x=>t.has(x));}
export function matchShop(list, hostBrand){const idx=list.map(u=>{let p; try{p=new URL(u).pathname}catch{return null} p=p.replace(/^(\/(?:[a-z]{2}(?:-[a-z]{2})?|int))+(?=\/)/i,'');
 // Shop ids (PrestaShop /1234-name) are not model numbers. Long digit runs are barcodes.
 return {u,t:new Set(tok(p.replace(/\/\d{3,}(?=-)/g,'/').replace(/\d{5,}/g,' ')))}}).filter(Boolean);
 const hostTok=tok(hostBrand||'');
 const res={}; for(const r of R){const yr=r.year?String(r.year):null; const base=tok(r.slug).filter(x=>!STOP.has(x));
  const model=base.filter(x=>!brandSpan(r.brand,base).has(x));
  let best=null;
  for(const c of idx){ const seen=hostTok.length?new Set([...c.t,...hostTok]):c.t; const bt=brandTokens(r.brand,seen); if(!bt) continue;
   const mt=model.filter(x=>!bt.includes(x)); const mtn=mt.filter(x=>x!==yr); if(mtn.length===0) continue; if(!mtn.every(x=>c.t.has(x))) continue;
   const ys=[...c.t].map(x=>/^20[12]\d$/.test(x)?x:/^2[2-8]$/.test(x)&&!mt.includes(x)?'20'+x:null).filter(Boolean); if(yr&&ys.length&&!ys.includes(yr)) continue; if(!yr&&ys.length) continue;
   if(BAD.some(x=>c.t.has(x)&&!mt.includes(x))) continue;
   const extra=[...c.t].filter(x=>!STOP.has(x)&&!bt.includes(x)&&!mt.includes(x)&&!/^\d+$/.test(x)&&x.length>2).length;
   // a different variant token (st3, 3.4, 12k, v2, light...) means a different racket
   if([...c.t].some(x=>/\d/.test(x)&&!/^20[12]\d$/.test(x)&&!/^2[2-8]$/.test(x)&&x.length<5&&!mt.includes(x))) continue;
   if([...c.t].some(x=>VARIANT.has(x)&&!mt.includes(x)&&!bt.includes(x))) continue;
   if(extra>3) continue; const sc=extra*100+(/\/(en|en-gb|en-us)\//.test(c.u)?0:50)+c.u.length; if(!best||sc<best.sc) best={u:c.u,sc};}
  if(best) res[r.slug]=best.u.replace(/^(https:\/\/(?:pdhsports|padelproshop)\.com)\/[a-z]{2}-[a-z]{2}\//,'$1/');}
 // a URL claimed by several slugs (usually a yearless listing): keep only the newest-year racket
 const by={}; for(const [s,u] of Object.entries(res))(by[u]??=[]).push(s);
 const yr=Object.fromEntries(R.map(r=>[r.slug,r.year||0]));
 for(const ss of Object.values(by)) if(ss.length>1){ss.sort((a,b)=>yr[b]-yr[a]||a.length-b.length); ss.slice(1).forEach(s=>delete res[s]);}
 return res;}
if(process.argv[1]?.endsWith('match.mjs')){const urls=JSON.parse(fs.readFileSync(new URL('./urls.json',import.meta.url)));
 const all={}; for(const [d,l] of Object.entries(urls)){const m=matchShop(l); all[d]=m; console.log(d,Object.keys(m).length);}
 fs.writeFileSync(new URL('./matches.json',import.meta.url),JSON.stringify(all,null,1));}
