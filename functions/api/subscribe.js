// Stores newsletter / price-alert sign-ups in the SUBSCRIBERS KV namespace. Key = sub:<email>; value merges every request.
const J=(o,s=200)=>new Response(JSON.stringify(o),{status:s,headers:{'content-type':'application/json','cache-control':'no-store'}});
const RX=/^[^\s@<>"]{1,64}@[^\s@<>"]{1,190}\.[a-z]{2,24}$/i;
export async function onRequestPost({request,env}){
 if(!env.SUBSCRIBERS) return J({ok:false},503);
 const o=request.headers.get('origin'); if(o&&!/^https:\/\/([a-z0-9-]+\.)?(whichpadel\.com|whichpadel\.pages\.dev)$/.test(o)&&!/^http:\/\/127\.0\.0\.1(:\d+)?$/.test(o)) return J({ok:false},403);
 if(Number(request.headers.get('content-length')||0)>2000) return J({ok:false},413);
 let b; try{b=await request.json()}catch{return J({ok:false},400)}
 if(b.website) return J({ok:true}); // honeypot: pretend success
 const email=String(b.email||'').trim().toLowerCase(); if(!RX.test(email)) return J({ok:false},400);
 if(email.endsWith('@qa.invalid')) return J({ok:true,dry:true}); // automated QA: full validation, no write
 const kind=b.kind==='alert'?'alert':'news', s=v=>String(v||'').slice(0,120);
 const max=Number.isFinite(b.max)&&b.max>0&&b.max<100000?Math.round(b.max):null;
 const key='sub:'+email, now=new Date().toISOString();
 const cur=JSON.parse(await env.SUBSCRIBERS.get(key)||'null')||{email,created:now,news:false,alerts:[]};
 if(kind==='news') cur.news=true; else { const a={racket:s(b.racket),max,cur:s(b.cur).slice(0,3),at:now}; cur.alerts=[...cur.alerts.filter(x=>!(x.racket===a.racket&&x.max===a.max)),a].slice(-20); }
 cur.lang=s(b.lang).slice(0,5)||cur.lang||null; cur.country=request.cf?.country||null; cur.updated=now; cur.page=s(b.page)||cur.page||null;
 await env.SUBSCRIBERS.put(key,JSON.stringify(cur)); return J({ok:true});
}
export const onRequest=()=>J({ok:false},405);
