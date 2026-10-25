// DOM-geometry layout QA: overlap, min gap, overflow-parent, text clipping, container nesting.
import { chromium } from 'playwright-core'; import fs from 'fs';
const B='http://127.0.0.1:'+(process.env.QA_PORT||4987)+'';
const C3=Object.entries(JSON.parse(fs.readFileSync('data/images.json'))).filter(([k,v])=>v.ok).slice(40,43).map(x=>x[0]);
export const PAGES=process.env.QA_PAGES?process.env.QA_PAGES.split(','):['/','/brands/bullpadel/2027/','/tools/real-weight/','/black-friday-padel-rackets/','/players/','/players/agustin-tapia/','/best/best-value-padel-rackets/','/rackets/'+C3[0]+'/','/rackets/?r='+C3.join(','),'/best/best-padel-rackets-for-beginners/','/best/best-padel-racket-2026/','/padel-rackets/','/brands/','/brands/bullpadel/','/privacy/','/affiliate-disclosure/','/404.html','/compare/adidas-metalbone-2026-vs-nox-at10-pro-cup-hard-2026/','/es/','/es/palas-padel/','/es/mejores-palas-padel/','/es/palas/?r=adidas-metalbone-2026,nox-at10-pro-cup-hard-2026','/es/palas/'+C3[0]+'/','/es/marcas/','/es/marcas/bullpadel/','/es/marcas/bullpadel/2027/','/es/mejores/palas-padel-principiantes/','/es/jugadores/','/es/jugadores/agustin-tapia/','/es/comparar/adidas-metalbone-2026-vs-nox-at10-pro-cup-hard-2026/','/es/herramientas/peso-real/','/es/black-friday-palas-padel/','/es/privacidad/','/es/afiliados/','/es/404.html','/fr/','/fr/raquette-padel/','/fr/meilleures-raquettes-padel/','/fr/raquettes/?r=adidas-metalbone-2026,nox-at10-pro-cup-hard-2026','/fr/raquettes/'+C3[0]+'/','/fr/marques/','/fr/marques/bullpadel/','/fr/marques/bullpadel/2027/','/fr/joueurs/agustin-tapia/','/fr/comparer/adidas-metalbone-2026-vs-nox-at10-pro-cup-hard-2026/','/fr/outils/poids-reel/','/fr/black-friday-raquettes-padel/','/fr/confidentialite/','/fr/404.html'];
export const WIDTHS=process.env.QA_WIDTHS?process.env.QA_WIDTHS.split(',').map(Number):[360,390,412,768,1280,1440];
function check(){
 const out=[]; const vis=e=>{const s=getComputedStyle(e);const r=e.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0};
 const name=e=>e.tagName.toLowerCase()+(e.id?'#'+e.id:'')+(typeof e.className==='string'&&e.className?'.'+e.className.trim().split(/\s+/).join('.'):'');
 const inflow=e=>{const p=getComputedStyle(e).position;return p==='static'||p==='relative'};
 const R=e=>e.getBoundingClientRect();
 // a) overlap of visible in-flow siblings
 for(const par of document.querySelectorAll('body, body *')){ if(!vis(par)) continue; const d=getComputedStyle(par).display; if(!/block|flex|grid/.test(d)||d.startsWith('inline')) continue;
  const kids=[...par.children].filter(k=>vis(k)&&inflow(k)&&!/^(SCRIPT|STYLE|BR|svg)$/i.test(k.tagName)&&getComputedStyle(k).display.match(/block|flex|grid|table|list-item/)&&!getComputedStyle(k).display.startsWith('inline')).slice(0,80);
  for(let i=0;i<kids.length;i++)for(let j=i+1;j<kids.length;j++){const a=R(kids[i]),b=R(kids[j]);const ox=Math.min(a.right,b.right)-Math.max(a.left,b.left),oy=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top); if(ox>1&&oy>1) out.push('overlap: '+name(kids[i])+' x '+name(kids[j])+` (${Math.round(ox)}x${Math.round(oy)})`);}
 }
 // b) min 12px gap (was 16; Rupert's tighter --gap/section rhythm, commit e03cd78) between adjacent blocks
 const groups=['main','.detail>div','.grid','.l-grid','.bgrid','.rlist','.qcards','.ftr .cols'];
 for(const g of groups) for(const par of document.querySelectorAll(g)){ const kids=[...par.children].filter(k=>vis(k)&&inflow(k)&&k.tagName!=='SCRIPT');
  for(let i=0;i<kids.length;i++)for(let j=i+1;j<kids.length;j++){const a=R(kids[i]),b=R(kids[j]);
   const hOv=Math.min(a.right,b.right)-Math.max(a.left,b.left)>1, vOv=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1;
   const gap=hOv?Math.max(b.top-a.bottom,a.top-b.bottom):vOv?Math.max(b.left-a.right,a.left-b.right):99;
   if(gap<11.5&&gap>-1&&(hOv||vOv)){ // only true neighbours
     out.push(`gap ${Math.round(gap)}px: ${name(kids[i])} / ${name(kids[j])} in ${g}`);} } }
 // c) overflow of parent / page
 const W=document.documentElement.clientWidth; if(document.documentElement.scrollWidth>W+1) out.push('page overflow-x '+document.documentElement.scrollWidth);
 for(const e of document.querySelectorAll('main *, header *, footer *')){ if(!vis(e)||!inflow(e)) continue; const p=e.parentElement; if(!p||!vis(p)) continue;
  if(e.closest('.rpg,.kchips,.tscroll,.gchips,.hrow,.tp-row,.rv,.pick-list,.chipset input')||getComputedStyle(p).display.startsWith('inline')||/^(svg|path|INPUT)$/i.test(e.tagName)) continue;
  const a=R(e),b=R(p); if(a.left<b.left-1||a.right>b.right+1) out.push('overflows parent: '+name(e)+' in '+name(p)+` (${Math.round(a.left-b.left)},${Math.round(a.right-b.right)})`);}
 // d) text clipping
 for(const e of document.querySelectorAll('body *')){ if(!vis(e)) continue; const s=getComputedStyle(e); if(!/hidden|clip/.test(s.overflowX+s.overflow)||s.textOverflow==='ellipsis'||e.closest('.bar')||e.tagName==='IMG') continue;
  if(e.scrollWidth>e.clientWidth+1&&e.innerText.trim()) out.push('text clipped: '+name(e)+` ${e.scrollWidth}>${e.clientWidth}`);}
 // e) nesting depth of bordered/background containers
 const isBox=e=>{const s=getComputedStyle(e); if(/^(BUTTON|INPUT|SELECT|LABEL|A|SPAN|B|I|IMG|svg|TH|TD|TR|TABLE|TBODY|THEAD|LI|SUMMARY|HTML|BODY|MAIN|HEADER|FOOTER|FORM|DIALOG)$/i.test(e.tagName)&&!e.classList.contains('rcard')&&!e.classList.contains('gcard')&&!e.classList.contains('bcard')) return false; if(e.matches('.bar,.chip,.ring,.ring *,.btn,.cv,.eyebrow,.medal,.rank,.x')) return false; if(!e.firstElementChild) return false;
  const bw=parseFloat(s.borderTopWidth)+parseFloat(s.borderLeftWidth)>=2&&s.borderLeftStyle!=='none'&&s.borderTopStyle!=='none'; const bg=s.backgroundColor!=='rgba(0, 0, 0, 0)'&&s.backgroundColor!=='transparent'||s.backgroundImage!=='none'; return bw||bg;};
 const seen=new Set();
 for(const e of document.querySelectorAll('body *')){ if(!vis(e)||!isBox(e)) continue; let d=0,x=e,chain=[]; while(x&&x!==document.body){ if(isBox(x)){d++;chain.push(name(x).slice(0,30));} x=x.parentElement;}
  if(d>2){const k=chain.reverse().join(' > '); if(!seen.has(k)){seen.add(k); out.push('nesting '+d+': '+k);}}}
 // f) card hit-test: nothing covers buttons/titles/bars inside cards; titles not clipped
 if(!document.querySelector('dialog[open], .nav.open')) for(const card of [...document.querySelectorAll('.rcard')].filter(vis).slice(0,12)){  
  for(const t of card.querySelectorAll('.btn, h3, h3 a, .bar, .cmpbox, .price')){ if(!vis(t)) continue; t.scrollIntoView({block:'center',behavior:'instant'}); const r=R(t); const x=r.left+r.width/2,y=r.top+r.height/2; if(y<0||y>innerHeight) continue;
   const hit=document.elementFromPoint(x,y); if(!hit||!(hit===t||t.contains(hit)||hit.contains(t)&&hit.closest('.rcard')===card&&!hit.matches('.rcard'))) out.push('covered: '+name(t)+' in card by '+(hit?name(hit):'null'));}
  for(const h of card.querySelectorAll('h3, h3 a')){ const cr=R(card),hr=R(h); if(h.scrollWidth>h.clientWidth+1||hr.right>cr.right+1||getComputedStyle(h).textOverflow==='ellipsis'&&h.scrollWidth>h.clientWidth) out.push('card title clipped: '+h.textContent.trim().slice(0,40));}
 }

 // g) text vertically centred + symmetric padding in buttons/rows/pills
 const txtBox=e=>{const rg=document.createRange(); let t=1e9,b=-1e9; const w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT); let n; while(n=w.nextNode()){ if(!n.textContent.trim()) continue; rg.selectNodeContents(n); for(const q of rg.getClientRects()){ if(q.height){t=Math.min(t,q.top);b=Math.max(b,q.bottom);} } } return b>t?{t,b}:null;};
 for(const e of document.querySelectorAll('header button, header a, dialog[open] button, dialog[open] a, .nav.open a, .rgn-list button, .btn, .chip')){ if(!vis(e)) continue; const s=getComputedStyle(e); if(s.display.startsWith('inline')&&s.display!=='inline-flex'&&s.display!=='inline-block'&&s.display!=='inline-grid') continue;
  const r=R(e), tb=txtBox(e); if(!tb||r.height<30||r.height>120) continue; const top=tb.t-r.top, bot=r.bottom-tb.b; if(Math.abs(top-bot)>4) out.push(`text not v-centred: ${name(e)} "${e.textContent.trim().slice(0,20)}" top ${Math.round(top)} / bottom ${Math.round(bot)}`);
  if(Math.abs(parseFloat(s.paddingTop)-parseFloat(s.paddingBottom))>1||Math.abs(parseFloat(s.paddingLeft)-parseFloat(s.paddingRight))>1) out.push(`asymmetric padding: ${name(e)} ${s.padding}`);}
 // h) uniform gaps between stacked siblings in lists/menus/sheets
 for(const par of document.querySelectorAll('ul, ol, .rgn-list, .nav.open, .menu, dialog[open] .sheet-in, .grid, .rlist')){ if(!vis(par)) continue; const k=[...par.children].filter(x=>vis(x)&&inflow(x)&&x.tagName!=='SCRIPT'); if(k.length<3) continue;
  const gs=[]; for(let i=1;i<k.length;i++){const a=R(k[i-1]),b=R(k[i]); if(b.top>=a.bottom-1&&Math.abs(a.left-b.left)<2) gs.push(Math.round(b.top-a.bottom));}
  if(gs.length>=2&&!par.matches('dialog[open] .sheet-in')&&Math.max(...gs)-Math.min(...gs)>2) out.push(`uneven sibling gaps in ${name(par)}: ${[...new Set(gs)].join(',')}`);}
 // i) stray visible glyphs (bare text nodes in layout containers) and things poking past viewport edges
 for(const c of document.querySelectorAll('header, header .wrap, header nav, .sheet-in, .sheet-top, main, footer, .ftr .cols')) for(const n of c.childNodes) if(n.nodeType===3&&n.textContent.trim()) out.push(`stray text "${n.textContent.trim().slice(0,10)}" in ${name(c)}`);
 for(const e of document.querySelectorAll('header *, dialog[open] *')){ if(!vis(e)||e.closest('.menu,.nav:not(.open),.kchips')) continue; const r=R(e); if(r.right>W+1||r.left<-1) out.push(`past viewport edge: ${name(e)} (${Math.round(r.left)}..${Math.round(r.right)})`);}
 // j) header items: >=8px between items, not touching
 const hk=[...(document.querySelector('header .wrap')?.children||[])].filter(x=>vis(x)&&inflow(x)&&x.tagName!=='DIALOG'&&!x.matches('.nav')).map(R).sort((a,b)=>a.left-b.left);
 for(let i=1;i<hk.length;i++) if(hk[i].left-hk[i-1].right<7.5) out.push(`header items cramped: ${Math.round(hk[i].left-hk[i-1].right)}px`);
 window.scrollTo(0,0);
 return out;
}
export async function layoutQA(b){
 const issues=[];
 for(const w of WIDTHS){ const c=await b.newContext({viewport:{width:w,height:900}}); const p=await c.newPage();
  for(const u of PAGES){ await p.goto(B+u); await p.waitForTimeout(300); for(const s of [...new Set(await p.evaluate(check))]) issues.push(`[layout ${w} ${u}] ${s}`);
   if(u==='/'||u==='/es/'){ // open states: region picker sheet, mobile menu
    await p.click('#rgn-btn'); await p.waitForTimeout(250); for(const s of [...new Set(await p.evaluate(check))]) issues.push(`[layout ${w} ${u} picker-open] ${s}`);
    await p.keyboard.press('Escape'); if(await p.isVisible('.burger')){ await p.click('.burger'); await p.waitForTimeout(150); for(const s of [...new Set(await p.evaluate(check))]) issues.push(`[layout ${w} ${u} menu-open] ${s}`); await p.click('.burger'); } } } await c.close(); }
 return issues;
}
if(process.argv[1].endsWith('layoutqa.mjs')){ const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']}); const i=await layoutQA(b); await b.close(); console.log(i.join('\n')); console.log('LAYOUT VIOLATIONS',i.length); process.exit(i.length?1:0);}
