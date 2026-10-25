// Padel shoe catalogue (data/shoes.json, built from shop product pages) + facets, ranking and money-page pickers.
import raw from '../../data/shoes.json'; import { pick, DEFAULT_REGION, conv } from './price.js'; import { slugify, brandList } from './data.js';
export const SHOE_CHECKED=raw.checked;
export const shoes=raw.shoes.map(s=>({...s,shops:s.offs.length,inStock:s.offs.filter(o=>o.s).length}));
export const shoeBySlug=Object.fromEntries(shoes.map(s=>[s.slug,s]));
export const shoeGallery=s=>Array.from({length:s.imgs},(_,i)=>({s:`/shoes/g/${s.slug}-${i}-400.webp`,l:`/shoes/g/${s.slug}-${i}-800.webp`}));
export const shoeImg=s=>s.imgs?`/shoes/g/${s.slug}-0-400.webp`:null;
export const priceIn=(s,lang)=>{const p=pick(s,DEFAULT_REGION(lang)); return p.none?null:p.v;};
// recommended: in stock at more shops first, then newer season, then lower price
export const rankShoes=(list,lang='en')=>[...list].sort((a,b)=>b.inStock-a.inStock||(b.year||0)-(a.year||0)||(priceIn(a,lang)??1e9)-(priceIn(b,lang)??1e9)||a.name.localeCompare(b.name));
export const shoeBrands=[...new Set(shoes.map(s=>s.brand))].sort().map(b=>({name:b,slug:slugify(b),count:shoes.filter(s=>s.brand===b).length})).filter(b=>b.count>=3&&b.name!=='Unknown');
const racketSlugs=new Set(brandList.map(b=>b.slug));
// A brand with rackets lives on /brands/:slug/. Shoe-only brands (Asics, Munich…) keep /shoes/brand/:slug/.
export const shoeOnlyBrands=shoeBrands.filter(b=>!racketSlugs.has(b.slug));
export function shoeBrandTarget(slug){
  if(racketSlugs.has(slug)) return {type:'brand',id:slug,hash:'shoes'};
  if(shoeBrands.some(b=>b.slug===slug)) return {type:'shoeBrand',id:slug,hash:''};
  return null;
}
export const LIST_MIN=3;
export const UNDER={u60:60,u100:100};
export const listCur=lang=>lang==='en'?'GBP':'EUR';
const cheapV=(s,lang)=>priceIn(s,lang);
export const SHOE_LISTS={
 best:(l)=>rankShoes(shoes,l).slice(0,30),
 mens:(l)=>rankShoes(shoes.filter(s=>s.gender==='m'),l).slice(0,40),
 womens:(l)=>rankShoes(shoes.filter(s=>s.gender==='w'),l).slice(0,40),
 junior:(l)=>rankShoes(shoes.filter(s=>s.gender==='k'),l),
 clay:(l)=>rankShoes(shoes.filter(s=>s.sole.includes('clay')||s.sole.includes('herringbone')),l).slice(0,40),
 omni:(l)=>rankShoes(shoes.filter(s=>s.sole.includes('omni')),l).slice(0,40),
 wide:(l)=>rankShoes(shoes.filter(s=>s.wide),l),
 cheap:(l)=>shoes.filter(s=>s.inStock&&cheapV(s,l)!=null).sort((a,b)=>cheapV(a,l)-cheapV(b,l)).slice(0,30),
 u60:(l)=>rankShoes(shoes.filter(s=>s.inStock&&(v=>v!=null&&v<=60)(cheapV(s,l))),l).slice(0,40),
 u100:(l)=>rankShoes(shoes.filter(s=>s.inStock&&(v=>v!=null&&v<=100)(cheapV(s,l))),l).slice(0,40),
};
// only publish lists that have enough real entries in every language
export const SHOE_LIST_KEYS=Object.keys(SHOE_LISTS).filter(k=>['en','es','fr','pt','it','de'].every(l=>SHOE_LISTS[k](l).length>=LIST_MIN));
