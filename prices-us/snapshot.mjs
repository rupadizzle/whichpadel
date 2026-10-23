// Writes data/us.json from the US preview Worker: {updated, r:{racketSlug:[offers]}, s:{shoeSlug:[offers]}} (USD only). Build-time input for the US pages.
import fs from 'node:fs'; const B='https://whichpadel-us-prices-preview.rupertwallace.workers.dev';
const get=async p=>(await (await fetch(B+p)).json()).r; const slim=e=>(e.o||[e]).map(o=>({d:o.d,n:o.n,p:o.p,c:o.c,u:o.u,s:o.s}));
const [r,s]=await Promise.all([get('/api/prices'),get('/api/shoe-prices')]);
const out={updated:new Date().toISOString().slice(0,10),r:Object.fromEntries(Object.entries(r).map(([k,e])=>[k,slim(e)])),s:Object.fromEntries(Object.entries(s).map(([k,e])=>[k,slim(e)]))};
fs.writeFileSync(new URL('../data/us.json',import.meta.url),JSON.stringify(out)); console.log('rackets',Object.keys(out.r).length,'shoes',Object.keys(out.s).length);
