import { chromium } from 'playwright-core';
const out=process.argv[2]; const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const c=await b.newContext({viewport:{width:412,height:915},deviceScaleFactor:2,isMobile:true,hasTouch:true}); const p=await c.newPage();
await p.goto('http://127.0.0.1:4987/'); await p.click('#rgn-btn'); await p.waitForTimeout(300); await p.screenshot({path:out});
console.log(JSON.stringify(await p.evaluate(()=>{const r=e=>e.getBoundingClientRect(); const bt=document.querySelector('.rgn-list button'); const s=bt.querySelector('span'); const hd=[...document.querySelector('.hdr .wrap').children].filter(e=>r(e).width).map(e=>[e.className||e.tagName,Math.round(r(e).left),Math.round(r(e).right)]); return {btn:r(bt).height,spanTop:r(s).top-r(bt).top,spanH:r(s).height,hd,sw:document.documentElement.scrollWidth}})));
await b.close();
