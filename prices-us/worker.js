// US offers (USD, US-delivering shops only) on the free-tier snapshot price engine.
// Shoe offers are stored as "shoe:<slug>". /api/prices -> rackets, /api/shoe-prices -> shoes.
import base, {exportPrices} from '../prices/src/worker.js';
import {loadExport, needsRebuild, pruneHistory, saveExport} from '../prices/src/snapshot.js';

const DAY=86400e3, CACHE_TTL=86400;

async function payload(env,ctx){
  const snap=await loadExport(env);
  if(snap) return JSON.parse(snap.json);
  if(ctx) ctx.waitUntil((async()=>{
    if(await needsRebuild(env)){
      await pruneHistory(env, Date.now()-90*DAY);
      await saveExport(env, await exportPrices(env));
    }
  })().catch(()=>{}));
  return {updated:null,r:{},pending:true};
}

export default {
  scheduled: base.scheduled,
  async fetch(req,env,ctx){
    const u=new URL(req.url);
    const shoes=u.pathname.endsWith('/api/shoe-prices');
    if(!shoes&&!u.pathname.endsWith('/api/prices')) return new Response('Not found',{status:404});
    const cache=caches.default;
    const all=await payload(env,ctx);
    const built=all.updated||'pending';
    const key=new Request(u.origin+u.pathname+'?v=snap-'+built);
    let r=await cache.match(key);
    if(r) return r;
    const out={};
    for(const [k,v] of Object.entries(all.r||{})){
      const s=k.startsWith('shoe:');
      if(s===shoes) out[s?k.slice(5):k]=v;
    }
    r=new Response(JSON.stringify({updated:all.updated,r:out,pending:!!all.pending}),{
      headers:{'content-type':'application/json','cache-control':`public, max-age=${CACHE_TTL}`},
    });
    ctx.waitUntil(cache.put(key,r.clone()));
    return r;
  },
};
