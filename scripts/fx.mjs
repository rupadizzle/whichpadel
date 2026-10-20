// Bake daily FX reference rates into data/fx.json at build time. Keeps the previous file if the fetch fails.
// The provider is recorded here for maintenance only and is never rendered on the site.
import fs from 'fs';
const F='data/fx.json'; const prev=JSON.parse(fs.readFileSync(F,'utf8'));
try{ const r=await fetch('https://api.frankfurter.app/latest?from=EUR&to=GBP,USD,SEK',{signal:AbortSignal.timeout(8000)}); if(!r.ok) throw new Error('HTTP '+r.status);
 const j=await r.json(); if(!j.rates?.GBP||!j.rates?.USD) throw new Error('bad payload');
 const out={date:j.date,source:'ECB reference rates',base:'EUR',rates:{EUR:1,...j.rates}}; fs.writeFileSync(F,JSON.stringify(out)); console.log('fx:',out.date,JSON.stringify(out.rates));
}catch(e){ console.log('fx: fetch failed ('+e.message+'), keeping',prev.date); }
