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
