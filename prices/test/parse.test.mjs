import fs from 'node:fs'; import {parse,sane} from '../src/parse.js';
const exp={'padelnuestro.com':{price:164.95,currency:'EUR',inStock:false},'allforpadel.com':{price:128,currency:'EUR',inStock:true},'noxsport.com':{price:389.99,currency:'EUR',inStock:true}};
let bad=0; for(const [d,e] of Object.entries(exp)){const r=parse(fs.readFileSync(new URL(`./fixtures/${d}.html`,import.meta.url),'utf8'),d);
 const ok=r.price===e.price&&r.currency===e.currency&&r.inStock===e.inStock; if(!ok)bad++; console.log(ok?'ok ':'BAD',d,JSON.stringify(r));}
const t=[[parse('<html></html>','x.com').error==='no-price'],[parse('<meta property="product:price:amount" content="2"><meta property="product:price:currency" content="EUR">','x.com').error?.startsWith('implausible')],[sane(100,[200,210,190])],[!sane(50,[200,210,190])],[parse('<meta property="og:price:amount" content="1.299,00"><meta property="og:price:currency" content="eur">','x.com').price===1299]];
t.forEach(([v],i)=>{if(!v){bad++;console.log('BAD unit',i)}}); console.log(bad?'PARSE FAIL':'PARSE PASS');
