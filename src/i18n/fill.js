// Fills keys present in the English dictionary but missing in another language from that language's translation memory (src/i18n/tm/<lang>.js).
// Never falls back to English: an untranslated key stays missing, and checkDicts / translate-missing.mjs fail the build.
export const isObj=v=>v&&typeof v==='object'&&!Array.isArray(v)&&!(v instanceof RegExp);
export function missing(ref,d,p=''){const out=[]; for(const k of Object.keys(ref)){const path=p+k; if(!(k in d)) out.push(path); else if(isObj(ref[k])&&isObj(d[k])) out.push(...missing(ref[k],d[k],path+'.'));} return out;}
export function fill(ref,d,tm){for(const path of missing(ref,d)) if(path in tm){const ks=path.split('.'); let o=d; for(const k of ks.slice(0,-1)) o=o[k]??=(o[k]={}); o[ks.at(-1)]=tm[path];} return d;}
