import {parse,sane} from './parse.js'; import {FEEDS} from './feeds.js';
import {saveExport, loadExport, needsRebuild, pruneHistory} from './snapshot.js';

const UA='WhichPadelPriceBot/1.0 (+https://whichpadel.com/about/; hello@whichpadel.com)';
// Free-plan scheduler: one cron every 2 min processes BATCH offers account-wide (≤50 external subrequests).
// ~720 runs/day × 3 offers ≈ 2,160 checks/day — enough to cover ~1,200–1,500 offers once per day.
const BATCH=3, GAP_MS=800, RETRY=6*3600e3, DAY=86400e3, HOUR=3600e3;
const RECHECK=20*HOUR;   // due again after ~20h → once/day coverage with headroom
const MAX_AGE=72*HOUR;   // hide offers not verified for 72h (unchanged UX)
const HEARTBEAT=20*HOUR; // write an observation at least once/day even if price unchanged (charts + min90)
const CACHE_TTL=86400;   // edge-cache prebuilt JSON for 24h
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

const SHOP_HEADERS={'esprit-padel-shop.com':{cookie:'cart_currency=EUR; localization=FR'}};
const SHOP_JSON={'esprit-padel-shop.com':'EUR'};

async function shopJson(res,cur){
  try{
    const v=(await res.json()).product.variants.filter(x=>+x.price>0);
    if(!v.length) return {error:'json:noprice'};
    const c=v[0].price_currency||cur;
    if(c!==cur) return {error:'currency:'+c};
    return {price:Math.min(...v.map(x=>+x.price)),currency:c,inStock:null,method:'shopify-json'};
  }catch(e){return {error:'json:'+e.message};}
}

