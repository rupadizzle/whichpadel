// The country sets the currency. Choosing another country switches the currency, a reload keeps it,
// and a shop that charges in another currency still carries the approx. marker.
import { chromium } from 'playwright-core';
const B=(process.argv[2]||'http://127.0.0.1:'+(process.env.QA_PORT||4987)+'').replace(/\/$/,''); const errs=[]; const ok=(c,m)=>{ if(!c) errs.push(m); };
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']}); const pg=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
const R=(await (await fetch(B+'/cards.json')).json()).find(r=>r.o?.length).s;
for(const [home,rk] of [['/es/','/es/palas/'],['/','/rackets/']]){
 await pg.goto(B+home,{waitUntil:'networkidle'}); await pg.evaluate(()=>localStorage.clear()); await pg.goto(B+rk+R+'/',{waitUntil:'networkidle'});
 await pg.click('#rgn-btn'); await pg.click('[data-rgn="US"]'); await pg.click('[data-rgn-save]');
 let t=await pg.$eval('.price-big .pz',e=>e.textContent);
 ok(/\$|No US shop yet|Aún no hay tienda|Pas encore|Ainda sem|Ancora nessun|Noch kein/.test(t),`${home}: US country did not set USD (${t})`);
 await pg.click('#rgn-btn'); await pg.click('[data-rgn="GB"]'); await pg.click('[data-rgn-save]');
 const lab=await pg.$eval('#rgn-btn',e=>e.textContent); const tGB=await pg.$eval('.price-big .pz',e=>e.textContent);
 ok(lab.includes('GB')&&lab.includes('£')&&!lab.includes('$'),`${home}: GB did not switch currency to £ (${lab})`); ok(tGB.includes('£'),`${home}: GBP price missing (${tGB})`);
 await pg.reload({waitUntil:'networkidle'}); const t2=await pg.$eval('.price-big .pz',e=>e.textContent); ok(t2.includes('£'),`${home}: currency not saved after reload (${t2})`);
 await pg.click('#rgn-btn'); await pg.click('[data-rgn="PT"]'); await pg.click('[data-rgn-save]');
 const tPT=await pg.$eval('#rgn-btn',e=>e.textContent); ok(tPT.includes('PT')&&tPT.includes('€')&&!tPT.includes('£'),`${home}: Portugal kept another currency (${tPT})`);
 await pg.evaluate(()=>{const e=document.querySelector('.price-big .pz'); if(!e||!e.dataset.o) return; const o=JSON.parse(e.dataset.o); if(!o[0]) return; o[0]={...o[0],c:'GBP'}; e.dataset.o=JSON.stringify(o); window.wpApply();});
 const ap=await pg.$eval('.price-big .pz',e=>({cv:e.classList.contains('cv'),ap:getComputedStyle(e,'::after').content}));
 ok(ap.cv&&/approx|aprox|env|circa|ca\./.test(ap.ap),`${home}: approx marker missing`);
 const n=await pg.$$eval('.pz',es=>[...new Set(es.map(e=>e.textContent.replace(/[\d\s.,]/g,'')).filter(x=>x&&x.length<3))]); ok(n.length<=1,`${home}: mixed currencies on page ${n}`);
}
await b.close(); console.log(errs.length?'CURQA FAIL\n '+errs.join('\n '):'curqa: pass'); process.exit(errs.length?1:0);
