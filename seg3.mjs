import { chromium } from 'playwright-core'; import fs from 'fs';
const B='http://127.0.0.1:4987'; fs.mkdirSync('shots/seg3',{recursive:true});
const img=JSON.parse(fs.readFileSync('data/images.json'));
const ok=Object.keys(img).filter(k=>img[k].ok); const no=fs.readdirSync('dist/rackets').filter(f=>!f.includes('.')&&!(img[f]&&img[f].ok));
const only=process.argv[2];
const pages={y27:'/brands/bullpadel/2027/',rw:'/tools/real-weight/',bf:'/black-friday-padel-rackets/',home:'/',players:'/players/',player:'/players/agustin-tapia/',value:'/best/best-value-padel-rackets/',racket:'/rackets/'+ok[0]+'/',racketsvg:'/rackets/'+no[0]+'/',compare:'/compare/?r='+ok.slice(40,43).join(','),guide:'/padel-rackets/',brands:'/brands/',brand:'/brands/bullpadel/',best1:'/best/best-padel-rackets-for-beginners/',best2:'/best/best-padel-racket-2026/',privacy:'/privacy/',404:'/404.html',vs:'/compare/adidas-metalbone-2026-vs-nox-at10-pro-cup-hard-2026/',es:'/es/',esguide:'/es/palas-padel/',esbest:'/es/mejores-palas-padel/',esr:'/es/palas/'+ok[0]+'/',esbrands:'/es/marcas/',esbrand:'/es/marcas/bullpadel/',esy27:'/es/marcas/bullpadel/2027/',eslist:'/es/mejores/palas-padel-principiantes/',espl:'/es/jugadores/',esp:'/es/jugadores/agustin-tapia/',esvs:'/es/comparar/adidas-metalbone-2026-vs-nox-at10-pro-cup-hard-2026/',estool:'/es/herramientas/peso-real/',esbf:'/es/black-friday-palas-padel/',eslegal:'/es/privacidad/',es404:'/es/404.html',fr:'/fr/',frguide:'/fr/raquette-padel/',frr:'/fr/raquettes/'+ok[0]+'/',frbrand:'/fr/marques/bullpadel/',fry27:'/fr/marques/bullpadel/2027/',frp:'/fr/joueurs/agustin-tapia/',frvs:'/fr/comparer/adidas-metalbone-2026-vs-nox-at10-pro-cup-hard-2026/',frtool:'/fr/outils/poids-reel/',frbf:'/fr/black-friday-raquettes-padel/',frcmp:'/fr/comparateur-raquettes-padel/?r=adidas-metalbone-2026,nox-at10-pro-cup-hard-2026',fr404:'/fr/404.html',escmp:'/es/comparador-palas-padel/?r=adidas-metalbone-2026,nox-at10-pro-cup-hard-2026'};
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const m=await (await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true})).newPage();
for(const [n,u] of Object.entries(pages)){ if(only&&!only.split(',').includes(n))continue;
 await m.goto(B+u); await m.waitForTimeout(400);
 const H=await m.evaluate(()=>document.documentElement.scrollHeight); let i=0;
 for(let y=0;y<H&&i<10;y+=780){await m.evaluate(y=>scrollTo(0,y),y);await m.waitForTimeout(150);await m.screenshot({path:`shots/seg3/${n}-${++i}.png`});}
 if(n==='compare'){await m.evaluate(()=>scrollTo(0,0));const a=await m.$('.hc [data-add]');if(a){await a.click();await m.waitForTimeout(300);await m.screenshot({path:'shots/seg3/compare-swap.png'});}}
 console.log(n,u,H,i);}
await b.close();
