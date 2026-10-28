// Merge US offers (USD, US-delivering shops; US price Worker + own D1) into a price payload. Read-only.
// Uses service bindings (wrangler.toml) when present, public workers.dev URLs as fallback (previews).
const URLS={US:'https://whichpadel-us-prices-preview.rupertwallace.workers.dev',SHOES:'https://whichpadel-shoe-prices-preview.rupertwallace.workers.dev',PRICES:'https://whichpadel.com'};
// 24h browser/edge hint; the Workers themselves also cache the prebuilt snapshot for 24h.
const CACHE_TTL=86400;
const CACHE_HDR={'content-type':'application/json','cache-control':`public, max-age=${CACHE_TTL}`};
const get=(env,svc,path)=>{const u=URLS[svc]+path; const p=env&&env[svc]?env[svc].fetch(new Request(u)):fetch(u,{cf:{cacheTtl:CACHE_TTL}}); return p.then(r=>r.ok?r.json():null).catch(()=>null);};

/** Build the merged JSON body (no Response yet). */
async function mergeBody(env, svc, path, usPath){
 const [a,b]=await Promise.all([get(env,svc,path),get(env,'US',usPath)]); const out=a&&a.r?a:{updated:new Date().toISOString(),r:{}};
 if(b&&b.r) for(const [k,e] of Object.entries(b.r)){const cur=out.r[k]; const uo=e.o||[{d:e.d,n:e.n,p:e.p,c:e.c,u:e.u,s:e.s,t:e.t,min30:e.min30}];
  if(!cur) out.r[k]=e; else cur.o=[...(cur.o||[]),...uo];}
 return out;
}

/**
 * Serve merged prices. Pages Function responses are not auto edge-cached from Cache-Control alone,
 * so we store them in caches.default (same 24h TTL as the Workers' snapshots).
 * `ctx` is optional (onRequestGet event context) for waitUntil.
 */
export async function merged(env, svc, path, usPath, ctx){
 const cache=caches.default;
 const key=new Request(`https://whichpadel.com/__wp_merged/${svc}${path}?us=${usPath}`);
 let hit=await cache.match(key);
 if(hit) return hit;
 const out=await mergeBody(env, svc, path, usPath);
 const r=new Response(JSON.stringify(out),{headers:CACHE_HDR});
 const put=cache.put(key,r.clone());
 if(ctx&&ctx.waitUntil) ctx.waitUntil(put); else await put;
 return r;
}
