// Compare-prices list QA (local preview :4987, mocked /api/prices): sorting, currency, country filter, expander, fallback, mobile, 6 langs.
import {chromium} from 'playwright-core'; const b=await chromium.launch(); let bad=0; const F=(m)=>{bad++;console.log('FAIL',m);};
const S='head-evo-speed-2025', T=new Date().toISOString().slice(0,10), Y=new Date(Date.now()-3*864e5).toISOString().slice(0,10);
const of=(d,p,c,s=1,t=T)=>({d,p,c,u:`https://${d}/p/${S}`,s,t,min30:p-5});
const O=[of('padelnuestro.com',90,'EUR'),of('allforpadel.com',80,'EUR',1,Y),of('decathlon.co.uk',70,'GBP'),of('padelsmith.co.uk',60,'GBP',0),of('tennis-warehouse.com',100,'USD'),of('mantissport.com',85,'EUR')];
const API={updated:'x',r:{[S]:{...O[0],min90:80,since:T,drop:0,h:[],o:O}}};
const dirs={en:'rackets',es:'es/palas',fr:'fr/raquettes',pt:'pt/raquetes',it:'it/racchette',de:'de/schlaeger'};
async function page(path,w,ls={},api=API){const pg=await b.newPage({viewport:{width:w,height:800}}); await pg.addInitScript(o=>{for(const[k,v] of Object.entries(o)) localStorage[k]=v; localStorage.wp_geo_seen='1';},ls);
 await pg.route('**/api/all-prices',r=>r.fulfill({json:api})); await pg.route('**/api/geo',r=>r.fulfill({json:{country:null}})); await pg.goto('http://127.0.0.1:'+(process.env.QA_PORT||4987)+''+path+'?px=1'); await pg.waitForTimeout(700); return pg;}
