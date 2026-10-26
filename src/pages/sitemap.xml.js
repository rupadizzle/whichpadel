import { pages, url, LANGS, alternates } from '../i18n/routes.js';
import { rackets, lists, brandList, players } from '../lib/data.js';
import { vsPairs } from '../lib/vs.js';
import { extraLists } from '../lib/seo-content.js';
export function GET(){
  const S='https://whichpadel.com'; const d='2026-10-20';
  const urls0=LANGS.flatMap(l=>pages().filter(p=>p.type!=='saved').map(p=>url(p.type,l,p.id)).filter(Boolean));
const urls=[...new Set([...urls0,'/deals/','/black-friday/'])];
  const x=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.map(u=>`<url><loc>${S}${u}</loc><lastmod>${d}</lastmod>${(()=>{const a=alternates(u);return a&&Object.keys(a).length>1?Object.entries(a).map(([l,h])=>`<xhtml:link rel="alternate" hreflang="${l}" href="${S}${h}"/>`).join('')+`<xhtml:link rel="alternate" hreflang="x-default" href="${S}${a.en||u}"/>`:''})()}</url>`).join('\n')}\n</urlset>\n`;
  return new Response(x,{headers:{'Content-Type':'application/xml'}});
}
