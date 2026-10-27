import {chunkBody, joinChunks, CHUNK} from '../src/snapshot.js';

let bad=0;
const check=(name,cond)=>{if(!cond){bad++; console.log('BAD',name);} else console.log('ok',name);};

// round-trip small
const s='{"updated":"x","r":{"a":1}}';
check('small roundtrip', joinChunks(chunkBody(s))===s);

// round-trip larger than one chunk
const big='{"u":"x","r":{"a":"'+'y'.repeat(CHUNK)+'"}}';
const parts=chunkBody(big);
check('multi chunk', parts.length>=2);
check('big roundtrip', joinChunks(parts)===big);
check('chunk size', parts.slice(0,-1).every(p=>p.length===CHUNK));

// empty
check('empty', joinChunks(chunkBody(''))==='');

console.log(bad?'SNAPSHOT FAIL':'SNAPSHOT PASS');
process.exit(bad?1:0);
