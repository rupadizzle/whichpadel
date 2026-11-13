import { chromium } from 'playwright-core'; import fs from 'fs';
const B='http://127.0.0.1:'+(process.env.QA_PORT||4987)+''; const dir=process.argv[2]||'shots/v5';
const C3=Object.entries(JSON.parse(fs.readFileSync('data/images.json'))).filter(([k,v])=>v.ok).slice(40,43).map(x=>x[0]);
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const pages={home:'/',racket:'/rackets/'+C3[0]+'/',compare:'/compare/?r='+C3.join(','),guide:'/padel-rackets/',brand:'/brands/bullpadel/',best:'/best/best-padel-rackets-for-beginners/'};
const m=await (await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true})).newPage();
for(const [n,u] of Object.entries(pages)){await m.goto(B+u);await m.waitForTimeout(500);await m.screenshot({path:`${dir}/${n}-390.png`,fullPage:true});}
const d=await (await b.newContext({viewport:{width:1280,height:900}})).newPage(); await d.goto(B+'/'); await d.waitForTimeout(500); await d.screenshot({path:dir+'/home-1280.png',fullPage:true});
await b.close();
