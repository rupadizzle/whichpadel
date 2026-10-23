// Strict shoe matcher: brand + every model token + gender must agree; no extra variant/number tokens; slides/slippers/socks excluded.
import fs from 'node:fs';
const S=JSON.parse(fs.readFileSync(new URL('../data/shoes.json',import.meta.url))).shoes;
const tok=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/(\d)\.(\d)/g,'$1$2').split(/[^a-z0-9]+/).filter(Boolean);
const STOP=new Set(['padel','shoes','shoe','zapatillas','men','mens','man','m','sneakers','by','the','de','and']);
const W=new Set(['women','womens','woman','w','mujer','lady','wmn']), K=new Set(['junior','jr','kids','kid','nino','child','children','youth']);
const BAD=new Set(['slides','slide','slipper','slippers','sock','socks','insole','insoles','laces','sandal','sandals']);
const VAR=new Set(['pro','boost','clay','ff','ff2','ff3','le','tour','plus','max','lite','light','speed','ltd','limited','edition','mid','low','wide','gtx','omni','all','court','elite','team','vibram','hybrid','lux','air','ultra','x','evo','one','motion','sprint','select','fly','power','control','pwr','ctrl','comfort','premium','top','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17']);
const COL=new Set(['white','black','blue','red','green','grey','gray','pink','orange','yellow','navy','silver','gold','purple','lime','fog','indigo','gunmetal','lava','dark','light','energy','coral','mint','beige','cyan','teal','turquoise','fluor','neon','aqua','royal','sky','ice','bright','deep','pure','cloud','core','ftwr','carbon','magenta','violet','lilac','sand','cream','off','bronze','petrol','burgundy','olive','khaki','ocean','tangerine','peach','rose','glow','sunrise','mid','copper','chalk','ivory']);
const VOC={}; for(const s of S){const b=s.brand.toLowerCase(); (VOC[b]??=new Set()); tok(s.model).forEach(x=>VOC[b].add(x));}
export function matchShoes(items){const res={};
 for(const s of S){const bt=tok(s.brand); const mt=tok(s.model).filter(x=>!STOP.has(x)&&!bt.includes(x)&&!W.has(x)&&!K.has(x)); const yr=s.year?String(s.year):null; const mtn=mt.filter(x=>x!==yr&&x!==yr?.slice(2));
  if(!mtn.length) continue; let best=null;
  for(const c of items){const t=new Set(tok(c.t)); if(!bt.every(x=>t.has(x))||!mtn.every(x=>t.has(x))) continue;
   if([...t].some(x=>BAD.has(x))) continue;
   const g=[...t].some(x=>K.has(x))?'k':[...t].some(x=>W.has(x))?'w':'m'; if(g!==s.gender) continue;
   const ys=[...t].filter(x=>/^20[12]\d$/.test(x)); if(yr&&ys.length&&!ys.includes(yr)) continue;
   if([...t].some(x=>VAR.has(x)&&!mt.includes(x))) continue;
   if([...t].some(x=>VOC[s.brand.toLowerCase()].has(x)&&!mt.includes(x)&&!W.has(x)&&!K.has(x)&&!STOP.has(x)&&!COL.has(x)&&!/^20[12]\d$/.test(x)&&x!==yr?.slice(2))) continue;
   if([...t].some(x=>/\d/.test(x)&&!/^20[12]\d$/.test(x)&&!mt.includes(x)&&x!==yr?.slice(2))) continue;
   const extra=[...t].filter(x=>!STOP.has(x)&&!bt.includes(x)&&!mt.includes(x)&&!COL.has(x)&&!W.has(x)&&!K.has(x)&&!/^20[12]\d$/.test(x)&&x.length>2);
   if(extra.length>2) continue;
   // model part = title up to the first colour word or '/': no unexplained tokens allowed there
   const pre=[]; for(const x of tok(c.t.split('/')[0])){if(COL.has(x)) break; pre.push(x);}
   if(pre.some(x=>!STOP.has(x)&&!bt.includes(x)&&!mt.includes(x)&&!W.has(x)&&!K.has(x)&&!/^20[12]\d$/.test(x)&&x!==yr?.slice(2)&&x!=='padel')) {(globalThis.REJ??=[]).push(s.slug+' <- '+c.t); continue;}
   const p=+c.p; if(!best||(c.a&&!best.a)||(c.a===best.a&&p<+best.p)) best=c;}
  if(best) res[s.slug]=best;}
 return res;}
if(process.argv[1].endsWith('shoematch.mjs')){const items=JSON.parse(fs.readFileSync(process.argv[2])); const m=matchShoes(items); for(const [k,v] of Object.entries(m)) console.log(k.padEnd(45),'|',v.t,v.p,v.a); console.log(Object.keys(m).length);}
