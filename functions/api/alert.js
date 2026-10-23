// Finder price-drop alert sign-ups -> D1 (finder_alerts). Double opt-in: confirmed=0, nothing is sent yet.
const J=(o,s=200)=>new Response(JSON.stringify(o),{status:s,headers:{'content-type':'application/json','cache-control':'no-store'}});
const RX=/^[^\s@<>"]{1,64}@[^\s@<>"]{1,190}\.[a-z]{2,24}$/i;
let ready=false;
export async function onRequestPost({request,env}){
 if(!env.DB) return J({ok:false},503);
 const o=request.headers.get('origin'); if(o&&!/^https:\/\/([a-z0-9-]+\.)?(whichpadel\.com|whichpadel\.pages\.dev)$/.test(o)&&!/^http:\/\/127\.0\.0\.1(:\d+)?$/.test(o)) return J({ok:false},403);
 if(Number(request.headers.get('content-length')||0)>2000) return J({ok:false},413);
 let b; try{b=await request.json()}catch{return J({ok:false},400)}
 if(b.website) return J({ok:true});
 const email=String(b.email||'').trim().toLowerCase(); if(!RX.test(email)||b.consent!==true) return J({ok:false},400);
 if(email.endsWith('@qa.invalid')) return J({ok:true,dry:true});
 const s=(v,n=120)=>String(v||'').slice(0,n); const price=Number.isFinite(b.price)&&b.price>0&&b.price<100000?Math.round(b.price):null;
 if(!ready){ await env.DB.prepare("CREATE TABLE IF NOT EXISTS finder_alerts(email TEXT NOT NULL, racket TEXT NOT NULL, lang TEXT, country TEXT, price INTEGER, cur TEXT, answers TEXT, consent_at TEXT NOT NULL, confirmed INTEGER NOT NULL DEFAULT 0, created TEXT NOT NULL, PRIMARY KEY(email,racket))").run(); ready=true; }
 const now=new Date().toISOString();
 await env.DB.prepare("INSERT INTO finder_alerts(email,racket,lang,country,price,cur,answers,consent_at,confirmed,created) VALUES(?,?,?,?,?,?,?,?,0,?) ON CONFLICT(email,racket) DO UPDATE SET price=excluded.price,cur=excluded.cur,answers=excluded.answers,lang=excluded.lang,consent_at=excluded.consent_at")
  .bind(email,s(b.racket,100),s(b.lang,5),request.cf?.country||null,price,s(b.cur,3),s(b.answers,200),now,now).run();
 return J({ok:true});
}
export const onRequest=()=>J({ok:false},405);
