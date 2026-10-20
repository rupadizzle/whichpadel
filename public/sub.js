// Shared handler for every email form (newsletter + price alerts), all languages. Strings come from data-* attributes.
document.addEventListener('submit',async e=>{const f=e.target.closest('form[data-sub]');if(!f)return;e.preventDefault();
 const i=f.querySelector('input[type=email]'),o=f.querySelector('.ok'),b=f.querySelector('button');if(!i.checkValidity()){i.reportValidity();return}
 const n=f.querySelector('input[type=number]'),body={email:i.value.trim(),kind:f.dataset.sub,lang:f.dataset.lang,racket:f.dataset.racket||'',max:n&&n.value?Number(n.value):null,cur:(window.WP&&WP.currency)||'',page:location.pathname,website:f.querySelector('.hp')?.value||''};
 b.disabled=true;let ok=false;try{const r=await fetch('/api/subscribe',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});ok=r.ok}catch(_){}
 b.disabled=false;o.textContent=ok?o.dataset.ok:f.dataset.err;o.hidden=false;if(ok){i.value='';if(n)n.value=''}});
