// Shared handler for every email form (newsletter + price alerts), all languages. Strings come from data-* attributes.
(()=>{
function mount(el){if(!el||el.dataset.tsOn||!window.turnstile||!window.WP_TS)return; try{el.dataset.tsOn=window.turnstile.render(el,{sitekey:window.WP_TS,size:'compact',appearance:'interaction-only'});}catch(e){}}
function token(f){const el=f&&f.querySelector('[data-ts]'); if(el&&el.dataset.tsOn&&window.turnstile) return window.turnstile.getResponse(el.dataset.tsOn)||''; return '';}
function reset(f){const el=f&&f.querySelector('[data-ts]'); if(el&&el.dataset.tsOn&&window.turnstile) try{window.turnstile.reset(el.dataset.tsOn)}catch(e){}}
function mountAll(){document.querySelectorAll('[data-ts]').forEach(mount);}
window.wpTs={mount,token,reset,mountAll};
// Turnstile loads only once a form with a [data-ts] box is near the viewport or gets focus, not on every page load.
window.wpTsReady=()=>mountAll();
const SRC='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=wpTsReady';
function load(){if(window.turnstile){mountAll();return;} if(document.getElementById('ts-api')) return; const s=document.createElement('script'); s.id='ts-api'; s.src=SRC; s.async=true; document.head.appendChild(s);}
window.wpTs.load=load;
const watch=()=>{const els=document.querySelectorAll('[data-ts]'); if(!els.length) return;
 if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>{if(es.some(x=>x.isIntersecting)){io.disconnect(); load();}},{rootMargin:'600px 0px'}); els.forEach(el=>io.observe(el));} else load();};
document.addEventListener('focusin',e=>{const f=e.target&&e.target.closest&&e.target.closest('form'); if(f&&f.querySelector('[data-ts]')) load();});
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',watch):watch();
})();
document.addEventListener('submit',async e=>{const f=e.target.closest('form[data-sub]:not([data-sub=nl])');if(!f)return;e.preventDefault();
 const i=f.querySelector('input[type=email]'),o=f.querySelector('.ok'),b=f.querySelector('button');if(!i.checkValidity()){i.reportValidity();return}
 const n=f.querySelector('input[type=number]'),body={email:i.value.trim(),kind:f.dataset.sub,lang:f.dataset.lang,racket:f.dataset.racket||'',max:n&&n.value?Number(n.value):null,cur:(window.WP&&WP.currency)||'',page:location.pathname,website:f.querySelector('.hp')?.value||'',turnstile:window.wpTs&&wpTs.token(f)||''};
 b.disabled=true;let ok=false;try{const r=await fetch('/api/subscribe',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});ok=r.ok}catch(_){}
 b.disabled=false;o.textContent=ok?o.dataset.ok:f.dataset.err;o.hidden=false;if(ok){i.value='';if(n)n.value='';} if(window.wpTs) wpTs.reset(f);});
