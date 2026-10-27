/**
 * In-memory D1 stand-in: schema + synthetic offers/observations → exportPrices →
 * saveExport → loadExport. Prints before/after rows-read estimates.
 */
import {exportPrices} from '../src/worker.js';
import {saveExport, loadExport, chunkBody} from '../src/snapshot.js';

function memDB(){
  const tables={shops:[],offers:[],price_observations:[],price_exports:[],price_changes:[],parse_failures:[]};
  const nextId={offers:1};

  function rowsOf(sql){
    const m=sql.match(/FROM\s+(\w+)/i)||sql.match(/INTO\s+(\w+)/i)||sql.match(/UPDATE\s+(\w+)/i)||sql.match(/DELETE\s+FROM\s+(\w+)/i);
    return m?tables[m[1]]||[]:null;
  }

  function prepare(sql){
    const s=sql.replace(/\s+/g,' ').trim();
    const bound=(args)=>{
      const api={
        sql:s, args,
        async all(){
          if(/FROM offers o JOIN shops s .* JOIN price_observations p/i.test(s)){
            const since=args[0];
            const out=[];
            for(const o of tables.offers){
              if((o.fails||0)>=2) continue;
              const shop=tables.shops.find(x=>x.domain===o.shop);
              for(const p of tables.price_observations){
                if(p.offer_id!==o.id||p.ts<=since) continue;
                out.push({id:o.id,r:o.racket_id,d:o.shop,n:shop?.name,u:o.url,ts:p.ts,price:p.price,c:p.currency,s:p.in_stock});
              }
            }
            out.sort((a,b)=>a.ts-b.ts);
            return {results:out};
          }
          if(/FROM price_exports WHERE key = 'meta' OR key GLOB/i.test(s)){
            return {results:tables.price_exports.slice().sort((a,b)=>a.key.localeCompare(b.key))};
          }
          if(/FROM price_exports WHERE key/i.test(s)){
            return {results:tables.price_exports.filter(r=>r.key===args[0])};
          }
          return {results:[]};
        },
        async first(){
          const {results}=await api.all();
          if(/SELECT built_at FROM price_exports/i.test(s)){
            const r=tables.price_exports.find(x=>x.key==='meta');
            return r?{built_at:r.built_at}:null;
          }
          return results[0]??null;
        },
        async run(){
          if(/^INSERT INTO shops/i.test(s)){
            tables.shops.push({domain:args[0],host:args[1],name:args[2],active:1,mode:'page',robots:null,robots_at:null});
            return {meta:{changes:1}};
          }
          if(/^INSERT INTO offers/i.test(s)){
            // id,racket_id,shop,url,currency,last_checked,fails OR racket_id,shop,url,...
            if(typeof args[0]==='number'){
              tables.offers.push({id:args[0],racket_id:args[1],shop:args[2],url:args[3],currency:args[4],last_checked:args[5],fails:args[6]});
              nextId.offers=Math.max(nextId.offers,args[0]+1);
            }else{
              tables.offers.push({id:nextId.offers++,racket_id:args[0],shop:args[1],url:args[2],currency:args[3],last_checked:0,fails:0});
            }
            return {meta:{changes:1}};
          }
          if(/^INSERT INTO price_observations/i.test(s)){
            tables.price_observations.push({offer_id:args[0],ts:args[1],price:args[2],currency:args[3],in_stock:args[4],method:args[5]});
            return {meta:{changes:1}};
          }
          if(/^DELETE FROM price_exports/i.test(s)){const n=tables.price_exports.length; tables.price_exports.length=0; return {meta:{changes:n}};}
          if(/^INSERT INTO price_exports/i.test(s)){
            tables.price_exports.push({key:args[0],built_at:args[1],body:args[2]});
            return {meta:{changes:1}};
          }
          if(/^DELETE FROM price_observations WHERE rowid IN/i.test(s)){
            const older=args[0], limit=args[1];
            const doomed=tables.price_observations.filter(p=>p.ts<older).sort((a,b)=>a.ts-b.ts).slice(0,limit);
            tables.price_observations=tables.price_observations.filter(p=>!doomed.includes(p));
            return {meta:{changes:doomed.length}};
          }
          return {meta:{changes:0}};
        },
      };
      return api;
    };
    return {
      bind(...args){return bound(args);},
      async all(){return bound([]).all();},
      async first(){return bound([]).first();},
      async run(){return bound([]).run();},
    };
  }

  return {
    tables,
    DB:{
      prepare,
      async batch(statements){
        for(const st of statements) await st.run();
        return statements.map(()=>({success:true}));
      },
    },
  };
}

