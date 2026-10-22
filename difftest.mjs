// Compare normalized HTML of every built page in DIST against the live mirror.
import fs from 'fs'; import path from 'path';
const [dist='dist', mirror='/workspace/whichpadel-mirror/html'] = process.argv.slice(2);
const urls = fs.readFileSync(path.join(mirror,'..','urls.txt'),'utf8').trim().split('\n');
const norm = s => s.replace(/\/_astro\/[^"' )]+/g,'/_astro/X').replace(/"rates":\{[^}]*\}/g,'').replace(/\d{4}-\d{2}-\d{2}/g,'D').replace(/>\s+</g,'><').replace(/\s+/g,' ').trim();
let ok=0, bad=[];
for (const u of urls) { const p = u.replace('https://whichpadel.com','');
  const a = path.join(mirror,p,'index.html'), b = path.join(dist,p,'index.html');
  if (!fs.existsSync(b)) { bad.push([p,'missing']); continue; }
  const x=norm(fs.readFileSync(a,'utf8')), y=norm(fs.readFileSync(b,'utf8'));
  if (x===y) ok++; else { let i=0; while(x[i]===y[i]) i++; bad.push([p, 'live:'+x.slice(i-40,i+80)+' | build:'+y.slice(i-40,i+80)]); } }
console.log(`DIFF ${ok}/${urls.length} match, ${bad.length} differ`); bad.slice(0,8).forEach(b=>console.log(b.join('  ')));
process.exit(bad.length?1:0);
