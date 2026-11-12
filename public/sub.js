// Shared handler for every email form (newsletter + price alerts), all languages. Strings come from data-* attributes.
(()=>{
function mount(el){if(!el||el.dataset.tsOn||!window.turnstile||!window.WP_TS)return; try{el.dataset.tsOn=window.turnstile.render(el,{sitekey:window.WP_TS,size:'compact'});}catch(e){}}
function token(f){const el=f&&f.querySelector('[data-ts]'); if(el&&el.dataset.tsOn&&window.turnstile) return window.turnstile.getResponse(el.dataset.tsOn)||''; return '';}
function reset(f){const el=f&&f.querySelector('[data-ts]'); if(el&&el.dataset.tsOn&&window.turnstile) try{window.turnstile.reset(el.dataset.tsOn)}catch(e){}}
function mountAll(){document.querySelectorAll('[data-ts]').forEach(mount);}
window.wpTs={mount,token,reset,mountAll};
const ready=()=>mountAll();
if(window.turnstile) ready();
else{const i=setInterval(()=>{if(window.turnstile){clearInterval(i);ready();}},50); document.addEventListener('DOMContentLoaded',()=>{if(window.turnstile){clearInterval(i);ready();}}); setTimeout(()=>clearInterval(i),20000);}
})();
document.addEventListener('submit',async e=>{const f=e.target.closest('form[data-sub]:not([data-sub=nl])');if(!f)return;e.preventDefault();
 const i=f.querySelector('input[type=email]'),o=f.querySelector('.ok'),b=f.querySelector('button');if(!i.checkValidity()){i.reportValidity();return}
 const n=f.querySelector('input[type=number]'),body={email:i.value.trim(),kind:f.dataset.sub,lang:f.dataset.lang,racket:f.dataset.racket||'',max:n&&n.value?Number(n.value):null,cur:(window.WP&&WP.currency)||'',page:location.pathname,website:f.querySelector('.hp')?.value||'',turnstile:window.wpTs&&wpTs.token(f)||''};
 b.disabled=true;let ok=false;try{const r=await fetch('/api/subscribe',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});ok=r.ok}catch(_){}
 b.disabled=false;o.textContent=ok?o.dataset.ok:f.dataset.err;o.hidden=false;if(ok){i.value='';if(n)n.value='';} if(window.wpTs) wpTs.reset(f);});
