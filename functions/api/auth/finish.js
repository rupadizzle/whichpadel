// Consumes a magic-link token and sets the session cookie, then returns to the saved page.
import { J, readyDb, safeNext, newToken, sha256, sessionCookie } from '../_acct.js';
export async function onRequestGet({request,env}){
 const url=new URL(request.url); const next=safeNext(url.searchParams.get('next'));
 const fail=()=>Response.redirect(new URL(next+'?auth=bad', url.origin), 302);
 if(!env.DB) return fail();
 await readyDb(env);
 const raw=url.searchParams.get('t')||''; if(raw.length<20) return fail();
 const hash=await sha256(raw), now=new Date().toISOString();
 const row=await env.DB.prepare('SELECT user_id FROM login_tokens WHERE hash=? AND expires>?').bind(hash, now).first();
 await env.DB.prepare('DELETE FROM login_tokens WHERE hash=?').bind(hash).run();
 if(!row) return fail();
 const session=newToken(), sh=await sha256(session), exp=new Date(Date.now()+60*864e5).toISOString();
 await env.DB.prepare('INSERT INTO sessions(hash,user_id,expires) VALUES(?,?,?)').bind(sh, row.user_id, exp).run();
 return new Response(null,{status:302,headers:{location:next+'?sync=1','cache-control':'no-store','set-cookie':sessionCookie(session, request)}});
}
export const onRequest=()=>J({ok:false},405);
