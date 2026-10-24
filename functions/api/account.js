// Deletes the signed-in account: saved rackets, sessions and the email row.
import { J, originOk, readyDb, userFrom, sessionCookie } from './_acct.js';
export async function onRequest({request,env}){
 if(request.method!=='DELETE') return J({ok:false},405);
 if(!originOk(request)) return J({ok:false},403);
 if(!env.DB) return J({ok:false},503);
 await readyDb(env);
 const user=await userFrom(request, env); if(!user) return J({ok:false},401);
 const id=user.id, db=env.DB;
 const stmts=[
  db.prepare('DELETE FROM saved WHERE user_id=?').bind(id),
  db.prepare('DELETE FROM sessions WHERE user_id=?').bind(id),
  db.prepare('DELETE FROM login_tokens WHERE user_id=?').bind(id),
  db.prepare('DELETE FROM users WHERE id=?').bind(id),
 ];
 if(db.batch) await db.batch(stmts); else for(const st of stmts) await st.run();
 return new Response(JSON.stringify({ok:true}),{headers:{'content-type':'application/json','cache-control':'no-store','set-cookie':sessionCookie('', request, 0)}});
}
