// Shared helpers for magic-link accounts and saved rackets. Tables live in the existing D1 binding (DB).
const KINDS=new Set(['r','s','b','g']);
const SLUG=/^[a-z0-9-]{1,80}$/;
export const CAP=40;
export const J=(o,s=200)=>new Response(JSON.stringify(o),{status:s,headers:{'content-type':'application/json','cache-control':'no-store'}});
export const RX=/^[^\s@<>"]{1,64}@[^\s@<>"]{1,190}\.[a-z]{2,24}$/i;
export function originOk(request){
 const o=request.headers.get('origin'); if(!o) return true;
 return /^https:\/\/([a-z0-9-]+\.)?(whichpadel\.com|whichpadel\.pages\.dev)$/.test(o)||/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(o);
}
export function cleanItems(items){
 if(!Array.isArray(items)) return [];
 const out=[], seen=new Set();
 for(const x of items){
  const t=x&&x.t, s=x&&x.s;
  if(!KINDS.has(t)||typeof s!=='string'||!SLUG.test(s)) continue;
  const k=t+':'+s; if(seen.has(k)) continue; seen.add(k); out.push({t,s});
  if(out.length>=CAP) break;
 }
 return out;
}
// This device's list comes first, then account items it does not already have.
export const unionItems=(existing,incoming)=>cleanItems([...(incoming||[]),...(existing||[])]);
export function toggleItem(items,t,s){
 const cur=cleanItems(items); if(!KINDS.has(t)||!SLUG.test(s||'')) return cur;
 const i=cur.findIndex(x=>x.t===t&&x.s===s);
 if(i>=0) cur.splice(i,1); else cur.unshift({t,s});
 return cleanItems(cur);
}
export function safeNext(s){
 if(typeof s!=='string'||s.length>200||!s.startsWith('/')||s.startsWith('//')||s.includes('\\')||s.includes('://')||/[\s?#]/.test(s)) return '/saved/';
 return s;
}
export function newToken(){
 const b=new Uint8Array(32); crypto.getRandomValues(b);
 return btoa(String.fromCharCode(...b)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
export async function sha256(s){
 const d=await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
 return [...new Uint8Array(d)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
let ready=false;
export async function readyDb(env){
 if(ready) return;
 const q=sql=>env.DB.prepare(sql).run();
 await q('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE, created TEXT NOT NULL)');
 await q('CREATE TABLE IF NOT EXISTS sessions(hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL, expires TEXT NOT NULL)');
 await q('CREATE TABLE IF NOT EXISTS login_tokens(hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL, expires TEXT NOT NULL)');
 await q('CREATE TABLE IF NOT EXISTS saved(user_id INTEGER NOT NULL, kind TEXT NOT NULL, slug TEXT NOT NULL, created TEXT NOT NULL, PRIMARY KEY(user_id, kind, slug))');
 ready=true;
}
export async function userFrom(request, env){
 const m=(request.headers.get('cookie')||'').match(/(?:^|; )wp_session=([^;]+)/); if(!m) return null;
 const hash=await sha256(decodeURIComponent(m[1]));
 return env.DB.prepare('SELECT u.id AS id, u.email AS email FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.hash=? AND s.expires>?').bind(hash, new Date().toISOString()).first();
}
export async function readSaved(db, userId){
 const {results}=await db.prepare('SELECT kind AS t, slug AS s FROM saved WHERE user_id=? ORDER BY rowid DESC').bind(userId).all();
 return cleanItems(results||[]);
}
export async function putSaved(db, userId, items){
 const now=new Date().toISOString();
 const stmts=[db.prepare('DELETE FROM saved WHERE user_id=?').bind(userId)];
 for(const x of [...items].reverse()) stmts.push(db.prepare('INSERT INTO saved(user_id,kind,slug,created) VALUES(?,?,?,?)').bind(userId,x.t,x.s,now));
 if(db.batch) await db.batch(stmts); else for(const st of stmts) await st.run();
}
export function sessionCookie(token, request, maxAge=60*86400){
 const secure=new URL(request.url).protocol==='https:';
 return `wp_session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}${secure?'; Secure':''}`;
}
