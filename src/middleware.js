// Old /shoes/brand/:slug/ URLs. One brand, one page: /brands/:slug/.
// The racket comparison tool lives on the racket list. Old /rackets/compare/ URLs go there.
import { defineMiddleware } from 'astro:middleware';
import { url } from './i18n/routes.js';
import { brandList } from './lib/data.js';
import { shoeBrands } from './lib/shoes.js';
const LANGS=['en','es','fr','pt','it','de'];
const racketSlugs=new Set(brandList.map(b=>b.slug));
const redir=new Map();
for(const b of shoeBrands){
  for(const lang of LANGS){ const from=url('shoeBrand',lang,b.slug), to=url('brand',lang,b.slug)+(racketSlugs.has(b.slug)?'#shoes':''); if(!from||!to) continue; redir.set(from,to); if(from.endsWith('/')) redir.set(from.slice(0,-1),to); } }
const cmp=new Map();
for(const lang of LANGS){ const from=url('compare',lang), to=url('rackets',lang); if(!from||!to) continue; cmp.set(from,to); if(from.endsWith('/')) cmp.set(from.slice(0,-1),to); }
export const onRequest=defineMiddleware((context,next)=>{
  const path=context.url.pathname;
  if(path==='/black-friday-padel-rackets'||path==='/black-friday-padel-rackets/') return context.redirect('/black-friday/',301);
  if(path==='/padel-bags'||path.startsWith('/padel-bags/')){ const dest=path.replace(/^\/padel-bags/,'/bags'); const search=new URL(context.request.url).search||context.url.search; return context.redirect((dest.endsWith('/')?dest:dest+'/')+search,301); }
  const shoe=redir.get(path); if(shoe) return context.redirect(shoe,301);
  const list=cmp.get(path); if(list){ const search=new URL(context.request.url).search||context.url.search; return context.redirect(list+search,301); }
  return next();
});
