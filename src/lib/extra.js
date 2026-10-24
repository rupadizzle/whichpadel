import { rackets, brandList, fmtPrice, cap } from './data.js';
const key=r=>r.model.replace(r.brand,'').replace(/\b20\d\d\b/g,'').replace(/\b\d+(\.\d+)?\b/g,'').replace(/\s+/g,' ').trim().toLowerCase();
const pairsFor=(b,models,prev)=>models.map(r=>{const k=key(r); const p=b.rackets.filter(x=>x.year===prev&&key(x)===k); return p.length===1?{n:r,o:p[0]}:null;}).filter(Boolean);
export const brandYears=brandList.flatMap(b=>{
  const years=[...new Set(b.rackets.map(r=>r.year).filter(Boolean))].sort((a,c)=>c-a);
  return years.map(year=>{const models=b.rackets.filter(r=>r.year===year); const prev=year-1;
    return {...b, year, prev, models, pairs:pairsFor(b,models,prev), id:`${b.slug}/${year}`};});
});
export const y27=brandYears.filter(b=>b.year===2027);
export const wt=r=>r.weightMin?`${r.weightMin}${r.weightMax&&r.weightMax!==r.weightMin?'–'+r.weightMax:''} g`:null;
export const diffRows=(o,n)=>[['Shape',cap(o.shape),cap(n.shape)],['Weight',wt(o),wt(n)],['Balance',o.balance,n.balance],['Core',[cap(o.coreHardness),o.coreMaterial].filter(x=>x&&x!=='—').join(' · ')||null,[cap(n.coreHardness),n.coreMaterial].filter(x=>x&&x!=='—').join(' · ')||null],['Face',o.faceMaterial,n.faceMaterial],['Recorded price',o.price!=null?fmtPrice(o):null,n.price!=null?fmtPrice(n):null]].map(([k,a,b])=>({k,a:a??'Not published',b:b??'Not published',same:(a??null)===(b??null)}));
// real-weight estimate
const BAL={low:25.5,medium:26.5,high:27.5};
export const balCm=r=>{const s=String(r.balance||'').toLowerCase(); if(BAL[s]) return {cm:BAL[s],est:true}; let m=s.match(/([\d.]+)\s*mm/); if(m) return {cm:+m[1]/10,est:false}; m=s.match(/([\d.]+)\s*cm/); if(m) return {cm:+m[1],est:false}; return null;};
export const feel=r=>{const b=balCm(r); if(!b||!r.weightMin) return null; const w=r.weightMax?(r.weightMin+r.weightMax)/2:r.weightMin; return {w,cm:b.cm,balEst:b.est,idx:Math.round(w*(b.cm-10)/100)};};
export const feelData=()=>rackets.map(r=>{const f=feel(r); return f&&{s:r.slug,m:r.model,i:r.image||'',w:f.w,cm:f.cm,e:f.balEst,x:f.idx};}).filter(Boolean);
