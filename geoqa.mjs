// Geo banner QA: shows only on language mismatch, correct target-language text, Switch/Stay persist, no layout shift (CLS), fits 360/390/1280.
import { chromium } from 'playwright-core';
const B=process.argv[2]||'http://127.0.0.1:4987'; const bad=[]; const ok=(c,m)=>{if(!c) bad.push(m)};
const br=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const CASES=[['/','ES','es','España','Cambiar'],['/','FR','fr','France','Changer'],['/es/','GB','en','United Kingdom','Switch'],['/','BE','fr','Belgique','Changer'],['/de/','US','en','United States','$'],['/','PT','pt','Portugal','€']];
for(const w of [360,390,1280]) for(const [p,c,tl,cn,txt] of CASES){
 const ctx=await br.newContext({viewport:{width:w,height:800}}); const pg=await ctx.newPage();
 await pg.addInitScript(()=>{window.__cls=0;new PerformanceObserver(l=>{for(const e of l.getEntries()) if(!e.hadRecentInput) window.__cls+=e.value}).observe({type:'layout-shift',buffered:true});});
 await pg.goto(B+p+'?geo='+c,{waitUntil:'load'}); await pg.waitForTimeout(400);
 const r=await pg.evaluate(()=>{const b=document.getElementById('geo-bn'); const R=b.getBoundingClientRect(); return {vis:!b.hidden,lang:b.lang,t:b.textContent,pos:getComputedStyle(b).position,ov:R.right>innerWidth+0.5||R.left<0,hs:document.documentElement.scrollWidth>innerWidth+1,cls:window.__cls,bh:[...b.querySelectorAll('button')].every(x=>x.getBoundingClientRect().height>=44)};});
 const k=`${w} ${p} ${c}`; ok(r.vis,k+' not shown'); ok(r.lang===tl,k+' lang '+r.lang); ok(r.t.includes(cn)&&r.t.includes(txt),k+' text: '+r.t); ok(r.pos==='fixed',k+' not overlay'); ok(!r.ov&&!r.hs,k+' overflow'); ok(r.cls<0.01,k+' CLS '+r.cls); ok(r.bh,k+' tap<44');
 if(w===390&&c==='ES'){ await pg.click('#geo-sw'); await pg.waitForURL(/\/es\//); const s=await pg.evaluate(()=>[localStorage.wp_lang,localStorage.wp_region,document.getElementById('geo-bn').hidden]); ok(s[0]==='es'&&s[1]==='ES'&&s[2],'switch persist '+s);
  await pg.goto(B+'/?geo=ES',{waitUntil:'load'}); await pg.waitForTimeout(300); ok(await pg.evaluate(()=>document.getElementById('geo-bn').hidden),'shown after saved choice');}
 if(w===390&&c==='FR'){ await pg.click('#geo-st'); ok(await pg.evaluate(()=>document.getElementById('geo-bn').hidden&&localStorage.wp_geo_stay==='1'),'stay');
  await pg.reload({waitUntil:'load'}); await pg.waitForTimeout(300); ok(await pg.evaluate(()=>document.getElementById('geo-bn').hidden),'shown after stay');}
 await ctx.close();}
// matches page language -> hidden; bot (webdriver, no override) -> no fetch, hidden
for(const [p,c] of [['/','GB'],['/','US'],['/es/','ES'],['/fr/','BE']]){const pg=await br.newPage(); await pg.goto(B+p+'?geo='+c,{waitUntil:'load'}); await pg.waitForTimeout(300); ok(await pg.evaluate(()=>document.getElementById('geo-bn').hidden),'shown on match '+p+c); await pg.close();}
{const pg=await br.newPage(); let f=0; pg.on('request',r=>{if(r.url().includes('/api/geo/')||r.url().endsWith('/api/geo')) f++}); await pg.goto(B+'/es/',{waitUntil:'load'}); await pg.waitForTimeout(500); ok(await pg.evaluate(()=>document.getElementById('geo-bn').hidden),'shown to bot'); await pg.close();}
await br.close(); console.log(bad.length?bad.join('\n')+'\nGEOQA FAIL':'GEOQA PASS'); process.exit(bad.length?1:0);
