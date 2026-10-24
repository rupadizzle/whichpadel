// Vertical rhythm QA: gap header(/hero)->first content and last content->footer, one page per type per language, at 360/390/1280.
import { chromium } from 'playwright-core'; import fs from 'fs';
const B=process.argv[2]||'http://127.0.0.1:'+(process.env.QA_PORT||4987)+'';
const urls=[...fs.readFileSync('dist/sitemap.xml','utf8').matchAll(/<loc>https:\/\/whichpadel\.com([^<]*)<\/loc>/g)].map(m=>m[1]);
const L=['es','fr','pt','it','de']; const seen=new Map();
for(const u of urls){const s=u.split('/').filter(Boolean);const lang=L.includes(s[0])?s.shift():'en';const key=lang+':'+(s[0]||'')+':'+s.length+(s[0]&&s[1]&&s[1].includes('-vs-')?':vs':'');if(!seen.has(key))seen.set(key,u)}
for(const l of ['en',...L]) seen.set(l+':404',(l==='en'?'':'/'+l)+'/404.html');
const pages=[...seen.entries()].filter(([k])=>!process.env.QA_FAST||/^(en|es|de):/.test(k)).map(([,v])=>v); const W=(process.env.QA_WIDTHS?process.env.QA_WIDTHS.split(',').map(Number):[360,390,1280]);
const br=await chromium.launch(); const pg=await br.newPage(); const res=[]; let bad=0;
for(const w of W){ await pg.setViewportSize({width:w,height:900});
 for(const p of pages){ await pg.goto(B+p,{waitUntil:process.env.QA_FAST?'load':'networkidle'}); if(process.env.QA_FAST) await pg.waitForTimeout(200);
  if(await pg.$('.fz-hdr')) continue; if(await pg.$('main>.crumbs+.cat, .cmp-intro')) continue; /* hubs + compare pages: compact header rhythm by design (Rupert, 24 Oct commit e03cd78), exempt from the shared gap */ /* focused finder shell: no footer */
  const r=await pg.evaluate(()=>{const vis=e=>{const s=getComputedStyle(e),b=e.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&b.height>0&&!['SCRIPT','STYLE'].includes(e.tagName)};
   const m=document.querySelector('main');const kids=[...m.children].filter(vis);const f=kids[0],l=kids[kids.length-1];
   let above=m.previousElementSibling;while(above&&!vis(above))above=above.previousElementSibling;
   const foot=m.nextElementSibling;const mt=e=>parseFloat(getComputedStyle(e).marginTop),mb=e=>parseFloat(getComputedStyle(e).marginBottom);
   return {top:Math.round(f.getBoundingClientRect().top-above.getBoundingClientRect().bottom),bot:Math.round(foot.getBoundingClientRect().top-l.getBoundingClientRect().bottom),hero:above.tagName!=='HEADER',first:f.tagName+'.'+f.className,last:l.tagName+'.'+l.className}});
  res.push({w,p,...r}); }}
await br.close();
const by={};for(const r of res){const k=r.w+(r.hero?'h':'');(by[k]??=[]).push(r)}
for(const [k,a] of Object.entries(by)){const t=new Set(a.map(x=>x.top)),b=new Set(a.map(x=>x.bot));console.log(`w=${k} pages=${a.length} top=${[...t]} bottom=${[...b]}`);
 if(t.size>1||b.size>1){bad++; for(const x of a)console.log('  ',x.p,x.top,x.bot,x.first,x.last)} if([...t,...b].some(v=>v<16))bad++;}
console.log(`PAD ${pages.length} pages x ${W.length} widths, ${bad?'FAIL':'PASS'}`); process.exit(bad?1:0);
