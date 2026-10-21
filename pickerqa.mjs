// Picker QA: every built page has the header picker; its language links resolve to built pages and match hreflang;
// header geometry at 360/390/1280 for every page type in every language (no overlap/wrap, tap targets >=44px).
import fs from 'fs'; import path from 'path'; import { chromium } from 'playwright-core';
const B=process.argv[2]||'http://127.0.0.1:4987'; const bad=[];
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):e.name.endsWith('.html')?[path.join(d,e.name)]:[]);
const exists=h=>{const p=h.split('#')[0].split('?')[0]; return fs.existsSync('dist'+p+(p.endsWith('/')?'index.html':''))||fs.existsSync('dist'+p);};
const files=walk('dist').filter(f=>!/\/(404|api)\b/.test(f)&&!f.endsWith('/404.html')); let n=0; const types=new Map();
for(const f of files){const h=fs.readFileSync(f,'utf8'); if(/http-equiv="refresh"/.test(h)) continue; n++;
 const rel='/'+path.relative('dist',f).replace(/index\.html$/,''); 
 if((h.match(/id="rgn-btn"/g)||[]).length!==1) bad.push('picker count: '+rel);
 const dup=h.replace(/<ul class="lang-seg".*?<\/ul>/s,'').match(/<a [^>]*hreflang="/g); if(dup) bad.push('duplicate language links: '+rel);
 const m=h.match(/<ul class="lang-seg"[^>]*>(.*?)<\/ul>/s); if(!m){bad.push('no language list: '+rel); continue;}
 const links=[...m[1].matchAll(/href="([^"]+)"[^>]*hreflang="([a-z]{2})"/g)].map(x=>[x[2],x[1]]);
 const alts=Object.fromEntries([...h.matchAll(/<link rel="alternate" hreflang="([a-z]{2})" href="https:\/\/whichpadel\.com([^"]+)"/g)].map(x=>[x[1],x[2]]));
 if(Object.keys(alts).length&&links.length!==Object.keys(alts).length) bad.push(`lang count ${links.length}/${Object.keys(alts).length}: ${rel}`);
 for(const [l,u] of links){ if(!exists(u)) bad.push(`dead lang link ${l} ${u} on ${rel}`); if(alts[l]&&alts[l]!==u) bad.push(`lang ${l} ${u}≠hreflang ${alts[l]} on ${rel}`);}
 const seg=rel.split('/')[1]; const lang=['es','fr','pt','it','de'].includes(seg)?seg:'en'; const depth=rel.split('/').filter(Boolean).length; const k=lang+':'+(rel.split('/')[lang==='en'?1:2]||'home')+':'+Math.min(depth,4);
 if(!types.has(k)) types.set(k,rel);}
console.log(`pickerqa: ${n} pages checked statically, ${types.size} sampled for geometry`);
const br=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']}); 
for(const w of [360,390,1024,1181,1280,1440]){const pg=await br.newPage({viewport:{width:w,height:800}});
 for(const rel of types.values()){ await pg.goto(B+rel,{waitUntil:'domcontentloaded'});
  const r=await pg.evaluate(()=>{const o=[]; const hd=document.querySelector('.hdr .wrap'); const R=e=>e.getBoundingClientRect();
   const kids=[...hd.children].filter(e=>{const s=getComputedStyle(e);return s.display!=='none'&&s.position!=='absolute'&&R(e).width>0&&e.tagName!=='SCRIPT'&&e.tagName!=='DIALOG'});
   const top=R(kids[0]).top; for(let i=0;i<kids.length;i++){const a=R(kids[i]); if(a.right>innerWidth+0.5) o.push('offscreen '+kids[i].className); if(i&&Math.abs(R(kids[i]).top+a.height/2-(top+R(kids[0]).height/2))>2) o.push('wrap '+kids[i].className);
    if(i){const p=R(kids[i-1]); if(a.left<p.right-0.5) o.push('overlap '+kids[i-1].className+'/'+kids[i].className);}}
   const b=document.getElementById('rgn-btn'); const br=R(b); if(br.height<44) o.push('rgn height '+br.height);
   if(b.scrollWidth>b.clientWidth+1) o.push('rgn clipped'); const bu=document.querySelector('.burger'); if(getComputedStyle(bu).display!=='none'&&R(bu).height<44) o.push('burger '+R(bu).height);
   document.querySelectorAll('#nav > *').forEach(e=>{const r=R(e); if(getComputedStyle(document.getElementById('nav')).flexDirection==='row'&&r.width&&(r.height>46||r.right>innerWidth)) o.push('nav item wraps/overflows '+e.textContent.slice(0,15));});
   if(document.documentElement.scrollWidth>innerWidth+1) o.push('page hscroll'); return o;});
  r.forEach(x=>bad.push(`${w}px ${rel}: ${x}`));}
 // open sheet once per width: language buttons >=44px, no overlap, no overflow
 await pg.goto(B+'/es/',{waitUntil:'load'}); await pg.click('#rgn-btn');
 const s=await pg.evaluate(()=>{const o=[];const a=[...document.querySelectorAll('.lang-seg a')].map(e=>e.getBoundingClientRect()); if(a.length!==6) o.push('langs '+a.length);
  a.forEach((x,i)=>{if(x.height<44)o.push('lang h '+x.height); if(x.right>innerWidth)o.push('lang offscreen'); a.slice(i+1).forEach(y=>{if(Math.min(x.right,y.right)-Math.max(x.left,y.left)>1&&Math.min(x.bottom,y.bottom)-Math.max(x.top,y.top)>1)o.push('lang overlap')})});
  const d=document.querySelector('.rgn-sheet .sheet-in'); if(d.scrollWidth>d.clientWidth+1)o.push('sheet hscroll'); return o;});
 s.forEach(x=>bad.push(`${w}px sheet: ${x}`)); await pg.close();}
await br.close();
bad.slice(0,40).forEach(x=>console.log(' - '+x)); console.log(bad.length?`PICKERQA FAIL ${bad.length}`:'PICKERQA PASS'); process.exit(bad.length?1:0);
