// Currency-following amounts. Server code never writes a bare "£100": it writes a token, and scripts/post.mjs turns each token into
// <span class="mz" data-m data-mc data-k> (text) or plain text (attributes, scripts, <head>), using the page's default currency.
// The region script (src/components/Region.astro) re-renders every .mz, budget radio ([data-mb]) and the <title> (html[data-mt])
// in the visitor's chosen currency, exactly like the shop price boxes (.pz). curtextqa.mjs fails the deploy on any amount that escapes.
// Token: ⟦kind|amount|fromCurrency|displayCurrency⟧   kind m = amount (exact conversion), b = budget threshold (round local
// equivalent), s = currency symbol only.
export const SYMS={GBP:'£',EUR:'€',USD:'$',SEK:'kr'};
export const tk=(n,from,disp=from,kind='m')=>n==null||Number.isNaN(+n)?'':`⟦${kind}|${Math.round(+n*100)/100}|${from}|${disp}⟧`;
export const bud=(n,cur)=>tk(n,cur,cur,'b'); export const sym=cur=>`⟦s|0|${cur}|${cur}⟧`;
// round local equivalent for a budget threshold
export const nice=v=>{const s=v<50?5:v<300?10:v<1000?50:100; return Math.max(s,Math.round(v/s)*s);};
export const val=(rates,k,n,f,t)=>f===t?Math.round(n):k==='b'?nice(n/rates[f]*rates[t]):Math.round(n/rates[f]*rates[t]);
export const fmtM=(v,c,lang)=>c==='SEK'?`${v} kr`:lang!=='en'?`${v} ${SYMS[c]}`:`${SYMS[c]}${v}`;
export const TOKSRC='⟦([mbsMBS])\\|([\\d.]+)\\|([A-Za-z]{3})\\|([A-Za-z]{3})⟧';
export function render(html,lang,rates){
 const RE=()=>new RegExp(TOKSRC,'g'); const has=s=>new RegExp(TOKSRC).test(s);
 const show=(k,n,f,d)=>(k=k.toLowerCase(),f=f.toUpperCase(),d=d.toUpperCase(),k==='s'?SYMS[d]:fmtM(val(rates,k,+n,f,d),d,lang));
 const plain=s=>s.replace(RE(),(_,k,n,f,d)=>show(k,n,f,d));
 const span=s=>s.replace(RE(),(_,k,n,f,d)=>(k=k.toLowerCase())==="s"?`<span class="mzs" data-mc="${d.toUpperCase()}">${SYMS[d.toUpperCase()]}</span>`:`<span class="mz" data-k="${k}" data-m="${n}" data-mc="${f.toUpperCase()}">${show(k,n,f,d)}</span>`);
 if(!has(html)) return html;
 const tm=html.match(/<title>([^<]*)<\/title>/); const mt=tm&&has(tm[1])?tm[1]:null;
 const parts=html.split(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<head>[\s\S]*?<\/head>|<textarea[\s\S]*?<\/textarea>|<option[^>]*>[^<]*|<[^>]+>)/);
 let out=parts.map((p,i)=>i%2?plain(p):span(p)).join('');
 if(mt) out=out.replace(/<html\b([^>]*)>/,(_,a)=>`<html${a} data-mt="${mt.replace(/"/g,'&quot;')}">`);
 return out;
}

// Prose written by hand (guides) with literal amounts: turn every amount into a token so it follows the visitor's currency.
// Thresholds ("under £50", "menos de 50 €") become budget tokens (rounded local equivalent); other amounts convert exactly.
// Handles symbol-first (£4.25, $30, €30) and number-first runs ("50 / 100 / 150 €", "2–4 €", "4,25 €").
const PROSE_CUR={'£':'GBP','€':'EUR','$':'USD'};
const PROSE_TH=/(under|below|less than|up to|menos de|hasta|unter|bis zu|sotto|fino a|moins de|jusqu'à|até|abaixo de)\s*[~≈]?\s*(?:[£$€]?\s?\d+(?:[.,]\d{1,2})?\s?€?\s?(?:\/|–|-)\s?)*$/i;
export function moneyProse(s){
 if(!s||typeof s!=='string') return s;
 const num=n=>+String(n).replace(',','.');
 const kind=(str,off)=>PROSE_TH.test(str.slice(Math.max(0,off-40),off))?'b':'m';
 // number-first runs ending in €: "50 / 100 / 150 €", "2–4 €", "4,25 €"
 s=s.replace(/(\d+(?:[.,]\d{1,2})?)((?:\s?(?:\/|–|-)\s?\d+(?:[.,]\d{1,2})?)*)\s?€/g,(m,a,rest,off,str)=>{const k=kind(str,off); return tk(num(a),'EUR','EUR',k)+rest.replace(/\d+(?:[.,]\d{1,2})?/g,n=>tk(num(n),'EUR','EUR',k));});
 // symbol-first: £4.25, $30, €30
 s=s.replace(/([£$€])\s?(\d+(?:[.,]\d{1,2})?)/g,(m,c,n,off,str)=>tk(num(n),PROSE_CUR[c],PROSE_CUR[c],kind(str,off)));
 return s;
}
