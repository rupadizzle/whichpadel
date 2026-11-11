// Static check over dist: canonical = own URL; hreflang en/es/fr + x-default present, absolute, self-including, reciprocal, and pointing at built pages.
import fs from 'fs'; import path from 'path';
const D='dist', S='https://whichpadel.com'; const LANGS=['en',...fs.readdirSync(D).filter(d=>/^[a-z]{2}$/.test(d)&&fs.existsSync(`${D}/${d}/index.html`))]; const errs=[]; const map={}; const live=new Set(); let pruned=0;
const EN_ONLY_XD=['/guides/best-padel-gifts-for-men/','/guides/best-padel-gifts-for-women/','/guides/best-padel-clothing-brands/'];
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):e.name.endsWith('.html')?[path.join(d,e.name)]:[]);
for(const f of walk(D)){ const rel='/'+path.relative(D,f).replace(/index\.html$/,'').replace(/\\/g,'/'); if(/404/.test(rel)) continue;
 const h=fs.readFileSync(f,'utf8'); const robots=(h.match(/<meta name="robots" content="([^"]+)"/)||[])[1]; const canon=(h.match(/<link rel="canonical" href="([^"]+)"/)||[])[1];
 const alts={}; for(const m of h.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)) alts[m[1]]=m[2];
 if(robots==='noindex,follow'){ pruned++; if(canon!==S+rel) errs.push(`${rel}: noindex page canonical ${canon}`); if(Object.values(alts).some(u=>u!==S+rel)) errs.push(`${rel}: noindex page lists hreflang siblings`); continue; }
 if(robots) continue; live.add(rel);
 if(canon!==S+rel) errs.push(`${rel}: canonical ${canon}`);
 // /us/ pages: English (US) only, no translated twin -> exactly one self-referencing en-US hreflang
 if(rel.startsWith('/us/')){ if(Object.keys(alts).join()!=='en-US'||alts['en-US']!==S+rel) errs.push(`${rel}: want only self en-US hreflang`); continue; }
 // English-only pages with no translations: canonical only, no hreflang set
 if(['/describe/','/describe-shoes/'].includes(rel)) /* deals, my kit, padel rules, how to hold and padel vs paddle now ship in all six languages */{ if(Object.keys(alts).length) errs.push(`${rel}: English-only page should have no hreflang`); continue; }
 if(EN_ONLY_XD.includes(rel)){ if(Object.keys(alts).sort().join()!=='en,x-default'||alts.en!==S+rel||alts['x-default']!==alts.en) errs.push(`${rel}: want only self en + x-default hreflang`); continue; }
 // English + Spanish pair pages (no other translations yet): exactly en, es and x-default, reciprocal like the rest
 const PAIR=['/padel-clothing/','/es/ropa-padel/'].includes(rel); /* en+es only pages; bags, accessories, grips, pressuriser and ball machine now ship in all six languages */
 if(PAIR&&Object.keys(alts).length!==3) errs.push(`${rel}: en+es page should have only en, es and x-default hreflang`);
 if(alts['x-default']&&alts['x-default']!==alts.en) errs.push(`${rel}: x-default != en`);
 if(!Object.values(alts).includes(S+rel)) errs.push(`${rel}: hreflang set lacks self`);
 const sib=[...((h.match(/<ul class="lang-seg" data-lang-pick>(.*?)<\/ul>/)||[])[1]||'').matchAll(/<a [^>]*href="([^"]+)"[^>]*hreflang="([^"]+)"/g)].map(m=>[m[2],m[1]]);
 const lang=(h.match(/<html lang="([^"]+)"/)||[])[1]; map[rel]={alts,lang,sib,PAIR}; }
for(const [rel,{alts,sib,PAIR}] of Object.entries(map)){ const want=PAIR?['en','es']:sib.filter(([,u])=>live.has(u)).map(([l])=>l);
 for(const l of [...want,'x-default']) if(!alts[l]) errs.push(`${rel}: missing hreflang ${l}`);
 for(const l of Object.keys(alts)) if(l!=='x-default'&&!want.includes(l)) errs.push(`${rel}: hreflang ${l} is not an indexed sibling`); }
for(const [rel,{alts}] of Object.entries(map)) for(const [l,u] of Object.entries(alts)){ const r=u.replace(S,''); if(!map[r]){errs.push(`${rel}: hreflang ${l} -> ${r} ${live.has(r)?'not in a hreflang cluster':'not built or not indexed'}`);continue;} if(JSON.stringify(map[r].alts)!==JSON.stringify(alts)) errs.push(`${rel}: hreflang not reciprocal with ${r}`);
 const want=l==='x-default'?'en':l; if(!map[r].lang.startsWith(want)) errs.push(`${r}: html lang ${map[r].lang} but hreflang ${l}`); }
console.log(`seoqa: ${LANGS.join('/')} · ${Object.keys(map).length} pages, ${pruned} noindex,follow, ${errs.length} issues`); errs.slice(0,30).forEach(e=>console.log(' ',e));
process.exit(errs.length?1:0);
