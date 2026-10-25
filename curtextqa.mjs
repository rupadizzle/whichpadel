// Currency-text QA: every currency amount a visitor can see (body text, attributes, <title>) must be inside a converter
// element (.pz = shop price, .mz = converted amount / budget) so it follows the chosen currency. Fails on any escape.
// Also fails on leftover raw tokens (⟦…⟧) and on a <title> with an amount but no data-mt template.
import fs from 'fs'; import path from 'path';
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):e.name.endsWith('.html')?[path.join(d,e.name)]:[]);
const AMT=/(?:[£€$]\s?\d[\d.,]*|\d[\d.,]*\s?(?:[£€]|kr\b)|\b(?:GBP|EUR|USD|SEK)\s?\d)/;
const bad=[]; let pages=0, conv=0;
for(const f of walk('dist')){const h0=fs.readFileSync(f,'utf8'); if(/http-equiv="refresh"/.test(h0)||/<meta name="robots" content="noindex/.test(h0)) continue; pages++; const rel='/'+path.relative('dist',f);
 // /us/ pages are US-only and always open in USD (Region PAGE lock), so their $ amounts are intentional
 if(rel.startsWith('/us/')) continue;
 if(/⟦|⟧/.test(h0.replace(/<script[\s\S]*?<\/script>/g,'').replace(/ data-mt="[^"]*"/,''))) bad.push(`raw token: ${rel}`);
 const t=(h0.match(/<title>([^<]*)<\/title>/)||[])[1]||''; if(AMT.test(t)&&!/<html[^>]*\sdata-mt="/.test(h0)) bad.push(`title not templated: ${rel} :: ${t}`);
 let h=h0.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<head>[\s\S]*?<\/head>|<!--[\s\S]*?-->/g,'');
 conv+=(h.match(/class="(?:pz|mz)\b|class="[^"]*\b(?:pz|mz)\b/g)||[]).length;
 h=h.replace(/<span class="[^"]*\b(?:pz|mz)\b[^"]*"[^>]*>[^<]*<\/span>/g,'');
 for(const m of h.matchAll(/<[^>]+>/g)){const a=m[0].replace(/\s(?:data-[\w-]+|href|src|srcset|class|style|id)="[^"]*"/g,''); if(AMT.test(a)) bad.push(`attr: ${rel} :: ${a.slice(0,140)}`);}
 const txt=h.replace(/<[^>]+>/g,'\n'); for(const line of txt.split('\n')) if(AMT.test(line)) bad.push(`text: ${rel} :: ${line.trim().slice(0,140)}`);}
const by={}; for(const b of bad){const k=b.split(' :: ')[0].replace(/\/(es|fr|pt|it|de)\//,'/L/').replace(/\/[^/]+\/index\.html$/,'/*'); by[k]=(by[k]||0)+1;}
if(bad.length){console.log(Object.entries(by).sort((a,b)=>b[1]-a[1]).slice(0,40).map(([k,n])=>n+'  '+k).join('\n')); console.log(bad.slice(0,30).join('\n'));}
console.log(`curtextqa: ${pages} pages, ${conv} converter elements, ${bad.length} escapes`); console.log(bad.length?'CURTEXT FAIL':'CURTEXT PASS');
