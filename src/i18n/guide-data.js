import { rackets, brandList } from '../lib/data.js'; import { shapeStats, coreStats, balanceStats, weightStats, faceStats } from '../lib/seo-content.js'; import { Pnum, money, url } from './index.js'; import { med } from './stats.js';
export function guideData(lang){const E=rackets.map(r=>Pnum(r,lang)).filter(v=>v!=null).sort((a,b)=>a-b);
 const shapeP=s=>money(med(rackets.filter(r=>r.shape===s).map(r=>Pnum(r,lang)).filter(v=>v!=null)),lang);
 return {N:rackets.length,B:brandList.length,S:Object.fromEntries(shapeStats.map(s=>[s.shape,{...s,price:shapeP(s.shape)}])),C:Object.fromEntries(coreStats.map(s=>[s.core,s])),Bal:Object.fromEntries(balanceStats.map(s=>[s.balance,s])),shapeStats,coreStats,balanceStats,W:weightStats,F:faceStats,
  P:{n:E.length,min:money(E[0],lang),max:money(E.at(-1),lang),med:money(med(E),lang),tiers:[[0,100],[100,175],[175,275],[275,1e9]].map(([a,b])=>({a,b,n:E.filter(p=>p>a&&p<=b).length}))},
  u:(t,id)=>url(t,lang,id)};}
