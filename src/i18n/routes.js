// Route map: one entry per page type, one path builder per language. Generates hreflang for every page pair + x-default (en).
import { rackets, brandList, players, lists } from '../lib/data.js';
import { extraLists } from '../lib/seo-content.js';
import { vsPairs } from '../lib/vs.js';
import { y27 } from '../lib/extra.js';
export const ALL_LANGS=['en','es','fr','pt','it','de'];
export const LANGS=(process.env.WP_LANGS||'en,es,fr,pt,it,de').split(',');
export const LOCALE={en:'en-GB',es:'es',fr:'fr',pt:'pt-PT',it:'it-IT',de:'de-DE'};
export const LANG_NAME={en:'English',es:'Español',fr:'Français',pt:'Português',it:'Italiano',de:'Deutsch'};
export const OG_LOCALE={en:'en_GB',es:'es_ES',fr:'fr_FR',pt:'pt_PT',it:'it_IT',de:'de_DE'};
export const BEST_SLUG={
 'best-padel-rackets-for-beginners':{es:'palas-padel-principiantes',fr:'raquettes-padel-debutant',pt:'raquetes-padel-iniciantes',it:'racchette-padel-principianti',de:'padelschlaeger-einsteiger'},
 'best-control-padel-rackets':{es:'palas-padel-control',fr:'raquettes-padel-controle',pt:'raquetes-padel-controlo',it:'racchette-padel-controllo',de:'padelschlaeger-kontrolle'},
 'best-power-padel-rackets':{es:'palas-padel-potencia',fr:'raquettes-padel-puissance',pt:'raquetes-padel-potencia',it:'racchette-padel-potenza',de:'padelschlaeger-kraft'},
 'best-padel-racket-for-tennis-elbow':{es:'palas-padel-epicondilitis',fr:'raquettes-padel-tennis-elbow',pt:'raquetes-padel-epicondilite',it:'racchette-padel-epicondilite',de:'padelschlaeger-tennisarm'},
 'best-padel-racket-for-tennis-players':{es:'palas-padel-tenistas',fr:'raquettes-padel-joueurs-de-tennis',pt:'raquetes-padel-tenistas',it:'racchette-padel-tennisti',de:'padelschlaeger-tennisspieler'},
 'best-value-padel-rackets':{es:'palas-padel-calidad-precio',fr:'raquettes-padel-rapport-qualite-prix',pt:'raquetes-padel-qualidade-preco',it:'racchette-padel-qualita-prezzo',de:'padelschlaeger-preis-leistung'},
 'most-comfortable-padel-rackets':{es:'palas-padel-mas-comodas',fr:'raquettes-padel-les-plus-confortables',pt:'raquetes-padel-mais-confortaveis',it:'racchette-padel-piu-confortevoli',de:'komfortabelste-padelschlaeger'},
 'most-powerful-padel-rackets':{es:'palas-padel-mas-potentes',fr:'raquettes-padel-les-plus-puissantes',pt:'raquetes-padel-mais-potentes',it:'racchette-padel-piu-potenti',de:'kraftvollste-padelschlaeger'},
 'best-padel-rackets-under-100':{es:'palas-padel-menos-de-100-euros',fr:'raquettes-padel-moins-de-100-euros',pt:'raquetes-padel-menos-de-100-euros',it:'racchette-padel-sotto-100-euro',de:'padelschlaeger-unter-100-euro'},
 'best-padel-rackets-under-150':{es:'palas-padel-menos-de-150-euros',fr:'raquettes-padel-moins-de-150-euros',pt:'raquetes-padel-menos-de-150-euros',it:'racchette-padel-sotto-150-euro',de:'padelschlaeger-unter-150-euro'},
 'best-padel-rackets-under-200':{es:'palas-padel-menos-de-200-euros',fr:'raquettes-padel-moins-de-200-euros',pt:'raquetes-padel-menos-de-200-euros',it:'racchette-padel-sotto-200-euro',de:'padelschlaeger-unter-200-euro'},
 'best-padel-racket-2026':{es:'mejores-palas-padel-2026',fr:'meilleures-raquettes-padel-2026',pt:'melhores-raquetes-padel-2026',it:'migliori-racchette-padel-2026',de:'beste-padelschlaeger-2026'},
 'best-intermediate-padel-rackets':{es:'palas-padel-nivel-intermedio',fr:'raquettes-padel-niveau-intermediaire',pt:'raquetes-padel-nivel-intermedio',it:'racchette-padel-livello-intermedio',de:'padelschlaeger-fortgeschrittene'},
 'best-advanced-padel-rackets':{es:'palas-padel-nivel-avanzado',fr:'raquettes-padel-niveau-avance',pt:'raquetes-padel-nivel-avancado',it:'racchette-padel-livello-avanzato',de:'padelschlaeger-starke-spieler'},
 'best-cheap-padel-rackets':{es:'palas-padel-baratas',fr:'raquettes-padel-pas-cheres',pt:'raquetes-padel-baratas',it:'racchette-padel-economiche',de:'guenstige-padelschlaeger'},
 'best-womens-padel-rackets':{es:'palas-padel-mujer',fr:'raquettes-padel-femme',pt:'raquetes-padel-mulher',it:'racchette-padel-donna',de:'padelschlaeger-damen'},
 'best-round-padel-rackets':{'es':'palas-padel-redondas','fr':'raquettes-padel-rondes','pt':'raquetes-padel-redondas','it':'racchette-padel-rotonde','de':'runde-padelschlaeger'},
 'best-teardrop-padel-rackets':{'es':'palas-padel-lagrima','fr':'raquettes-padel-goutte-d-eau','pt':'raquetes-padel-lagrima','it':'racchette-padel-a-goccia','de':'padelschlaeger-tropfenform'},
 'best-diamond-padel-rackets':{'es':'palas-padel-diamante','fr':'raquettes-padel-diamant','pt':'raquetes-padel-diamante','it':'racchette-padel-a-diamante','de':'padelschlaeger-diamantform'},
 'best-hybrid-padel-rackets':{'es':'palas-padel-hibridas','fr':'raquettes-padel-hybrides','pt':'raquetes-padel-hibridas','it':'racchette-padel-ibride','de':'padelschlaeger-hybridform'},
};
export const SHAPE_KEYS=['round','teardrop','diamond','hybrid'].map(s=>`best-${s}-padel-rackets`);
export const BEST_KEYS=Object.keys(BEST_SLUG).filter(k=>lists[k]||extraLists[k]);
const P={
 home:{en:()=>'/',es:()=>'/es/',fr:()=>'/fr/',pt:()=>'/pt/',it:()=>'/it/',de:()=>'/de/'},
 guide:{en:()=>'/padel-rackets/',es:()=>'/es/palas-padel/',fr:()=>'/fr/raquette-padel/',pt:()=>'/pt/raquetes-padel/',it:()=>'/it/racchette-padel/',de:()=>'/de/padelschlaeger/'},
 compare:{en:()=>'/compare/',es:()=>'/es/comparador-palas-padel/',fr:()=>'/fr/comparateur-raquettes-padel/',pt:()=>'/pt/comparador-raquetes-padel/',it:()=>'/it/confronto-racchette-padel/',de:()=>'/de/padelschlaeger-vergleich/'},
 bestIndex:{en:()=>'/best/',es:()=>'/es/mejores-palas-padel/',fr:()=>'/fr/meilleures-raquettes-padel/',pt:()=>'/pt/melhores-raquetes-padel/',it:()=>'/it/migliori-racchette-padel/',de:()=>'/de/beste-padelschlaeger/'},
 racket:{en:s=>`/rackets/${s}/`,es:s=>`/es/palas/${s}/`,fr:s=>`/fr/raquettes/${s}/`,pt:s=>`/pt/raquetes/${s}/`,it:s=>`/it/racchette/${s}/`,de:s=>`/de/schlaeger/${s}/`},
 brands:{en:()=>'/brands/',es:()=>'/es/marcas/',fr:()=>'/fr/marques/',pt:()=>'/pt/marcas/',it:()=>'/it/marchi/',de:()=>'/de/marken/'},
 brand:{en:s=>`/brands/${s}/`,es:s=>`/es/marcas/${s}/`,fr:s=>`/fr/marques/${s}/`,pt:s=>`/pt/marcas/${s}/`,it:s=>`/it/marchi/${s}/`,de:s=>`/de/marken/${s}/`},
 brand2027:{en:s=>`/brands/${s}/2027/`,es:s=>`/es/marcas/${s}/2027/`,fr:s=>`/fr/marques/${s}/2027/`,pt:s=>`/pt/marcas/${s}/2027/`,it:s=>`/it/marchi/${s}/2027/`,de:s=>`/de/marken/${s}/2027/`},
 best:{en:k=>`/best/${k}/`,es:k=>`/es/mejores/${BEST_SLUG[k].es}/`,fr:k=>`/fr/meilleures/${BEST_SLUG[k].fr}/`,pt:k=>`/pt/melhores/${BEST_SLUG[k].pt}/`,it:k=>`/it/migliori/${BEST_SLUG[k].it}/`,de:k=>`/de/beste/${BEST_SLUG[k].de}/`},
 players:{en:()=>'/players/',es:()=>'/es/jugadores/',fr:()=>'/fr/joueurs/',pt:()=>'/pt/jogadores/',it:()=>'/it/giocatori/',de:()=>'/de/spieler/'},
 player:{en:s=>`/players/${s}/`,es:s=>`/es/jugadores/${s}/`,fr:s=>`/fr/joueurs/${s}/`,pt:s=>`/pt/jogadores/${s}/`,it:s=>`/it/giocatori/${s}/`,de:s=>`/de/spieler/${s}/`},
 vs:{en:s=>`/compare/${s}/`,es:s=>`/es/comparar/${s}/`,fr:s=>`/fr/comparer/${s}/`,pt:s=>`/pt/comparar/${s}/`,it:s=>`/it/confronto/${s}/`,de:s=>`/de/vergleich/${s}/`},
 tool:{en:()=>'/tools/real-weight/',es:()=>'/es/herramientas/peso-real/',fr:()=>'/fr/outils/poids-reel/',pt:()=>'/pt/ferramentas/peso-real/',it:()=>'/it/strumenti/peso-reale/',de:()=>'/de/tools/echtes-gewicht/'},
 bf:{en:()=>'/black-friday-padel-rackets/',es:()=>'/es/black-friday-palas-padel/',fr:()=>'/fr/black-friday-raquettes-padel/',pt:()=>'/pt/black-friday-raquetes-padel/',it:()=>'/it/black-friday-racchette-padel/',de:()=>'/de/black-friday-padelschlaeger/'},
 privacy:{en:()=>'/privacy/',es:()=>'/es/privacidad/',fr:()=>'/fr/confidentialite/',pt:()=>'/pt/privacidade/',it:()=>'/it/privacy/',de:()=>'/de/datenschutz/'},
 affiliate:{en:()=>'/affiliate-disclosure/',es:()=>'/es/afiliados/',fr:()=>'/fr/affiliation/',pt:()=>'/pt/afiliados/',it:()=>'/it/affiliazione/',de:()=>'/de/affiliate-hinweis/'},
 about:{en:()=>'/about/',es:()=>'/es/sobre-nosotros/',fr:()=>'/fr/a-propos/',pt:()=>'/pt/sobre-nos/',it:()=>'/it/chi-siamo/',de:()=>'/de/ueber-uns/'},
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
