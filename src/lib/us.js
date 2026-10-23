// US market (preview): money pages built only from real US offers (USD, shops verified to deliver to the US), snapshot in data/us.json
// (refresh: node prices-us/snapshot.mjs). A page is published only when it has >= US_MIN real items.
import snap from '../../data/us.json'; import { rackets, bySlug } from './data.js'; import { shoes, shoeBySlug, rankShoes } from './shoes.js'; import { pickL } from '../i18n/lists.js';
export const US_MIN=3; export const US_CHECKED=snap.updated;
const live=os=>(os||[]).filter(o=>o.p>0&&o.c==='USD');
const usd=os=>{const a=live(os).filter(o=>o.s!==0); return a.length?Math.min(...a.map(o=>o.p)):null;};
// racket/shoe objects carrying ONLY their US offers, so cards render one USD price
const withUS=(x,os)=>({...x,offs:live(os).map(o=>({d:o.d,p:o.p,c:o.c,u:o.u,s:o.s===0?0:1})),price:null,productUrl:null,usd:usd(os)});
export const usRackets=Object.entries(snap.r||{}).filter(([s])=>bySlug[s]).map(([s,os])=>withUS(bySlug[s],os)).filter(r=>r.usd!=null);
export const usShoes=Object.entries(snap.s||{}).filter(([s])=>shoeBySlug[s]).map(([s,os])=>withUS(shoeBySlug[s],os)).filter(s=>s.usd!=null);
const usBy=Object.fromEntries(usRackets.map(r=>[r.slug,r]));
const q=r=>r.ratings.power+r.ratings.control+r.ratings.comfort;
const order=(k,extra=[])=>{const seen=new Set(); const out=[]; for(const r of [...pickL(k,'en'),...extra]){const u=usBy[r.slug]; if(u&&!seen.has(r.slug)){seen.add(r.slug); out.push(u);}} return out;};
const byScore=list=>[...list].sort((a,b)=>q(b)-q(a)||(b.year||0)-(a.year||0)||a.usd-b.usd);
export const US_UNDER=[100,150,200,250,300];
export const US_PAGES={
 'best-padel-rackets':{kind:'r',list:()=>order('best-padel-racket-2026',byScore(usRackets)).slice(0,20)},
 'padel-rackets-for-beginners':{kind:'r',list:()=>order('best-padel-rackets-for-beginners').slice(0,15)},
 ...Object.fromEntries(US_UNDER.map(n=>[`padel-rackets-under-${n}`,{kind:'r',cap:n,list:()=>byScore(usRackets.filter(r=>r.usd<=n)).slice(0,20)}])),
 'padel-shoes':{kind:'s',list:()=>rankShoes(usShoes,'en').slice(0,30)},
 'padel-shoes-under-100':{kind:'s',cap:100,list:()=>rankShoes(usShoes.filter(s=>s.usd<=100),'en').slice(0,30)},
};
// drop "under $X" pages that would just repeat a smaller one (same items) and anything under the minimum
export const US_KEYS=(()=>{const ks=Object.keys(US_PAGES).filter(k=>US_PAGES[k].list().length>=US_MIN); const sig={}; return ks.filter(k=>{if(!US_PAGES[k].cap) return true; const s=US_PAGES[k].kind+US_PAGES[k].list().map(x=>x.slug).sort().join(); if(sig[s]) return false; sig[s]=1; return true;});})();
export const usCoverage=()=>({rackets:usRackets.length,rTotal:rackets.length,shoes:usShoes.length,sTotal:shoes.length});
