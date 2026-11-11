import fs from 'fs';
for(const l of fs.readdirSync('dist').filter(d=>/^[a-z]{2}$/.test(d))){const s=`dist/${l}/404/index.html`; if(fs.existsSync(s)){fs.copyFileSync(s,`dist/${l}/404.html`); fs.rmSync(`dist/${l}/404`,{recursive:true});}}
// Render currency tokens (see src/lib/money.js) in every built HTML page; JSON/XML must never contain one.
import path from 'path'; import { render, TOKSRC } from '../src/lib/money.js';
const fx=JSON.parse(fs.readFileSync('data/fx.json','utf8'));
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
import crypto from 'crypto';
const sm=fs.readFileSync('dist/sitemap.xml','utf8'); const S='https://whichpadel.com';
const fileOf=u=>'dist'+u+(u.endsWith('/')?'index.html':'');
const sig=h=>crypto.createHash('sha1').update([(h.match(/<title>([\s\S]*?)<\/title>/)||[])[1],(h.match(/<meta name="description" content="([^"]*)"/)||[])[1],h.slice(h.indexOf('<body')).replace(/<(script|style)\b[\s\S]*?<\/\1>/g,'').replace(/data-bf-count>[\s\S]*?<\/p>/g,'').replace(/<[^>]+>/g,' ').replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g,'').replace(/\s+/g,' ')].join('\n')).digest('hex').slice(0,16);
let prev={}; try{const r=await fetch(S+'/lastmod.json',{signal:AbortSignal.timeout(10000)}); if(r.ok) prev=await r.json();}catch{}
const today=new Date().toISOString().slice(0,10); const man={}; let kept=0, changed=0;
const sm2=sm.replace(/<loc>([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod>/g,(m,loc,src)=>{const u=loc.slice(S.length); const f=fileOf(u); if(!fs.existsSync(f)) return m;
 const h=sig(fs.readFileSync(f,'utf8')); const p=prev[u]; const d=p&&p.h===h?p.d:p?today:src; if(p&&p.h===h) kept++; else if(p) changed++; man[u]={h,d}; return `<loc>${loc}</loc><lastmod>${d}</lastmod>`;});
fs.writeFileSync('dist/sitemap.xml',sm2); fs.writeFileSync('dist/lastmod.json',JSON.stringify(man));
console.log(`post: lastmod ${Object.keys(man).length} urls, ${kept} unchanged, ${changed} changed, ${Object.keys(man).length-kept-changed} new (source dates)`);
let nPages=0; const tok=new RegExp(TOKSRC);
for(const f of walk('dist')){ if(f.endsWith('.html')){const h=fs.readFileSync(f,'utf8'); const lang=(h.match(/<html[^>]*\slang="([a-z]{2})/)||[])[1]||'en'; const o=render(h,lang,fx.rates); if(o!==h){fs.writeFileSync(f,o); nPages++;}}
 else if(/\.(json|xml|txt)$/.test(f)&&tok.test(fs.readFileSync(f,'utf8'))) throw new Error('currency token in '+f);}
console.log(`post: currency tokens rendered on ${nPages} pages`);