export function robotsAllows(txt,path){
  if(!txt) return true;
  let on=false,rules=[];
  for(const raw of txt.split(/\r?\n/)){
    const l=raw.replace(/#.*/,'').trim();
    const m=l.match(/^([\w-]+)\s*:\s*(.*)$/);
    if(!m) continue;
    const k=m[1].toLowerCase(), v=m[2].trim();
    if(k==='user-agent'){on=v==='*'||/whichpadel/i.test(v);}
    else if(on&&(k==='disallow'||k==='allow')&&v) rules.push([k,v]);
  }
  let best=null;
  for(const [k,v] of rules){
    const re=new RegExp('^'+v.replace(/[.+?^{}()|[\]\\]/g,'\\$&').replace(/\*/g,'.*').replace(/\\\$$|\$$/,'$'));
    if(re.test(path)&&(!best||v.length>best[1].length||(v.length===best[1].length&&k==='allow'))) best=[k,v];
  }
  return !best||best[0]==='allow';
}

async function robots(env,shop){
  const now=Date.now();
  if(shop.robots_at&&now-shop.robots_at<DAY) return shop.robots;
  let t='';
  try{const r=await fetch(`https://${shop.host}/robots.txt`,{headers:{'user-agent':UA}}); if(r.ok) t=(await r.text()).slice(0,100000);}catch{}
  await env.DB.prepare('UPDATE shops SET robots=?,robots_at=? WHERE domain=?').bind(t,now,shop.domain).run();
  return t;
}

async function checkOffer(env,o,rtxt){
  const now=Date.now();
  const u=new URL(o.url);
  const fail=async(status,err)=>{
    await env.DB.batch([
      env.DB.prepare('INSERT INTO parse_failures VALUES(?,?,?,?)').bind(o.id,now,status,err),
      env.DB.prepare('UPDATE offers SET last_checked=?,last_error=?,fails=fails+1 WHERE id=?').bind(now,err,o.id),
    ]);
    return {id:o.id,err};
  };
  if(!robotsAllows(rtxt,u.pathname+u.search)) return fail(0,'robots');
  const fu=SHOP_JSON[o.shop]?o.url.split(/[?#]/)[0]+'.json':o.url;
  let res;
  try{
    res=await fetch(fu,{
      headers:{'user-agent':UA,accept:'text/html,application/xhtml+xml','accept-language':'en',...(SHOP_HEADERS[o.shop]||{})},
      redirect:'follow',
    });
  }catch(e){return fail(0,'fetch:'+e.message);}
  if(res.status===429||res.status===403||res.status===405||res.status>=500){
    await env.DB.batch([
      env.DB.prepare('INSERT INTO parse_failures VALUES(?,?,?,?)').bind(o.id,now,res.status,'blocked-retry'),
      env.DB.prepare('UPDATE offers SET last_checked=?,last_error=?,fails=fails+1 WHERE id=?').bind(now-RECHECK+RETRY,'http'+res.status,o.id),
    ]);
    return {id:o.id,err:'retry'};
  }
  if(!res.ok) return fail(res.status,'http'+res.status);
  const p=SHOP_JSON[o.shop]
    ? await shopJson(res,SHOP_JSON[o.shop])
    : parse(await res.text(),o.shop,/^(shoe:)?ball-/.test(o.racket_id||'')?2:15);
  if(p.error) return fail(res.status,p.error);

  const {results:hist}=await env.DB.prepare(
    'SELECT price,currency,in_stock,ts FROM price_observations WHERE offer_id=? ORDER BY ts DESC LIMIT 5',
  ).bind(o.id).all();
  if(!sane(p.price,hist.filter(h=>h.currency===p.currency).map(h=>h.price))) return fail(res.status,'outlier:'+p.price);

  const last=hist[0];
  const stock=p.inStock==null?null:+p.inStock;
  const changed=!last
    || last.price!==p.price
    || last.currency!==p.currency
    || (stock!=null && last.in_stock!==stock);
  const heartbeat=!last || (now-last.ts)>=HEARTBEAT;

  const st=[env.DB.prepare('UPDATE offers SET last_checked=?,last_error=NULL,fails=0,currency=? WHERE id=?').bind(now,p.currency,o.id)];
  if(changed||heartbeat){
    st.push(env.DB.prepare('INSERT INTO price_observations VALUES(?,?,?,?,?,?)').bind(o.id,now,p.price,p.currency,stock,p.method));
  }
  if(last&&last.currency===p.currency&&last.price!==p.price){
    st.push(env.DB.prepare('INSERT INTO price_changes VALUES(?,?,?,?,?)').bind(o.id,now,last.price,p.price,p.currency));
  }
  await env.DB.batch(st);
  return {id:o.id,price:p.price,wrote:changed||heartbeat};
}

/** Process the oldest-due offers globally (not per-shop × PER_DOMAIN). Fits free subrequest + CPU budgets. */
export async function run(env){
  for(const f of FEEDS) if(f.enabled(env)) await f.fetchOffers(env);

  const {results:due}=await env.DB.prepare(
    `SELECT o.*, s.host, s.domain, s.robots, s.robots_at
     FROM offers o JOIN shops s ON s.domain=o.shop
     WHERE s.active=1 AND s.mode='page' AND o.last_checked<?
     ORDER BY o.last_checked ASC LIMIT ?`,
  ).bind(Date.now()-RECHECK, BATCH).all();

  if(!due.length){
    await maybeRebuild(env);
    return [];
  }

  const robotsCache={};
  const out=[];
  for(const [i,o] of due.entries()){
    if(i) await sleep(GAP_MS);
    if(!robotsCache[o.shop]) robotsCache[o.shop]=await robots(env,o);
    out.push(await checkOffer(env,o,robotsCache[o.shop]));
  }
  await maybeRebuild(env);
  return out;
}

/** Build current-offers + 90-day history payload (same shape the site already consumes). */
export async function exportPrices(env){
  const now=Date.now();
  const {results}=await env.DB.prepare(
    `SELECT o.id,o.racket_id r,o.shop d,s.name n,o.url u,p.ts,p.price,p.currency c,p.in_stock s
     FROM offers o JOIN shops s ON s.domain=o.shop JOIN price_observations p ON p.offer_id=o.id
     WHERE p.ts>? AND o.fails<2 ORDER BY p.ts`,
  ).bind(now-90*DAY).all();

  const by={};
  for(const x of results) (by[x.id]??=[]).push(x);
  const out={};
  for(const obs of Object.values(by)){
    const last=obs.at(-1);
    if(now-last.ts>MAX_AGE) continue;
    const c=last.c;
    const same=obs.filter(o=>o.c===c);
    const days={};
    for(const o of same) days[new Date(o.ts).toISOString().slice(0,10)]=o.price;
    const h=Object.entries(days);
    const min=n=>Math.min(...same.filter(o=>now-o.ts<=n*DAY).map(o=>o.price));
    const prev=[...h].reverse().find(([,p])=>p!==last.price);
    const recentPrev=prev&&now-Date.parse(prev[0])<=7*DAY+DAY?prev[1]:null;
    const drop=recentPrev&&last.price<=recentPrev*0.95?Math.round((1-last.price/recentPrev)*100):0;
    const e={p:last.price,c,u:last.u,d:last.d,n:last.n,s:last.s,t:new Date(last.ts).toISOString().slice(0,10),min30:min(30),min90:min(90),since:h[0][0],drop,h:h.slice(-90)};
    const all=[...(out[last.r]?.o||[]),{d:e.d,n:e.n,p:e.p,c:e.c,u:e.u,s:e.s,t:e.t,min30:e.min30}];
    const cur=out[last.r];
    out[last.r]=(!cur||(e.s!==0&&(cur.s===0||e.p<cur.p)))?e:cur;
    out[last.r].o=all;
  }
  const FXA={EUR:1,GBP:0.84,USD:1.12,SEK:11.1};
  for(const [k,e] of Object.entries(out)){
    const v=x=>x.p/(FXA[x.c]||1);
    if(e.o.length<3) continue;
    const md=e.o.map(v).sort((a,b)=>a-b)[e.o.length>>1];
    const keep=e.o.filter(x=>v(x)>=md*0.55&&v(x)<=md*1.8);
    if(keep.length<e.o.length){
      const b=keep.filter(x=>x.s!==0).sort((a,b)=>v(a)-v(b))[0]||keep[0];
      out[k]={...e,o:keep};
      if(!keep.some(x=>x.u===e.u)) Object.assign(out[k],{p:b.p,c:b.c,u:b.u,d:b.d,n:b.n,s:b.s,t:b.t,min30:b.min30,drop:0});
    }
  }
  return {updated:new Date(now).toISOString(),r:out};
}

async function maybeRebuild(env){
  if(!(await needsRebuild(env))) return null;
  await pruneHistory(env, Date.now()-90*DAY);
  const data=await exportPrices(env);
  return saveExport(env, data);
}

async function servePrices(env,ctx,origin,pathname){
  const cache=caches.default;
  const snap=await loadExport(env);
  if(!snap){
    // No snapshot yet (migration just applied). Build once in the background; return empty so we don't full-scan on the request path.
    if(ctx) ctx.waitUntil(maybeRebuild(env).catch(()=>{}));
    return new Response(JSON.stringify({updated:null,r:{},pending:true}),{
      headers:{'content-type':'application/json','cache-control':'public, max-age=60','access-control-allow-origin':'https://whichpadel.com'},
    });
  }
  const key=new Request(`${origin}${pathname}?v=snap-${snap.built_at}`);
  let r=await cache.match(key);
  if(r) return r;
  r=new Response(snap.json,{
    headers:{
      'content-type':'application/json',
      'cache-control':`public, max-age=${CACHE_TTL}`,
      'access-control-allow-origin':'https://whichpadel.com',
      'x-wp-prices-built':String(snap.built_at),
    },
  });
  if(ctx) ctx.waitUntil(cache.put(key,r.clone()));
  return r;
}

export default {
  async scheduled(ev,env,ctx){ctx.waitUntil(run(env));},
  async fetch(req,env,ctx){
    const u=new URL(req.url);
    // Manual rebuild for go-live / ops (secret header). Not used by the site.
    if(u.pathname.endsWith('/api/prices/rebuild') && req.method==='POST'){
      const want=env.REBUILD_SECRET;
      if(!want || req.headers.get('x-wp-rebuild')!==want) return new Response('Forbidden',{status:403});
      const info=await maybeRebuild(env);
      // Force rebuild even if fresh
      if(!info){
        await pruneHistory(env, Date.now()-90*DAY);
        const data=await exportPrices(env);
        const saved=await saveExport(env, data);
        return Response.json({ok:true,forced:true,...saved});
      }
      return Response.json({ok:true,forced:false,...info});
    }
    if(!u.pathname.endsWith('/api/prices')) return new Response('Not found',{status:404});
    return servePrices(env,ctx,u.origin,u.pathname);
  },
};
