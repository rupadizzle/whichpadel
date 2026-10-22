// Product-page price parser. Order: JSON-LD Product/Offer -> meta (og/product:price) -> microdata -> per-domain fallbacks.
// Pure string work (no DOM) so it runs inside a Worker cheaply. Returns {price,currency,inStock,method} or {error}.
const num=s=>{if(s==null)return null; s=String(s).trim().replace(/[^\d.,]/g,''); if(!s)return null;
 if(/,\d{1,2}$/.test(s)) s=s.replace(/\./g,'').replace(',','.'); else s=s.replace(/,/g,''); const n=+s; return Number.isFinite(n)?n:null;};
const stock=a=>a==null?null:/InStock|LimitedAvailability|PreOrder|OnlineOnly/i.test(a)?true:/OutOfStock|SoldOut|Discontinued/i.test(a)?false:null;
const CUR=/^(EUR|GBP|USD|SEK)$/;
function ldBlocks(html){const out=[]; let i=0; const re=/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi; let m;
 while((m=re.exec(html))&&i++<20){try{out.push(JSON.parse(m[1].trim()))}catch{}} return out;}
function* walk(x){if(Array.isArray(x)){for(const y of x) yield* walk(y);} else if(x&&typeof x==='object'){yield x; for(const k of ['@graph','offers','hasVariant','mainEntity']) if(x[k]) yield* walk(x[k]);}}
const isT=(o,t)=>[].concat(o['@type']||[]).includes(t);
function fromLd(html){for(const b of ldBlocks(html)) for(const o of walk(b)){ if(!(isT(o,'Product')||isT(o,'ProductGroup'))) continue;
  const offers=[...walk(o.offers||[])].filter(x=>isT(x,'Offer')||isT(x,'AggregateOffer'));
  for(const f of offers){const p=num(f.price??f.lowPrice??f.priceSpecification?.price); const c=f.priceCurrency??f.priceSpecification?.priceCurrency;
   if(p) return {price:p,currency:c||null,inStock:stock(f.availability),method:'jsonld'};}}
 return null;}
const meta=(html,n)=>{const re=new RegExp(`<meta[^>]+(?:property|name|itemprop)=["']${n}["'][^>]*>`,'i'); const t=html.match(re)?.[0]; return t?.match(/content=["']([^"']*)/i)?.[1]??null;};
function fromMeta(html){const p=num(meta(html,'product:price:amount')||meta(html,'og:price:amount')); if(!p) return null;
 return {price:p,currency:meta(html,'product:price:currency')||meta(html,'og:price:currency'),inStock:stock(meta(html,'product:availability')||meta(html,'og:availability')),method:'meta'};}
function fromMicro(html){const p=num(html.match(/itemprop=["']price["'][^>]*content=["']([^"']+)/i)?.[1]); if(!p) return null;
 const c=html.match(/itemprop=["']priceCurrency["'][^>]*content=["']([A-Z]{3})/i)?.[1]; const a=html.match(/itemprop=["']availability["'][^>]*(?:href|content)=["']([^"']+)/i)?.[1];
 return {price:p,currency:c||null,inStock:stock(a),method:'microdata'};}
// per-domain fallbacks (only used when the generic layers find nothing)
const FALLBACK={
 'noxsport.com':h=>{const p=num(h.match(/"price":\s*"?([\d.,]+)/)?.[1]); return p?{price:p,currency:'EUR',inStock:null,method:'fallback'}:null;},
};
const DEFAULT_CUR={'padelnuestro.com':'EUR','allforpadel.com':'EUR','noxsport.com':'EUR'};
export function parse(html,domain){
 const r=fromLd(html)||fromMeta(html)||fromMicro(html)||FALLBACK[domain]?.(html); if(!r) return {error:'no-price'};
 // fill stock/currency from other layers if missing
 if(r.inStock==null) r.inStock=(fromMicro(html)?.inStock)??(fromMeta(html)?.inStock)??null;
 if(!r.currency) r.currency=fromMicro(html)?.currency||DEFAULT_CUR[domain]||null;
 r.currency=r.currency?String(r.currency).toUpperCase():null;
 if(!r.currency||!CUR.test(r.currency)) return {error:'currency:'+r.currency};
 if(!(r.price>=15&&r.price<=1500)) return {error:'implausible:'+r.price};
 return r;}
// outlier check vs recent history (median of last observations): reject >60% drop or >150% rise in one step
export function sane(price,recent){if(!recent?.length) return true; const s=[...recent].sort((a,b)=>a-b), m=s[s.length>>1]; return price>=m*0.4&&price<=m*2.5;}
