// Shared handler for every email form (newsletter + price alerts), all languages. Strings come from data-* attributes.
(()=>{
function mount(el){if(!el||el.dataset.tsOn||!window.turnstile||!window.WP_TS)return; try{el.dataset.tsOn=window.turnstile.render(el,{sitekey:window.WP_TS,size:'compact'});}catch(e){}}
function token(f){const el=f&&f.querySelector('[data-ts]'); if(el&&el.dataset.tsOn&&window.turnstile) return window.turnstile.getResponse(el.dataset.tsOn)||''; return '';}
function reset(f){const el=f&&f.querySelector('[data-ts]'); if(el&&el.dataset.tsOn&&window.turnstile) try{window.turnstile.reset(el.dataset.tsOn)}catch(e){}}
function mountAll(){document.querySelectorAll('[data-ts]').forEach(mount);}
function load(){
 if(window.turnstile){mountAll(); return window.wpTsReady||(window.wpTsReady=Promise.resolve());}
 if(window.wpTsReady) return window.wpTsReady;
 window.wpTsReady=new Promise(res=>{
  const done=()=>{mountAll();res()};
  const s=document.createElement('script');
  s.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
  s.async=true;
  s.defer=true;
  s.onload=()=>{
   if(window.turnstile){done();return;}
   const i=setInterval(()=>{if(window.turnstile){clearInterval(i);done();}},50);
   setTimeout(()=>{clearInterval(i);done();},20000);
  };
  s.onerror=()=>res();
  document.head.appendChild(s);
 });
 return window.wpTsReady;
}
async function ensure(f){
 await load();
 const el=f&&f.querySelector('[data-ts]');
 if(el) mount(el);
 for(let n=0;n<80;n++){const t=token(f); if(t) return t; await new Promise(r=>setTimeout(r,50));}
 return token(f);
}
function copy(status,err,mail,ok,fail){return (err==='soon'||err==='mail'||status===503)?mail:(status>=200&&status<300)?ok:fail;}
function arm(e){const t=e.target; if(!t||!t.closest) return; if(t.closest('[data-ts], form:has([data-ts]), #rk-alert, #acct-pop, #acct-form, #keep-form, #newsletter')) load();}
document.addEventListener('focusin',arm,true);
document.addEventListener('pointerdown',arm,true);
window.wpTs={mount,token,reset,mountAll,load,ensure,copy};
})();
document.addEventListener('submit',async e=>{const f=e.target.closest('form[data-sub]:not([data-sub=nl])');if(!f)return;e.preventDefault();
 const i=f.querySelector('input[type=email]'),o=f.querySelector('.ok'),b=f.querySelector('button');if(!i.checkValidity()){i.reportValidity();return}
 if(window.wpTs) await wpTs.ensure(f);
 const n=f.querySelector('input[type=number]'),body={email:i.value.trim(),kind:f.dataset.sub,lang:f.dataset.lang,racket:f.dataset.racket||'',max:n&&n.value?Number(n.value):null,cur:(window.WP&&WP.currency)||'',page:location.pathname,website:f.querySelector('.hp')?.value||'',turnstile:window.wpTs&&wpTs.token(f)||''};
 b.disabled=true;let ok=false;try{const r=await fetch('/api/subscribe',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});ok=r.ok}catch(_){}
 b.disabled=false;o.textContent=ok?o.dataset.ok:f.dataset.err;o.hidden=false;if(ok){i.value='';if(n)n.value='';} if(window.wpTs) wpTs.reset(f);});
