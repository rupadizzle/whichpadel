// Old shoe-brand URLs for brands that also have rackets. One brand, one page: /brands/:slug/#shoes.
import { defineMiddleware } from 'astro:middleware';
import { url } from './i18n/routes.js';
import { shoeBrands, shoeBrandTarget } from './lib/shoes.js';
const LANGS=['en','es','fr','pt','it','de'];
const redir=new Map();
for(const b of shoeBrands){ const t=shoeBrandTarget(b.slug); if(!t||t.type!=='brand') continue;
  for(const lang of LANGS){ const from=url('shoeBrand',lang,b.slug), to=url('brand',lang,b.slug)+'#shoes'; if(!from) continue; redir.set(from,to); if(from.endsWith('/')) redir.set(from.slice(0,-1),to); } }
export const onRequest=defineMiddleware((context,next)=>{ const to=redir.get(context.url.pathname); if(to) return context.redirect(to,301); return next(); });
