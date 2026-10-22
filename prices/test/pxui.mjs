// Live-price UI check with a mocked /api/prices (run against local preview on :4987): render, currency conversion, no overflow.
import {chromium} from 'playwright-core'; const b=await chromium.launch();
const API={updated:'x',r:{'adidas-2026-world-cup-argentina':{p:128,c:'EUR',u:'https://allforpadel.com/x',d:'allforpadel.com',s:1,t:'2026-10-22',min30:120,min90:120,since:'2026-07-01',drop:12,h:[]}}};
for(const [l,p] of [['en','/rackets/adidas-2026-world-cup-argentina/'],['de','/de/schlaeger/adidas-2026-world-cup-argentina/']]) for(const w of [360,1280]){
 const pg=await b.newPage({viewport:{width:w,height:800}}); await pg.route('**/api/prices',r=>r.fulfill({json:API}));
 await pg.goto('http://127.0.0.1:4987'+p+'?px=1'); await pg.waitForSelector('#pxlive:not([hidden])',{timeout:5000});
 const t=await pg.evaluate(()=>[document.querySelector('#buybox .price-big').innerText,document.getElementById('pxlive').innerText.replace(/\n/g,' | '),document.querySelector('#buybox a.aff').href,document.documentElement.scrollWidth]);
 console.log(l,w,JSON.stringify(t)); await pg.close();}
await b.close();
