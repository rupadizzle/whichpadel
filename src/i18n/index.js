import es from './es.js'; import fr from './fr.js';
import { priceText, pick, fmt, FX } from '../lib/price.js';
import { url, alternates, LANGS } from './routes.js';
export const DICTS={es,fr};
export const D=lang=>DICTS[lang];
export { url, alternates, LANGS };
export const SITE='https://whichpadel.com';
export const P=(r,lang)=>priceText(r,D(lang).region,lang);
export const Pnum=(r,lang)=>{const p=pick(r,D(lang).region); return p.none?null:p.v;};
export const money=(n,lang)=>n==null?null:fmt(Math.round(n),'EUR',lang);
export const mat=(s,lang)=>{if(!s) return null; let o=s; for(const [re,rep] of D(lang).terms.mat) o=o.replace(re,rep); return o;};
export const wt=r=>r.weightMin?`${r.weightMin}${r.weightMax&&r.weightMax!==r.weightMin?'–'+r.weightMax:''} g`:null;
export const balTxt=(r,lang)=>{if(!r.balance) return null; const t=D(lang).terms.bal; if(t[r.balance]) return t[r.balance]; const m=String(r.balance).match(/([\d.]+)\s*(cm|mm)/); if(!m) return r.balance; const cm=m[2]==='mm'?+m[1]/10:+m[1]; return `${String(cm).replace('.',',')} cm`;};
export const racketX=(r,lang)=>{const R=r.ratings; const top=Object.entries(R).sort((a,b)=>b[1]-a[1]); const C=D(lang).copy.racket;
 return {best:top[0],worst:top.at(-1),bal:balTxt(r,lang),face:mat(r.faceMaterial,lang),core:/^(soft|medium|hard|medium-hard|foam)$/i.test(r.coreMaterial||'')?null:mat(r.coreMaterial,lang),price:P(r,lang),missing:(r.inputsMissing||[]).map(k=>C.missingNames[k]||k)};};
// recursive key check: every dict must have the same keys and value kinds as the reference (es)
export function checkDicts(){const errs=[]; const kind=v=>Array.isArray(v)?'array':v instanceof RegExp?'re':typeof v;
 const walk=(a,b,p,ln)=>{for(const k of Object.keys(a)){ if(!(k in b)){errs.push(`${ln}: missing key ${p}${k}`);continue;} const ka=kind(a[k]),kb=kind(b[k]); if(ka!==kb&&!(ka==='string'&&kb==='string')) errs.push(`${ln}: ${p}${k} is ${kb}, expected ${ka}`); else if(ka==='object') walk(a[k],b[k],p+k+'.',ln); else if(ka==='array'&&a[k].length!==b[k].length&&!(p+k).includes('mat')) errs.push(`${ln}: ${p}${k} length ${b[k].length}≠${a[k].length}`);}
  for(const k of Object.keys(b)) if(!(k in a)) errs.push(`${ln}: extra key ${p}${k}`);};
 for(const [ln,d] of Object.entries(DICTS)) if(ln!=='es') walk(es,d,'',ln);
 if(errs.length) throw new Error('i18n dictionary check failed:\n'+errs.join('\n'));}
checkDicts();
