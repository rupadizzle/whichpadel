// Currency picker behaviour: currency is independent of country, saved, and converted prices carry the approx. marker.
import { chromium } from 'playwright-core';
const B=(process.argv[2]||'http://127.0.0.1:'+(process.env.QA_PORT||4987)+'').replace(/\/$/,''); const errs=[]; const ok=(c,m)=>{ if(!c) errs.push(m); };
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']}); const pg=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
const R=(await (await fetch(B+'/cards.json')).json()).find(r=>r.o?.length).s;
for(const [home,rk] of [['/es/','/es/palas/'],['/','/rackets/']]){
 await pg.goto(B+home,{waitUntil:'networkidle'}); await pg.evaluate(()=>localStorage.clear()); await pg.goto(B+rk+R+'/',{waitUntil:'networkidle'});
 await pg.click('#rgn-btn'); await pg.click('[data-cur="USD"]'); await pg.click('[data-rgn-save]');
 let t=await pg.$eval('.price-big .pz',e=>({t:e.textContent,cv:e.classList.contains('cv'),ap:getComputedStyle(e,'::after').content}));
 ok(t.t.includes('$'),`${home}: USD not applied (${t.t})`); ok(!t.cv||/approx|aprox|env/.test(t.ap),`${home}: approx marker missing`);
 const lab1=await pg.$eval('#rgn-btn',e=>e.textContent); await pg.click('#rgn-btn'); await pg.click('[data-rgn="GB"]'); await pg.click('[data-rgn-save]');
 const lab2=await pg.$eval('#rgn-btn',e=>e.textContent); ok(lab2.includes('GB')&&lab2.includes('$'),`${home}: country change reset currency (${lab1} -> ${lab2})`);
 await pg.reload({waitUntil:'networkidle'}); const t2=await pg.$eval('.price-big .pz',e=>e.textContent); ok(t2.includes('$'),`${home}: currency not saved after reload (${t2})`);
 await pg.click('#rgn-btn'); await pg.click('[data-cur="GBP"]'); await pg.click('[data-rgn-save]');
 const t3=await pg.$eval('.price-big .pz',e=>({t:e.textContent,cv:e.classList.contains('cv')})); ok(t3.t.includes('£'),`${home}: GBP not applied`);
 const n=await pg.$$eval('.pz',es=>[...new Set(es.map(e=>e.textContent.replace(/[\d\s.,]/g,'')).filter(x=>x&&x.length<3))]); ok(n.length<=1,`${home}: mixed currencies on page ${n}`);
}
await b.close(); console.log(errs.length?'CURQA FAIL\n '+errs.join('\n '):'curqa: pass'); process.exit(errs.length?1:0);
