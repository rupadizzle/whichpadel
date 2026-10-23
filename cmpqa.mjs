// Compare-prices list QA (local preview :4987, mocked /api/prices): sorting, currency, country filter, expander, fallback, mobile, 6 langs.
import {chromium} from 'playwright-core'; const b=await chromium.launch(); let bad=0; const F=(m)=>{bad++;console.log('FAIL',m);};
const S='head-evo-speed-2025', T=new Date().toISOString().slice(0,10), Y=new Date(Date.now()-3*864e5).toISOString().slice(0,10);
const of=(d,p,c,s=1,t=T)=>({d,p,c,u:`https://${d}/p/${S}`,s,t,min30:p-5});
const O=[of('padelnuestro.com',90,'EUR'),of('allforpadel.com',80,'EUR',1,Y),of('decathlon.co.uk',70,'GBP'),of('padelsmith.co.uk',60,'GBP',0),of('tennis-warehouse.com',100,'USD'),of('mantissport.com',85,'EUR')];
const API={updated:'x',r:{[S]:{...O[0],min90:80,since:T,drop:0,h:[],o:O}}};
const dirs={en:'rackets',es:'es/palas',fr:'fr/raquettes',pt:'pt/raquetes',it:'it/racchette',de:'de/schlaeger'};
async function page(path,w,ls={},api=API){const pg=await b.newPage({viewport:{width:w,height:800}}); await pg.addInitScript(o=>{for(const[k,v] of Object.entries(o)) localStorage[k]=v; localStorage.wp_geo_seen='1';},ls);
 await pg.route('**/api/prices',r=>r.fulfill({json:api})); await pg.route('**/api/geo',r=>r.fulfill({json:{country:null}})); await pg.goto('http://127.0.0.1:4987'+path+'?px=1'); await pg.waitForTimeout(700); return pg;}
const info=pg=>pg.evaluate(()=>{const P=document.getElementById('pxcmp'); const rows=[...P.querySelectorAll('.pxl:not(details .pxl) > li')];
 return {hidden:P.hidden,main:!document.getElementById('buymain').hidden,rows:rows.map(li=>[li.querySelector('.pxs b').textContent,li.querySelector('.pxp').textContent,li.hidden,li.classList.contains('best'),li.querySelector('a').rel,li.querySelector('a').getBoundingClientRect().height]),
  other:P.querySelectorAll('details .pxl li').length,otherOpen:!!P.querySelector('details[open]'),more:P.querySelector('.pxmore')?.textContent||null,sw:document.documentElement.scrollWidth,vw:innerWidth,low:document.getElementById('pxlive').innerText,
  ext:[...P.querySelectorAll('a')].every(a=>/^https:\/\//.test(a.href)&&a.rel==='sponsored nofollow')};});
for(const w of [360,390,1280]) for(const [l,d] of Object.entries(dirs)){
 const pg=await page(`/${d}/${S}/`,w,{wp_region:'GB',wp_cur:'GBP'}); const x=await info(pg); const tag=`${l}@${w}`;
 // GB delivers: padelnuestro, decathlon, padelsmith(oos). unknown: allforpadel, mantis, tennis-warehouse
 if(x.hidden||x.main) F(tag+' list not shown');
 const names=x.rows.map(r=>r[0]); if(names.join()!=='Decathlon UK,Padel Nuestro,Padelsmith') F(tag+' sort/filter '+names);
 if(!x.rows[0]?.[3]||x.rows.filter(r=>r[3]).length!==1) F(tag+' highlight');
 if(!x.rows.every(r=>/£/.test(r[1]))) F(tag+' currency '+x.rows.map(r=>r[1]));
 if(x.other!==3||x.otherOpen) F(tag+' other shops '+x.other);
 if(x.rows.some(r=>r[5]<44)) F(tag+' tap target');
 if(x.sw>x.vw) F(tag+' overflow '+x.sw);
 if(!x.ext) F(tag+' links'); if(!/£55|55 £/.test(x.low)) F(tag+' low30 '+x.low);
 const ov=await pg.evaluate(()=>[...document.querySelectorAll('#pxcmp *')].some(e=>e.scrollWidth>e.clientWidth+1&&getComputedStyle(e).overflow!=='visible')); if(ov) F(tag+' element overflow');
 await pg.close();}
// currency switch EUR + country ES: allforpadel, padelnuestro, mantis(unknown) ... ES delivers padelnuestro, allforpadel
{const pg=await page('/rackets/'+S+'/',390,{wp_region:'ES',wp_cur:'EUR'}); const x=await info(pg); if(x.rows.map(r=>r[0]).join()!=='All For Padel,Padel Nuestro'||!x.rows.every(r=>/€/.test(r[1]))) F('ES/EUR '+JSON.stringify(x.rows));
 if(!/checked 3 days ago/.test(await pg.locator('#pxcmp').innerText())) F('age text');
 await pg.evaluate(()=>WP.setRC('US','USD')); const y=await info(pg); if(y.rows.map(r=>r[0]).join()!=='Tennis Warehouse'||!/\$100/.test(y.rows[0][1])) F('live switch US '+JSON.stringify(y.rows)); await pg.close();}
// expander: 7 shops delivering GB
{const many=Array.from({length:7},(_,i)=>of('padelnuestro.com',100+i,'EUR')).map((o,i)=>({...o,d:i<3?'padelnuestro.com':'decathlon.co.uk',u:o.u+i}));
 const pg=await page('/rackets/'+S+'/',360,{wp_region:'GB',wp_cur:'GBP'},{updated:'x',r:{[S]:{...many[0],min90:1,since:T,drop:0,h:[],o:many}}});
 let x=await info(pg); if(x.rows.filter(r=>!r[2]).length!==5||x.more!=='Show all 7 shops') F('expander closed '+x.more);
 await pg.click('.pxmore'); x=await info(pg); if(x.rows.filter(r=>!r[2]).length!==7) F('expander open'); await pg.close();}
// fallback: no live offer
{const pg=await page('/rackets/'+S+'/',390,{},{updated:'x',r:{}}); const x=await info(pg); if(!x.hidden||!x.main) F('fallback'); await pg.close();}
{const pg=await page('/rackets/'+S+'/',390,{wp_region:'GB'},{updated:'x',r:{[S]:{...of('noxsport.com',90,'EUR'),min90:1,since:T,drop:0,h:[],o:[of('noxsport.com',90,'EUR')]}}}); const x=await info(pg); if(x.rows.length||x.other!==1||!x.otherOpen) F('only-unknown'); await pg.close();}
await b.close(); console.log(bad?'CMPQA FAIL '+bad:'CMPQA PASS');
