import { J, originOk, readyDb, sha256, sessionCookie } from '../_acct.js';
export async function onRequestPost({request,env}){
 if(!originOk(request)) return J({ok:false},403);
 if(env.DB){
  await readyDb(env);
  const m=(request.headers.get('cookie')||'').match(/(?:^|; )wp_session=([^;]+)/);
  if(m) await env.DB.prepare('DELETE FROM sessions WHERE hash=?').bind(await sha256(decodeURIComponent(m[1]))).run();
 }
 return new Response(JSON.stringify({ok:true}),{headers:{'content-type':'application/json','cache-control':'no-store','set-cookie':sessionCookie('', request, 0)}});
}
export const onRequest=()=>J({ok:false},405);
