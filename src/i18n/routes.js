// Route map: one entry per page type, one path builder per language. Generates hreflang for every page pair + x-default (en).
import { rackets, brandList, players, lists } from '../lib/data.js';
import { extraLists } from '../lib/seo-content.js';
import { vsPairs } from '../lib/vs.js';
import { y27 } from '../lib/extra.js';
export const ALL_LANGS=['en','es','fr','pt','it'];
export const LANGS=(process.env.WP_LANGS||'en,es,fr,pt,it').split(',');
export const LOCALE={en:'en-GB',es:'es',fr:'fr',pt:'pt-PT',it:'it-IT'};
export const LANG_NAME={en:'English',es:'Español',fr:'Français',pt:'Português',it:'Italiano'};
export const OG_LOCALE={en:'en_GB',es:'es_ES',fr:'fr_FR',pt:'pt_PT',it:'it_IT'};
export const BEST_SLUG={
 'best-padel-rackets-for-beginners':{es:'palas-padel-principiantes',fr:'raquettes-padel-debutant',pt:'raquetes-padel-iniciantes',it:'racchette-padel-principianti'},
 'best-control-padel-rackets':{es:'palas-padel-control',fr:'raquettes-padel-controle',pt:'raquetes-padel-controlo',it:'racchette-padel-controllo'},
 'best-power-padel-rackets':{es:'palas-padel-potencia',fr:'raquettes-padel-puissance',pt:'raquetes-padel-potencia',it:'racchette-padel-potenza'},
 'best-padel-racket-for-tennis-elbow':{es:'palas-padel-epicondilitis',fr:'raquettes-padel-tennis-elbow',pt:'raquetes-padel-epicondilite',it:'racchette-padel-epicondilite'},
 'best-padel-racket-for-tennis-players':{es:'palas-padel-tenistas',fr:'raquettes-padel-joueurs-de-tennis',pt:'raquetes-padel-tenistas',it:'racchette-padel-tennisti'},
 'best-value-padel-rackets':{es:'palas-padel-calidad-precio',fr:'raquettes-padel-rapport-qualite-prix',pt:'raquetes-padel-qualidade-preco',it:'racchette-padel-qualita-prezzo'},
 'most-comfortable-padel-rackets':{es:'palas-padel-mas-comodas',fr:'raquettes-padel-les-plus-confortables',pt:'raquetes-padel-mais-confortaveis',it:'racchette-padel-piu-confortevoli'},
 'most-powerful-padel-rackets':{es:'palas-padel-mas-potentes',fr:'raquettes-padel-les-plus-puissantes',pt:'raquetes-padel-mais-potentes',it:'racchette-padel-piu-potenti'},
 'best-padel-rackets-under-100':{es:'palas-padel-menos-de-100-euros',fr:'raquettes-padel-moins-de-100-euros',pt:'raquetes-padel-menos-de-100-euros',it:'racchette-padel-sotto-100-euro'},
 'best-padel-racket-2026':{es:'mejores-palas-padel-2026',fr:'meilleures-raquettes-padel-2026',pt:'melhores-raquetes-padel-2026',it:'migliori-racchette-padel-2026'},
 'best-intermediate-padel-rackets':{es:'palas-padel-nivel-intermedio',fr:'raquettes-padel-niveau-intermediaire',pt:'raquetes-padel-nivel-intermedio',it:'racchette-padel-livello-intermedio'},
 'best-advanced-padel-rackets':{es:'palas-padel-nivel-avanzado',fr:'raquettes-padel-niveau-avance',pt:'raquetes-padel-nivel-avancado',it:'racchette-padel-livello-avanzato'},
 'best-cheap-padel-rackets':{es:'palas-padel-baratas',fr:'raquettes-padel-pas-cheres',pt:'raquetes-padel-baratas',it:'racchette-padel-economiche'},
 'best-womens-padel-rackets':{es:'palas-padel-mujer',fr:'raquettes-padel-femme',pt:'raquetes-padel-mulher',it:'racchette-padel-donna'},
};
export const BEST_KEYS=Object.keys(BEST_SLUG).filter(k=>lists[k]||extraLists[k]);
const P={
 home:{en:()=>'/',es:()=>'/es/',fr:()=>'/fr/',pt:()=>'/pt/',it:()=>'/it/'},
 guide:{en:()=>'/padel-rackets/',es:()=>'/es/palas-padel/',fr:()=>'/fr/raquette-padel/',pt:()=>'/pt/raquetes-padel/',it:()=>'/it/racchette-padel/'},
 compare:{en:()=>'/compare/',es:()=>'/es/comparador-palas-padel/',fr:()=>'/fr/comparateur-raquettes-padel/',pt:()=>'/pt/comparador-raquetes-padel/',it:()=>'/it/confronto-racchette-padel/'},
 bestIndex:{en:()=>'/best/',es:()=>'/es/mejores-palas-padel/',fr:()=>'/fr/meilleures-raquettes-padel/',pt:()=>'/pt/melhores-raquetes-padel/',it:()=>'/it/migliori-racchette-padel/'},
 racket:{en:s=>`/rackets/${s}/`,es:s=>`/es/palas/${s}/`,fr:s=>`/fr/raquettes/${s}/`,pt:s=>`/pt/raquetes/${s}/`,it:s=>`/it/racchette/${s}/`},
 brands:{en:()=>'/brands/',es:()=>'/es/marcas/',fr:()=>'/fr/marques/',pt:()=>'/pt/marcas/',it:()=>'/it/marchi/'},
 brand:{en:s=>`/brands/${s}/`,es:s=>`/es/marcas/${s}/`,fr:s=>`/fr/marques/${s}/`,pt:s=>`/pt/marcas/${s}/`,it:s=>`/it/marchi/${s}/`},
 brand2027:{en:s=>`/brands/${s}/2027/`,es:s=>`/es/marcas/${s}/2027/`,fr:s=>`/fr/marques/${s}/2027/`,pt:s=>`/pt/marcas/${s}/2027/`,it:s=>`/it/marchi/${s}/2027/`},
 best:{en:k=>`/best/${k}/`,es:k=>`/es/mejores/${BEST_SLUG[k].es}/`,fr:k=>`/fr/meilleures/${BEST_SLUG[k].fr}/`,pt:k=>`/pt/melhores/${BEST_SLUG[k].pt}/`,it:k=>`/it/migliori/${BEST_SLUG[k].it}/`},
 players:{en:()=>'/players/',es:()=>'/es/jugadores/',fr:()=>'/fr/joueurs/',pt:()=>'/pt/jogadores/',it:()=>'/it/giocatori/'},
 player:{en:s=>`/players/${s}/`,es:s=>`/es/jugadores/${s}/`,fr:s=>`/fr/joueurs/${s}/`,pt:s=>`/pt/jogadores/${s}/`,it:s=>`/it/giocatori/${s}/`},
 vs:{en:s=>`/compare/${s}/`,es:s=>`/es/comparar/${s}/`,fr:s=>`/fr/comparer/${s}/`,pt:s=>`/pt/comparar/${s}/`,it:s=>`/it/confronto/${s}/`},
 tool:{en:()=>'/tools/real-weight/',es:()=>'/es/herramientas/peso-real/',fr:()=>'/fr/outils/poids-reel/',pt:()=>'/pt/ferramentas/peso-real/',it:()=>'/it/strumenti/peso-reale/'},
 bf:{en:()=>'/black-friday-padel-rackets/',es:()=>'/es/black-friday-palas-padel/',fr:()=>'/fr/black-friday-raquettes-padel/',pt:()=>'/pt/black-friday-raquetes-padel/',it:()=>'/it/black-friday-racchette-padel/'},
 privacy:{en:()=>'/privacy/',es:()=>'/es/privacidad/',fr:()=>'/fr/confidentialite/',pt:()=>'/pt/privacidade/',it:()=>'/it/privacy/'},
 affiliate:{en:()=>'/affiliate-disclosure/',es:()=>'/es/afiliados/',fr:()=>'/fr/affiliation/',pt:()=>'/pt/afiliados/',it:()=>'/it/affiliazione/'},
 about:{en:()=>'/about/',es:()=>'/es/sobre-nosotros/',fr:()=>'/fr/a-propos/',pt:()=>'/pt/sobre-nos/',it:()=>'/it/chi-siamo/'},
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
