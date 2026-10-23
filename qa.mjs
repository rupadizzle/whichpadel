// .hn = stretched link: tap area is the whole compare header card (::after inset:0), so its own box height is not the tap target.
import { chromium } from 'playwright-core';
import fs from 'fs';
import { layoutQA } from './layoutqa.mjs';
const B='http://127.0.0.1:4987'; const CMP3=Object.entries(JSON.parse(fs.readFileSync('data/images.json'))).filter(([k,v])=>v.ok).slice(40,43).map(x=>x[0]).join(','); const issues=[]; const log=(...a)=>{console.log(...a)};
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
// 1. link crawl from dist files
const files=[]; (function w(d){for(const f of fs.readdirSync(d,{withFileTypes:true})){const p=d+'/'+f.name; f.isDirectory()?w(p):p.endsWith('.html')&&files.push(p);}})('dist');
const exists=u=>{u=u.split('#')[0].split('?')[0]; if(u==='') return true; const p='dist'+decodeURI(u); return fs.existsSync(p)&&(fs.statSync(p).isFile()||fs.existsSync(p+'/index.html'));};
const titles={},descs={}; let bad=new Set();
for(const f of files){const h=fs.readFileSync(f,'utf8'); const pg=f.slice(4);
 for(const m of h.matchAll(/(?:href|src)="(\/[^"]*)"/g)){ if(!m[1].includes('${')&&!exists(m[1])) bad.add(pg+' -> '+m[1]); }
 const t=(h.match(/<title>(.*?)<\/title>/)||[])[1]; (titles[t]??=[]).push(pg);
 const d=(h.match(/<meta name="description" content="([^"]*)"/)||[])[1]; (descs[d]??=[]).push(pg);
 const h1=(h.match(/<h1[\s>]/g)||[]).length; if(h1!==1) issues.push(`${pg}: ${h1} h1`);
 for(const m of h.matchAll(/<img [^>]*>/g)) if(!/alt="/.test(m[0])||!/width=/.test(m[0])) issues.push(pg+' img missing alt/size');
 for(const m of h.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) try{JSON.parse(m[1])}catch{issues.push(pg+' bad jsonld')}
}
for(const [t,p] of Object.entries(titles)) if(p.length>1&&!p.every(x=>x.includes('404'))) issues.push('dup title '+t+' '+p.slice(0,3));
for(const [t,p] of Object.entries(descs)) if(p.length>1) issues.push('dup desc '+p.slice(0,3));
log('pages',files.length,'broken internal',bad.size,[...bad].slice(0,10));
// 2. overflow + tap targets
const pages=['/','/brands/bullpadel/2027/','/tools/real-weight/','/black-friday-padel-rackets/','/players/','/players/agustin-tapia/','/best/best-value-padel-rackets/','/rackets/adidas-2026-world-cup-argentina/','/compare/?r=adidas-2026-world-cup-argentina,adidas-2026-world-cup-belgium','/compare/?r='+CMP3,'/compare/','/best/best-padel-rackets-for-beginners/','/brands/','/brands/bullpadel/','/padel-rackets/','/best/best-padel-racket-2026/','/best/best-womens-padel-rackets/','/brands/nox/','/privacy/','/affiliate-disclosure/','/404.html','/compare/adidas-metalbone-2026-vs-nox-at10-pro-cup-hard-2026/','/es/','/es/palas-padel/','/es/mejores-palas-padel/','/es/comparador-palas-padel/?r=adidas-metalbone-2026,nox-at10-pro-cup-hard-2026'];
for(const w of (process.env.QA_FAST?[]:[360,390,768,1280])){ const c=await b.newContext({viewport:{width:w,height:800}}); const p=await c.newPage();
 for(const u of pages){ await p.goto(B+u); await p.waitForTimeout(400);
  const r=await p.evaluate(()=>{const W=document.documentElement.clientWidth; const o=[];
   if(document.documentElement.scrollWidth>W+1) o.push('overflow '+document.documentElement.scrollWidth);
   const wide=[...document.querySelectorAll('body *')].filter(e=>{const b=e.getBoundingClientRect(); return b.right>W+1&&b.width>0&&!e.closest('.tscroll')&&getComputedStyle(e).position!=='fixed'&&!(()=>{for(let a=e.parentElement;a;a=a.parentElement){const o=getComputedStyle(a).overflowX;if(o==='auto'||o==='scroll'||o==='hidden'&&a!==document.body)return true}return false})()}).slice(0,3).map(e=>e.className||e.tagName);
   if(wide.length) o.push('wide:'+wide.join(','));
   const small=[...document.querySelectorAll('a,button,select,input,label.cmpbox')].filter(e=>{const s=getComputedStyle(e); if(s.display==='none'||s.visibility==='hidden'||e.closest('.legal,.prose,.disc,.muted,p.small,.chipset,p')||e.classList.contains('hn')) return false; const b=e.getBoundingClientRect(); return b.width>0&&(b.height<44)&&!(e.tagName==='INPUT'&&e.type==='checkbox')&&!e.closest('label.cmpbox')||false;}).map(e=>(e.tagName+'.'+e.className+':'+(e.textContent||'').trim().slice(0,20)+':'+Math.round(e.getBoundingClientRect().height)));
   if(small.length) o.push('small:'+[...new Set(small)].slice(0,6).join(' | '));
   return o;});
  if(r.length) issues.push(`${w} ${u}: ${r.join(' ; ')}`);
 } await c.close(); }
// 3. interactions
const c=await b.newContext({viewport:{width:1280,height:900}}); const p=await c.newPage(); p.setDefaultTimeout(8000); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>{errs.push('dialog:'+d.message());d.dismiss()});
const t=async(name,fn)=>{try{await fn();log('ok',name)}catch(e){issues.push('FAIL '+name+': '+e.message.split('\n')[0])}};
await p.goto(B+'/');
await t('header finder',async()=>{await p.click('.nav .cta'); await p.waitForURL(/racket-finder/);});
await t('finder quiz',async()=>{await p.click('#fq label:has-text("Advanced")'); await p.click('#fq label:has-text("Power / attack")'); await p.click('#fq label:has-text("No limit")'); await p.waitForSelector('.fq-r'); const n=await p.locator('.fq-r').count(); if(n<3) throw Error('fq '+n); if(!/level=advanced&style=power&budget=any/.test(p.url())) throw Error('url '+p.url()); const rel=await p.getAttribute('.fq-r .aff','rel'); if(rel!=='sponsored nofollow') throw Error('rel'); log(' finder ->',await p.textContent('.fq-m'),'|',await p.textContent('.fq-p')); await p.goto(p.url()); await p.waitForSelector('.fq-r');});
await p.goto(B+'/');
await t('dropdown',async()=>{await p.click('.dd>button'); if(!await p.isVisible('.dd .menu a')) throw Error('menu hidden'); await p.click('.dd .menu a >> nth=0'); await p.waitForURL(/best/); await p.goBack();});
await t('home finder cta',async()=>{if(!await p.isVisible('.fcta-card')) throw Error('no cta');});
await t('clear',async()=>{await p.click('#f-clear'); await p.waitForTimeout(400); const n=await p.textContent('#count'); if(!n.startsWith('319')&&!n.startsWith(String(await p.evaluate(()=>document.getElementById('tbl').dataset.total)))) throw Error(n);});
await t('filters',async()=>{await p.selectOption('#f-brand','Nox'); for(const [n,v] of [['f-shape','diamond'],['f-balance','high'],['f-core','hard']]){await p.check(`input[name=${n}][value=${v}]`,{force:true}); await p.waitForTimeout(300);} log(' filters ->',await p.textContent('#count')); await p.click('#f-clear'); await p.fill('#f-max','100'); await p.waitForTimeout(500); log(' max100 ->',await p.textContent('#count')); await p.fill('#f-q','vertex'); await p.waitForTimeout(500); log(' q ->',await p.textContent('#count')); await p.click('#f-clear'); await p.waitForTimeout(300);});
await t('sort',async()=>{for(const v of ['gbp:1','gbp:-1','power:-1','control:-1','forgiveness:-1','value:-1','year:-1','model:1']){await p.selectOption('#f-sort',v); await p.waitForTimeout(250);} const first=await p.textContent('#tbl .rcard h3'); log(' A-Z first',first); await p.selectOption('#f-sort','gbp:1'); await p.waitForTimeout(300); log(' cheapest',await p.textContent('#tbl .rcard .price'));});
await t('more',async()=>{await p.click('#more'); await p.waitForTimeout(300); const n=await p.locator('#tbl .rcard').count(); if(n!==48) throw Error('cards '+n);});
await t('hero search',async()=>{await p.fill('.search input','metalbone'); await p.click('.search button'); await p.waitForTimeout(700); log(' search ->',await p.textContent('#count')); await p.click('#f-clear'); await p.waitForTimeout(300);});
await t('compare tick',async()=>{const cb=p.locator('#tbl .cmp'); await cb.nth(0).check(); await cb.nth(1).check(); if(!await p.isVisible('#cmpbar')) throw Error('bar'); await p.click('#cmp-go2'); await p.waitForURL(/compare\/\?r=/); await p.waitForSelector('.cvals'); });
await t('compare add via sheet',async()=>{await p.click('.slot-add'); await p.fill('#sheet-q','vertex'); await p.waitForTimeout(200); await p.click('#sheet-list button >> nth=0'); const n=await p.locator('.chead .hc').count(); if(n!==3) throw Error('hc '+n); if(!/r=.*,.*,/.test(p.url())) throw Error('url');});
await t('compare swap+remove',async()=>{await p.click('.hc [data-add] >> nth=0'); await p.click('#sheet-list button >> nth=3'); await p.click('.hc [data-rm] >> nth=2'); if(await p.locator('.chead .hc').count()!==2) throw Error('rm');});
await t('newsletter',async()=>{await p.fill('.news input[type=email]','a@b.co'); await p.click('.news button'); await p.waitForSelector('.news .ok',{state:'visible',timeout:8000}).catch(()=>{throw Error('no ok')}); /* static server: shows localized error; real success checked by subqa on preview */});
await p.goto(B+'/rackets/adidas-2026-world-cup-argentina/');
await t('price alert',async()=>{await p.fill('.alert-panel input[type=email]','a@b.co'); await p.click('.alert-panel button'); await p.waitForSelector('.alert-panel .ok',{state:'visible',timeout:8000}).catch(()=>{throw Error('no ok')}); /* static server: shows localized error; real success checked by subqa on preview */});
await t('racket compare link',async()=>{await p.click('.buybox .btn-sm'); await p.waitForURL(/compare/);});
await p.goto(B+'/best/best-padel-rackets-for-beginners/');
await t('best compare',async()=>{const cb=p.locator('.cmp'); await cb.nth(0).check(); await cb.nth(1).check(); await p.click('.toolbar button'); await p.waitForURL(/compare/);});
await p.goto(B+'/brands/'); await t('brand click',async()=>{await p.click('.bcard >> nth=0'); await p.waitForURL(/brands\/.+/);});
await t('brand compare',async()=>{const cb=p.locator('.cmp'); await cb.nth(0).check(); await cb.nth(1).check(); await p.click('.toolbar button'); await p.waitForURL(/compare/);});
// mobile menu + finder from another page
const m=await (await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true})).newPage(); m.setDefaultTimeout(8000);
await m.goto(B+'/brands/');
await t('mobile burger+finder',async()=>{await m.tap('.burger'); await m.tap('.nav .cta'); await m.waitForURL(/racket-finder/); await m.waitForTimeout(400); if(await m.isVisible('.nav')) throw Error('nav still open');});
await t('mobile best list link',async()=>{await m.tap('.burger'); await m.tap('.dd .menu a >> nth=1'); await m.waitForURL(/best/);});
await m.goto(B+'/rackets/adidas-2026-world-cup-argentina/'); await t('mobile sticky cta',async()=>{await m.waitForTimeout(400); if(await m.evaluate(()=>document.getElementById('stickycta').classList.contains('show'))) throw Error('shown while price card visible'); await m.evaluate(()=>scrollTo(0,document.body.scrollHeight)); await m.waitForTimeout(500); if(!await m.evaluate(()=>document.getElementById('stickycta').classList.contains('show'))) throw Error('not shown');});
await m.goto(B+'/'); await t('mobile filter sheet',async()=>{await m.tap('#f-open'); await m.tap('input[name=f-shape][value=diamond] + span'); await m.waitForTimeout(400); const c=await m.textContent('#count3'); await m.tap('#f-done'); if(await m.isVisible('#f-done')) throw Error('open'); log(' sheet diamond ->',c);});
await m.goto(B+'/rackets/adidas-2026-world-cup-argentina/'); await t('region picker',async()=>{await m.tap('#rgn-btn'); await m.tap('[data-rgn=US]'); await m.tap('[data-cur=USD]'); await m.tap('[data-rgn-save]'); const x=await m.textContent('.price-big .pz'); if(!/^\$/.test(x)) throw Error('price '+x); await m.evaluate(()=>localStorage.clear());});
for(const f of files){const h=fs.readFileSync(f,'utf8'); if(h.includes('≈')) issues.push('dual/approx price marker in '+f.slice(4));}
if(!process.env.QA_FAST) issues.push(...await layoutQA(b));
log('errors',errs); log('ISSUES\n'+issues.join('\n'));
await b.close();
const { execSync } = await import('child_process');
if(!process.env.QA_FAST){ try{ execSync('node seoqa.mjs',{stdio:'inherit'}); }catch(e){ issues.push('SEOQA FAILED'); }
try{ execSync('node curqa.mjs '+B,{stdio:'inherit'}); }catch(e){ issues.push('CURQA FAILED'); }
try{ execSync('node pickerqa.mjs '+B,{stdio:'inherit'}); }catch(e){ issues.push('PICKERQA FAILED'); }
try{ execSync('node parity.mjs '+B,{stdio:'inherit'}); }catch(e){ issues.push('PARITY FAILED'); console.log('PARITY FAILED'); } }
if(errs.length||issues.length){ console.log('QA FAIL'); process.exit(1); } else console.log('QA PASS');
