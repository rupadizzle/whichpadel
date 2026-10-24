import { allRackets as rackets, fmtPrice, cap } from '../lib/data.js'; import { offersOf } from '../lib/price.js';
export function GET(){
const slim=rackets.map(r=>({s:r.slug,m:r.model,b:r.brand,i:r.image||'',sh:r.shape||'',Year:r.year,Shape:cap(r.shape),Weight:r.weight,Balance:cap(r.balance),Core:r.coreMaterial,Hardness:cap(r.coreHardness),Face:r.faceMaterial,Thickness:r.thicknessMm?r.thicknessMm+' mm':null,p:fmtPrice(r).replace(/ \(.*\)/,''),g:r.priceGBPApprox??null,pc:r.priceChecked||'',...Object.fromEntries(Object.entries(r.ratings).map(([k,v])=>[cap(k),v])),u:r.productUrl,o:offersOf(r)}));
return new Response(JSON.stringify(slim),{headers:{'Content-Type':'application/json'}});}
