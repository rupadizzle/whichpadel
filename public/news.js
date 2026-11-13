// Newsletter forms (form[data-sub=nl]) -> /api/subscribe (SUBSCRIBERS KV) with explicit consent. /api/news needs the ACCT D1 binding, which is not set up.
document.addEventListener('submit',async e=>{const f=e.target.closest('form[data-sub=nl]');if(!f)return;e.preventDefault();e.stopImmediatePropagation();
 const i=f.querySelector('input[type=email]'),c=f.querySelector('input[type=checkbox]'),m=f.querySelector('.nl-m'),b=f.querySelector('button');
 const say=(t,ok)=>{m.textContent=t;m.className='nl-m '+(ok?'good':'bad');m.hidden=false};
 if(!i.checkValidity()||!c.checked){say(f.dataset.err,0);(i.checkValidity()?c:i).focus();return}
 b.disabled=true;let ok=false;try{const r=await fetch('/api/subscribe',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:i.value.trim(),kind:'news',consent:true,lang:f.dataset.lang,src:f.dataset.src,page:location.pathname,website:f.querySelector('.hp')?.value||'',turnstile:window.wpTs&&wpTs.token(f)||''})});ok=r.ok}catch(_){}
 b.disabled=false;if(ok){say(m.dataset.ok,1);f.querySelector('.nl-r').hidden=true;f.querySelector('.nl-c').hidden=true; const ts=f.querySelector('[data-ts]'); if(ts) ts.hidden=true;}else {say(f.dataset.err,0); if(window.wpTs) wpTs.reset(f);}},true);
