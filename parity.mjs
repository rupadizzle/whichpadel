// Cross-language parity: for a sample of every page type, the EN/ES/FR versions must have the same DOM skeleton
// (tags + classes; repeated identical siblings collapsed) and the same computed spacing at 390px and 1280px.
// Usage: node parity.mjs [baseUrl]   Exit 1 on any mismatch.
import { chromium } from 'playwright-core'; import fs from 'fs';
const LANGS=['en',...fs.readdirSync('dist').filter(d=>/^[a-z]{2}$/.test(d)&&fs.existsSync(`dist/${d}/index.html`))];
const base=(process.argv[2]||'http://127.0.0.1:'+(process.env.QA_PORT||4987)+'').replace(/\/$/,'');
const first=d=>fs.readdirSync('dist/'+d,{withFileTypes:true}).filter(e=>e.isDirectory()&&fs.existsSync(`dist/${d}/${e.name}/index.html`)).map(e=>e.name).sort()[0];
const brand=first('brands'), y27=fs.readdirSync('dist/brands').find(b=>fs.existsSync(`dist/brands/${b}/2027/index.html`));
const vs=fs.readdirSync('dist/compare').find(x=>x.includes('-vs-'));
const EN={home:'/',guide:'/padel-rackets/',compare:'/compare/',bestIndex:'/best/',best:'/best/best-value-padel-rackets/',racket:`/rackets/${first('rackets')}/`,brands:'/brands/',brand:`/brands/${brand}/`,brand2027:`/brands/${y27}/2027/`,players:'/players/',player:`/players/${first('players')}/`,vs:`/compare/${vs}/`,tool:'/tools/real-weight/',bf:'/black-friday/',privacy:'/privacy/',affiliate:'/affiliate-disclosure/',about:'/about/'};
const alts=p=>{const h=fs.readFileSync('dist'+p+'index.html','utf8'); const o={}; for(const m of h.matchAll(/hreflang="([a-z]{2})" href="https:\/\/whichpadel\.com([^"]+)"/g)) o[m[1]]=m[2]; return o;};
const FT=['home','racket','compare','vs','best','guide','brand','player'];
const sets=Object.entries(EN).filter(([t])=>!process.env.QA_FAST||FT.includes(t)).map(([t,p])=>[t,alts(p)]); if(!process.env.QA_FAST) sets.push(['404',Object.fromEntries(LANGS.map(l=>[l,l==='en'?'/404.html':`/${l}/404.html`]))]);
const SIG=()=>{const STATE=['cv','open','show','active','on','sel'];const PROPS=['paddingTop','paddingRight','paddingBottom','paddingLeft','marginTop','marginBottom','rowGap','columnGap','fontSize','borderRadius','display'];
 const roots=[document.querySelector('header'),...document.querySelectorAll('body > section'),document.querySelector('main'),document.querySelector('footer')].filter(Boolean);
 const key=e=>e.tagName.toLowerCase()+(e.classList.length?'.'+[...e.classList].filter(c=>!STATE.includes(c)).sort().join('.'):'')+(e.id&&!/^(rv|cmpn|fn)/.test(e.id)?'#'+e.id:'');
 const skel=(e,d)=>{ if(d>5) return key(e); const kids=[...e.children].filter(c=>!c.hasAttribute('data-parity-skip')&&(!['SCRIPT','TEMPLATE','STYLE','svg','BR'].includes(c.tagName)&&!['B','EM','I','SMALL','SPAN','STRONG','A'].includes(c.tagName)||c.className&&c.tagName!=='A'));
  const ks=[]; for(const c of kids){const s=skel(c,d+1); if(ks.at(-1)!==s) ks.push(s);} return key(e)+(ks.length?'['+ks.join(',')+']':''); };
 const sp=[]; const visit=(e,d)=>{ if(d>3) return; const cs=getComputedStyle(e); sp.push(key(e)+' '+PROPS.map(p=>cs[p]).join(' ')); const seen=new Set(); for(const c of e.children){if(c.hasAttribute('data-parity-skip')) continue; const k=key(c); if(seen.has(k)||['SCRIPT','TEMPLATE'].includes(c.tagName)) continue; seen.add(k); visit(c,d+1);} };
 roots.forEach(r=>visit(r,0)); return {skel:roots.map(r=>skel(r,0)), sp:[...new Set(sp)]}; };
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']}); const fails=[]; let n=0;
for(const w of [390,1280]){ const ctx=await b.newContext({viewport:{width:w,height:900}});
 for(const [t,set] of sets){ const res={}; for(const l of LANGS){ if(!set[l]){fails.push(`${t}: no ${l} version`);continue;} const pg=await ctx.newPage(); const errs=[];
   pg.on('pageerror',e=>errs.push(e.message)); await pg.goto(base+set[l],{waitUntil:process.env.QA_FAST?'load':'networkidle'}).catch(()=>{}); await pg.waitForTimeout(300); res[l]=await pg.evaluate(SIG); if(errs.length) fails.push(`${t} ${l} ${w}: JS error ${errs[0]}`); await pg.close(); n++; }
  for(const l of LANGS.slice(1)){ if(!res.en||!res[l]) continue;
   res.en.skel.forEach((s,i)=>{ if(s!==res[l].skel[i]) {const o=res[l].skel[i]||''; let k=0; while(k<s.length&&s[k]===o[k]) k++; fails.push(`${t} @${w}: structure differs en vs ${l} in root ${i} at char ${k}\n   en: …${s.slice(Math.max(0,k-150),k+150)}\n   ${l}: …${o.slice(Math.max(0,k-150),k+150)}`);} });
   if(res.en.skel.length!==res[l].skel.length) fails.push(`${t} @${w}: root count en ${res.en.skel.length} vs ${l} ${res[l].skel.length}`);
   const A=new Set(res.en.sp), B=new Set(res[l].sp); const d1=[...A].filter(x=>!B.has(x)), d2=[...B].filter(x=>!A.has(x));
   if(d1.length||d2.length) fails.push(`${t} @${w}: spacing differs en vs ${l}: en-only ${d1.slice(0,3).join(' | ')} ; ${l}-only ${d2.slice(0,3).join(' | ')}`); } }
 await ctx.close(); }
await b.close();
console.log(`parity: ${sets.length} page types × ${LANGS.length} languages (${LANGS.join('/')}) × 2 widths (${n} loads), ${fails.length} mismatches`); fails.slice(0,40).forEach(f=>console.log(' ✗',f));
process.exit(fails.length?1:0);
