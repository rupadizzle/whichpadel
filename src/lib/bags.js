// Padel bag catalogue (data/bags.json). Ids are bag-<slug>, the same pattern balls use (ball-<slug>) on the shoe price engine.
// The bag pages list only the confirmed 2025-27 models (range === 'in-range'); year-unknown models stay in the data, flagged.
import raw from '../../data/bags.json'; import { pick, SHOPS } from './price.js'; import { brandList } from './data.js';
export const BAG_CHECKED=raw.checked;
export const allBags=raw.bags;
export const bags=raw.bags.filter(b=>b.range==='in-range');
export const bagImg=b=>b.img?`/bags/${b.slug}.webp`:null;
// best offer for the region (same rules as rackets and balls: in stock first, same-currency delivering shop first)
export const bagOffer=(b,region)=>{const p=pick(b,region); return p.none?null:p;};
const byPrice=region=>(a,b)=>((bagOffer(a,region)?.v??1e9)-(bagOffer(b,region)?.v??1e9))||a.name.localeCompare(b.name);
export const bagGroups=region=>({bags:bags.filter(b=>b.type!=='backpack').sort(byPrice(region)),packs:bags.filter(b=>b.type==='backpack').sort(byPrice(region))});
const med=a=>{const s=[...a].sort((x,y)=>x-y); return s.length?s[Math.floor((s.length-1)/2)]:null;};
// facts used in the copy, computed from the data so the text never drifts from the table
export const bagStats=region=>{const g=bagGroups(region); const price=l=>med(l.map(b=>bagOffer(b,region)?.v).filter(v=>v!=null)); const cap=l=>med(l.map(b=>b.rackets).filter(Boolean));
 const yes=k=>bags.filter(b=>b[k]==='yes').length;
 return {n:bags.length,nBags:g.bags.length,nPacks:g.packs.length,brands:new Set(bags.map(b=>b.brand)).size,priceBags:price(g.bags),pricePacks:price(g.packs),capBags:cap(g.bags),capPacks:cap(g.packs),thermal:yes('thermal'),shoe:yes('shoe'),cur:bagOffer(g.bags[0],region)?.cur};};
// brand sections: brands that have confirmed models; link to the racket brand page when one exists
export const bagBrand=(name,region)=>{const l=bags.filter(b=>b.brand===name).sort(byPrice(region)); const slug=brandList.find(x=>x.name.toLowerCase()===name.toLowerCase())?.slug||null; return {name,slug,list:l,n:l.length,from:l.length?bagOffer(l[0],region):null};};
// shop button target: the shop's affiliate template when one is set (https://…{url}), otherwise the product URL
export const bagHref=o=>{const a=SHOPS[o.d]?.affiliate; return typeof a==='string'&&a.startsWith('https://')?a.replace('{url}',encodeURIComponent(o.u)):o.u;};
