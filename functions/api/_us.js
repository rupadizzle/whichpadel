// Merge US offers (USD, US-delivering shops; US price Worker + own D1) into a price payload. Read-only.
// Uses service bindings (wrangler.toml) when present, public workers.dev URLs as fallback (previews).
const URLS={US:'https://whichpadel-us-prices-preview.rupertwallace.workers.dev',SHOES:'https://whichpadel-shoe-prices-preview.rupertwallace.workers.dev',PRICES:'https://whichpadel.com'};
const get=(env,svc,path)=>{const u=URLS[svc]+path; const p=env&&env[svc]?env[svc].fetch(new Request(u)):fetch(u,{cf:{cacheTtl:600}}); return p.then(r=>r.ok?r.json():null).catch(()=>null);};
export async function merged(env, svc, path, usPath){
 const [a,b]=await Promise.all([get(env,svc,path),get(env,'US',usPath)]); const out=a&&a.r?a:{updated:new Date().toISOString(),r:{}};
 if(b&&b.r) for(const [k,e] of Object.entries(b.r)){const cur=out.r[k]; const uo=e.o||[{d:e.d,n:e.n,p:e.p,c:e.c,u:e.u,s:e.s,t:e.t,min30:e.min30}];
  if(!cur) out.r[k]=e; else cur.o=[...(cur.o||[]),...uo];}
 return new Response(JSON.stringify(out),{headers:{'content-type':'application/json','cache-control':'public, max-age=600'}});}
