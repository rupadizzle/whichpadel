// Normalised facets for the /rackets/ hub (shared by the static pages and /cards.json).
import { rackets } from './data.js';
export const PER=24;
const cm=s=>{const m=String(s).match(/([\d.]+)\s*(mm|cm)/); if(!m) return null; return m[2]==='mm'?+m[1]/10:+m[1];};
export const balN=r=>['low','medium','high'].includes(r.balance)?r.balance:(v=>v==null?'':v<26?'low':v<=26.4?'medium':'high')(cm(r.balance||''));
export const coreN=r=>({soft:'soft','medium-soft':'soft',medium:'medium','medium-hard':'hard',hard:'hard'})[r.coreHardness]||'';
export const wtN=r=>{const w=r.weightMin&&r.weightMax?(r.weightMin+r.weightMax)/2:(r.weightMin||r.weightMax); return !w?'':w<355?'l':w<=365?'m':'h';};
export const lvN=r=>{const t=r.ratings; return t.forgiveness>=70&&t.power<60?'b':t.power>=65&&t.forgiveness<55?'a':'i';};
// default order: rackets with a price first, newest, most complete specs
const base0=()=>[...rackets].sort((a,b)=>((b.price!=null)-(a.price!=null))||((b.year||0)-(a.year||0))||(b.published-a.published)||a.model.localeCompare(b.model));
// interleave brands so no single brand fills a page
export const hubOrder=()=>{const q={}; for(const r of base0()) (q[r.brand]??=[]).push(r); const ks=Object.keys(q).sort((a,b)=>q[b].length-q[a].length); const o=[]; while(o.length<rackets.length) for(const k of ks) if(q[k].length) o.push(q[k].shift()); return o;};
export const hubPages=()=>Math.ceil(rackets.length/PER);
