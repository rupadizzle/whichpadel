// Route map: one entry per page type, one path builder per language. Generates hreflang for every page pair + x-default (en).
import { rackets, brandList, players, lists } from '../lib/data.js';
import { extraLists } from '../lib/seo-content.js';
import { vsPairs } from '../lib/vs.js';
import { y27 } from '../lib/extra.js';
export const ALL_LANGS=['en','es','fr'];
export const LANGS=(process.env.WP_LANGS||'en,es,fr').split(',');
export const LOCALE={en:'en-GB',es:'es',fr:'fr'};
export const LANG_NAME={en:'English',es:'Español',fr:'Français'};
export const OG_LOCALE={en:'en_GB',es:'es_ES',fr:'fr_FR'};
export const BEST_SLUG={
 'best-padel-rackets-for-beginners':{es:'palas-padel-principiantes',fr:'raquettes-padel-debutant'},
 'best-control-padel-rackets':{es:'palas-padel-control',fr:'raquettes-padel-controle'},
 'best-power-padel-rackets':{es:'palas-padel-potencia',fr:'raquettes-padel-puissance'},
 'best-padel-racket-for-tennis-elbow':{es:'palas-padel-epicondilitis',fr:'raquettes-padel-tennis-elbow'},
 'best-padel-racket-for-tennis-players':{es:'palas-padel-tenistas',fr:'raquettes-padel-joueurs-de-tennis'},
 'best-value-padel-rackets':{es:'palas-padel-calidad-precio',fr:'raquettes-padel-rapport-qualite-prix'},
 'most-comfortable-padel-rackets':{es:'palas-padel-mas-comodas',fr:'raquettes-padel-les-plus-confortables'},
 'most-powerful-padel-rackets':{es:'palas-padel-mas-potentes',fr:'raquettes-padel-les-plus-puissantes'},
 'best-padel-rackets-under-100':{es:'palas-padel-menos-de-100-euros',fr:'raquettes-padel-moins-de-100-euros'},
 'best-padel-racket-2026':{es:'mejores-palas-padel-2026',fr:'meilleures-raquettes-padel-2026'},
 'best-intermediate-padel-rackets':{es:'palas-padel-nivel-intermedio',fr:'raquettes-padel-niveau-intermediaire'},
 'best-advanced-padel-rackets':{es:'palas-padel-nivel-avanzado',fr:'raquettes-padel-niveau-avance'},
 'best-cheap-padel-rackets':{es:'palas-padel-baratas',fr:'raquettes-padel-pas-cheres'},
 'best-womens-padel-rackets':{es:'palas-padel-mujer',fr:'raquettes-padel-femme'},
};
export const BEST_KEYS=Object.keys(BEST_SLUG).filter(k=>lists[k]||extraLists[k]);
const P={
 home:{en:()=>'/',es:()=>'/es/',fr:()=>'/fr/'},
 guide:{en:()=>'/padel-rackets/',es:()=>'/es/palas-padel/',fr:()=>'/fr/raquette-padel/'},
 compare:{en:()=>'/compare/',es:()=>'/es/comparador-palas-padel/',fr:()=>'/fr/comparateur-raquettes-padel/'},
 bestIndex:{en:()=>'/best/',es:()=>'/es/mejores-palas-padel/',fr:()=>'/fr/meilleures-raquettes-padel/'},
 racket:{en:s=>`/rackets/${s}/`,es:s=>`/es/palas/${s}/`,fr:s=>`/fr/raquettes/${s}/`},
 brands:{en:()=>'/brands/',es:()=>'/es/marcas/',fr:()=>'/fr/marques/'},
 brand:{en:s=>`/brands/${s}/`,es:s=>`/es/marcas/${s}/`,fr:s=>`/fr/marques/${s}/`},
 brand2027:{en:s=>`/brands/${s}/2027/`,es:s=>`/es/marcas/${s}/2027/`,fr:s=>`/fr/marques/${s}/2027/`},
 best:{en:k=>`/best/${k}/`,es:k=>`/es/mejores/${BEST_SLUG[k].es}/`,fr:k=>`/fr/meilleures/${BEST_SLUG[k].fr}/`},
 players:{en:()=>'/players/',es:()=>'/es/jugadores/',fr:()=>'/fr/joueurs/'},
 player:{en:s=>`/players/${s}/`,es:s=>`/es/jugadores/${s}/`,fr:s=>`/fr/joueurs/${s}/`},
 vs:{en:s=>`/compare/${s}/`,es:s=>`/es/comparar/${s}/`,fr:s=>`/fr/comparer/${s}/`},
 tool:{en:()=>'/tools/real-weight/',es:()=>'/es/herramientas/peso-real/',fr:()=>'/fr/outils/poids-reel/'},
 bf:{en:()=>'/black-friday-padel-rackets/',es:()=>'/es/black-friday-palas-padel/',fr:()=>'/fr/black-friday-raquettes-padel/'},
 privacy:{en:()=>'/privacy/',es:()=>'/es/privacidad/',fr:()=>'/fr/confidentialite/'},
 affiliate:{en:()=>'/affiliate-disclosure/',es:()=>'/es/afiliados/',fr:()=>'/fr/affiliation/'},
 about:{en:()=>'/about/',es:()=>'/es/sobre-nosotros/',fr:()=>'/fr/a-propos/'},
};
export const url=(type,lang,id)=>P[type][lang]?P[type][lang](id):null;
export const pages=()=>{const out=[]; const add=(type,id)=>out.push({type,id});
 ['home','guide','compare','bestIndex','brands','players','tool','bf','privacy','affiliate','about'].forEach(t=>add(t));
 rackets.forEach(r=>add('racket',r.slug)); brandList.forEach(b=>add('brand',b.slug)); y27.forEach(b=>add('brand2027',b.slug));
 BEST_KEYS.forEach(k=>add('best',k)); [...new Set(players.map(p=>p.slug))].forEach(s=>add('player',s)); vsPairs.forEach(v=>add('vs',v.slug)); return out;};
// reverse map for hreflang on any page
let REV=null;
export function alternates(pathname){ if(!REV){REV={}; for(const p of pages()){const set=Object.fromEntries(LANGS.map(l=>[l,url(p.type,l,p.id)]).filter(x=>x[1])); for(const u of Object.values(set)) REV[u]=set;}}
 return REV[pathname]||null; }
export const langOf=pathname=>LANGS.find(l=>l!=='en'&&(pathname.startsWith('/'+l+'/')||pathname==='/'+l))||'en';
