import {parse,sane} from './parse.js'; import {FEEDS} from './feeds.js';
const UA='WhichPadelPriceBot/1.0 (+https://whichpadel.com/about/; hello@whichpadel.com)';
const PER_RUN={'noxsport.com':1}, PER_DOMAIN=4, GAP_MS=6000, RETRY=6*3600e3, DAY=86400e3, RECHECK=8*3600e3, MAX_AGE=48*3600e3;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
// minimal robots.txt: groups for "*" or our bot name, longest-match Disallow/Allow, supports * and $
// Per-shop request headers (e.g. pin the shop's own currency instead of geo-IP pricing).
const SHOP_HEADERS={'esprit-padel-shop.com':{cookie:'cart_currency=EUR; localization=FR'}};
export function robotsAllows(txt,path){if(!txt) return true; let on=false,rules=[]; for(const raw of txt.split(/\r?\n/)){const l=raw.replace(/#.*/,'').trim(); const m=l.match(/^([\w-]+)\s*:\s*(.*)$/); if(!m) continue; const k=m[1].toLowerCase(), v=m[2].trim();
  if(k==='user-agent'){on=v==='*'||/whichpadel/i.test(v);} else if(on&&(k==='disallow'||k==='allow')&&v) rules.push([k,v]);}
 let best=null; for(const [k,v] of rules){const re=new RegExp('^'+v.replace(/[.+?^{}()|[\]\\]/g,'\\$&').replace(/\*/g,'.*').replace(/\\\$$|\$$/,'$')); if(re.test(path)&&(!best||v.length>best[1].length||(v.length===best[1].length&&k==='allow'))) best=[k,v];}
 return !best||best[0]==='allow';}
async function robots(env,shop){const now=Date.now(); if(shop.robots_at&&now-shop.robots_at<DAY) return shop.robots;
 let t=''; try{const r=await fetch(`https://${shop.host}/robots.txt`,{headers:{'user-agent':UA}}); if(r.ok) t=(await r.text()).slice(0,100000);}catch{}
 await env.DB.prepare('UPDATE shops SET robots=?,robots_at=? WHERE domain=?').bind(t,now,shop.domain).run(); return t;}
async function checkOffer(env,o,rtxt){const now=Date.now(); const u=new URL(o.url);
 const fail=async(status,err)=>{await env.DB.batch([env.DB.prepare('INSERT INTO parse_failures VALUES(?,?,?,?)').bind(o.id,now,status,err),env.DB.prepare('UPDATE offers SET last_checked=?,last_error=?,fails=fails+1 WHERE id=?').bind(now,err,o.id)]); return {id:o.id,err};};
 if(!robotsAllows(rtxt,u.pathname+u.search)) return fail(0,'robots');
 let res; try{res=await fetch(o.url,{headers:{'user-agent':UA,accept:'text/html,application/xhtml+xml','accept-language':'en',...(SHOP_HEADERS[o.shop]||{})},redirect:'follow'});}catch(e){return fail(0,'fetch:'+e.message);}
 if(res.status===429||res.status===403||res.status===405||res.status>=500){await env.DB.batch([env.DB.prepare('INSERT INTO parse_failures VALUES(?,?,?,?)').bind(o.id,now,res.status,'blocked-retry'),env.DB.prepare('UPDATE offers SET last_checked=?,last_error=?,fails=fails+1 WHERE id=?').bind(now-RECHECK+RETRY,'http'+res.status,o.id)]); return {id:o.id,err:'retry'};}
 if(!res.ok) return fail(res.status,'http'+res.status);
 const p=parse(await res.text(),o.shop,/^(shoe:)?ball-/.test(o.racket_id||'')?2:15); if(p.error) return fail(res.status,p.error);
 const {results:hist}=await env.DB.prepare('SELECT price,currency FROM price_observations WHERE offer_id=? ORDER BY ts DESC LIMIT 5').bind(o.id).all();
 if(!sane(p.price,hist.filter(h=>h.currency===p.currency).map(h=>h.price))) return fail(res.status,'outlier:'+p.price);
 const st=[env.DB.prepare('INSERT INTO price_observations VALUES(?,?,?,?,?,?)').bind(o.id,now,p.price,p.currency,p.inStock==null?null:+p.inStock,p.method),
  env.DB.prepare('UPDATE offers SET last_checked=?,last_error=NULL,fails=0,currency=? WHERE id=?').bind(now,p.currency,o.id)];
 if(hist[0]&&hist[0].currency===p.currency&&hist[0].price!==p.price) st.push(env.DB.prepare('INSERT INTO price_changes VALUES(?,?,?,?,?)').bind(o.id,now,hist[0].price,p.price,p.currency));
 await env.DB.batch(st); return {id:o.id,price:p.price};}
export async function run(env){const {results:shops}=await env.DB.prepare("SELECT * FROM shops WHERE active=1 AND mode='page'").all();
 for(const f of FEEDS) if(f.enabled(env)) await f.fetchOffers(env); // inactive until credentials exist
 const out=await Promise.all(shops.map(async s=>{const {results:due}=await env.DB.prepare('SELECT * FROM offers WHERE shop=? AND last_checked<? ORDER BY last_checked LIMIT ?').bind(s.domain,Date.now()-RECHECK,PER_RUN[s.domain]||PER_DOMAIN).all();
  if(!due.length) return []; const rt=await robots(env,s); const r=[]; for(const [i,o] of due.entries()){if(i) await sleep(GAP_MS); r.push(await checkOffer(env,o,rt));} return r;}));
 return out.flat();}
// public read API: best current offer per racket + 30/90-day lows + short history + drop flag
export async function exportPrices(env){const now=Date.now();
 const {results}=await env.DB.prepare(`SELECT o.id,o.racket_id r,o.shop d,s.name n,o.url u,p.ts,p.price,p.currency c,p.in_stock s FROM offers o JOIN shops s ON s.domain=o.shop JOIN price_observations p ON p.offer_id=o.id WHERE p.ts>? AND o.fails<2 ORDER BY p.ts`).bind(now-90*DAY).all();
 const by={}; for(const x of results)(by[x.id]??=[]).push(x);
 const out={}; for(const obs of Object.values(by)){const last=obs.at(-1); if(now-last.ts>MAX_AGE) continue; /* unverified for 48h: hide */ const c=last.c; const same=obs.filter(o=>o.c===c);
  const days={}; for(const o of same) days[new Date(o.ts).toISOString().slice(0,10)]=o.price; const h=Object.entries(days);
  const min=n=>Math.min(...same.filter(o=>now-o.ts<=n*DAY).map(o=>o.price)); const prev=[...h].reverse().find(([,p])=>p!==last.price);
  const recentPrev=prev&&now-Date.parse(prev[0])<=7*DAY+DAY?prev[1]:null; const drop=recentPrev&&last.price<=recentPrev*0.95?Math.round((1-last.price/recentPrev)*100):0;
  const e={p:last.price,c,u:last.u,d:last.d,n:last.n,s:last.s,t:new Date(last.ts).toISOString().slice(0,10),min30:min(30),min90:min(90),since:h[0][0],drop,h:h.slice(-90)};
  const all=[...(out[last.r]?.o||[]),{d:e.d,n:e.n,p:e.p,c:e.c,u:e.u,s:e.s,t:e.t,min30:e.min30}];
  const cur=out[last.r]; out[last.r]=(!cur||(e.s!==0&&(cur.s===0||e.p<cur.p)))?e:cur; out[last.r].o=all;}
 // cross-shop sanity: drop offers far from the racket's median (wrong product matched); approx EUR rates are enough for this
 const FXA={EUR:1,GBP:0.84,USD:1.12,SEK:11.1}; for(const [k,e] of Object.entries(out)){const v=x=>x.p/(FXA[x.c]||1); if(e.o.length<3) continue; const md=e.o.map(v).sort((a,b)=>a-b)[e.o.length>>1];
  const keep=e.o.filter(x=>v(x)>=md*0.55&&v(x)<=md*1.8); if(keep.length<e.o.length){const b=keep.filter(x=>x.s!==0).sort((a,b)=>v(a)-v(b))[0]||keep[0]; out[k]={...e,...(e.o.includes(b)?{}:{}),o:keep}; if(!keep.some(x=>x.u===e.u)) Object.assign(out[k],{p:b.p,c:b.c,u:b.u,d:b.d,n:b.n,s:b.s,t:b.t,min30:b.min30,drop:0});}}
 return {updated:new Date(now).toISOString(),r:out};}
export default {
 async scheduled(ev,env,ctx){ctx.waitUntil(run(env));},
 async fetch(req,env,ctx){const u=new URL(req.url); if(!u.pathname.endsWith('/api/prices')) return new Response('Not found',{status:404});
  const cache=caches.default; const key=new Request(u.origin+'/api/prices?v=5'); let r=await cache.match(key); if(r) return r;
  r=new Response(JSON.stringify(await exportPrices(env)),{headers:{'content-type':'application/json','cache-control':'public, max-age=900','access-control-allow-origin':'https://whichpadel.com'}});
  ctx.waitUntil(cache.put(key,r.clone())); return r;}};
