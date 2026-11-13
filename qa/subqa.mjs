// Email forms (newsletter + price alert) post to /api/subscribe and show the localized result. Uses @qa.invalid (validated, never stored).
import { chromium } from 'playwright-core'; import fs from 'fs';
const B=(process.argv[2]||'http://127.0.0.1:'+(process.env.QA_PORT||4987)+'').replace(/\/$/,''); const errs=[];
const CHROME=fs.existsSync('/usr/bin/google-chrome')?'/usr/bin/google-chrome':'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'; // CI is Linux; local runs are macOS
const b=await chromium.launch({executablePath:CHROME,args:['--no-sandbox']}); const pg=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
const R=(await (await fetch(B+'/cards.json')).json())[0].s;
// Real submits need a Turnstile token. Cloudflare's always-pass test keys are used on localhost (Base.astro WP_TS); on the
// live site automated browsers get no token, so there the forms are only checked to render. Run against
// `wrangler pages dev` with TURNSTILE_SECRET=1x0000000000000000000000000000000AA for the full submit test.
const LOCAL=/^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(B);
// [path, form, opener (clicked first), result element]
const CASES=[['/','form[data-sub=news]',null,'.ok'],['/pt/','form[data-sub=news]',null,'.ok'],['/es/','form[data-sub=news]',null,'.ok'],
 ['/rackets/'+R+'/','#rk-alert form','.pxwatch .pxalert-cta','.ok'],['/black-friday/','form[data-sub=nl]',null,'.nl-m']];
for(const [path,sel,opener,res] of CASES){
 await pg.goto(B+path,{waitUntil:'load'}); await pg.waitForTimeout(800); if(opener){const o=await pg.$(opener); if(!o){errs.push(path+': no '+opener);continue} await o.evaluate(x=>x.click()); await pg.waitForTimeout(400);}
 const f=await pg.$(sel); if(!f){errs.push(path+': no '+sel);continue}
 if(!LOCAL) continue;
 await f.$eval('input[type=email]',i=>{i.value='qa-'+Date.now()+'@qa.invalid'; i.focus();}); await f.$$eval('input[type=checkbox]',cs=>cs.forEach(c=>c.checked=true));
 await pg.waitForFunction(s=>window.wpTs&&wpTs.token(document.querySelector(s)),sel,{timeout:10000}).catch(()=>errs.push(path+': no Turnstile token'));
 await f.evaluate(x=>x.requestSubmit());
 await pg.waitForFunction(([s,r])=>{const e=document.querySelector(s+' '+r); return e&&!e.hidden&&e.textContent.trim();},[sel,res],{timeout:8000}).catch(()=>{});
 const r=await f.$eval(res,o=>({t:o.textContent.trim(),ok:o.dataset.ok||o.closest('dialog')?.dataset.ok||'',h:o.hidden})); if(r.h||!r.ok||r.t!==r.ok) errs.push(`${path} ${sel}: got "${r.t}"`);
}
const bad=await fetch(B+'/api/subscribe',{method:'POST',headers:{'content-type':'application/json',origin:new URL(B).origin},body:'{"email":"nope"}'}); if(bad.status!==400) errs.push('invalid email not rejected: '+bad.status);
for(const o of [null,'https://evil.example']){ const r=await fetch(B+'/api/subscribe',{method:'POST',headers:{'content-type':'application/json',...(o?{origin:o}:{})},body:'{"email":"qa-origin@qa.invalid"}'}); if(r.status!==403) errs.push(`origin ${o} not rejected: ${r.status}`); }
await b.close(); console.log(errs.length?'SUBQA FAIL\n '+errs.join('\n '):'subqa: pass'); process.exit(errs.length?1:0);
