import { pages, url, LANGS } from '../i18n/routes.js';
import { rackets, lists, brandList, players } from '../lib/data.js';
import { y27 } from '../lib/extra.js';
import { vsPairs } from '../lib/vs.js';
import { extraLists } from '../lib/seo-content.js';
export function GET(){
  const S='https://whichpadel.com'; const d='2026-10-20';
  const urls0=LANGS.flatMap(l=>pages().map(p=>url(p.type,l,p.id)).filter(Boolean));
const urls=[...new Set(urls0)];
  const x=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`<url><loc>${S}${u}</loc><lastmod>${d}</lastmod></url>`).join('\n')}\n</urlset>\n`;
  return new Response(x,{headers:{'Content-Type':'application/xml'}});
}
