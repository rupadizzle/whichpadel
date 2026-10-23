import { tk } from './money.js';
import raw from '../../data/rackets.normalised.json';
import imgs from '../../data/images.json';
export const meta = raw.meta;
import src from '../../data/rackets.json';
const ALIAS={'Alejandro Galán':'Ale Galán','Federico Chingotto':'Fede Chingotto','Martin di Nenno':'Martín Di Nenno','Martin Di Nenno':'Martín Di Nenno','Beatriz González':'Bea González','Franco Stupa':'Franco Stupaczuk'};
const PL=Object.fromEntries(src.rackets.filter(x=>x.player).map(x=>[x.slug,ALIAS[x.player.trim()]||x.player.trim()]));
const top2=r=>{const v=Object.entries(r.ratings).filter(([k])=>k!=='value').map(([,v])=>v).sort((a,b)=>b-a); return (v[0]+v[1])/2;};
const pub=r=>[r.shape,r.weightMin,r.balance,r.coreHardness,r.faceMaterial,r.thicknessMm].filter(x=>x!=null&&x!=='').length;
// one canonical spelling per brand (case-insensitive, most common casing wins)
const BC={}; for(const r of raw.rackets){const k=String(r.brand||'').trim().toLowerCase(); (BC[k]=BC[k]||{})[String(r.brand||'').trim()]=(BC[k][String(r.brand||'').trim()]||0)+1;}
const canonB=b=>{const c=BC[String(b||'').trim().toLowerCase()]; return c?Object.entries(c).sort((a,b)=>b[1]-a[1]||(/^[A-Z]/.test(b[0])-/^[A-Z]/.test(a[0])))[0][0]:b;};
const base = raw.rackets.map(r=>({...r,brand:canonB(r.brand)})).map(r => ({...(imgs[r.slug]?.ok ? { ...r, image: `/rackets/${r.slug}.webp` } : r), player: PL[r.slug]||null, published: pub(r)}));
// Audience (men | women | junior | unisex), derived strictly from the official model name.
// junior: JR/Jr/Junior/Kids/Girl/Boy/Niño; women: W/Woman/Women/Mujer/Lady; men: only when the brand sells a W version of the exact same model; otherwise unisex.
const JR_RE=/\b(JR|Jr|Junior|Kids?|Girl|Boy|Niñ[oa]s?|Infantil)\b/; const W_RE=/\s*\b(W|Woman|Women|Mujer|Lady|Ladies)\b/;
const normM=s=>s.replace(new RegExp(W_RE.source,'g'),'').replace(/\s+/g,' ').trim().toLowerCase();
const WSET=new Set(base.filter(r=>!JR_RE.test(r.model)&&W_RE.test(r.model)).map(r=>r.brand.toLowerCase()+'|'+normM(r.model)));
for (const r of base) r.audience = JR_RE.test(r.model)?'junior':W_RE.test(r.model)?'women':WSET.has(r.brand.toLowerCase()+'|'+r.model.toLowerCase().replace(/\s+/g,' ').trim())?'men':'unisex';
export const AUDIENCES=['men','women','junior','unisex'];
const rawV = r => r.priceGBPApprox ? top2(r)/r.priceGBPApprox : null;
const maxV = Math.max(...base.map(rawV).filter(Boolean));
export const VALUE_FORMULA = 'Value score = (average of the racket’s two highest calculated ratings, excluding the existing value rating) ÷ recorded price in GBP, then scaled so the best racket in the database scores 100. Rackets without a recorded price get no value score.';
export const rackets = base.map(r => ({...r, valueScore: rawV(r)==null?null:Math.max(1,Math.round(rawV(r)/maxV*100))}));
export const bySlug = Object.fromEntries(rackets.map(r => [r.slug, r]));
import { priceText } from './price.js';
export const fmtPrice = r => priceText(r,'GB','en') || 'Check price';
export const cap = s => s ? s[0].toUpperCase() + s.slice(1) : '—';
export const lists = {
  'best-padel-rackets-for-beginners': { title: 'Best padel rackets for beginners', rule: 'Round shape, sorted by the forgiveness rating, then comfort.', pick: rs => rs.filter(r => r.shape === 'round').sort((a,b)=> b.ratings.forgiveness - a.ratings.forgiveness || b.ratings.comfort - a.ratings.comfort) },
  'best-control-padel-rackets': { title: 'Best control padel rackets', rule: 'Sorted by the control rating, ties broken by handling.', pick: rs => [...rs].sort((a,b)=> b.ratings.control - a.ratings.control || b.ratings.handling - a.ratings.handling) },
  'best-power-padel-rackets': { title: 'Best power padel rackets', rule: 'Sorted by the power rating, ties broken by price (cheaper first).', pick: rs => [...rs].sort((a,b)=> b.ratings.power - a.ratings.power || (a.priceGBPApprox??1e9)-(b.priceGBPApprox??1e9)) },
  'best-padel-racket-for-tennis-elbow': { title: 'Best padel rackets for tennis elbow (arm-friendly picks)', intro: 'If your elbow or forearm gets sore, many players look for rackets with a softer core, a lower weight and a round shape, because those specs are usually associated with less vibration and an easier swing. This list ranks rackets on those published specs only. It is not medical advice: we make no claim that any racket prevents, treats or cures tennis elbow or any injury. If you have pain, see a doctor or physiotherapist.', rule: 'Included: soft core (as published), round shape, and a maximum published weight of 365 g or less where weight is published (rackets with no published weight are excluded). Sorted by the comfort rating, then forgiveness, then lower weight.', pick: rs => rs.filter(r => r.coreHardness === 'soft' && r.shape === 'round' && r.weightMax != null && r.weightMax <= 365).sort((a,b)=> b.ratings.comfort - a.ratings.comfort || b.ratings.forgiveness - a.ratings.forgiveness || a.weightMax - b.weightMax) },
  'best-padel-racket-for-tennis-players': { title: 'Best padel rackets for tennis players switching to padel', intro: 'Tennis players usually arrive with a full swing and good timing but no experience of short, compact padel strokes or walls. Rackets that are easy to move and forgive off-centre hits make that switch smoother. This list ranks rackets on published specs only.', rule: 'Included: round or teardrop shape, low or medium balance (as published), and a soft or medium core. Rackets with no published balance or core are excluded. Sorted by the average of the forgiveness and handling ratings, then by control.', pick: rs => rs.filter(r => ['round','teardrop'].includes(r.shape) && ['low','medium'].includes(r.balance) && ['soft','medium'].includes(r.coreHardness)).sort((a,b)=> (b.ratings.forgiveness+b.ratings.handling) - (a.ratings.forgiveness+a.ratings.handling) || b.ratings.control - a.ratings.control) },
  'best-value-padel-rackets': { title: 'Best value padel rackets', intro: 'The most rating for your money: each racket’s two strongest spec-based scores, divided by its recorded price.', method: true, rule: 'Sorted by our value score (formula below). Only rackets with a recorded price.', pick: rs => rs.filter(r=>r.valueScore!=null).sort((a,b)=> b.valueScore - a.valueScore) },
  'most-comfortable-padel-rackets': { title: 'Most comfortable padel rackets', intro: 'Rackets with the highest spec-based comfort rating, which favours softer cores and lower weights.', rule: 'Sorted by the comfort rating, ties broken by forgiveness.', pick: rs => [...rs].sort((a,b)=> b.ratings.comfort - a.ratings.comfort || b.ratings.forgiveness - a.ratings.forgiveness) },
  'most-powerful-padel-rackets': { title: 'Most powerful padel rackets', intro: 'Rackets with the highest spec-based power rating, usually diamond shapes with a high balance and firmer core.', rule: 'Sorted by the power rating, ties broken by handling.', pick: rs => [...rs].sort((a,b)=> b.ratings.power - a.ratings.power || b.ratings.handling - a.ratings.handling) },
  'best-padel-rackets-under-100': { title: 'Best padel rackets under ⟦b|100|GBP|GBP⟧', rule: 'Recorded price at or below ⟦b|100|GBP|GBP⟧ (EUR/USD converted at the 20 Oct 2026 rate), sorted by the value rating.', pick: rs => rs.filter(r => r.priceGBPApprox != null && r.priceGBPApprox <= 100).sort((a,b)=> b.ratings.value - a.ratings.value) },
  'best-padel-rackets-under-150': { title: 'Best padel rackets under ⟦b|150|GBP|GBP⟧', rule: 'Recorded price at or below ⟦b|150|GBP|GBP⟧ (EUR/USD converted at the 20 Oct 2026 rate), sorted by the value rating.', pick: rs => rs.filter(r => r.priceGBPApprox != null && r.priceGBPApprox <= 150).sort((a,b)=> b.ratings.value - a.ratings.value) },
  'best-padel-rackets-under-200': { title: 'Best padel rackets under ⟦b|200|GBP|GBP⟧', rule: 'Recorded price at or below ⟦b|200|GBP|GBP⟧ (EUR/USD converted at the 20 Oct 2026 rate), sorted by the value rating.', pick: rs => rs.filter(r => r.priceGBPApprox != null && r.priceGBPApprox <= 200).sort((a,b)=> b.ratings.value - a.ratings.value) },
};

