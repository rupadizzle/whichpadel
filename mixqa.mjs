// Mixed-language check for every non-English language folder: visible text (racket/brand names removed) must not contain English or the other language.
import fs from 'fs';
const R=JSON.parse(fs.readFileSync('data/rackets.normalised.json')); const arr=Array.isArray(R)?R:(R.rackets||Object.values(R));
const esc=s=>String(s).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const shortM=(brand,model,year)=>{let s=String(model||''); if(brand) s=s.replace(new RegExp('^'+esc(brand)+'\\s+','i'),''); if(year) s=s.replace(new RegExp('\\s+'+year+'\\s*$'),''); return s.trim();};
const cutYear=(model,year)=>{let s=String(model||''); if(year==null||year==='') return s; const y=String(year); const parts=s.split(/\s+/); const i=parts.indexOf(y); return i>=0?parts.slice(0,i).join(' '):shortM('',s,year);};
const prefixes=s=>{const w=String(s||'').split(/\s+/).filter(Boolean); const out=[]; for(let i=w.length;i>=3;i--) out.push(w.slice(0,i).join(' ')); return out;};
const raw=[...arr.flatMap(r=>{const m=r.model||r.name||''; const sh=shortM(r.brand,m,r.year); const core=cutYear(m,r.year); const shCore=shortM(r.brand,core,null); return [r.name,m,r.brand,r.coreMaterial,r.faceMaterial,r.frame,m.replace(new RegExp('^'+(r.brand||'')+'\\s*','i'),''),sh.length>=3?sh:'',core.length>=3?core:'',shCore.length>=3?shCore:'',...prefixes(core),...prefixes(shCore)];})];
const S=fs.existsSync('data/shoes.json')?JSON.parse(fs.readFileSync('data/shoes.json')).shoes:[]; // shoe product names are proper nouns too
for(const s of S){const sh=shortM(s.brand,s.name||s.model||'',s.year); const core=cutYear(s.name||s.model||'',s.year); raw.push(s.name,s.model,sh.length>=3?sh:'',core.length>=3?core:'',...prefixes(core));}
const names=[...new Set(raw.filter(Boolean))].sort((a,b)=>b.length-a.length).map(esc);
const NM=new RegExp(names.join('|'),'gi');
const files=[]; (function w(d){for(const f of fs.readdirSync(d,{withFileTypes:true})){const p=d+'/'+f.name; f.isDirectory()?w(p):p.endsWith('.html')&&files.push(p);}})('dist');
const out=[]; const LANGS=fs.readdirSync('dist').filter(d=>/^[a-z]{2}$/.test(d)&&fs.existsSync(`dist/${d}/index.html`));
// marker words that are unambiguous for each language (never valid in the others we ship)
const OK={pt:['marcas','também','pala','palas'],es:['marcas','também'],it:['del','pala','palas'],de:['des'],fr:['pala','palas']};
const MK={es:['las','los','pala','palas','del','marcas','también'],fr:['les','des','avec','pour','une','raquettes','poids','marques'],pt:['raquetes','raquete','você','não','também','preço','marcas'],it:['racchette','racchetta','della','delle','prezzo','marchi','anche'],de:['schläger','und','mit','für','preis','marken','auch']};
const rx=ws=>new RegExp('(?<!\\p{L})('+ws.join('|')+')(?!\\p{L})','giu');
for(const f of files){const pg=f.slice(4); const lg=pg.split('/')[1]; if(!LANGS.includes(lg)) continue; let h=fs.readFileSync(f,'utf8');
 /* product pages: the <title> may keep any words of the product's own name to tell variants apart (src/lib/racket-title.js); those are proper nouns */
 {const pn=(h.match(/"@type":"Product","name":"([^"]+)"/)||[])[1]; if(pn){const ws=pn.split(/\s+/).filter(w=>w.length>2).map(esc); if(ws.length) h=h.replace(/<title>([^<]*)<\/title>/,(m,t)=>'<title>'+t.replace(new RegExp('(?<!\\p{L})('+ws.join('|')+')(?!\\p{L})','giu'),' ')+'</title>');}}
 const tx=h.replace(/<span class="rk-m">[^<]*<\/span>/g,' ').replace(/Which<em>Padel/g,' ').replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<option[\s\S]*?<\/option>/g,' ').replace(/<[^>]+>/g,' ').replace(/&[a-z#0-9]+;/g,' ').replace(/Padel Is Our Sport|Comfort Foam|SC Comfort|Comfort Flex|WhichPadel|PadelTrue|Black Friday|Cyber Monday|CC BY 4\.0|All For Padel|Padel And Help/g,' ').replace(NM,' ');
 const en=(tx.match(/(?<!\p{L})(the|and|with|your|rackets?|check price|price|best|for|from|weight|brands?|players?|which|about|more|see all|guide|power|comfort|this|that|these|our|weave|soft|hard|medium|round|teardrop|diamond|hybrid|high|low)(?!\p{L})/giu)||[]).filter(w=>!((lg==='fr'||lg==='de'||lg==='it')&&/^guide$/i.test(w))&&!(lg==='it'&&/^(the|comfort)$/i.test(w))&&!(lg==='de'&&/^(hybrid)$/i.test(w))&&!(lg==='pt'&&/^for$/i.test(w))); if(!en.length) en.x=1;
 const own=new Set(MK[lg]||[]); const otherW=Object.entries(MK).filter(([k])=>k!==lg).flatMap(([,v])=>v).filter(w=>!own.has(w)&&!(OK[lg]||[]).includes(w)); const o=tx.match(rx([...new Set(otherW)]));
 if(en.length) out.push(`${pg}: EN ${[...new Set(en.map(x=>x.toLowerCase()))].join(',')}`+(process.env.V?' :: '+[...tx.matchAll(/.{40}(?<!\p{L})(soft|hard|high|power|hybrid|medium|comfort|with)(?!\p{L}).{20}/gu)].map(m=>m[0]).join(' | '):'')); if(o&&o.length>2) out.push(`${pg}: OTHER ${[...new Set(o)].join(',')} (${o.length})`);}
console.log(out.join('\n')||'mixqa clean'); console.log(out.length+' issues');
if(out.length) process.exitCode=1;
