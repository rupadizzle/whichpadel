import fs from 'fs';
const F='data/live-prices.json'; const prev=fs.existsSync(F)?JSON.parse(fs.readFileSync(F,'utf8')):{updated:null,r:{}};
try{
 const res=await fetch('https://whichpadel.com/api/prices',{signal:AbortSignal.timeout(15000)}); if(!res.ok) throw new Error('HTTP '+res.status);
 const j=await res.json(); const n=Object.keys(j.r||{}).length; if(!n) throw new Error('empty');
 const r=Object.fromEntries(Object.entries(j.r).map(([k,e])=>[k,(e.o||[e]).filter(o=>o.p>0).map(o=>({d:o.d,p:o.p,c:o.c,u:o.u,s:o.s?1:0}))]).filter(([,v])=>v.length));
 fs.writeFileSync(F,JSON.stringify({updated:j.updated,r})); console.log('live-prices:',Object.keys(r).length,'rackets, updated',j.updated);
}catch(e){ console.log('live-prices: fetch failed ('+e.message+'), keeping',prev.updated); if(!fs.existsSync(F)) fs.writeFileSync(F,JSON.stringify(prev)); }