export const slugify = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const brandList = [...new Set(rackets.map(r=>r.brand))].sort().map(b=>{const rs=rackets.filter(r=>r.brand===b); return {name:b, slug:slugify(b), count:rs.length, rackets:rs};});
export const brandSlug = b => slugify(b);
const shapeTxt={round:'a round head, which puts the sweet spot low and central for control and forgiveness',teardrop:'a teardrop head, the middle ground between the control of a round racket and the power of a diamond',diamond:'a diamond head, which moves the sweet spot higher for more power on overheads',hybrid:'a hybrid head shape that blends round and teardrop characteristics'};
export function intro(r){
  const R=r.ratings, top=Object.entries(R).filter(([,v])=>typeof v==='number').sort((a,b)=>b[1]-a[1]), best=top[0], worst=top[top.length-1];
  const s=[];
  s.push(`The ${r.model} is a ${r.year?r.year+' ':''}padel racket from ${r.brand}${r.shape?` with ${shapeTxt[r.shape]||r.shape+' shape'}`:''}.`);
  const bits=[]; if(r.weightMin) bits.push(`a published weight of ${r.weightMin}${r.weightMax&&r.weightMax!==r.weightMin?`–${r.weightMax}`:''} g`);
  if(r.balance) bits.push(`${r.balance} balance`); if(r.coreHardness) bits.push(`a ${r.coreHardness}${r.coreMaterial?` ${r.coreMaterial}`:''} core`); else if(r.coreMaterial) bits.push(`a ${r.coreMaterial} core`);
  if(r.faceMaterial) bits.push(`a ${r.faceMaterial} face`);
  if(bits.length) s.push(`It has ${bits.length>1?bits.slice(0,-1).join(', ')+' and '+bits.at(-1):bits[0]}.`);
  s.push(`On our spec-based model its strongest score is ${best[0]} (${best[1]}/100) and its lowest is ${worst[0]} (${worst[1]}/100)${R.comfort>=70?', so it suits players who want an arm-friendly feel':R.power>=70?', so it suits attacking players who finish points at the net':R.forgiveness>=70?', which makes it a sensible pick for newer players':''}.`);
  if(r.priceGBPApprox) s.push(`The last recorded price was about ${tk(r.priceGBPApprox,'GBP')}.`);
  if(r.inputsMissing?.length) s.push(`The maker or retailer does not publish its ${r.inputsMissing.join(' or ')}, so treat related scores with care.`);
  return s.join(' ');
}
export const absImg = r => r.image ? `https://whichpadel.com${r.image}` : undefined;

export const players=(()=>{const m={}; rackets.forEach(r=>{if(r.player)(m[r.player]??=[]).push(r)}); return Object.entries(m).map(([name,rs])=>({name,slug:slugify(name),rackets:rs.sort((a,b)=>(b.year||0)-(a.year||0)||a.model.localeCompare(b.model))})).sort((a,b)=>b.rackets.length-a.rackets.length||a.name.localeCompare(b.name));})();
export const playerSlug=n=>slugify(n);
