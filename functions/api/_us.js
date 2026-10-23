// Preview: merge US offers (USD, US-delivering shops, separate preview Worker + D1) into a price payload. Production data is read-only here.
const US='https://whichpadel-us-prices-preview.rupertwallace.workers.dev';
export async function merged(base, path){
 const get=u=>fetch(u,{cf:{cacheTtl:600}}).then(r=>r.ok?r.json():null).catch(()=>null);
 const [a,b]=await Promise.all([get(base),get(US+path)]); const out=a&&a.r?a:{updated:new Date().toISOString(),r:{}};
 if(b&&b.r) for(const [k,e] of Object.entries(b.r)){const cur=out.r[k]; const uo=e.o||[{d:e.d,n:e.n,p:e.p,c:e.c,u:e.u,s:e.s,t:e.t,min30:e.min30}];
  if(!cur) out.r[k]=e; else cur.o=[...(cur.o||[]),...uo];}
 return new Response(JSON.stringify(out),{headers:{'content-type':'application/json','cache-control':'public, max-age=600'}});}
