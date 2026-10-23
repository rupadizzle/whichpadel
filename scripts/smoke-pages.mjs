// Fixed smoke sample for fast deploys: 8 page types x every language (via hreflang), comma-joined for QA_PAGES.
import fs from 'fs';
const first=d=>fs.readdirSync('dist/'+d,{withFileTypes:true}).filter(e=>e.isDirectory()&&fs.existsSync(`dist/${d}/${e.name}/index.html`)).map(e=>e.name).sort()[0];
const vs=fs.readdirSync('dist/compare').find(x=>x.includes('-vs-'));
const EN=['/','/rackets/head-evo-speed-2025/','/compare/',`/compare/${vs}/`,'/best/best-value-padel-rackets/','/padel-rackets/','/about/','/brands/bullpadel/'].filter(p=>fs.existsSync('dist'+p+'index.html'));
const out=new Set();
for(const p of EN){ out.add(p); const h=fs.readFileSync('dist'+p+'index.html','utf8'); for(const m of h.matchAll(/hreflang="([a-z]{2})" href="https:\/\/whichpadel\.com([^"]+)"/g)) out.add(m[2]); }
out.add('/404.html');
console.log([...out].join(','));
