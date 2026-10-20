import { pages, url, LANGS } from '../i18n/routes.js';
import { rackets, lists, brandList, players } from '../lib/data.js';
import { y27 } from '../lib/extra.js';
import { vsPairs } from '../lib/vs.js';
import { extraLists } from '../lib/seo-content.js';
export function GET(){
  const S='https://whichpadel.com'; const d='2026-10-20';
  const urls0=['/','/brands/','/players/','/tools/real-weight/','/black-friday-padel-rackets/',...y27.map(b=>`/brands/${b.slug}/2027/`),...players.map(p=>`/players/${p.slug}/`),'/compare/','/about/','/affiliate-disclosure/','/privacy/','/padel-rackets/',...vsPairs.map(v=>`/compare/${v.slug}/`),...Object.keys(extraLists).map(k=>`/best/${k}/`),...Object.keys(lists).map(k=>`/best/${k}/`),...brandList.map(b=>`/brands/${b.slug}/`),...rackets.map(r=>`/rackets/${r.slug}/`),...LANGS.filter(l=>l!=='en').flatMap(l=>pages().map(p=>url(p.type,l,p.id)).filter(Boolean))];
const urls=[...new Set(urls0)];
  const x=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`<url><loc>${S}${u}</loc><lastmod>${d}</lastmod></url>`).join('\n')}\n</urlset>\n`;
  return new Response(x,{headers:{'Content-Type':'application/xml'}});
}
