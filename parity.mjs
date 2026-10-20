import { chromium } from 'playwright-core';
const base=process.argv[2]||'http://localhost:4329';
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']}); const out={};
for(const p of ['/','/es/','/fr/']){const pg=await b.newPage({viewport:{width:390,height:844}}); const errs=[]; pg.on('pageerror',e=>errs.push(e.message)); pg.on('console',m=>m.type()==='error'&&errs.push(m.text()));
 await pg.goto(base+p,{waitUntil:'networkidle'});
 const sig=await pg.evaluate(()=>[...document.querySelectorAll('main > *, body > section, .hero')].map(e=>e.tagName+'.'+e.className+'#'+e.id+':'+e.querySelectorAll('*').length));
 const geo=await pg.evaluate(()=>[...document.querySelectorAll('section')].map(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return e.className+'|'+s.paddingTop+'|'+s.marginTop+'|'+Math.round(r.width)}));
 await pg.click('#q-go'); await pg.waitForSelector('#qres .qc'); const q=await pg.$$eval('#qres .qc',x=>x.length);
 await pg.click('#more'); await pg.waitForFunction(()=>document.querySelectorAll('#tbl .rcard').length>24); const n=await pg.$$eval('#tbl .rcard',x=>x.length); const pr=await pg.$eval('#tbl .rcard:nth-child(30) .price',e=>e.textContent);
 out[p]={sig,geo,q,n,pr,errs}; await pg.close();}
await b.close();
const strip=a=>a.map(s=>s.replace(/:\d+$/,''));
console.log('struct equal es',JSON.stringify(strip(out['/'].sig))===JSON.stringify(strip(out['/es/'].sig)),'fr',JSON.stringify(strip(out['/'].sig))===JSON.stringify(strip(out['/fr/'].sig)));
console.log('geo equal es',JSON.stringify(out['/'].geo)===JSON.stringify(out['/es/'].geo),'fr',JSON.stringify(out['/'].geo)===JSON.stringify(out['/fr/'].geo));
for(const p in out) console.log(p,out[p].q,out[p].n,out[p].pr,out[p].errs);
