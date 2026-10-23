// One-off first pass from the box for offers never checked: same UA, robots rules, parser and sanity checks as the Worker; writes SQL.
import fs from 'node:fs'; import {parse} from './src/parse.js'; import {robotsAllows} from './src/worker.js';
const UA='WhichPadelPriceBot/1.0 (+https://whichpadel.com/about/; hello@whichpadel.com)', GAP=3000;
const due=JSON.parse(fs.readFileSync(process.argv[2])); const by={}; for(const o of due)(by[o.shop]??=[]).push(o);
const q=s=>s==null?'NULL':typeof s==='number'?s:`'${String(s).replace(/'/g,"''")}'`; const sql=[]; const stat={};
await Promise.all(Object.entries(by).map(async([d,os])=>{const st=stat[d]={ok:0,fail:{}}; let rt=''; try{rt=await (await fetch(`https://${os[0].host}/robots.txt`,{headers:{'user-agent':UA}})).text()}catch{}
 for(const o of os){const now=Date.now(); const u=new URL(o.url); let err=null,p;
  if(!robotsAllows(rt,u.pathname+u.search)) err='robots'; else { try{const r=await fetch(o.url,{headers:{'user-agent':UA,accept:'text/html','accept-language':'en'}}); if(!r.ok) err='http'+r.status; else {p=parse(await r.text(),d); if(p.error) err=p.error;}}catch(e){err='fetch'} await new Promise(r=>setTimeout(r,GAP)); }
  if(err){(st.fail[err]=(st.fail[err]||0)+1); sql.push(`INSERT INTO parse_failures VALUES(${o.id},${now},0,${q(err)});`,`UPDATE offers SET last_checked=${now},last_error=${q(err)},fails=fails+1 WHERE id=${o.id};`);}
  else {st.ok++; sql.push(`INSERT INTO price_observations VALUES(${o.id},${now},${p.price},${q(p.currency)},${p.inStock==null?'NULL':+p.inStock},${q(p.method)});`,`UPDATE offers SET last_checked=${now},last_error=NULL,fails=0,currency=${q(p.currency)} WHERE id=${o.id};`);}}}));
fs.writeFileSync('/tmp/backfill.sql',sql.join('\n')); console.log(JSON.stringify(stat,null,0));
