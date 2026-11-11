import fs from 'fs'; import sharp from 'sharp';
const gal=JSON.parse(fs.readFileSync('data/gallery.json','utf8'));
const out='dist/rackets/t'; fs.mkdirSync(out,{recursive:true});
const q=fs.readdirSync('public/rackets').filter(f=>f.endsWith('.webp')).map(f=>f.slice(0,-5)).map(s=>[s,gal[s]?`public/rackets/g/${s}-0-400.webp`:`public/rackets/${s}.webp`]).filter(([,f])=>fs.existsSync(f));
let n=0;
await Promise.all(Array.from({length:8},async()=>{for(let x;(x=q.shift());){await sharp(x[1]).resize(240,240,{fit:'inside',withoutEnlargement:true}).webp({quality:78}).toFile(`${out}/${x[0]}-240.webp`); n++;}}));
console.log(`thumbs: ${n} racket card images`);
