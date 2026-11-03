// Static check over dist: canonical = own URL; hreflang en/es/fr + x-default present, absolute, self-including, reciprocal, and pointing at built pages.
import fs from 'fs'; import path from 'path';
const D='dist', S='https://whichpadel.com'; const LANGS=['en',...fs.readdirSync(D).filter(d=>/^[a-z]{2}$/.test(d)&&fs.existsSync(`${D}/${d}/index.html`))]; const errs=[]; const map={};
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):e.name.endsWith('.html')?[path.join(d,e.name)]:[]);
for(const f of walk(D)){ const rel='/'+path.relative(D,f).replace(/index\.html$/,'').replace(/\\/g,'/'); if(/404/.test(rel)) continue;
 const h=fs.readFileSync(f,'utf8'); if(/<meta name="robots" content="noindex/.test(h)) continue; const canon=(h.match(/<link rel="canonical" href="([^"]+)"/)||[])[1];
 if(canon!==S+rel) errs.push(`${rel}: canonical ${canon}`);
 const alts={}; for(const m of h.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)) alts[m[1]]=m[2];
 // /us/ pages: English (US) only, no translated twin -> exactly one self-referencing en-US hreflang
 if(rel.startsWith('/us/')){ if(Object.keys(alts).join()!=='en-US'||alts['en-US']!==S+rel) errs.push(`${rel}: want only self en-US hreflang`); continue; }
 // English-only pages with no translations: canonical only, no hreflang set
 if(['/deals/','/describe/','/describe-shoes/','/my-kit/','/padel-vs-paddle-tennis/','/guides/how-to-hold-a-padel-racket/','/guides/padel-rules/'].includes(rel)){ if(Object.keys(alts).length) errs.push(`${rel}: English-only page should have no hreflang`); continue; }
 // English + Spanish pair pages (no other translations yet): exactly en, es and x-default, reciprocal like the rest
 const PAIR=rel.startsWith('/bags/')||rel.startsWith('/es/paleteros-mochilas-padel/')||['/padel-clothing/','/es/ropa-padel/','/padel-accessories/','/es/accesorios-padel/','/padel-grips-overgrips/','/es/grips-overgrips-padel/','/padel-ball-pressuriser/','/es/presurizador-pelotas-padel/','/padel-ball-machine/','/es/maquina-lanzapelotas-padel/'].includes(rel);
 for(const l of [...(PAIR?['en','es']:LANGS),'x-default']) if(!alts[l]) errs.push(`${rel}: missing hreflang ${l}`);
 if(PAIR&&Object.keys(alts).length!==3) errs.push(`${rel}: en+es page should have only en, es and x-default hreflang`);
 if(alts['x-default']&&alts['x-default']!==alts.en) errs.push(`${rel}: x-default != en`);
 if(!Object.values(alts).includes(S+rel)) errs.push(`${rel}: hreflang set lacks self`);
 const lang=(h.match(/<html lang="([^"]+)"/)||[])[1]; map[rel]={alts,lang}; }
for(const [rel,{alts}] of Object.entries(map)) for(const [l,u] of Object.entries(alts)){ const r=u.replace(S,''); if(!map[r]){errs.push(`${rel}: hreflang ${l} -> ${r} not built`);continue;} if(JSON.stringify(map[r].alts)!==JSON.stringify(alts)) errs.push(`${rel}: hreflang not reciprocal with ${r}`);
 const want=l==='x-default'?'en':l; if(!map[r].lang.startsWith(want)) errs.push(`${r}: html lang ${map[r].lang} but hreflang ${l}`); }
console.log(`seoqa: ${LANGS.join('/')} · ${Object.keys(map).length} pages, ${errs.length} issues`); errs.slice(0,30).forEach(e=>console.log(' ',e));
process.exit(errs.length?1:0);
