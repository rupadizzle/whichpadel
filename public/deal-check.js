// "Is this discount real?" Uses only the price history we have recorded (read-only price API). Too little history = no verdict.
(function(){
const MIN_DAYS=21, MIN_PTS=10, DAY=864e5;
const fmt=(p,c)=>{try{return new Intl.NumberFormat('en-GB',{style:'currency',currency:c,maximumFractionDigits:p%1?2:0}).format(p)}catch(e){return p+' '+c}};
const med=a=>{const s=[...a].sort((x,y)=>x-y),m=s.length>>1;return s.length%2?s[m]:(s[m-1]+s[m])/2};
function verdict(e){
 if(!e||!Array.isArray(e.h)||e.h.length<MIN_PTS||!(e.p>0)) return null;
 const h=e.h.filter(x=>x&&x[1]>0), span=(Date.parse(h[h.length-1][0])-Date.parse(h[0][0]))/DAY;
 if(h.length<MIN_PTS||span<MIN_DAYS) return null;
 const cur=e.p, c=e.c, past=h.slice(0,-1).map(x=>x[1]), usual=med(past), low=Math.min(...past);
 const cutoff=Date.parse(h[h.length-1][0])-30*DAY, recent=h.slice(0,-1).filter(x=>Date.parse(x[0])>=cutoff).map(x=>x[1]);
 const peak=recent.length?Math.max(...recent):0, pct=Math.round((1-cur/usual)*100), since=h[0][0];
 const base={cur,usual,low,pct,c,since,days:Math.round(span)};
 if(peak>usual*1.08&&cur>=usual*0.95&&cur<peak*0.97) return {...base,k:'inflated',t:`Not a real deal: the price went up to ${fmt(peak,c)} recently, and ${fmt(cur,c)} is just its usual price of about ${fmt(usual,c)}.`};
 if(cur<=low&&pct>=3) return {...base,k:'lowest',t:`Real deal: ${fmt(cur,c)} is the lowest price we've recorded since ${since}, ${pct}% below its usual ${fmt(usual,c)}.`};
 if(pct>=10) return {...base,k:'drop',t:`Real drop: ${pct}% below its usual price of ${fmt(usual,c)}. Lowest we've recorded: ${fmt(low,c)}.`};
 if(pct>=3) return {...base,k:'small',t:`Small saving: ${pct}% below its usual ${fmt(usual,c)}. Lowest we've recorded: ${fmt(low,c)}.`};
 return {...base,k:'normal',t:`Normal price: about what it usually sells for (${fmt(usual,c)}). Lowest we've recorded: ${fmt(low,c)}.`};
}
const cache={}; const get=api=>cache[api]||(cache[api]=fetch(api).then(r=>r.ok?r.json():null).catch(()=>null));
window.WPDeal={verdict,fmt,get,MIN_DAYS};
document.querySelectorAll('[data-dc]').forEach(el=>get(el.dataset.api).then(j=>{const v=verdict(j&&j.r&&j.r[el.dataset.dc]); if(!v) return; const o=el.querySelector('[data-dc-out]')||el; o.textContent=v.t; el.dataset.k=v.k; el.hidden=false;}));
})();
