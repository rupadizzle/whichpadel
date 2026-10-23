import { offersOf } from '../lib/price.js';
import { rackets, fmtPrice } from '../lib/data.js'; import { balN, coreN, wtN, lvN } from '../lib/hub.js';
export function GET(){
  const out=rackets.map(r=>{let h=0; for (const c of r.brand) h=(h*31+c.charCodeAt(0))%360;
    return {s:r.slug,b:r.brand,m:r.model,y:r.year,sh:r.shape||'',bl:r.balance||'',c:r.coreHardness||'',w0:r.weightMin??'',w1:r.weightMax??'',g:r.priceGBPApprox??'',p:fmtPrice(r),i:r.image||'',h,
      power:r.ratings.power,control:r.ratings.control,forgiveness:r.ratings.forgiveness,value:r.ratings.value,comfort:r.ratings.comfort,handling:r.ratings.handling,u:r.productUrl,o:offersOf(r),bn:balN(r),cn:coreN(r),wn:wtN(r),lv:lvN(r),pub:r.published,a:r.audience};});
  return new Response(JSON.stringify(out),{headers:{'Content-Type':'application/json'}});
}
