import { rackets, lists } from '../lib/data.js'; import { extraLists } from '../lib/seo-content.js'; import { Pnum } from './index.js';
const ALL={...lists,...extraLists};
export function pickL(k,lang){ {const um=k.match(/^best-padel-rackets-under-(\d+)$/); if(um){const cap=+um[1], q=r=>r.ratings.power+r.ratings.control+r.ratings.comfort; const rs=rackets.filter(r=>{const p=Pnum(r,lang);return p!=null&&p<=cap}); return cap===100?rs.sort((a,b)=>b.ratings.value-a.ratings.value):rs.sort((a,b)=>q(b)-q(a)||Pnum(a,lang)-Pnum(b,lang));}}
 if(k==='best-cheap-padel-rackets') return rackets.filter(r=>{const p=Pnum(r,lang);return p!=null&&p<=80}).sort((a,b)=>(b.ratings.forgiveness+b.ratings.comfort+b.ratings.value)-(a.ratings.forgiveness+a.ratings.comfort+a.ratings.value)||Pnum(a,lang)-Pnum(b,lang));
 return ALL[k].pick(rackets);}
export const method=k=>!!ALL[k]?.method;
