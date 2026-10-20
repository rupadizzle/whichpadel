// Route map: one entry per page type, one path builder per language. Generates hreflang for every page pair + x-default (en).
import { rackets, brandList, players, lists } from '../lib/data.js';
import { extraLists } from '../lib/seo-content.js';
import { vsPairs } from '../lib/vs.js';
import { y27 } from '../lib/extra.js';
export const ALL_LANGS=['en','es','fr','pt'];
export const LANGS=(process.env.WP_LANGS||'en,es,fr,pt').split(',');
export const LOCALE={en:'en-GB',es:'es',fr:'fr',pt:'pt-PT'};
export const LANG_NAME={en:'English',es:'Español',fr:'Français',pt:'Português'};
export const OG_LOCALE={en:'en_GB',es:'es_ES',fr:'fr_FR',pt:'pt_PT'};
export const BEST_SLUG={
 'best-padel-rackets-for-beginners':{es:'palas-padel-principiantes',fr:'raquettes-padel-debutant',pt:'raquetes-padel-iniciantes'},
 'best-control-padel-rackets':{es:'palas-padel-control',fr:'raquettes-padel-controle',pt:'raquetes-padel-controlo'},
 'best-power-padel-rackets':{es:'palas-padel-potencia',fr:'raquettes-padel-puissance',pt:'raquetes-padel-potencia'},
 'best-padel-racket-for-tennis-elbow':{es:'palas-padel-epicondilitis',fr:'raquettes-padel-tennis-elbow',pt:'raquetes-padel-epicondilite'},
 'best-padel-racket-for-tennis-players':{es:'palas-padel-tenistas',fr:'raquettes-padel-joueurs-de-tennis',pt:'raquetes-padel-tenistas'},
 'best-value-padel-rackets':{es:'palas-padel-calidad-precio',fr:'raquettes-padel-rapport-qualite-prix',pt:'raquetes-padel-qualidade-preco'},
 'most-comfortable-padel-rackets':{es:'palas-padel-mas-comodas',fr:'raquettes-padel-les-plus-confortables',pt:'raquetes-padel-mais-confortaveis'},
 'most-powerful-padel-rackets':{es:'palas-padel-mas-potentes',fr:'raquettes-padel-les-plus-puissantes',pt:'raquetes-padel-mais-potentes'},
 'best-padel-rackets-under-100':{es:'palas-padel-menos-de-100-euros',fr:'raquettes-padel-moins-de-100-euros',pt:'raquetes-padel-menos-de-100-euros'},
 'best-padel-racket-2026':{es:'mejores-palas-padel-2026',fr:'meilleures-raquettes-padel-2026',pt:'melhores-raquetes-padel-2026'},
 'best-intermediate-padel-rackets':{es:'palas-padel-nivel-intermedio',fr:'raquettes-padel-niveau-intermediaire',pt:'raquetes-padel-nivel-intermedio'},
 'best-advanced-padel-rackets':{es:'palas-padel-nivel-avanzado',fr:'raquettes-padel-niveau-avance',pt:'raquetes-padel-nivel-avancado'},
 'best-cheap-padel-rackets':{es:'palas-padel-baratas',fr:'raquettes-padel-pas-cheres',pt:'raquetes-padel-baratas'},
 'best-womens-padel-rackets':{es:'palas-padel-mujer',fr:'raquettes-padel-femme',pt:'raquetes-padel-mulher'},
};
export const BEST_KEYS=Object.keys(BEST_SLUG).filter(k=>lists[k]||extraLists[k]);
const P={
 home:{en:()=>'/',es:()=>'/es/',fr:()=>'/fr/',pt:()=>'/pt/'},
 guide:{en:()=>'/padel-rackets/',es:()=>'/es/palas-padel/',fr:()=>'/fr/raquette-padel/',pt:()=>'/pt/raquetes-padel/'},
 compare:{en:()=>'/compare/',es:()=>'/es/comparador-palas-padel/',fr:()=>'/fr/comparateur-raquettes-padel/',pt:()=>'/pt/comparador-raquetes-padel/'},
 bestIndex:{en:()=>'/best/',es:()=>'/es/mejores-palas-padel/',fr:()=>'/fr/meilleures-raquettes-padel/',pt:()=>'/pt/melhores-raquetes-padel/'},
 racket:{en:s=>`/rackets/${s}/`,es:s=>`/es/palas/${s}/`,fr:s=>`/fr/raquettes/${s}/`,pt:s=>`/pt/raquetes/${s}/`},
 brands:{en:()=>'/brands/',es:()=>'/es/marcas/',fr:()=>'/fr/marques/',pt:()=>'/pt/marcas/'},
 brand:{en:s=>`/brands/${s}/`,es:s=>`/es/marcas/${s}/`,fr:s=>`/fr/marques/${s}/`,pt:s=>`/pt/marcas/${s}/`},
 brand2027:{en:s=>`/brands/${s}/2027/`,es:s=>`/es/marcas/${s}/2027/`,fr:s=>`/fr/marques/${s}/2027/`,pt:s=>`/pt/marcas/${s}/2027/`},
 best:{en:k=>`/best/${k}/`,es:k=>`/es/mejores/${BEST_SLUG[k].es}/`,fr:k=>`/fr/meilleures/${BEST_SLUG[k].fr}/`,pt:k=>`/pt/melhores/${BEST_SLUG[k].pt}/`},
 players:{en:()=>'/players/',es:()=>'/es/jugadores/',fr:()=>'/fr/joueurs/',pt:()=>'/pt/jogadores/'},
 player:{en:s=>`/players/${s}/`,es:s=>`/es/jugadores/${s}/`,fr:s=>`/fr/joueurs/${s}/`,pt:s=>`/pt/jogadores/${s}/`},
 vs:{en:s=>`/compare/${s}/`,es:s=>`/es/comparar/${s}/`,fr:s=>`/fr/comparer/${s}/`,pt:s=>`/pt/comparar/${s}/`},
 tool:{en:()=>'/tools/real-weight/',es:()=>'/es/herramientas/peso-real/',fr:()=>'/fr/outils/poids-reel/',pt:()=>'/pt/ferramentas/peso-real/'},
 bf:{en:()=>'/black-friday-padel-rackets/',es:()=>'/es/black-friday-palas-padel/',fr:()=>'/fr/black-friday-raquettes-padel/',pt:()=>'/pt/black-friday-raquetes-padel/'},
 privacy:{en:()=>'/privacy/',es:()=>'/es/privacidad/',fr:()=>'/fr/confidentialite/',pt:()=>'/pt/privacidade/'},
 affiliate:{en:()=>'/affiliate-disclosure/',es:()=>'/es/afiliados/',fr:()=>'/fr/affiliation/',pt:()=>'/pt/afiliados/'},
 about:{en:()=>'/about/',es:()=>'/es/sobre-nosotros/',fr:()=>'/fr/a-propos/',pt:()=>'/pt/sobre-nos/'},
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
