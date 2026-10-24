// Magic-link sign-in. Sends the link with Resend when RESEND_API_KEY and AUTH_FROM are set.
import { J, RX, originOk, readyDb, safeNext, newToken, sha256 } from '../_acct.js';
const LANG=new Set(['en','es','fr','pt','it','de']);
const MAIL={
 en:['Your WhichPadel sign-in link','Use this link to keep your saved rackets. It expires in 30 minutes.\n\n{url}\n\nIf you did not ask for this, ignore this email.'],
 es:['Tu enlace para entrar en WhichPadel','Usa este enlace para conservar tus palas guardadas. Caduca en 30 minutos.\n\n{url}\n\nSi no lo has pedido, ignora este email.'],
 fr:['Votre lien de connexion WhichPadel','Utilisez ce lien pour conserver vos raquettes enregistrées. Il expire dans 30 minutes.\n\n{url}\n\nSi vous n’êtes pas à l’origine de cette demande, ignorez cet e-mail.'],
 pt:['O seu link para entrar na WhichPadel','Use este link para guardar as suas raquetes. Expira em 30 minutos.\n\n{url}\n\nSe não pediu isto, ignore este email.'],
 it:['Il tuo link di accesso a WhichPadel','Usa questo link per conservare le racchette salvate. Scade tra 30 minuti.\n\n{url}\n\nSe non hai chiesto tu l’accesso, ignora questa email.'],
 de:['Dein WhichPadel-Anmeldelink','Mit diesem Link behältst du deine gespeicherten Schläger. Er gilt 30 Minuten.\n\n{url}\n\nWenn du das nicht warst, ignoriere diese E-Mail.'],
};
async function sendLink(env, email, link, lang){
 if(!env.RESEND_API_KEY||!env.AUTH_FROM) return 'mail';
 const [subject, body]=(MAIL[lang]||MAIL.en);
 const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{authorization:'Bearer '+env.RESEND_API_KEY,'content-type':'application/json'},body:JSON.stringify({from:env.AUTH_FROM,to:[email],subject,text:body.replace('{url}',link)})});
 return r.ok?'ok':'send';
}
export async function onRequestPost({request,env}){
 if(!env.DB) return J({ok:false},503);
 if(!originOk(request)) return J({ok:false},403);
 if(Number(request.headers.get('content-length')||0)>2000) return J({ok:false},413);
 let b; try{b=await request.json()}catch{return J({ok:false},400)}
 if(b.website) return J({ok:true});
 const email=String(b.email||'').trim().toLowerCase(); if(!RX.test(email)) return J({ok:false},400);
 if(email.endsWith('@qa.invalid')) return J({ok:true,dry:true});
 const lang=LANG.has(b.lang)?b.lang:'en';
 await readyDb(env);
 const now=new Date().toISOString();
 await env.DB.prepare('INSERT INTO users(email,created) VALUES(?,?) ON CONFLICT(email) DO NOTHING').bind(email,now).run();
 const user=await env.DB.prepare('SELECT id FROM users WHERE email=?').bind(email).first();
 if(!user) return J({ok:false},500);
 const raw=newToken(), hash=await sha256(raw), exp=new Date(Date.now()+30*60*1000).toISOString();
 await env.DB.prepare('DELETE FROM login_tokens WHERE user_id=?').bind(user.id).run();
 await env.DB.prepare('INSERT INTO login_tokens(hash,user_id,expires) VALUES(?,?,?)').bind(hash,user.id,exp).run();
 const link=new URL('/api/auth/finish', request.url);
 link.searchParams.set('t', raw); link.searchParams.set('next', safeNext(b.next));
 const sent=await sendLink(env, email, link.toString(), lang);
 if(sent!=='ok'){ await env.DB.prepare('DELETE FROM login_tokens WHERE hash=?').bind(hash).run(); return J({ok:false,err:sent}, sent==='mail'?503:502); }
 return J({ok:true});
}
export const onRequest=()=>J({ok:false},405);
