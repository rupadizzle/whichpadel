// Writes data/us.json from the US preview Worker: {updated, r:{racketSlug:[offers]}, s:{shoeSlug:[offers]}} (USD only). Build-time input for the US pages.
import fs from 'node:fs'; const B='https://whichpadel-us-prices.rupertwallace.workers.dev'; const F=new URL('../data/us.json',import.meta.url);
const prev=JSON.parse(fs.readFileSync(F,'utf8')); const RM=JSON.parse(fs.readFileSync(new URL('./racket-matches.json',import.meta.url))); const OK=new Set(Object.values(RM).flatMap(m=>Object.values(m)));
const get=async p=>{const res=await fetch(B+p,{signal:AbortSignal.timeout(10000)}); if(!res.ok) throw new Error(p+' HTTP '+res.status); const j=await res.json(); if(!j.r||!Object.keys(j.r).length) throw new Error(p+' empty'); return j.r;};
const slim=e=>(e.o||[e]).map(o=>({d:o.d,n:o.n,p:o.p,c:o.c,u:o.u,s:o.s}));
try{
 const [r,s]=await Promise.all([get('/api/prices'),get('/api/shoe-prices')]);
 const out={updated:new Date().toISOString().slice(0,10),r:Object.fromEntries(Object.entries(r).map(([k,e])=>[k,slim(e).filter(o=>OK.has(o.u))]).filter(([,v])=>v.length)),s:Object.fromEntries(Object.entries(s).map(([k,e])=>[k,slim(e)]))};
 fs.writeFileSync(F,JSON.stringify(out)); console.log('us: rackets',Object.keys(out.r).length,'shoes',Object.keys(out.s).length,'updated',out.updated);
}catch(e){ console.log('us: snapshot failed ('+e.message+'), keeping',prev.updated); }