const mem=memDB();
const env={DB:mem.DB};

// seed
await env.DB.batch([
  env.DB.prepare('INSERT INTO shops(domain,host,name) VALUES(?,?,?)').bind('a.com','a.com','A'),
  env.DB.prepare('INSERT INTO shops(domain,host,name) VALUES(?,?,?)').bind('b.com','b.com','B'),
  env.DB.prepare('INSERT INTO shops(domain,host,name) VALUES(?,?,?)').bind('c.com','c.com','C'),
  env.DB.prepare('INSERT INTO offers(id,racket_id,shop,url,currency,last_checked,fails) VALUES(?,?,?,?,?,?,?)').bind(1,'racket-one','a.com','https://a.com/1','EUR',0,0),
  env.DB.prepare('INSERT INTO offers(id,racket_id,shop,url,currency,last_checked,fails) VALUES(?,?,?,?,?,?,?)').bind(2,'racket-one','b.com','https://b.com/1','EUR',0,0),
  env.DB.prepare('INSERT INTO offers(id,racket_id,shop,url,currency,last_checked,fails) VALUES(?,?,?,?,?,?,?)').bind(3,'racket-two','a.com','https://a.com/2','EUR',0,0),
  env.DB.prepare('INSERT INTO offers(id,racket_id,shop,url,currency,last_checked,fails) VALUES(?,?,?,?,?,?,?)').bind(4,'racket-two','c.com','https://c.com/2','GBP',0,0),
]);

const now=Date.now(), day=86400e3;
const obsStmts=[];
for(const oid of [1,2,3,4]){
  for(let d=0;d<30;d++){
    const ts=now-(29-d)*day;
    obsStmts.push(env.DB.prepare('INSERT INTO price_observations VALUES(?,?,?,?,?,?)').bind(oid,ts,oid===4?100+d:80+d*0.5,oid===4?'GBP':'EUR',1,'test'));
  }
}
await env.DB.batch(obsStmts);

const data=await exportPrices(env);
const keys=Object.keys(data.r).sort();
if(keys.join()!=='racket-one,racket-two'){console.error('BAD keys',keys); process.exit(1);}
console.log('ok export products',keys);

if(!Array.isArray(data.r['racket-one'].h)||data.r['racket-one'].h.length<10){
  console.error('BAD history',data.r['racket-one'].h); process.exit(1);
}
console.log('ok history days',data.r['racket-one'].h.length);

if(!Array.isArray(data.r['racket-one'].o)||data.r['racket-one'].o.length<2){
  console.error('BAD offers',data.r['racket-one'].o); process.exit(1);
}
console.log('ok offer list',data.r['racket-one'].o.length);

const saved=await saveExport(env,data);
console.log('ok saved',saved);

const loaded=await loadExport(env);
if(!loaded||loaded.json!==JSON.stringify(data)){console.error('BAD roundtrip',loaded&&loaded.bytes); process.exit(1);}
console.log('ok load roundtrip bytes',loaded.bytes);

const obsCount=mem.tables.price_observations.length;
const offerCount=mem.tables.offers.length;
const scaleOffers=1200, scaleObsPerOffer=30, scaleObs=scaleOffers*scaleObsPerOffer;
const oldDaily=scaleObs*20*96; // full scan every 15 min × 20 colos
const newDaily=scaleObs + 20*5 + scaleOffers*6; // 1 build + cold chunk reads + daily checks

console.log(JSON.stringify({
  fixture:{obsCount,offerCount},
  scaled_to:{offers:scaleOffers,observations:scaleObs},
  estimate_old_rows_read_per_day:oldDaily,
  estimate_new_rows_read_per_day:newDaily,
  reduction_factor:Math.round(oldDaily/newDaily),
},null,2));

const parts=chunkBody(JSON.stringify(data));
if(parts.join('')!==JSON.stringify(data)){console.error('BAD chunk'); process.exit(1);}
console.log('ok chunk parts',parts.length);
console.log('EXPORT LOCAL PASS');
