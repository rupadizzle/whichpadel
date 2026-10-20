// Email forms (newsletter + price alert) post to /api/subscribe and show the localized result. Uses @qa.invalid (validated, never stored).
import { chromium } from 'playwright-core';
const B=(process.argv[2]||'http://127.0.0.1:4987').replace(/\/$/,''); const errs=[];
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']}); const pg=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
const R=(await (await fetch(B+'/cards.json')).json())[0].s;
for(const [path,sel] of [['/','form[data-sub=news]'],['/pt/','form[data-sub=news]'],['/rackets/'+R+'/','form[data-sub=alert]'],['/es/','form[data-sub=alert]']]){
 await pg.goto(B+path,{waitUntil:'networkidle'}); const f=await pg.$(sel); if(!f){errs.push(path+': no '+sel);continue}
 await f.$eval('input[type=email]',i=>i.value='qa-'+Date.now()+'@qa.invalid'); await f.$eval('button',x=>x.click());
 await pg.waitForFunction(s=>!document.querySelector(s+' .ok').hidden,sel,{timeout:8000}).catch(()=>{});
 const r=await f.$eval('.ok',o=>({t:o.textContent,ok:o.dataset.ok,h:o.hidden})); if(r.h||r.t!==r.ok) errs.push(`${path} ${sel}: got "${r.t}"`);
}
const bad=await fetch(B+'/api/subscribe',{method:'POST',headers:{'content-type':'application/json'},body:'{"email":"nope"}'}); if(bad.status!==400) errs.push('invalid email not rejected: '+bad.status);
await b.close(); console.log(errs.length?'SUBQA FAIL\n '+errs.join('\n '):'subqa: pass'); process.exit(errs.length?1:0);
