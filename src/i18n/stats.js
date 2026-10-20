import { rackets, brandList, slugify } from '../lib/data.js';
import { Pnum, money } from './index.js';
const med=a=>{const s=[...a].sort((x,y)=>x-y);return s.length?s[Math.floor(s.length/2)]:null;};
const cnt=(rs,k)=>{const m={}; rs.forEach(r=>{if(r[k]) m[r[k]]=(m[r[k]]||0)+1}); return Object.entries(m).sort((a,c)=>c[1]-a[1]);};
export function brandStats(b,lang){const rs=b.rackets; const sh=cnt(rs,'shape'); const ys=[...new Set(rs.map(r=>r.year).filter(Boolean))].sort(); const p=rs.map(r=>Pnum(r,lang)).filter(v=>v!=null);
 const avg=k=>Math.round(rs.reduce((a,r)=>a+r.ratings[k],0)/rs.length); const top=k=>[...rs].sort((a,c)=>c.ratings[k]-a.ratings[k])[0];
 return {n:rs.length,shapes:sh,shape:sh[0],shape2:sh[1]?.[0],y0:ys[0],y1:ys.at(-1),np:p.length,pmin:p.length?money(Math.min(...p),lang):null,pmax:p.length?money(Math.max(...p),lang):null,pmed:p.length?money(med(p),lang):null,power:avg('power'),control:avg('control'),topPower:top('power'),topForg:top('forgiveness'),soft:rs.filter(r=>['soft','medium-soft'].includes(r.coreHardness)).length};}
export function brandFaq(b,lang,d){const x=brandStats(b,lang); const C=d.copy.brand; const f=[]; if(x.n>1){f.push(C.faqPower(b.name,x.topPower.model,x.topPower.ratings.power)); f.push(C.faqBeg(b.name,x.topForg.model,x.topForg.ratings.forgiveness));} if(x.soft) f.push(C.faqSoft(b.name,x.soft,x.n)); f.push(C.faqPrice(b.name,x)); return f;}
export { cnt, med };
