// Checks public/_redirects the way Cloudflare Pages parses it, so no rule is silently dropped.
// Cloudflare counts every rule after the first wildcard/placeholder rule as dynamic and stops reading
// after 100 dynamic rules (2000 static). It also ignores duplicate sources and malformed lines.
import { readFileSync } from 'node:fs';
const lines = readFileSync(new URL('../public/_redirects', import.meta.url), 'utf8').split('\n');
const bad = []; const seen = new Set(); let stat = 0, dyn = 0, dynamicMode = false;
lines.forEach((raw, i) => {
  const line = raw.trim(); if (!line || line.startsWith('#')) return;
  const t = line.split(/\s+/); const n = i + 1;
  if (t.length < 2 || t.length > 3) return bad.push(`line ${n}: expected 2 or 3 fields`);
  const [from, to, code = '302'] = t;
  const isDyn = /\*|:[A-Za-z]\w*/.test(from);
  if (isDyn) dynamicMode = true;
  else if (dynamicMode) bad.push(`line ${n}: static rule after a wildcard rule (counts as dynamic; move wildcard rules to the end)`);
  dynamicMode ? dyn++ : stat++;
  if (!from.startsWith('/')) bad.push(`line ${n}: source must start with /`);
  if (!/^(\/|https?:\/\/)/.test(to)) bad.push(`line ${n}: bad destination`);
  if (!['200', '301', '302', '303', '307', '308'].includes(code)) bad.push(`line ${n}: status ${code}`);
  if (seen.has(from)) bad.push(`line ${n}: duplicate source ${from}`); seen.add(from);
});
if (dyn > 100) bad.push(`${dyn} dynamic rules (max 100)`);
if (stat > 2000) bad.push(`${stat} static rules (max 2000)`);
console.log(`_redirects: ${stat} static, ${dyn} dynamic`);
if (bad.length) { console.log(bad.join('\n')); process.exit(1); }
console.log('REDIRECTS PASS');
