// Old shoe-brand URLs for brands that also have rackets. One brand, one page: /brands/:slug/#shoes.
// The racket comparison tool lives on the racket list. Old /rackets/compare/ URLs go there.
import { defineMiddleware } from 'astro:middleware';
import { url } from './i18n/routes.js';
import { shoeBrands, shoeBrandTarget } from './lib/shoes.js';
const LANGS=['en','es','fr','pt','it','de'];
const redir=new Map();
for(const b of shoeBrands){ const t=shoeBrandTarget(b.slug); if(!t||t.type!=='brand') continue;
  for(const lang of LANGS){ const from=url('shoeBrand',lang,b.slug), to=url('brand',lang,b.slug)+'#shoes'; if(!from) continue; redir.set(from,to); if(from.endsWith('/')) redir.set(from.slice(0,-1),to); } }
const cmp=new Map();
for(const lang of LANGS){ const from=url('compare',lang), to=url('rackets',lang); if(!from||!to) continue; cmp.set(from,to); if(from.endsWith('/')) cmp.set(from.slice(0,-1),to); }
export const onRequest=defineMiddleware((context,next)=>{
  const path=context.url.pathname;
  const shoe=redir.get(path); if(shoe) return context.redirect(shoe,301);
  const list=cmp.get(path); if(list){ const search=new URL(context.request.url).search||context.url.search; return context.redirect(list+search,301); }
  return next();
});
