// Read published balance lines from shop/brand pages we already store a URL for.
// Writes data/spec-checks.json. Does not edit the PadelTrue catalogue.
import fs from 'node:fs';

const raw = JSON.parse(fs.readFileSync(new URL('../data/rackets.normalised.json', import.meta.url)));
const matches = JSON.parse(fs.readFileSync(new URL('../prices/match/matches.json', import.meta.url)));
const bySlug = {};
for (const map of Object.values(matches)) {
  for (const [slug, url] of Object.entries(map)) (bySlug[slug] ??= []).push(url);
}

const targets = raw.rackets.filter(r => !['low', 'medium', 'high'].includes(r.balance)).map(r => {
  const url = r.productUrl || (bySlug[r.slug] && bySlug[r.slug][0]) || null;
  return url ? { slug: r.slug, url } : null;
}).filter(Boolean);

const UA = 'WhichPadelSpecBot/1.0 (+https://whichpadel.com/about/; hello@whichpadel.com)';
const sleep = ms => new Promise(r => setTimeout(r, ms));

function textOf(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{2,}/g, '\n');
}

function balanceLines(text) {
  const lines = text.split('\n').map(s => s.trim()).filter(Boolean);
  const hit = [];
  for (let i = 0; i < lines.length; i++) {
    if (!/balance|equilib|balanc/i.test(lines[i])) continue;
    const chunk = [lines[i], lines[i + 1], lines[i + 2]].filter(Boolean).join(' | ');
    if (chunk.length < 180) hit.push(chunk);
    if (hit.length === 4) break;
  }
  return hit;
}

const out = { fetched: new Date().toISOString().slice(0, 10), note: 'Verbatim balance lines from the stored product URL. The PadelTrue files are unchanged.', rackets: {} };
let n = 0;
for (const t of targets) {
  n++;
  const row = { url: t.url, lines: [], error: null };
  try {
    const res = await fetch(t.url, { headers: { 'user-agent': UA, accept: 'text/html' }, redirect: 'follow', signal: AbortSignal.timeout(15000) });
    if (!res.ok) row.error = 'http ' + res.status;
    else row.lines = balanceLines(textOf(await res.text()));
  } catch (e) {
    row.error = String(e.cause?.code || e.name || e.message).slice(0, 80);
  }
  out.rackets[t.slug] = row;
  if (n % 20 === 0) console.log(n + '/' + targets.length);
  await sleep(400);
}
fs.writeFileSync(new URL('../data/spec-checks.json', import.meta.url), JSON.stringify(out, null, 1));
const withLine = Object.values(out.rackets).filter(r => r.lines.length).length;
const failed = Object.values(out.rackets).filter(r => r.error).length;
console.log('checked', targets.length, 'with a balance line', withLine, 'failed', failed);
