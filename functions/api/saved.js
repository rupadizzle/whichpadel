// Signed-in saved list. Signed-out callers get 401 and keep using localStorage.
import { J, originOk, readyDb, userFrom, readSaved, putSaved, cleanItems, unionItems, toggleItem } from './_acct.js';
export async function onRequest({request,env}){
 if(request.method!=='GET'&&request.method!=='POST') return J({ok:false},405);
 if(!env.DB) return J({ok:false},503);
 if(request.method==='POST'&&!originOk(request)) return J({ok:false},403);
 if(Number(request.headers.get('content-length')||0)>8000) return J({ok:false},413);
 await readyDb(env);
 const user=await userFrom(request, env); if(!user) return J({ok:false},401);
 if(request.method==='GET') return J({ok:true,email:user.email,items:await readSaved(env.DB, user.id)});
 let b; try{b=await request.json()}catch{return J({ok:false},400)}
 const cur=await readSaved(env.DB, user.id);
 let next;
 if(b.op==='toggle') next=toggleItem(cur, b.t, b.s);
 else if(b.merge) next=unionItems(cur, b.items);
 else next=cleanItems(b.items);
 await putSaved(env.DB, user.id, next);
 return J({ok:true,email:user.email,items:next});
}
