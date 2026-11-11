// Weekly deals newsletter sign-ups -> D1 (newsletter). Double opt-in later: confirmed=0, nothing is sent yet.
import { originOk, limited } from './_acct.js';
const J=(o,s=200)=>new Response(JSON.stringify(o),{status:s,headers:{'content-type':'application/json','cache-control':'no-store'}});
const RX=/^[^\s@<>"]{1,64}@[^\s@<>"]{1,190}\.[a-z]{2,24}$/i;
let ready=false;
export async function onRequestPost({request,env}){
 if(!env.ACCT) return J({ok:false},503);
 if(!originOk(request)) return J({ok:false},403);
 if(await limited(request,'news')) return J({ok:false},429);
 if(Number(request.headers.get('content-length')||0)>2000) return J({ok:false},413);
 let b; try{b=await request.json()}catch{return J({ok:false},400)}
 if(b.website) return J({ok:true});
 const email=String(b.email||'').trim().toLowerCase(); if(!RX.test(email)||b.consent!==true) return J({ok:false},400);
 if(email.endsWith('@qa.invalid')) return J({ok:true,dry:true});
 const s=(v,n=120)=>String(v||'').slice(0,n);
 if(!ready){ await env.ACCT.prepare("CREATE TABLE IF NOT EXISTS newsletter(email TEXT PRIMARY KEY, source TEXT, page TEXT, lang TEXT, country TEXT, consent INTEGER NOT NULL, consent_at TEXT NOT NULL, confirmed INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL)").run(); ready=true; }
 const now=new Date().toISOString();
 await env.ACCT.prepare("INSERT INTO newsletter(email,source,page,lang,country,consent,consent_at,confirmed,created_at) VALUES(?,?,?,?,?,1,?,0,?) ON CONFLICT(email) DO UPDATE SET consent=1,consent_at=excluded.consent_at,lang=excluded.lang")
  .bind(email,s(b.src,40),s(b.page,200),s(b.lang,5),request.cf?.country||null,now,now).run();
 return J({ok:true});
}
export const onRequest=()=>J({ok:false},405);
