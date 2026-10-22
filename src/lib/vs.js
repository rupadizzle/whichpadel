import { tk } from './money.js'; import { priceTok } from './price.js';
import plan from '../../data/vs-plan.json';
import { bySlug, cap, fmtPrice } from './data.js';
export const vsPairs = plan.pairs.filter(p=>bySlug[p.a]&&bySlug[p.b]).map(p=>({...p, slug:`${p.a}-vs-${p.b}`, A:bySlug[p.a], B:bySlug[p.b]}));
export const vsFor = slug => vsPairs.filter(p=>p.a===slug||p.b===slug);
const K=['power','control','handling','forgiveness','comfort','value'];
export const sh=r=>r.model.replace(r.brand+' ','').replace(/ by .*$/,'');
const wt=r=>r.weightMin?`${r.weightMin}${r.weightMax&&r.weightMax!==r.weightMin?'–'+r.weightMax:''} g`:null;
export function vsCopy(A,B){
  const a=sh(A), b=sh(B), d=k=>A.ratings[k]-B.ratings[k];
  const big=K.filter(k=>k!=='value').map(k=>[k,d(k)]).sort((x,y)=>Math.abs(y[1])-Math.abs(x[1]));
  const s=[];
  s.push(`The ${A.model} and the ${B.model} ${A.brand===B.brand?`are both ${A.brand} rackets`:`come from ${A.brand} and ${B.brand}`}${A.shape&&B.shape?(A.shape===B.shape?`, and both have a ${A.shape} head`:`, with a ${A.shape} head on the ${a} and a ${B.shape} head on the ${b}`):''}.`);
  const spec=[]; if(wt(A)&&wt(B)) spec.push(`published weights are ${wt(A)} and ${wt(B)}`);
  if(A.balance&&B.balance) spec.push(A.balance===B.balance?`both have a ${A.balance} balance`:`balance is ${A.balance} versus ${B.balance}`);
  if(A.coreHardness&&B.coreHardness) spec.push(A.coreHardness===B.coreHardness?`both use a ${A.coreHardness} core`:`the core is ${A.coreHardness} on the ${a} and ${B.coreHardness} on the ${b}`);
  if(spec.length) s.push(`On paper, ${spec.join('; ')}.`);
  const [k,v]=big[0]; if(Math.abs(v)>=3) s.push(`The biggest gap in our spec-based ratings is ${k}: ${v>0?a:b} scores ${Math.max(A.ratings[k],B.ratings[k])} against ${Math.min(A.ratings[k],B.ratings[k])}.`);
  else s.push(`Their spec-based ratings are very close, with no score more than ${Math.abs(v)} points apart.`);
  const intro=s.join(' ');
  const w=k=>d(k)>0?a:d(k)<0?b:null;
  const v2=[];
  const pw=w('power'), ct=w('control'), fg=(A.ratings.forgiveness+A.ratings.comfort)-(B.ratings.forgiveness+B.ratings.comfort);
  if(pw) v2.push(`Pick the ${pw} if you want more power (${Math.max(A.ratings.power,B.ratings.power)} vs ${Math.min(A.ratings.power,B.ratings.power)}).`);
  if(ct&&ct!==pw) v2.push(`Pick the ${ct} if you value control (${Math.max(A.ratings.control,B.ratings.control)} vs ${Math.min(A.ratings.control,B.ratings.control)}).`);
  else if(ct) v2.push(`The ${ct} also edges control, so it leads on both of the main traits.`);
  if(fg) v2.push(`For newer players or sore arms, the ${fg>0?a:b} has the higher forgiveness and comfort scores combined.`);
  if(A.priceGBPApprox&&B.priceGBPApprox&&A.priceGBPApprox!==B.priceGBPApprox){const c=A.priceGBPApprox<B.priceGBPApprox?A:B,e=c===A?B:A; v2.push(`On recorded prices the ${sh(c)} is about ${tk(e.priceGBPApprox-c.priceGBPApprox,'GBP')} cheaper (about ${tk(c.priceGBPApprox,'GBP')} vs ${tk(e.priceGBPApprox,'GBP')}).`);}
  const verdict=v2.join(' ')||'On our spec-based model these two rackets are almost identical; choose on price and feel.';
  const faq=[
    [`Which is more powerful, the ${a} or the ${b}?`, pw?`On our spec-based model the ${pw} scores higher for power (${Math.max(A.ratings.power,B.ratings.power)} vs ${Math.min(A.ratings.power,B.ratings.power)}). Scores are calculated from published specs, not court tests.`:`Both score ${A.ratings.power} for power on our spec-based model.`],
    [`Which has more control, the ${a} or the ${b}?`, ct?`The ${ct} scores higher for control (${Math.max(A.ratings.control,B.ratings.control)} vs ${Math.min(A.ratings.control,B.ratings.control)}) on our spec-based model.`:`Both score ${A.ratings.control} for control on our spec-based model.`],
    [`Which is better for beginners?`, fg?`The ${fg>0?a:b} has the higher combined forgiveness and comfort scores, which usually suits newer players better.`:`They have the same combined forgiveness and comfort scores.`],
    [`What is the price difference?`, A.priceGBPApprox&&B.priceGBPApprox?`Recorded prices are ${priceTok(A,'GB')||'—'} for the ${a} and ${priceTok(B,'GB')||'—'} for the ${b}. Prices change often, so check the shop.`:`We do not have a recorded price for both rackets.`],
  ];
  return {intro,verdict,faq,a,b};
}
export const specRows=r=>({Shape:cap(r.shape),Weight:wt(r),Balance:cap(r.balance),Core:r.coreMaterial,Hardness:cap(r.coreHardness),Face:r.faceMaterial,Thickness:r.thicknessMm?r.thicknessMm+' mm':null,Year:r.year});
