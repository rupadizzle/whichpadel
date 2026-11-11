import fs from 'fs';
const src=process.argv[2]; if(!src){console.error('usage: node scripts/index-set.mjs <url-inventory.csv>'); process.exit(1);}
const [head,...lines]=fs.readFileSync(src,'utf8').trim().split('\n');
const cols=head.split(','), iPath=cols.indexOf('path'), iDec=cols.indexOf('decision');
const split=l=>{const out=[]; let cur='', q=false; for(const c of l){ if(c==='"') q=!q; else if(c===','&&!q){out.push(cur); cur='';} else cur+=c; } out.push(cur); return out;};
const keep=[...new Set(lines.map(split).filter(r=>r[iDec]==='INDEX').map(r=>r[iPath]))].sort();
fs.writeFileSync('data/index-set.json',JSON.stringify(keep,null,0).replace(/","/g,'",\n"')+'\n');
console.log(`index-set: ${keep.length} INDEX paths from ${lines.length} rows`);