const info=pg=>pg.evaluate(()=>{const P=document.getElementById('pxcmp'); const rows=[...P.querySelectorAll('.pxl:not(details .pxl) > li')];
 return {hidden:P.hidden,main:!document.getElementById('buymain').hidden,rows:rows.map(li=>[li.querySelector('.pxs b').textContent,li.querySelector('.pxp').textContent,li.hidden,li.classList.contains('best'),li.querySelector('a').rel,li.querySelector('a').getBoundingClientRect().height]),
  other:P.querySelectorAll('details .pxl li').length,otherOpen:!!P.querySelector('details[open]'),more:P.querySelector('.pxmore')?.textContent||null,nc:P.querySelectorAll('.pxnc').length,bd:P.querySelectorAll('.pxbd').length,all:P.querySelector('#pxall')?.textContent||null,sw:document.documentElement.scrollWidth,vw:innerWidth,low:document.getElementById('pxlive').innerText,
  ext:[...P.querySelectorAll('a')].every(a=>/^https:\/\//.test(a.href)&&a.rel==='sponsored nofollow')};});
for(const w of (process.env.QA_WIDTHS?process.env.QA_WIDTHS.split(',').map(Number):[360,390,1280])) for(const [l,d] of Object.entries(dirs)){
 const pg=await page(`/${d}/${S}/`,w,{wp_region:'GB',wp_cur:'GBP'}); const x=await info(pg); const tag=`${l}@${w}`;
 // GB delivers: padelnuestro, decathlon, padelsmith(oos). unknown: allforpadel, mantis, tennis-warehouse
 if(x.hidden||x.main) F(tag+' list not shown');
 const names=x.rows.map(r=>r[0]); if(names.join()!=='Decathlon UK,Padel Nuestro,Padelsmith,All For Padel') F(tag+' sort/filter (confirmed first, fill to 4) '+names);
 if(x.nc!==1) F(tag+' nc hint '+x.nc); if(x.bd!==1) F(tag+' best label '+x.bd); if(!/6/.test(x.all||'')) F(tag+' all-N link '+x.all);
 if(!x.rows[0]?.[3]||x.rows.filter(r=>r[3]).length!==1) F(tag+' highlight');
 if(!x.rows.every(r=>/£/.test(r[1]))) F(tag+' currency '+x.rows.map(r=>r[1]));
 if(x.other!==0) F(tag+' collapse should be gone '+x.other);
 if(x.rows.some(r=>r[5]<44)) F(tag+' tap target '+x.rows.map(r=>Math.round(r[5]*10)/10).join(','));
 if(x.sw>x.vw) F(tag+' overflow '+x.sw);
 if(!x.ext) F(tag+' links'); if(!/£55|55 £/.test(x.low)) F(tag+' low30 '+x.low);
 const ov=await pg.evaluate(()=>[...document.querySelectorAll('#pxcmp *:not(.pxs):not(.pxag)')].filter(e=>e.scrollWidth>e.clientWidth+1&&getComputedStyle(e).overflow!=='visible').map(e=>e.className+':'+e.textContent.slice(0,40)).join(';')); if(ov) F(tag+' element overflow '+ov);
 await pg.close();}
// currency switch EUR + country ES: allforpadel, padelnuestro, mantis(unknown) ... ES delivers padelnuestro, allforpadel
{const pg=await page('/rackets/'+S+'/',390,{wp_region:'ES',wp_cur:'EUR'}); const x=await info(pg); if(x.rows.map(r=>r[0]).join()!=='All For Padel,Padel Nuestro,Mantis,Tennis Warehouse'||!x.rows.every(r=>/€/.test(r[1]))) F('ES/EUR '+JSON.stringify(x.rows));
 if(!/3d ago/.test(await pg.locator('#pxcmp').textContent())) F('age text');
 await pg.evaluate(()=>WP.setRC('US','USD')); const y=await info(pg); // US is strict: only shops delivering to the US that charge in USD (no converted EU prices)
 if(y.rows[0][0]!=='Tennis Warehouse'||y.rows.length!==1||!/\$100/.test(y.rows[0][1])) F('live switch US '+JSON.stringify(y.rows)); await pg.close();}
// expander: 7 shops delivering GB
{const many=Array.from({length:7},(_,i)=>of('padelnuestro.com',100+i,'EUR')).map((o,i)=>({...o,d:i<3?'padelnuestro.com':'decathlon.co.uk',u:o.u+i}));
 const pg=await page('/rackets/'+S+'/',360,{wp_region:'GB',wp_cur:'GBP'},{updated:'x',r:{[S]:{...many[0],min90:1,since:T,drop:0,h:[],o:many}}});
 const x=await info(pg); if(x.rows.length!==4||x.other!==0||!/7/.test(x.all||'')) F('top4 + all-N '+x.rows.length+'/'+x.all);
 // sheet from All-N link: opens full, 7 rows, Esc closes, focus returns
 await pg.locator('#pxall').evaluate(el=>el.scrollIntoView({block:'center'})); await pg.click('#pxall'); await pg.waitForTimeout(400); let sh=await pg.evaluate(()=>{const D=document.getElementById('pxsheet');return {open:!D.hidden&&D.classList.contains('open'),n:D.querySelectorAll('.pxr').length,vis:[...D.querySelectorAll('.pxr')].filter(r=>r.offsetParent).length,role:D.querySelector('[role=dialog]')?.getAttribute('aria-modal'),lock:getComputedStyle(document.body).overflow}});
 if(!sh.open||sh.vis!==7||sh.role!=='true'||sh.lock!=='hidden') F('sheet full '+JSON.stringify(sh));
 for(let i=0;i<12;i++) await pg.keyboard.press('Tab'); if(!await pg.evaluate(()=>document.getElementById('pxsheet').contains(document.activeElement))) F('focus trap');
 await pg.keyboard.press('Escape'); await pg.waitForTimeout(350); if(!await pg.evaluate(()=>document.getElementById('pxsheet').hidden&&document.activeElement.id==='pxall')) F('esc/focus return');
 // sticky bar: hidden while box in view; tap bar opens compact sheet; show all expands; backdrop closes; Buy goes direct
 await pg.evaluate(()=>scrollTo(0,0)); await pg.waitForTimeout(300); if(await pg.evaluate(()=>document.getElementById('stickycta').classList.contains('show'))) F('bar visible while box in view');
 await pg.evaluate(()=>scrollTo(0,document.body.scrollHeight/2)); await pg.waitForTimeout(400); if(!await pg.evaluate(()=>document.getElementById('stickycta').classList.contains('show'))) F('bar not shown after scroll');
 await pg.click('#stickyopen'); await pg.waitForTimeout(400); sh=await pg.evaluate(()=>{const D=document.getElementById('pxsheet');return {open:!D.hidden,vis:[...D.querySelectorAll('.pxr')].filter(r=>r.offsetParent).length,best:!D.querySelector('.pxsbest')&&[...D.querySelectorAll('.pxr.best')].every(r=>r.querySelector('.pxb.pri[href^="https://"]'))}});
 if(!sh.open||sh.vis!==4||!sh.best) F('bar->sheet '+JSON.stringify(sh));
 await pg.click('.pxsall'); await pg.waitForTimeout(200); if(await pg.evaluate(()=>[...document.querySelectorAll('#pxsheet .pxr')].filter(r=>r.offsetParent).length)!==7) F('show all');
 await pg.mouse.click(195,20); await pg.waitForTimeout(350); if(!await pg.evaluate(()=>document.getElementById('pxsheet').hidden)) F('backdrop close');
 if(await pg.getAttribute('#stickybuy','href')) F('bar must not link out');
 await pg.close();}
// fallback: no live offer
{const pg=await page('/rackets/'+S+'/',390,{},{updated:'x',r:{}}); const x=await info(pg); if(!x.hidden||!x.main) F('fallback'); await pg.close();}
{const pg=await page('/rackets/'+S+'/',390,{wp_region:'GB'},{updated:'x',r:{[S]:{...of('noxsport.com',90,'EUR'),min90:1,since:T,drop:0,h:[],o:[of('noxsport.com',90,'EUR')]}}}); const x=await info(pg); if(x.rows.length!==1||x.nc!==1) F('only-unknown '+x.rows.length+'/'+x.nc); await pg.close();}
await b.close(); console.log(bad?'CMPQA FAIL '+bad:'CMPQA PASS');
