// US offers (USD, US-delivering shops only) on the unchanged racket price engine. Shoe offers are stored as "shoe:<slug>".
import base, {exportPrices} from '../prices/src/worker.js';
export default {
 scheduled: base.scheduled,
 async fetch(req,env,ctx){const u=new URL(req.url); const shoes=u.pathname.endsWith('/api/shoe-prices'); if(!shoes&&!u.pathname.endsWith('/api/prices')) return new Response('Not found',{status:404});
  const cache=caches.default; const key=new Request(u.origin+u.pathname+'?v=1'); let r=await cache.match(key); if(r) return r;
  const all=await exportPrices(env); const out={};
  for(const [k,v] of Object.entries(all.r)){const s=k.startsWith('shoe:'); if(s===shoes) out[s?k.slice(5):k]=v;}
  r=new Response(JSON.stringify({updated:all.updated,r:out}),{headers:{'content-type':'application/json','cache-control':'public, max-age=900'}});
  ctx.waitUntil(cache.put(key,r.clone())); return r;}};
