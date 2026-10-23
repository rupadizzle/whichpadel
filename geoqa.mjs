// Geo banner QA: country-confirm shown to every first-time visitor; Confirm (same/different language), Choose (picker), Close; hidden after saved choice/dismiss/bot; overlay, CLS, 44px taps, fit at 360/390/1280.
import { chromium } from 'playwright-core';
const B=process.argv[2]||'http://127.0.0.1:4987'; const bad=[]; const ok=(c,m)=>{if(!c) bad.push(m)};
const br=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const CASES=[['/','GB','United Kingdom','£'],['/','ES','Spain','€'],['/es/','ES','España','€'],['/es/','GB','Reino Unido','£'],['/','US','United States','$'],['/de/','FR','Frankreich','€'],['/fr/','SE','Suède','kr']];
const st=pg=>pg.evaluate(()=>({h:document.getElementById('geo-bn').hidden,r:localStorage.wp_region,c:localStorage.wp_cur,l:localStorage.wp_lang,s:localStorage.wp_geo_stay,p:location.pathname,d:!!document.getElementById('rgn-sheet')?.open}));
for(const w of (process.env.QA_WIDTHS?process.env.QA_WIDTHS.split(',').map(Number):[360,390,1280])){
 for(const [p,c,cn,sym] of CASES){
  const ctx=await br.newContext({viewport:{width:w,height:800}}); const pg=await ctx.newPage();
  await pg.addInitScript(()=>{window.__cls=0;new PerformanceObserver(l=>{for(const e of l.getEntries()) if(!e.hadRecentInput) window.__cls+=e.value}).observe({type:'layout-shift',buffered:true});});
  await pg.goto(B+p+'?geo='+c,{waitUntil:'load'}); await pg.waitForTimeout(400);
  const r=await pg.evaluate(()=>{const b=document.getElementById('geo-bn'); const R=b.getBoundingClientRect(); return {vis:!b.hidden,t:b.textContent,pos:getComputedStyle(b).position,ov:R.right>innerWidth+0.5||R.left<0,hs:document.documentElement.scrollWidth>innerWidth+1,cls:window.__cls,bh:[...b.querySelectorAll('button')].every(x=>{const q=x.getBoundingClientRect();return q.height>=44&&q.width>=44})};});
  const k=`${w} ${p} ${c}`; ok(r.vis,k+' not shown'); ok(r.t.includes(cn)&&r.t.includes(sym),k+' text: '+r.t); ok(r.pos==='fixed',k+' not overlay'); ok(!r.ov&&!r.hs,k+' overflow'); ok(r.cls<0.01,k+' CLS '+r.cls); ok(r.bh,k+' tap<44');
  await ctx.close();}
 const flow=async(p,c,fn)=>{const ctx=await br.newContext({viewport:{width:w,height:800}}); const pg=await ctx.newPage(); await pg.goto(B+p+'?geo='+c,{waitUntil:'load'}); await pg.waitForTimeout(300); await fn(pg); await ctx.close();};
 // confirm, same language: stays, saves GB/GBP, banner gone, not shown again
 await flow('/','GB',async pg=>{await pg.click('#geo-ok'); await pg.waitForTimeout(300); const s=await st(pg); ok(s.h&&s.r==='GB'&&s.c==='GBP'&&s.p==='/'&&!s.l,w+' confirm same '+JSON.stringify(s)); ok((await pg.textContent('#rgn-cur'))==='£',w+' picker label');
  await pg.goto(B+'/?geo=US',{waitUntil:'load'}); await pg.waitForTimeout(300); ok((await st(pg)).h,w+' shown after saved choice');});
 await flow('/','US',async pg=>{await pg.click('#geo-ok'); await pg.waitForTimeout(300); const s=await st(pg); ok(s.h&&s.r==='US'&&s.c==='USD'&&s.p==='/',w+' confirm US '+JSON.stringify(s)); ok((await pg.textContent('#rgn-cur'))==='$',w+' US label');});
 // confirm, different language: opens /es/
 await flow('/','ES',async pg=>{await pg.click('#geo-ok'); await pg.waitForURL(/\/es\//); await pg.waitForTimeout(300); const s=await st(pg); ok(s.h&&s.r==='ES'&&s.c==='EUR'&&s.l==='es',w+' confirm diff '+JSON.stringify(s));});
 await flow('/es/','GB',async pg=>{await pg.click('#geo-ok'); await pg.waitForURL(u=>!u.pathname.startsWith('/es/')); const s=await st(pg); ok(s.r==='GB'&&s.c==='GBP'&&s.l==='en',w+' confirm es->en '+JSON.stringify(s));});
 // choose: picker opens, banner gone
 await flow('/','FR',async pg=>{await pg.click('#geo-ch'); await pg.waitForTimeout(300); const s=await st(pg); ok(s.h&&s.d&&s.s==='1',w+' choose '+JSON.stringify(s));});
 // close: dismiss persists
 await flow('/','IT',async pg=>{await pg.click('#geo-x'); await pg.waitForTimeout(200); const s=await st(pg); ok(s.h&&s.s==='1'&&!s.r,w+' close '+JSON.stringify(s)); await pg.reload({waitUntil:'load'}); await pg.waitForTimeout(300); ok((await st(pg)).h,w+' shown after close');});
 // bot (webdriver, no ?geo): hidden, no geo fetch
 {const ctx=await br.newContext({viewport:{width:w,height:800}}); const pg=await ctx.newPage(); let f=0; pg.on('request',r=>{if(/\/api\/geo\/?$/.test(r.url())) f++}); await pg.goto(B+'/es/',{waitUntil:'load'}); await pg.waitForTimeout(500); ok((await st(pg)).h&&f===0,w+' shown to bot'); await ctx.close();}
}
await br.close(); console.log(bad.length?bad.join('\n')+'\nGEOQA FAIL':'GEOQA PASS'); process.exit(bad.length?1:0);
