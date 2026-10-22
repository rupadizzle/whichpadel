import fs from 'fs';
for(const l of fs.readdirSync('dist').filter(d=>/^[a-z]{2}$/.test(d))){const s=`dist/${l}/404/index.html`; if(fs.existsSync(s)){fs.copyFileSync(s,`dist/${l}/404.html`); fs.rmSync(`dist/${l}/404`,{recursive:true});}}
// Render currency tokens (see src/lib/money.js) in every built HTML page; JSON/XML must never contain one.
import path from 'path'; import { render, TOKSRC } from '../src/lib/money.js';
const fx=JSON.parse(fs.readFileSync('data/fx.json','utf8'));
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
let nPages=0; const tok=new RegExp(TOKSRC);
for(const f of walk('dist')){ if(f.endsWith('.html')){const h=fs.readFileSync(f,'utf8'); const lang=(h.match(/<html[^>]*\slang="([a-z]{2})/)||[])[1]||'en'; const o=render(h,lang,fx.rates); if(o!==h){fs.writeFileSync(f,o); nPages++;}}
 else if(/\.(json|xml|txt)$/.test(f)&&tok.test(fs.readFileSync(f,'utf8'))) throw new Error('currency token in '+f);}
console.log(`post: currency tokens rendered on ${nPages} pages`);
