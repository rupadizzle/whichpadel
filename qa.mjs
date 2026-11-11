// .hn = stretched link: tap area is the whole compare header card (::after inset:0), so its own box height is not the tap target.
import { chromium } from 'playwright-core';
import fs from 'fs';
import { layoutQA } from './layoutqa.mjs';
const B='http://127.0.0.1:'+(process.env.QA_PORT||4987)+''; const CMP3=Object.entries(JSON.parse(fs.readFileSync('data/images.json'))).filter(([k,v])=>v.ok).slice(40,43).map(x=>x[0]).join(','); const issues=[]; const log=(...a)=>{console.log(...a)};
const CHROME=fs.existsSync('/usr/bin/google-chrome')?'/usr/bin/google-chrome':'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const b=await chromium.launch({executablePath:CHROME,args:['--no-sandbox']});
// 1. link crawl from dist files
const files=[]; (function w(d){for(const f of fs.readdirSync(d,{withFileTypes:true})){const p=d+'/'+f.name; f.isDirectory()?w(p):p.endsWith('.html')&&files.push(p);}})('dist');
const exists=u=>{u=u.split('#')[0].split('?')[0]; if(u==='') return true; const p='dist'+decodeURI(u); return fs.existsSync(p)&&(fs.statSync(p).isFile()||fs.existsSync(p+'/index.html'));};
const titles={},descs={}; let bad=new Set();
for(const f of files){const h=fs.readFileSync(f,'utf8'); const pg=f.slice(4);
 for(const m of h.matchAll(/(?:href|src)="(\/[^"]*)"/g)){ if(!m[1].includes('${')&&!exists(m[1])) bad.add(pg+' -> '+m[1]); }
 const t=(h.match(/<title>(.*?)<\/title>/)||[])[1]; if(!/<meta name="robots" content="noindex/.test(h)) (titles[t]??=[]).push(pg); /* noindex pages are not in search results */
 const d=(h.match(/<meta name="description" content="([^"]*)"/)||[])[1]; if(!/<meta name="robots" content="noindex/.test(h)) (descs[d]??=[]).push(pg);
 const noindex=/<meta name="robots" content="noindex/.test(h); /* internal noindex pages (design boards, experiments) are not checked for h1/img */
 const h1=(h.replace(/<script[\s\S]*?<\/script>/g,'').match(/<h1[\s>]/g)||[]).length; if(h1!==1&&!noindex) issues.push(`${pg}: ${h1} h1`); /* h1 inside a script template is not markup */
 if(!noindex) for(const m of h.matchAll(/<img [^>]*>/g)) if(!/alt="/.test(m[0])||!/width=/.test(m[0])) issues.push(pg+' img missing alt/size');
 for(const m of h.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) try{JSON.parse(m[1])}catch{issues.push(pg+' bad jsonld')}
}
for(const [t,p] of Object.entries(titles)) if(p.length>1&&!p.every(x=>x.includes('404'))) issues.push('dup title '+t+' '+p.slice(0,3));
for(const [t,p] of Object.entries(descs)) if(p.length>1) issues.push('dup desc '+p.slice(0,3));
log('pages',files.length,'broken internal',bad.size,[...bad].slice(0,10));
// 2. overflow + tap targets
const pages=['/','/brands/bullpadel/2027/','/tools/real-weight/','/black-friday/','/players/','/players/agustin-tapia/','/best/best-value-padel-rackets/','/rackets/adidas-2026-world-cup-argentina/','/compare/?r=adidas-2026-world-cup-argentina,adidas-2026-world-cup-belgium','/compare/?r='+CMP3,'/compare/','/best/best-padel-rackets-for-beginners/','/brands/','/brands/bullpadel/','/padel-rackets/','/best/best-padel-racket-2026/','/best/best-womens-padel-rackets/','/brands/nox/','/privacy/','/affiliate-disclosure/','/404.html','/compare/adidas-metalbone-2026-vs-nox-at10-pro-cup-hard-2026/','/es/','/es/palas-padel/','/es/mejores-palas-padel/','/es/comparador-palas-padel/?r=adidas-metalbone-2026,nox-at10-pro-cup-hard-2026'];
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
const c=await b.newContext({viewport:{width:1280,height:900}}); await c.addInitScript(()=>{try{localStorage.wp_ck='0'}catch(e){}}); const p=await c.newPage(); p.setDefaultTimeout(8000); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>{errs.push('dialog:'+d.message());d.dismiss()});
const t=async(name,fn)=>{try{await fn();log('ok',name)}catch(e){issues.push('FAIL '+name+': '+e.message.split('\n')[0])}};
await p.goto(B+'/');
await t('header finder',async()=>{await p.click('.nav .cta'); await p.waitForURL(/\/finder\//);});
await t('finder quiz',async()=>{await p.click('.fz-prod[data-prod=racket]'); for(const x of ['Advanced','Either side','Power','Latest','No limit']) await p.locator('[data-scr=q] .fz-o:visible',{hasText:x}).first().click(); await p.waitForSelector('[data-scr=res]:not([hidden]) .fz-pick',{timeout:8000}); const n=await p.locator('[data-scr=res] .fz-pick').count(); if(n<2) throw Error('picks '+n); for(const q of ['level=advanced','side=either','style=power','prio=latest','budget=any']) if(!p.url().includes(q)) throw Error('url '+p.url()); const ext=await p.locator('[data-scr=res] a[href^="http"]').evaluateAll(as=>as.map(a=>a.rel)); if(ext.some(r=>r!=='sponsored nofollow')) throw Error('rel '+ext); const card=p.locator('[data-scr=res] .rk-a[role=button]').first(); const slug=await card.evaluate(a=>a.closest('[data-s]').dataset.s); await card.click(); await p.waitForTimeout(300); if(!((await p.getAttribute('#fz-sticky a.btn','href'))||'').includes(slug)) throw Error('pick not promoted '+slug); if(!/\/rackets\/\?r=/.test(await p.getAttribute('[data-scr=res] a.btn[href*="?r="]','href')||'')) throw Error('compare link'); await p.goto(p.url()); await p.waitForSelector('[data-scr=res]:not([hidden]) .fz-pick');}); /* product cards, 5 questions, result with picks (tap one to feature it) + 'compare these' link; answers live in the URL and reload restores the result */
await p.goto(B+'/');
await t('dropdown',async()=>{await p.click('.dd>button'); if(!await p.isVisible('.dd .menu a')) throw Error('menu hidden'); await p.click('.dd .menu a[href*="/best/"] >> nth=0'); await p.waitForURL(/best/); await p.goBack();});
await t('home finder entry',async()=>{const h=await p.getAttribute('.nav .cta','href'); if(!/\/finder\//.test(h||'')||!await p.isVisible('.nav .cta')) throw Error('cta '+h);}); /* the home finder card was retired; the header CTA is the entry on every page */
await t('home strips',async()=>{const s=await p.evaluate(()=>[...document.querySelectorAll('main .hrow-wrap, main section')].map(x=>({n:x.querySelectorAll('.rk').length,all:(x.querySelector('.sec-head a, .hrow-head a')||{}).getAttribute?.('href')})).filter(x=>x.n)); ['/rackets/','/shoes/','/balls/','/deals/'].forEach((h,i)=>{if(!s[i]||s[i].n<6||s[i].all!==h) throw Error('strip '+i+' '+JSON.stringify(s[i]));});}); /* replaces the retired top-picks row: rackets, shoes, balls, deals strips with 6+ cards and the right 'See all' */
await t('hero search',async()=>{await p.click('#gs-open'); await p.waitForSelector('#gs[open]'); await p.fill('#gs-q','metalbone'); await p.waitForSelector('#gs-list a[role=option]'); const n=await p.locator('#gs-list a[role=option]').count(); if(n<1) throw Error('hits '+n); await p.click('#gs-list a[role=option] >> nth=0'); await p.waitForURL(/metalbone/);});
await p.goto(B+'/rackets/'); await p.waitForTimeout(500);
await t('hub filters',async()=>{await p.check('input[name=h-brand][value=nox]',{force:true}); for(const [n,v] of [['h-shape','diamond'],['h-bal','high'],['h-hard','hard']]){await p.check(`input[name=${n}][value=${v}]`,{force:true}); await p.waitForTimeout(300);} log(' filters ->',await p.textContent('#h-count')); if(!/brand=nox/.test(p.url())) throw Error('url '+p.url()); await p.click('#h-clear'); await p.fill('#h-max','100'); await p.waitForTimeout(500); log(' max100 ->',await p.textContent('#h-count')); await p.click('#h-clear'); await p.waitForTimeout(300); const n=await p.textContent('#h-count'); if(!n.startsWith('319')&&!/^\d{3}/.test(n)) throw Error(n);});
await t('hub sort',async()=>{for(const v of ['best','price','new','pop']){await p.selectOption('#h-sort',v); await p.waitForTimeout(250);} await p.selectOption('#h-sort','price'); await p.waitForTimeout(300); const pr=await p.locator('#h-grid .rk-pv').evaluateAll(es=>es.slice(0,6).map(e=>parseFloat((e.textContent.match(/[\d.,]+/)||['NaN'])[0].replace(',','.')))); log(' cheapest',pr.join(' ')); const v=pr.filter(x=>!isNaN(x)); if(v.length<2||v.some((x,i)=>i&&x<v[i-1])) throw Error('price sort not ascending '+pr);});
await t('hub more',async()=>{await p.click('#h-more'); await p.waitForTimeout(300); const n=await p.locator('#h-grid .rk').count(); if(n!==48) throw Error('cards '+n);});
await p.goto(B+'/rackets/'); await p.waitForTimeout(500);
await t('compare tick',async()=>{const cb=p.locator('#h-grid .rk-cb'); await cb.nth(0).check(); await cb.nth(1).check(); if(!await p.isVisible('#h-tray')) throw Error('tray'); await p.click('#h-go'); await p.waitForSelector('#cmp-take[open] .cvals',{timeout:8000}); });
await t('compare add via sheet',async()=>{await p.locator('#cmp-take input[name=cmpn][value="3"]').check(); await p.fill('#sheet-q','vertex'); await p.waitForTimeout(200); await p.click('#sheet-list button >> nth=0'); const n=await p.locator('#cmp-take .chead .hc').count(); if(n!==3) throw Error('hc '+n);});
await t('compare swap+remove',async()=>{await p.click('#cmp-take .hc [data-add] >> nth=0'); await p.click('#sheet-list button >> nth=3'); await p.click('#cmp-take .hc [data-rm] >> nth=2'); if(await p.locator('#cmp-take .chead .hc').count()!==2) throw Error('rm');});
if(await p.locator('#cmp-take[open]').count()) await p.click('#cmp-take-x');
await t('newsletter',async()=>{await p.fill('.news input[type=email]','a@b.co'); await p.click('.news button'); await p.waitForSelector('.news .ok',{state:'visible',timeout:8000}).catch(()=>{throw Error('no ok')}); /* static server: shows localized error; real success checked by subqa on preview */});
await p.goto(B+'/rackets/adidas-2026-world-cup-argentina/');
await t('price alert',async()=>{await p.click('.pxalert-cta'); await p.waitForSelector('#rk-alert[open]'); await p.fill('#rk-alert input[type=email]','a@b.co'); await p.click('#rk-alert form button[type=submit]'); await p.waitForSelector('#rk-alert .ok',{state:'visible',timeout:8000}).catch(()=>{throw Error('no ok')}); await p.keyboard.press('Escape'); /* static server: shows localized error; real success checked by subqa on preview */});
await t('racket compare link',async()=>{await p.click('.rpcmp'); await p.waitForURL(/\/rackets\/\?r=/); await p.waitForSelector('#cmp-take[open] .cvals',{timeout:8000});});
await p.goto(B+'/best/best-padel-rackets-for-beginners/');
await t('best list',async()=>{const r=await p.evaluate(()=>({cards:document.querySelectorAll('.hub-grid .rk').length,ranks:[...document.querySelectorAll('.rk .rank')].slice(0,3).map(e=>e.textContent.trim()),hrefs:[...document.querySelectorAll('.hub-grid .rk .rk-a')].slice(0,3).map(a=>a.getAttribute('href')),finder:(document.querySelector('.fcard a.btn')||{}).getAttribute?.('href')})); if(r.cards<3||r.ranks.join()!=='#1,#2,#3'||!r.hrefs.every(h=>/^\/rackets\//.test(h))||!/\/finder\//.test(r.finder||'')) throw Error(JSON.stringify(r));}); /* best lists no longer have compare ticks: check ranked cards link to rackets and the finder card */
await p.goto(B+'/brands/'); await t('brand click',async()=>{await p.click('.bcard >> nth=0'); await p.waitForURL(/brands\/.+/);});
await t('brand cards',async()=>{const n=await p.locator('#rgrid .rk').count(); if(n<1) throw Error('cards '+n);});
// mobile menu + finder from another page
const m=await (await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true})).newPage(); m.setDefaultTimeout(8000);
await m.goto(B+'/brands/');
await t('mobile burger+finder',async()=>{await m.tap('.burger'); await m.tap('.nav .cta'); await m.waitForURL(/\/finder\//); await m.waitForTimeout(400); if(await m.isVisible('.nav')) throw Error('nav still open');});
await m.goto(B+'/brands/');
await t('mobile best list link',async()=>{await m.tap('.burger'); if(!await m.isVisible('.dd .menu a[href*="/best/"]')) await m.tap('.dd>button'); await m.tap('.dd .menu a[href*="/best/"] >> nth=0'); await m.waitForURL(/best/);});
await m.goto(B+'/rackets/adidas-2026-world-cup-argentina/'); await t('mobile sticky cta',async()=>{await m.waitForTimeout(400); const st=await m.evaluate(()=>({show:document.getElementById('stickycta').classList.contains('show'),box:getComputedStyle(document.getElementById('buybox')).display})); if(!st.show||st.box!=='none') throw Error('bar '+JSON.stringify(st));});
await m.goto(B+'/rackets/'); await t('mobile filter sheet',async()=>{await m.tap('#h-open'); await m.waitForTimeout(300); await m.tap('input[name=h-shape][value=diamond] + span'); await m.waitForTimeout(400); const c=await m.textContent('#h-apply'); await m.tap('#h-apply'); await m.waitForTimeout(300); if(await m.isVisible('#h-apply')) throw Error('open'); log(' sheet diamond ->',c);});
await m.goto(B+'/rackets/adidas-2026-world-cup-argentina/'); await t('region picker',async()=>{await m.tap('#rgn-btn'); await m.tap('[data-rgn=US]'); await m.tap('[data-rgn-save]'); const x=await m.textContent('.price-big .pz'); if(!/^\$/.test(x)&&!/No US shop yet/.test(x)) throw Error('price '+x); await m.evaluate(()=>localStorage.clear());});
for(const f of files){const h=fs.readFileSync(f,'utf8'); if(h.includes('≈')) issues.push('dual/approx price marker in '+f.slice(4));}
if(!process.env.QA_FAST) issues.push(...await layoutQA(b));
log('errors',errs); log('ISSUES\n'+issues.join('\n'));
await b.close();
const { execSync } = await import('child_process');
if(!process.env.QA_FAST){ try{ execSync('node --max-old-space-size=6144 seoqa.mjs',{stdio:'inherit'}); }catch(e){ issues.push('SEOQA FAILED'); }
try{ execSync('node curqa.mjs '+B,{stdio:'inherit'}); }catch(e){ issues.push('CURQA FAILED'); }
try{ execSync('node pickerqa.mjs '+B,{stdio:'inherit'}); }catch(e){ issues.push('PICKERQA FAILED'); }
try{ execSync('node parity.mjs '+B,{stdio:'inherit'}); }catch(e){ issues.push('PARITY FAILED'); console.log('PARITY FAILED'); } }
if(errs.length||issues.length){ console.log('QA FAIL'); process.exit(1); } else console.log('QA PASS');
