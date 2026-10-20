import fx from '../../data/fx.json'; import shopsRaw from '../../data/shops.json';
export const FX=fx; export const SHOPS=shopsRaw.shops;
// region -> currency
export const REGIONS={GB:['🇬🇧','United Kingdom','GBP'],IE:['🇮🇪','Ireland','EUR'],ES:['🇪🇸','España','EUR'],PT:['🇵🇹','Portugal','EUR'],FR:['🇫🇷','France','EUR'],IT:['🇮🇹','Italia','EUR'],DE:['🇩🇪','Deutschland','EUR'],NL:['🇳🇱','Nederland','EUR'],BE:['🇧🇪','Belgique','EUR'],SE:['🇸🇪','Sverige','SEK'],US:['🇺🇸','United States','USD'],EU:['🇪🇺','Other EU','EUR'],ROW:['🌍','Rest of world','EUR']};
export const domainOf=u=>{try{return new URL(u).hostname.replace(/^www\./,'')}catch{return ''}};
export const offersOf=r=>r.price==null||!r.productUrl?[]:[{d:domainOf(r.productUrl),p:r.price,c:r.currency,u:r.productUrl}];
export const conv=(n,from,to)=>n/fx.rates[from]*fx.rates[to];
export const SYM={GBP:'£',EUR:'€',USD:'$',SEK:'kr'}; export const CURRENCIES=['EUR','GBP','USD','SEK'];
export const fmt=(n,cur,lang='en')=>{const v=Math.round(n); const s=String(v); return cur==='SEK'?`${Math.round(n)} kr`:lang!=='en'?`${s} ${SYM[cur]}`:`${SYM[cur]}${s}`;};
// best offer for region: same-currency delivering shop first, else cheapest converted; status per shop
export function pick(r,region){const cur=REGIONS[region]?.[2]||'EUR'; const os=offersOf(r).map(o=>{const s=SHOPS[o.d]||{}; const st=(s.delivers||[]).includes(region)?'yes':(s.no||[]).includes(region)?'no':'unknown'; return {...o,st,v:o.c===cur?o.p:conv(o.p,o.c,cur),native:o.c===cur};}).filter(o=>o.st!=='no');
 if(!os.length) return {cur,none:true}; os.sort((a,b)=>(a.st==='yes'?0:1)-(b.st==='yes'?0:1)||(b.native-a.native)||a.v-b.v); const o=os[0];
 return {cur,o,v:o.native?o.p:Math.round(o.v),conv:!o.native};}
export function priceText(r,region='GB',lang='en'){const p=pick(r,region); return p.none?null:fmt(p.v,p.cur,lang);}
export const DEFAULT_REGION=lang=>lang==='es'?'ES':lang==='fr'?'FR':'GB';
