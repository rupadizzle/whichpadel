import { tk } from './money.js';
// SEO push content (new file). Data-derived lists, brand copy, vs plan.
import { rackets, slugify } from './data.js';
const avg = (rs,k)=> rs.length? Math.round(rs.reduce((a,r)=>a+r.ratings[k],0)/rs.length):0;
const med = a=>{const s=[...a].sort((x,y)=>x-y);return s.length?s[Math.floor(s.length/2)]:null;};
export const isWomens = r => /\b(W|Woman|Women|Mujer)\b/.test(r.model);
const shapePick = s => rs => rs.filter(r=>r.shape===s).map(r=>({r,s:(r.ratings.power+r.ratings.control+r.ratings.handling+r.ratings.forgiveness+r.ratings.comfort)/5})).sort((a,b)=>b.s-a.s||b.r.ratings.value-a.r.ratings.value).map(x=>x.r);
export const isJunior = r => /\b(JR|Jr|Junior)\b/.test(r.model);
export const isCarbon = r => /carbon|carbono|\b\d+k\b/i.test(r.faceMaterial||'') && !/fib(re|er|ra).{0,4}(glass|vidrio)|glass|polyglass|fibrix/i.test(r.faceMaterial||'');
const bal5 = r => (r.ratings.power+r.ratings.control+r.ratings.handling+r.ratings.forgiveness+r.ratings.comfort)/5;
export const extraLists = {
  'best-padel-racket-2026': { title:'Best padel rackets of 2026', kw:'best padel racket 2026',
    intro:'Every 2026 and 2027 model in our database, ranked on a balanced all-round score so that no single trait (pure power or pure control) dominates. Use the level and style lists linked below if you already know what you need.',
    rule:'Included: rackets with model year 2026 or 2027 and a recorded price. Score = average of power, control, handling, forgiveness and comfort ratings; ties broken by the value rating.',
    pick: rs=>rs.filter(r=>r.year>=2026 && r.priceGBPApprox).map(r=>({r,s:(r.ratings.power+r.ratings.control+r.ratings.handling+r.ratings.forgiveness+r.ratings.comfort)/5})).sort((a,b)=>b.s-a.s||b.r.ratings.value-a.r.ratings.value).map(x=>x.r) },
  'best-intermediate-padel-rackets': { title:'Best intermediate padel rackets', kw:'best intermediate padel racket',
    intro:'Intermediate players usually have a reliable rally and start wanting more from the smash without losing the forgiveness of a beginner racket. Teardrop and hybrid shapes with a medium balance are the usual step up, so that is what this list looks for.',
    rule:'Included: teardrop or hybrid shape, medium balance or unpublished balance, and a soft, medium-soft or medium core. Sorted by the average of power and control (the balance between the two), then forgiveness.',
    pick: rs=>rs.filter(r=>['teardrop','hybrid'].includes(r.shape) && (r.balance==='medium'||r.balance==null) && ['soft','medium-soft','medium'].includes(r.coreHardness)).sort((a,b)=>(b.ratings.power+b.ratings.control)-(a.ratings.power+a.ratings.control)||b.ratings.forgiveness-a.ratings.forgiveness) },
  'best-advanced-padel-rackets': { title:'Best advanced padel rackets', kw:'best padel racket for advanced players',
    intro:'Advanced players generate their own pace and want a racket that rewards clean contact: usually a diamond or teardrop head, higher balance and a firmer core. These rackets are less forgiving, which is the trade-off for more power at the net.',
    rule:'Included: diamond or teardrop shape and a medium, medium-hard or hard core. Sorted by the average of power and handling, then control.',
    pick: rs=>rs.filter(r=>['diamond','teardrop'].includes(r.shape) && ['medium','medium-hard','hard'].includes(r.coreHardness)).sort((a,b)=>(b.ratings.power+b.ratings.handling)-(a.ratings.power+a.ratings.handling)||b.ratings.control-a.ratings.control) },
  'best-cheap-padel-rackets': { title:'Best cheap padel rackets', kw:'cheap padel racket',
    intro:'You do not need to spend ⟦b|200|GBP|GBP⟧ to enjoy padel. These are the best-rated rackets in our database with a recorded price of ⟦b|80|GBP|GBP⟧ or less, which covers most first rackets and spares.',
    rule:'Included: recorded price at or below ⟦b|80|GBP|GBP⟧ (EUR/USD converted at the 20 Oct 2026 rate). Sorted by the average of forgiveness, comfort and value, then lower price.',
    pick: rs=>rs.filter(r=>r.priceGBPApprox!=null && r.priceGBPApprox<=80).sort((a,b)=>(b.ratings.forgiveness+b.ratings.comfort+b.ratings.value)-(a.ratings.forgiveness+a.ratings.comfort+a.ratings.value)||a.priceGBPApprox-b.priceGBPApprox) },
  'best-womens-padel-rackets': { title:"Best women's padel rackets", kw:"women's padel racket",
    pick: rs=>rs.filter(r=>!isJunior(r)&&(isWomens(r)||(r.weightMax&&r.weightMax<=360&&r.balance!=='high'&&!['hard','medium-hard'].includes(r.coreHardness)))).map(r=>({r,s:(r.ratings.handling+r.ratings.forgiveness+r.ratings.comfort)/3+(isWomens(r)?0.5:0)})).sort((a,b)=>b.s-a.s||(a.r.weightMin??999)-(b.r.weightMin??999)).map(x=>x.r) },
  'best-mens-padel-rackets': { title:"Best men's padel rackets", kw:"men's padel racket",
    pick: rs=>rs.filter(r=>!isJunior(r)&&!isWomens(r)&&r.weightMin&&r.weightMin>=355&&['medium','high'].includes(r.balance)).map(r=>({r,s:bal5(r)+(r.ratings.power+r.ratings.control)/10})).sort((a,b)=>b.s-a.s||b.r.ratings.value-a.r.ratings.value).map(x=>x.r) },
  'best-round-padel-rackets': { title:'Best round padel rackets', kw:'round padel racket', shape:'round',
    intro:'A round head puts the sweet spot low and central, so off-centre hits still come back with control. Round rackets are the usual choice for beginners and defensive players who build points from the back of the court.',
    rule:'Included: every racket with a round head shape (as published). Score = average of power, control, handling, forgiveness and comfort; ties broken by the value rating.',
    pick: shapePick('round') },
  'best-teardrop-padel-rackets': { title:'Best teardrop padel rackets', kw:'teardrop padel racket', shape:'teardrop',
    intro:'A teardrop head sits between round and diamond: the sweet spot is a little higher than on a round racket, giving extra punch without losing too much control. It suits all-round players who both attack and defend.',
    rule:'Included: every racket with a teardrop head shape (as published). Score = average of power, control, handling, forgiveness and comfort; ties broken by the value rating.',
    pick: shapePick('teardrop') },
  'best-diamond-padel-rackets': { title:'Best diamond padel rackets', kw:'diamond padel racket', shape:'diamond',
    intro:'A diamond head moves the sweet spot and the weight towards the tip, which adds power on smashes and volleys but makes the racket less forgiving. Diamond rackets suit attacking players with sound technique.',
    rule:'Included: every racket with a diamond head shape (as published). Score = average of power, control, handling, forgiveness and comfort; ties broken by the value rating.',
    pick: shapePick('diamond') },
  'best-hybrid-padel-rackets': { title:'Best hybrid padel rackets', kw:'hybrid padel racket', shape:'hybrid',
    intro:'A hybrid head blends round and teardrop characteristics, aiming for control and forgiveness with a little more reach than a pure round racket. Hybrids suit players moving up from a first racket.',
    rule:'Included: every racket with a hybrid head shape (as published). Score = average of power, control, handling, forgiveness and comfort; ties broken by the value rating.',
    pick: shapePick('hybrid') },
  'best-lightweight-padel-rackets': { title:'Best lightweight padel rackets', pick: rs=>rs.filter(r=>!isJunior(r)&&r.weightMax&&r.weightMax<=355).sort((a,b)=>(b.ratings.handling+b.ratings.comfort)-(a.ratings.handling+a.ratings.comfort)||a.weightMax-b.weightMax) },
  'best-carbon-padel-rackets': { title:'Best carbon padel rackets', pick: rs=>rs.filter(r=>!isJunior(r)&&isCarbon(r)).map(r=>({r,s:bal5(r)})).sort((a,b)=>b.s-a.s||b.r.ratings.value-a.r.ratings.value).map(x=>x.r) },
  'best-junior-padel-rackets': { title:"Best kids' & junior padel rackets", pick: rs=>rs.filter(r=>isJunior(r)||(r.weightMax&&r.weightMax<=345&&!['hard','medium-hard'].includes(r.coreHardness))).sort((a,b)=>isJunior(b)-isJunior(a)||(a.weightMax??999)-(b.weightMax??999)||(b.ratings.handling+b.ratings.forgiveness)-(a.ratings.handling+a.ratings.forgiveness)) },
  'best-pro-padel-rackets': { title:'Best pro padel rackets', pick: rs=>rs.filter(r=>r.player&&!isJunior(r)).map(r=>({r,s:bal5(r)})).sort((a,b)=>b.s-a.s||(b.r.year||0)-(a.r.year||0)).map(x=>x.r) },
  'best-soft-padel-rackets': { title:'Best soft padel rackets', pick: rs=>rs.filter(r=>!isJunior(r)&&['soft','medium-soft'].includes(r.coreHardness)).sort((a,b)=>(b.ratings.comfort+b.ratings.forgiveness)-(a.ratings.comfort+a.ratings.forgiveness)||b.ratings.control-a.ratings.control) },
  'best-hard-padel-rackets': { title:'Best hard padel rackets', pick: rs=>rs.filter(r=>!isJunior(r)&&['hard','medium-hard'].includes(r.coreHardness)).sort((a,b)=>(b.ratings.power+b.ratings.control)-(a.ratings.power+a.ratings.control)||b.ratings.handling-a.ratings.handling) },
};
// Brand copy: facts below are generic brand background plus figures computed live from our data.
const brandCopy = {
  adidas:{blurb:'adidas padel rackets are made under licence by the Spanish company Padel Is Our Sport, and the range is built around a few long-running families: Metalbone (the attacking flagship), Adipower, Cross It and the softer Match and Drive lines for newer players.', faq:[['Is adidas a good padel racket brand?','adidas is one of the largest padel brands and its range runs from entry-level to pro-tour models. Whether one suits you depends on shape, balance and core, which we list for every model below.'],['Which adidas padel racket is best for beginners?','Look at the round-shaped, soft-core models in the list. Sort by forgiveness on our database to see them first.']]},
  babolat:{blurb:'Babolat, the French racket-sports company, splits its padel range into three clear families: Technical (power, diamond-leaning), Air (lighter and faster) and Counter (control and comfort). That naming makes it one of the easiest ranges to shop by style.', faq:[['Is Babolat a good brand for padel rackets?','Babolat is a long-established racket maker with a full padel range from beginner to tour level. Use the shape and core data below to match a model to your game.'],['Which Babolat padel racket is best?','For power, the Technical family; for control and comfort, the Counter family; for a lighter swing, the Air family. Our list shows the spec-based scores for each.']]},
  nox:{blurb:'Nox is a Spanish padel specialist best known for the AT10 line built with Agustín Tapia and the ML10 line with Miguel Lamperti. Its range leans towards teardrop and round shapes, which makes it popular with players who want a balance of control and power.', faq:[['Are Nox padel rackets good?','Nox is a padel-only brand with models from entry level to the rackets used by top professionals. The specs and ratings for each model are listed below.'],['Which Nox padel racket is best?','The AT10 family is the attacking choice and the ML10 family is more control-focused and forgiving. Compare two side by side with our compare tool.'],['What country is Nox from?','Nox is a Spanish brand.']]},
  head:{blurb:'Head, the Austrian sports brand, is a major name in padel with tour-level lines such as Extreme, Speed, Delta, Gravity and the Coello signature models, plus the Evo series for newer players.', faq:[['Is Head a good padel racket brand?','Head has one of the broadest padel ranges and many professional players use it. Our database lists every Head model with its published specs.'],['Which Head padel racket is best for beginners?','The Evo and Gravity models are generally the most forgiving in the range; check their forgiveness and comfort scores below.']]},
  bullpadel:{blurb:'Bullpadel is a Spanish padel specialist and the largest brand in our database. Its Vertex and Hack lines are attack-focused diamond rackets, while Flow, Indiga and Elite target control, comfort and women\'s versions.', faq:[['Is Bullpadel a good brand?','Bullpadel is one of the best-known padel-only brands, with rackets from entry level to the pro tour. Every model we list shows shape, balance, core and price.'],['Which Bullpadel racket is best for power?','The Vertex and Hack families are the brand\'s attacking lines. Sort by power on the database to see them first.']]},
  wilson:{blurb:'Wilson, the American racket-sports brand, has a smaller padel range centred on the Bela line developed with Fernando Belasteguín, plus lighter "LS" versions for an easier swing.', faq:[['Is Wilson good for padel?','Wilson has a focused padel range rather than a huge one. The Bela models are the brand\'s flagships; the LS versions are lighter.'],['Which Wilson padel racket should I buy?','The Bela Pro models are the most attacking; the LS models are lighter and easier to handle. See the specs for each below.']]},
};
const SH={round:'round (control and forgiveness)',teardrop:'teardrop (all-round)',diamond:'diamond (power)',hybrid:'hybrid'};
function genericCopy(rs){
  const name=rs[0].brand, sh={}; rs.forEach(r=>{if(r.shape) sh[r.shape]=(sh[r.shape]||0)+1}); const top=Object.entries(sh).sort((a,b)=>b[1]-a[1]);
  const yrs=[...new Set(rs.map(r=>r.year).filter(Boolean))].sort(); const best=k=>[...rs].sort((a,b)=>b.ratings[k]-a.ratings[k])[0];
  const soft=rs.filter(r=>['soft','medium-soft'].includes(r.coreHardness)).length;
  const blurb=`Every ${name} padel racket in our database, with published specs, spec-based ratings and recorded prices.`;
  const faq=[];
  if(rs.length>1){ faq.push([`Which ${name} padel racket has the most power?`,`On our spec-based ratings the ${best('power').model} scores highest for power (${best('power').ratings.power}/100). Ratings are calculated from published specs, not court tests.`]);
   faq.push([`Which ${name} padel racket is best for beginners?`,`The ${best('forgiveness').model} has the highest forgiveness score (${best('forgiveness').ratings.forgiveness}/100) in the ${name} models we list, which usually suits newer players.`]); }
  if(soft) faq.push([`Does ${name} make soft, arm-friendly rackets?`,`${soft} of the ${rs.length} ${name} rackets we list have a soft or medium-soft core, as published by the maker or retailer.`]);
  return {blurb,faq};
}
export function brandContent(slug){
  const rs=rackets.filter(r=>slugify(r.brand)===slug); if(!rs.length) return null; const p=rs.map(r=>r.priceGBPApprox).filter(Boolean);
  const c=brandCopy[slug]||genericCopy(rs);
  const sh={}; rs.forEach(r=>{if(r.shape) sh[r.shape]=(sh[r.shape]||0)+1});
  const top=k=>[...rs].sort((a,b)=>b.ratings[k]-a.ratings[k])[0];
  const name=rs[0]?.brand||slug;
  const facts=`In our database: ${rs.length} ${name} racket${rs.length>1?'s':''}${Object.keys(sh).length?`; shapes ${Object.entries(sh).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k} ${v}`).join(', ')}`:''}${p.length?`; recorded prices about ${tk(Math.min(...p),'GBP')}–${tk(Math.max(...p),'GBP')} (median ${tk(med(p),'GBP')})`:''}. Highest power score: ${top('power').model}. Most forgiving: ${top('forgiveness').model}.`;
  const faq=[...c.faq,...(p.length?[]:[]),[`How much do ${name} padel rackets cost?`,p.length>1?`Recorded prices for the ${p.length} ${name} rackets with a price in our database run from about ${tk(Math.min(...p),'GBP')} to ${tk(Math.max(...p),'GBP')}, with a median of ${tk(med(p),'GBP')}. Prices change often, so check the shop before buying.`:p.length?`We have one recorded price for ${name}: about ${tk(p[0],'GBP')}. Prices change often, so check the shop before buying.`:`We do not have a recorded price for ${name} yet. Check the shop link on each racket page.`]];
  return { blurb:c.blurb, facts, faq, topPower:top('power'), topForgiving:top('forgiveness') };
}
export const shapeStats = ['round','teardrop','diamond','hybrid'].map(s=>{const g=rackets.filter(r=>r.shape===s);return {shape:s,n:g.length,power:avg(g,'power'),control:avg(g,'control'),forgiveness:avg(g,'forgiveness'),comfort:avg(g,'comfort'),price:med(g.map(r=>r.priceGBPApprox).filter(Boolean))};});
export const coreStats = ['soft','medium-soft','medium','medium-hard','hard'].map(s=>{const g=rackets.filter(r=>r.coreHardness===s);return {core:s,n:g.length,power:avg(g,'power'),control:avg(g,'control'),comfort:avg(g,'comfort'),forgiveness:avg(g,'forgiveness')};});
export const balanceStats = ['low','medium','high'].map(s=>{const g=rackets.filter(r=>r.balance===s);return {balance:s,n:g.length,power:avg(g,'power'),control:avg(g,'control'),forgiveness:avg(g,'forgiveness')};});
const P=rackets.map(r=>r.priceGBPApprox).filter(Boolean);
export const priceStats = { n:P.length, min:Math.min(...P), max:Math.max(...P), median:med(P), tiers:[['Up to ⟦b|100|GBP|GBP⟧',0,100],['⟦b|101|GBP|GBP⟧–⟦b|150|GBP|GBP⟧',100,150],['⟦b|151|GBP|GBP⟧–⟦b|250|GBP|GBP⟧',150,250],['Over ⟦b|250|GBP|GBP⟧',250,1e9]].map(([l,a,b])=>({label:l,n:P.filter(p=>p>a&&p<=b).length})) };
const W=rackets.filter(r=>r.weightMin); export const weightStats={n:W.length,min:Math.min(...W.map(r=>r.weightMin)),max:Math.max(...rackets.filter(r=>r.weightMax).map(r=>r.weightMax))};
export const faceStats=(()=>{let c=0,g=0;rackets.forEach(r=>{const f=(r.faceMaterial||'').toLowerCase(); if(!f) return; if(/carbon|carbono|\d+k\b/.test(f)) c++; else if(/glass|vidrio|fibrix|polyglass/.test(f)) g++;}); return {carbon:c,glass:g};})();
