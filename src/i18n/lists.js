import { rackets, lists } from '../lib/data.js'; import { extraLists } from '../lib/seo-content.js'; import { Pnum, D } from './index.js';
const ALL={...lists,...extraLists};
import { offersOf } from '../lib/price.js';
const shops=r=>new Set(offersOf(r).map(o=>o.d)).size;
// Shared tie-separators: newer models and rackets sold at 2+ shops rank a little higher. Spec ratings are never changed.
const adj=r=>Math.min(4,Math.max(0,(r.year||2023)-2023))*1.5+(shops(r)>=2?3:0);
const R=r=>r.ratings; const gen=r=>r.audience!=='women'&&r.audience!=='junior';
const SPEC={
 under:(cap,lang)=>({f:r=>{const p=Pnum(r,lang);return gen(r)&&p!=null&&p<=cap&&p>=cap*0.4},s:r=>0.65*(R(r).power+R(r).control+R(r).handling+R(r).forgiveness+R(r).comfort)/5+0.35*Math.min(R(r).power,R(r).control)+Pnum(r,lang)/cap*8,k:['power','control','comfort']}),
 'best-padel-rackets-for-beginners':{f:r=>gen(r)&&r.shape==='round'&&['soft','medium-soft','medium'].includes(r.coreHardness)&&(r.priceGBPApprox==null||r.priceGBPApprox<=140),s:r=>0.45*R(r).forgiveness+0.35*R(r).handling+0.2*R(r).control,k:['forgiveness','handling','control']},
 'best-padel-racket-for-tennis-elbow':{f:r=>gen(r)&&r.coreHardness==='soft'&&['round','teardrop'].includes(r.shape)&&r.balance!=='high'&&r.weightMax!=null&&r.weightMax<=365,s:r=>0.6*R(r).comfort+0.2*R(r).forgiveness+(365-r.weightMax)*0.6+(r.shape==='round'?3:0),k:['comfort','forgiveness','handling']},
 'most-comfortable-padel-rackets':{k:['comfort','forgiveness','handling']},
 'best-control-padel-rackets':{k:['control','handling','forgiveness']},
 'best-cheap-padel-rackets':{k:['forgiveness','comfort','control']},
};
const RULE={
 under:{en:'Recorded price between 40% of the budget and the budget itself, adult models only. Score blends the five spec ratings with the weaker of power and control (so all-rounders beat one-trick rackets), plus a bonus for using more of the budget.',es:'Precio registrado entre el 40 % del presupuesto y el presupuesto, solo modelos de adulto. Puntuación = media de las cinco valoraciones más un extra por aprovechar el presupuesto.',pt:'Preço registado entre 40% do orçamento e o orçamento, apenas modelos de adulto. Pontuação = média das cinco avaliações mais um bónus por aproveitar o orçamento.',fr:'Prix relevé entre 40 % du budget et le budget, modèles adultes uniquement. Score = moyenne des cinq notes plus un bonus pour l’usage du budget.',it:'Prezzo rilevato tra il 40% del budget e il budget, solo modelli per adulti. Punteggio = media delle cinque valutazioni più un bonus per l’uso del budget.',de:'Erfasster Preis zwischen 40 % des Budgets und dem Budget, nur Erwachsenenmodelle. Wert = Mittel der fünf Bewertungen plus Bonus für die Budgetnutzung.'},
 'best-padel-rackets-for-beginners':{en:'Round shape, soft to medium core, recorded price up to ⟦b|140|GBP|GBP⟧, adult models. Score = 45% forgiveness, 35% handling, 20% control.',es:'Forma redonda, núcleo blando a medio, precio hasta ⟦b|140|GBP|GBP⟧, modelos de adulto. Puntuación = 45 % tolerancia, 35 % manejo, 20 % control.',pt:'Forma redonda, núcleo macio a médio, preço até ⟦b|140|GBP|GBP⟧, modelos de adulto. Pontuação = 45% tolerância, 35% manuseamento, 20% controlo.',fr:'Forme ronde, noyau souple à moyen, prix jusqu’à ⟦b|140|GBP|GBP⟧, modèles adultes. Score = 45 % tolérance, 35 % maniabilité, 20 % contrôle.',it:'Forma rotonda, nucleo da morbido a medio, prezzo fino a ⟦b|140|GBP|GBP⟧, modelli per adulti. Punteggio = 45% tolleranza, 35% maneggevolezza, 20% controllo.',de:'Runde Form, weicher bis mittlerer Kern, Preis bis ⟦b|140|GBP|GBP⟧, Erwachsenenmodelle. Wert = 45 % Fehlertoleranz, 35 % Handling, 20 % Kontrolle.'},
 'best-padel-racket-for-tennis-elbow':{en:'Soft core, round or teardrop shape, not head-heavy, published weight 365 g or less, adult models. Score = 60% comfort, 20% forgiveness, plus a bonus for lower weight and a round head.',es:'Núcleo blando, forma redonda o lágrima, sin balance alto, peso publicado de 365 g o menos, modelos de adulto. Puntuación = 60 % confort, 20 % tolerancia y un extra por menor peso y forma redonda.',pt:'Núcleo macio, forma redonda ou lágrima, sem equilíbrio alto, peso publicado até 365 g, modelos de adulto. Pontuação = 60% conforto, 20% tolerância e um bónus por menor peso e forma redonda.',fr:'Noyau souple, forme ronde ou goutte, équilibre non haut, poids publié de 365 g maximum, modèles adultes. Score = 60 % confort, 20 % tolérance, plus un bonus pour un poids plus faible et une forme ronde.',it:'Nucleo morbido, forma rotonda o a goccia, bilanciamento non alto, peso pubblicato fino a 365 g, modelli per adulti. Punteggio = 60% comfort, 20% tolleranza, più un bonus per peso minore e forma rotonda.',de:'Weicher Kern, runde oder Tropfenform, keine hohe Balance, angegebenes Gewicht bis 365 g, Erwachsenenmodelle. Wert = 60 % Komfort, 20 % Fehlertoleranz plus Bonus für geringeres Gewicht und runde Form.'},
};
const NOTE={en:' At most 2 per brand in the top 10. Newer models and rackets sold at 2+ shops get a small boost. Guide score: 100 = top of this list.',es:' Máximo 2 por marca en el top 10. Los modelos más nuevos y las palas en 2+ tiendas suben un poco. Nota de la guía: 100 = la mejor de esta lista.',pt:' No máximo 2 por marca no top 10. Modelos mais recentes e raquetes à venda em 2+ lojas sobem um pouco. Nota do guia: 100 = a melhor desta lista.',fr:' Les modèles récents et les raquettes vendues dans 2+ boutiques gagnent un léger bonus. Score du guide : 100 = la meilleure de cette liste.',it:' I modelli più recenti e le racchette in vendita in 2+ negozi salgono un po’. Punteggio guida: 100 = la migliore di questa lista.',de:' Neuere Modelle und Schläger bei 2+ Shops erhalten einen kleinen Bonus. Guide-Wert: 100 = Spitze dieser Liste.'};
const specOf=(k,lang)=>{const um=k.match(/^best-padel-rackets-under-(\d+)$/); return um?SPEC.under(+um[1],lang):SPEC[k]};
export function ruleL(k,lang,orig){const um=/^best-padel-rackets-under-\d+$/.test(k); const r=(um?RULE.under:RULE[k])?.[lang]; return (r||orig)+(NOTE[lang]||NOTE.en);}
export const keysL=k=>specOf(k,'en')?.k||['power','control','forgiveness'];
const FIVE=['power','control','handling','forgiveness','comfort'];
const rate=id=>({id,v:r=>r.ratings?.[id]});
const sum=(id,ks)=>({id,v:r=>ks.reduce((a,k)=>a+(r.ratings?.[k]||0),0)});
const price={id:'price',low:true,v:r=>r.priceGBPApprox==null?null:r.priceGBPApprox};
const weight={id:'weight',low:true,v:r=>r.weightMax??r.weightMin??null};
const weightMin={id:'weight',low:true,v:r=>r.weightMin??r.weightMax??null};
const yearS={id:'year',v:r=>r.year||0};
const all={id:'all',v:r=>FIVE.reduce((a,k)=>a+(r.ratings?.[k]||0),0)/5};
const women={id:'women',v:r=>r.audience==='women'?1:0};
const men={id:'men',v:r=>r.audience==='men'?1:0};
const junior={id:'junior',v:r=>r.audience==='junior'?1:0};
const round={id:'round',v:r=>r.shape==='round'?1:0};
const scoreOf=fn=>({id:'score',v:fn});
const yearPts=r=>Math.min(4,Math.max(0,(r.year||2023)-2023))*1.5;
const shopPts=r=>shops(r)>=2?3:0;
function stepsFor(k,lang){
 const um=k.match(/^best-padel-rackets-under-(\d+)$/);
 if(um){const cap=+um[1]; return [scoreOf(r=>0.65*(R(r).power+R(r).control+R(r).handling+R(r).forgiveness+R(r).comfort)/5+0.35*Math.min(R(r).power,R(r).control)+(Pnum(r,lang)??0)/cap*8)];}
 const map={
  'best-padel-rackets-for-beginners':[rate('forgiveness'),rate('handling'),rate('control'),scoreOf(r=>0.45*R(r).forgiveness+0.35*R(r).handling+0.2*R(r).control)],
  'best-padel-racket-for-tennis-elbow':[rate('comfort'),rate('forgiveness'),weight,round,scoreOf(r=>0.6*R(r).comfort+0.2*R(r).forgiveness+(365-(r.weightMax??365))*0.6+(r.shape==='round'?3:0))],
  'best-control-padel-rackets':[rate('control'),rate('handling')],
  'best-power-padel-rackets':[rate('power'),price],
  'best-padel-racket-for-tennis-players':[sum('forgiveness+handling',['forgiveness','handling']),rate('control')],
  'best-value-padel-rackets':[rate('value')],
  'most-comfortable-padel-rackets':[rate('comfort'),rate('forgiveness')],
  'most-powerful-padel-rackets':[rate('power'),rate('handling')],
  'best-padel-racket-2026':[all,rate('value')],
  'best-intermediate-padel-rackets':[sum('power+control',['power','control']),rate('forgiveness')],
  'best-advanced-padel-rackets':[sum('power+handling',['power','handling']),rate('control')],
  'best-cheap-padel-rackets':[sum('forgiveness+comfort+value',['forgiveness','comfort','value']),price],
  'best-womens-padel-rackets':[sum('handling+forgiveness+comfort',['handling','forgiveness','comfort']),women,weightMin],
  'best-mens-padel-rackets':[all,sum('power+control',['power','control']),men,rate('value')],
  'best-round-padel-rackets':[all,rate('value')],
  'best-teardrop-padel-rackets':[all,rate('value')],
  'best-diamond-padel-rackets':[all,rate('value')],
  'best-hybrid-padel-rackets':[all,rate('value')],
  'best-lightweight-padel-rackets':[sum('handling+comfort',['handling','comfort']),weight],
  'best-carbon-padel-rackets':[all,rate('value')],
  'best-junior-padel-rackets':[junior,weight,sum('handling+forgiveness',['handling','forgiveness'])],
  'best-pro-padel-rackets':[all,yearS],
  'best-soft-padel-rackets':[sum('comfort+forgiveness',['comfort','forgiveness']),rate('control')],
  'best-hard-padel-rackets':[sum('power+control',['power','control']),rate('handling')],
 };
 return map[k]||[rate('power'),rate('control'),rate('forgiveness')];
}
const shownN=n=>Math.abs(n-Math.round(n))<0.05?String(Math.round(n)):n.toFixed(1);
function edge(win,lose,steps){
 let tied=null;
 for(const s of steps){const wv=s.v(win.r),lv=s.v(lose.r); if(wv==null||lv==null) continue; if(shownN(wv)===shownN(lv)){if(!FLAG.has(s.id)) tied={id:s.id,v:wv}; continue;} const winBetter=s.low?wv<lv:wv>lv; if(winBetter) return {id:s.id,win:wv,lose:lv,low:!!s.low,tie:tied&&tied.id!==s.id?tied:null};}
 return null;
}
function boostVia(winner,loser){
 const y=yearPts(winner.r)-yearPts(loser.r), s=shopPts(winner.r)-shopPts(loser.r);
 if(y<=0&&s<=0) return null;
 return y>=s?{via:'year',year:winner.r.year}:{via:'shops'};
}
function leadFact(cur,nxt,steps){
 if(!nxt) return {t:'leadPlain'};
 if(cur.pre>nxt.pre+1e-9){const e=edge(cur,nxt,steps); if(e) return {t:'lead',id:e.id,mine:e.win,low:e.low,tie:e.tie}; if(cur.r.audience==='junior') return {t:'lead',id:'junior'}; return {t:'leadPlain'};}
 const via=boostVia(cur,nxt), e=edge(nxt,cur,steps);
 return via?{t:'leadBoost',...(e?{id:e.id,mine:e.lose,above:e.win,low:e.low}:{}),...via}:{t:'leadPlain'};
}
function pairFact(above,cur,steps){
 const same=()=>{const s=steps.find(st=>!FLAG.has(st.id)&&st.v(above.r)!=null&&st.v(cur.r)!=null&&shownN(st.v(above.r))===shownN(st.v(cur.r))); if(s) return {t:'same',id:s.id,mine:s.v(above.r)}; const f=steps.find(st=>FLAG.has(st.id)&&st.v(above.r)&&shownN(st.v(above.r))===shownN(st.v(cur.r))); return f?{t:'sameFlag',id:f.id}:{t:'plain'};};
 if(above.pre>cur.pre+1e-9){const e=edge(above,cur,steps); return e?{t:'gap',id:e.id,mine:e.lose,above:e.win,low:e.low,tie:e.tie}:same();}
 if(cur.pre>above.pre+1e-9){const via=boostVia(above,cur), e=edge(cur,above,steps); return via?{t:'boost',...(e?{id:e.id,mine:e.win,above:e.lose,low:e.low,tie:e.tie}:{}),...via}:same();}
 const via=boostVia(above,cur); return via?{t:'boost',via:via.via,year:via.year}:same();
}
function whyFacts(k,lang,top){
 const steps=stepsFor(k,lang);
 return top.map((x,i)=>i?pairFact(top[i-1],x,steps):leadFact(x,top[1],steps));
}
const FLAG=new Set(['women','men','junior','round']);
const AND={en:' and ',es:' y ',fr:' et ',pt:' e ',it:' e ',de:' und '};
const WORD={
 price:{en:'recorded price',es:'precio registrado',fr:'prix relevé',pt:'preço registado',it:'prezzo rilevato',de:'erfasster Preis'},
 weight:{en:'published weight',es:'peso publicado',fr:'poids publié',pt:'peso publicado',it:'peso pubblicato',de:'angegebenes Gewicht'},
 all:{en:'all-round score',es:'puntuación global',fr:'score global',pt:'pontuação global',it:'punteggio complessivo',de:'Gesamtwert'},
 score:{en:'list score',es:'puntuación de la lista',fr:'score de la liste',pt:'pontuação da lista',it:'punteggio della lista',de:'Listenwert'},
 year:{en:'model year',es:'año de modelo',fr:'année de modèle',pt:'ano de modelo',it:'anno di modello',de:'Modelljahr'},
 women:{en:'women’s model',es:'modelo de mujer',fr:'modèle femme',pt:'modelo de mulher',it:'modello donna',de:'Damenmodell'},
 men:{en:'men’s model',es:'modelo de hombre',fr:'modèle homme',pt:'modelo de homem',it:'modello uomo',de:'Herrenmodell'},
 junior:{en:'junior model',es:'modelo júnior',fr:'modèle junior',pt:'modelo júnior',it:'modello junior',de:'Juniormodell'},
 round:{en:'round head',es:'forma redonda',fr:'forme ronde',pt:'forma redonda',it:'forma rotonda',de:'runde Form'},
};
const capW=s=>s?s[0].toUpperCase()+s.slice(1):s;
function whyName(id,lang){
 if(!id) return '';
 if(WORD[id]) return WORD[id][lang]||WORD[id].en;
 if(id.includes('+')){const t=D(lang).terms.rtLow; const parts=id.split('+').map(k=>t[k]||k); const and=AND[lang]||AND.en; return parts.length<3?parts.join(and):parts.slice(0,-1).join(', ')+and+parts.at(-1);}
 return D(lang).terms.rtLow[id]||id;
}
const TXT={
 en:{
  lead:(n,v)=>`Leads this list on ${n} (${v}).`,
  leadTie:(n,v)=>`Leads this list on ${n} (${v}). The recorded price is lower than the next racket.`,
  leadOn:(tie,v,n,mine)=>`Leads this list on ${tie} (${v}). ${n} ${mine} puts it ahead of the next racket.`,
  same:(n,v)=>`Same ${n} as the racket above (${v}).`,
  sameFlag:n=>`Also a ${n}, like the racket above.`,
  leadLow:(n)=>n==='recorded price'?`Leads this list on a lower recorded price.`:`Leads this list on a lower published weight (${n}).`,
  leadFlag:n=>`Leads this list as a ${n}.`,
  gap:(n,mine,above)=>`${n} ${mine}, against ${above} for the racket above.`,
  gapTie:(n,v)=>`Same ${n} as the racket above (${v}). The recorded price is higher.`,
  gapOn:(tie,v,n,mine,above)=>`Same ${tie} as the racket above (${v}). ${n} ${mine}, against ${above}.`,
  gapLow:n=>n==='recorded price'?`The recorded price is higher than the racket above.`:`Published weight is higher than the racket above.`,
  gapW:(mine,above)=>`Published weight ${mine} g, against ${above} g for the racket above.`,
  gapFlag:n=>`The racket above is a ${n}, which is why it ranks first between these two.`,
  boost:(n,mine,above,year)=>`${n} is ${mine}, better than ${above} on the racket above. The ${year} model year is the boost that keeps that racket ahead.`,
  boostShop:(n,mine,above)=>`${n} is ${mine}, better than ${above} on the racket above. Being sold at two or more shops is the boost that keeps that racket ahead.`,
  boostOnly:(year)=>`The ${year} model year is the boost that places the racket above ahead of this one.`,
  boostShopOnly:()=>`Being sold at two or more shops is the boost that places the racket above ahead of this one.`,
  leadBoost:(n,mine,above,year)=>`Leads this list on the ${year} model-year boost. ${n} is ${mine}, behind ${above} on the next racket.`,
  leadBoostShop:(n,mine,above)=>`Leads this list because it is sold at two or more shops. ${n} is ${mine}, behind ${above} on the next racket.`,
  leadBoostOnly:year=>`Leads this list on the ${year} model-year boost.`,
  leadBoostShopOnly:()=>`Leads this list because it is sold at two or more shops.`,
  plain:()=>`Ranks next under this list’s rule.`,
  leadPlain:()=>`Leads this list under its published rule.`,
 },
 es:{
  lead:(n,v)=>`Lidera esta lista en ${n} (${v}).`,
  leadTie:(n,v)=>`Lidera esta lista en ${n} (${v}). El precio registrado es más bajo que el de la siguiente.`,
  leadOn:(tie,v,n,mine)=>`Lidera esta lista en ${tie} (${v}). ${n} ${mine} la pone por delante de la siguiente.`,
  same:(n,v)=>`Igual en ${n} que la pala anterior (${v}).`,
  sameFlag:n=>`También es ${n}, como la pala anterior.`,
  leadLow:n=>n==='precio registrado'?`Lidera esta lista por un precio registrado más bajo.`:`Lidera esta lista por un peso publicado más bajo.`,
  leadFlag:n=>`Lidera esta lista como ${n}.`,
  gap:(n,mine,above)=>`${n} ${mine}, frente a ${above} de la pala anterior.`,
  gapTie:(n,v)=>`Igual en ${n} que la pala anterior (${v}). El precio registrado es más alto.`,
  gapOn:(tie,v,n,mine,above)=>`Igual en ${tie} que la pala anterior (${v}). ${n} ${mine}, frente a ${above}.`,
  gapLow:n=>n==='precio registrado'?`El precio registrado es más alto que el de la pala anterior.`:`El peso publicado es más alto que el de la pala anterior.`,
  gapW:(mine,above)=>`Peso publicado ${mine} g, frente a ${above} g de la pala anterior.`,
  gapFlag:n=>`La pala anterior es ${n}, y por eso queda delante.`,
  boost:(n,mine,above,year)=>`${n} ${mine}, mejor que ${above} de la pala anterior. El año ${year} es el extra que mantiene esa pala delante.`,
  boostShop:(n,mine,above)=>`${n} ${mine}, mejor que ${above} de la pala anterior. Estar a la venta en dos o más tiendas es el extra que mantiene esa pala delante.`,
  boostOnly:year=>`El año ${year} es el extra que coloca la pala anterior por delante.`,
  boostShopOnly:()=>`Estar a la venta en dos o más tiendas es el extra que coloca la pala anterior por delante.`,
  leadBoost:(n,mine,above,year)=>`Lidera esta lista por el extra del año ${year}. ${n} ${mine}, por detrás de ${above} de la siguiente.`,
  leadBoostShop:(n,mine,above)=>`Lidera esta lista porque se vende en dos o más tiendas. ${n} ${mine}, por detrás de ${above} de la siguiente.`,
  leadBoostOnly:year=>`Lidera esta lista por el extra del año ${year}.`,
  leadBoostShopOnly:()=>`Lidera esta lista porque se vende en dos o más tiendas.`,
  plain:()=>`Queda aquí según la regla de esta lista.`,
  leadPlain:()=>`Lidera esta lista según su regla publicada.`,
 },
 fr:{
  lead:(n,v)=>`En tête de cette liste pour ${n} (${v}).`,
  leadTie:(n,v)=>`En tête de cette liste pour ${n} (${v}). Le prix relevé est plus bas que celui de la suivante.`,
  leadOn:(tie,v,n,mine)=>`En tête de cette liste pour ${tie} (${v}). ${n} ${mine} la place devant la suivante.`,
  same:(n,v)=>`Même ${n} que la raquette au-dessus (${v}).`,
  sameFlag:n=>`Aussi ${n}, comme la raquette au-dessus.`,
  leadLow:n=>n==='prix relevé'?`En tête de cette liste grâce à un prix relevé plus bas.`:`En tête de cette liste grâce à un poids publié plus bas.`,
  leadFlag:n=>`En tête de cette liste comme ${n}.`,
  gap:(n,mine,above)=>`${n} ${mine}, contre ${above} pour la raquette au-dessus.`,
  gapTie:(n,v)=>`Même ${n} que la raquette au-dessus (${v}). Le prix relevé est plus élevé.`,
  gapOn:(tie,v,n,mine,above)=>`Même ${tie} que la raquette au-dessus (${v}). ${n} ${mine}, contre ${above}.`,
  gapLow:n=>n==='prix relevé'?`Le prix relevé est plus élevé que celui de la raquette au-dessus.`:`Le poids publié est plus élevé que celui de la raquette au-dessus.`,
  gapW:(mine,above)=>`Poids publié ${mine} g, contre ${above} g pour la raquette au-dessus.`,
  gapFlag:n=>`La raquette au-dessus est ${n}, ce qui la place devant.`,
  boost:(n,mine,above,year)=>`${n} ${mine}, mieux que ${above} pour la raquette au-dessus. L’année ${year} est le bonus qui garde cette raquette devant.`,
  boostShop:(n,mine,above)=>`${n} ${mine}, mieux que ${above} pour la raquette au-dessus. La vente dans deux boutiques ou plus est le bonus qui garde cette raquette devant.`,
  boostOnly:year=>`L’année ${year} est le bonus qui place la raquette au-dessus devant celle-ci.`,
  boostShopOnly:()=>`La vente dans deux boutiques ou plus est le bonus qui place la raquette au-dessus devant celle-ci.`,
  leadBoost:(n,mine,above,year)=>`En tête grâce au bonus de l’année ${year}. ${n} ${mine}, derrière ${above} pour la raquette suivante.`,
  leadBoostShop:(n,mine,above)=>`En tête parce qu’elle est vendue dans deux boutiques ou plus. ${n} ${mine}, derrière ${above} pour la raquette suivante.`,
  leadBoostOnly:year=>`En tête grâce au bonus de l’année ${year}.`,
  leadBoostShopOnly:()=>`En tête parce qu’elle est vendue dans deux boutiques ou plus.`,
  plain:()=>`Place suivante selon la règle de cette liste.`,
  leadPlain:()=>`En tête de cette liste selon sa règle publiée.`,
 },
 pt:{
  lead:(n,v)=>`Lidera esta lista em ${n} (${v}).`,
  leadTie:(n,v)=>`Lidera esta lista em ${n} (${v}). O preço registado é mais baixo do que o da seguinte.`,
  leadOn:(tie,v,n,mine)=>`Lidera esta lista em ${tie} (${v}). ${n} ${mine} coloca-a à frente da seguinte.`,
  same:(n,v)=>`Igual em ${n} à raquete acima (${v}).`,
  sameFlag:n=>`Também é ${n}, como a raquete acima.`,
  leadLow:n=>n==='preço registado'?`Lidera esta lista por um preço registado mais baixo.`:`Lidera esta lista por um peso publicado mais baixo.`,
  leadFlag:n=>`Lidera esta lista como ${n}.`,
  gap:(n,mine,above)=>`${n} ${mine}, contra ${above} da raquete acima.`,
  gapTie:(n,v)=>`Igual em ${n} à raquete acima (${v}). O preço registado é mais alto.`,
  gapOn:(tie,v,n,mine,above)=>`Igual em ${tie} à raquete acima (${v}). ${n} ${mine}, contra ${above}.`,
  gapLow:n=>n==='preço registado'?`O preço registado é mais alto do que o da raquete acima.`:`O peso publicado é mais alto do que o da raquete acima.`,
  gapW:(mine,above)=>`Peso publicado ${mine} g, contra ${above} g da raquete acima.`,
  gapFlag:n=>`A raquete acima é ${n}, e por isso fica à frente.`,
  boost:(n,mine,above,year)=>`${n} ${mine}, melhor do que ${above} da raquete acima. O ano ${year} é o bónus que a mantém à frente.`,
  boostShop:(n,mine,above)=>`${n} ${mine}, melhor do que ${above} da raquete acima. Estar à venda em duas ou mais lojas é o bónus que a mantém à frente.`,
  boostOnly:year=>`O ano ${year} é o bónus que coloca a raquete acima à frente desta.`,
  boostShopOnly:()=>`Estar à venda em duas ou mais lojas é o bónus que coloca a raquete acima à frente desta.`,
  leadBoost:(n,mine,above,year)=>`Lidera esta lista pelo bónus do ano ${year}. ${n} ${mine}, atrás de ${above} da seguinte.`,
  leadBoostShop:(n,mine,above)=>`Lidera esta lista porque se vende em duas ou mais lojas. ${n} ${mine}, atrás de ${above} da seguinte.`,
  leadBoostOnly:year=>`Lidera esta lista pelo bónus do ano ${year}.`,
  leadBoostShopOnly:()=>`Lidera esta lista porque se vende em duas ou mais lojas.`,
  plain:()=>`Fica aqui pela regra desta lista.`,
  leadPlain:()=>`Lidera esta lista pela regra publicada.`,
 },
 it:{
  lead:(n,v)=>`Guida questa classifica per ${n} (${v}).`,
  leadTie:(n,v)=>`Guida questa classifica per ${n} (${v}). Il prezzo rilevato è più basso di quello della successiva.`,
  leadOn:(tie,v,n,mine)=>`Guida questa classifica per ${tie} (${v}). ${n} ${mine} la mette davanti alla successiva.`,
  same:(n,v)=>`Stesso punteggio di ${n} della racchetta sopra (${v}).`,
  sameFlag:n=>`Anche questa è ${n}, come la racchetta sopra.`,
  leadLow:n=>n==='prezzo rilevato'?`Guida questa classifica per un prezzo rilevato più basso.`:`Guida questa classifica per un peso pubblicato più basso.`,
  leadFlag:n=>`Guida questa classifica come ${n}.`,
  gap:(n,mine,above)=>`${n} ${mine}, contro ${above} della racchetta sopra.`,
  gapTie:(n,v)=>`Stesso punteggio di ${n} della racchetta sopra (${v}). Il prezzo rilevato è più alto.`,
  gapOn:(tie,v,n,mine,above)=>`Stesso punteggio di ${tie} della racchetta sopra (${v}). ${n} ${mine}, contro ${above}.`,
  gapLow:n=>n==='prezzo rilevato'?`Il prezzo rilevato è più alto di quello della racchetta sopra.`:`Il peso pubblicato è più alto di quello della racchetta sopra.`,
  gapW:(mine,above)=>`Peso pubblicato ${mine} g, contro ${above} g della racchetta sopra.`,
  gapFlag:n=>`La racchetta sopra è ${n}, e per questo resta davanti.`,
  boost:(n,mine,above,year)=>`${n} ${mine}, meglio di ${above} della racchetta sopra. L’anno ${year} è il bonus che la tiene davanti.`,
  boostShop:(n,mine,above)=>`${n} ${mine}, meglio di ${above} della racchetta sopra. Essere in vendita in due o più negozi è il bonus che la tiene davanti.`,
  boostOnly:year=>`L’anno ${year} è il bonus che mette la racchetta sopra davanti a questa.`,
  boostShopOnly:()=>`Essere in vendita in due o più negozi è il bonus che mette la racchetta sopra davanti a questa.`,
  leadBoost:(n,mine,above,year)=>`Guida la classifica per il bonus dell’anno ${year}. ${n} ${mine}, dietro ${above} della successiva.`,
  leadBoostShop:(n,mine,above)=>`Guida la classifica perché è in vendita in due o più negozi. ${n} ${mine}, dietro ${above} della successiva.`,
  leadBoostOnly:year=>`Guida la classifica per il bonus dell’anno ${year}.`,
  leadBoostShopOnly:()=>`Guida la classifica perché è in vendita in due o più negozi.`,
  plain:()=>`Resta qui in base alla regola di questa classifica.`,
  leadPlain:()=>`Guida questa classifica in base alla regola pubblicata.`,
 },
 de:{
  lead:(n,v)=>`Führt diese Liste bei ${n} an (${v}).`,
  leadTie:(n,v)=>`Führt diese Liste bei ${n} an (${v}). Der erfasste Preis liegt unter dem des nächsten Schlägers.`,
  leadOn:(tie,v,n,mine)=>`Führt diese Liste bei ${tie} an (${v}). ${n} ${mine} setzt ihn vor den nächsten Schläger.`,
  same:(n,v)=>`Gleicher Wert bei ${n} wie beim Schläger darüber (${v}).`,
  sameFlag:n=>`Ebenfalls ein ${n}, wie der Schläger darüber.`,
  leadLow:n=>n==='erfasster Preis'?`Führt diese Liste mit einem niedrigeren erfassten Preis an.`:`Führt diese Liste mit einem niedrigeren angegebenen Gewicht an.`,
  leadFlag:n=>`Führt diese Liste als ${n} an.`,
  gap:(n,mine,above)=>`${n} ${mine}, gegenüber ${above} beim Schläger darüber.`,
  gapTie:(n,v)=>`Gleicher Wert bei ${n} wie beim Schläger darüber (${v}). Der erfasste Preis liegt höher.`,
  gapOn:(tie,v,n,mine,above)=>`Gleicher Wert bei ${tie} wie beim Schläger darüber (${v}). ${n} ${mine}, gegenüber ${above}.`,
  gapLow:n=>n==='erfasster Preis'?`Der erfasste Preis liegt höher als beim Schläger darüber.`:`Das angegebene Gewicht liegt höher als beim Schläger darüber.`,
  gapW:(mine,above)=>`Angegebenes Gewicht ${mine} g, gegenüber ${above} g beim Schläger darüber.`,
  gapFlag:n=>`Der Schläger darüber ist ein ${n} und steht deshalb vor diesem.`,
  boost:(n,mine,above,year)=>`${n} ist ${mine}, besser als ${above} beim Schläger darüber. Der Modelljahrgang ${year} ist der Bonus, der jenen Schläger vorne hält.`,
  boostShop:(n,mine,above)=>`${n} ist ${mine}, besser als ${above} beim Schläger darüber. Der Verkauf bei zwei oder mehr Shops ist der Bonus, der jenen Schläger vorne hält.`,
  boostOnly:year=>`Der Modelljahrgang ${year} ist der Bonus, der den Schläger darüber vor diesen setzt.`,
  boostShopOnly:()=>`Der Verkauf bei zwei oder mehr Shops ist der Bonus, der den Schläger darüber vor diesen setzt.`,
  leadBoost:(n,mine,above,year)=>`Führt die Liste durch den Bonus des Modelljahrgangs ${year} an. ${n} ist ${mine}, hinter ${above} beim nächsten Schläger.`,
  leadBoostShop:(n,mine,above)=>`Führt die Liste an, weil er bei zwei oder mehr Shops verkauft wird. ${n} ist ${mine}, hinter ${above} beim nächsten Schläger.`,
  leadBoostOnly:year=>`Führt die Liste durch den Bonus des Modelljahrgangs ${year} an.`,
  leadBoostShopOnly:()=>`Führt die Liste an, weil er bei zwei oder mehr Shops verkauft wird.`,
  plain:()=>`Steht hier nach der Regel dieser Liste.`,
  leadPlain:()=>`Führt diese Liste nach ihrer veröffentlichten Regel an.`,
 },
};
function whyNum(id,n){return id==='weight'||id==='year'?shownN(n):shownN(n);}
export function whyText(fact,lang){
 if(!fact) return '';
 const L=TXT[lang]||TXT.en, name=whyName(fact.id,lang), Name=capW(name);
 const mine=fact.mine==null?'':whyNum(fact.id,fact.mine), above=fact.above==null?'':whyNum(fact.id,fact.above);
 const flag=fact.id==='women'||fact.id==='men'||fact.id==='junior'||fact.id==='round';
 if(fact.t==='leadPlain') return L.leadPlain();
 if(fact.t==='plain') return L.plain();
 if(fact.t==='same') return L.same(name,mine);
 if(fact.t==='sameFlag') return L.sameFlag(name);
 const tieN=fact.tie?whyName(fact.tie.id,lang):'', tieV=fact.tie?whyNum(fact.tie.id,fact.tie.v):'';
 if(fact.t==='lead'){
  if(flag) return L.leadFlag(name);
  if(fact.tie&&fact.id==='price') return L.leadTie(tieN,tieV);
  if(fact.tie) return L.leadOn(tieN,tieV,Name,mine);
  if(fact.low&&fact.id==='weight') return L.leadLow(mine+' g');
  if(fact.low) return L.leadLow(name);
  return L.lead(name,mine);
 }
 if(fact.t==='gap'){
  if(flag) return L.gapFlag(name);
  if(fact.tie&&fact.id==='price') return L.gapTie(tieN,tieV);
  if(fact.tie) return L.gapOn(tieN,tieV,Name,mine,above);
  if(fact.id==='weight') return L.gapW(mine,above);
  if(fact.low) return L.gapLow(name);
  return L.gap(Name,mine,above);
 }
 if(fact.t==='boost'||fact.t==='leadBoost'){
  const lead=fact.t==='leadBoost';
  if(fact.id==='weight'){
   const lead=fact.t==='leadBoost', shop=fact.via==='shops', y=fact.year;
   const line={
    en:shop?`Published weight ${mine} g, lower than ${above} g on the racket above. Being sold at two or more shops is the boost that keeps that racket ahead.`:`Published weight ${mine} g, lower than ${above} g on the racket above. The ${y} model year is the boost that keeps that racket ahead.`,
    es:shop?`Peso publicado ${mine} g, menor que ${above} g de la pala anterior. Estar a la venta en dos o más tiendas es el extra que mantiene esa pala delante.`:`Peso publicado ${mine} g, menor que ${above} g de la pala anterior. El año ${y} es el extra que mantiene esa pala delante.`,
    fr:shop?`Poids publié ${mine} g, plus bas que ${above} g pour la raquette au-dessus. La vente dans deux boutiques ou plus est le bonus qui garde cette raquette devant.`:`Poids publié ${mine} g, plus bas que ${above} g pour la raquette au-dessus. L’année ${y} est le bonus qui garde cette raquette devant.`,
    pt:shop?`Peso publicado ${mine} g, menor do que ${above} g da raquete acima. Estar à venda em duas ou mais lojas é o bónus que a mantém à frente.`:`Peso publicado ${mine} g, menor do que ${above} g da raquete acima. O ano ${y} é o bónus que a mantém à frente.`,
    it:shop?`Peso pubblicato ${mine} g, più basso di ${above} g della racchetta sopra. Essere in vendita in due o più negozi è il bonus che la tiene davanti.`:`Peso pubblicato ${mine} g, più basso di ${above} g della racchetta sopra. L’anno ${y} è il bonus che la tiene davanti.`,
    de:shop?`Angegebenes Gewicht ${mine} g, niedriger als ${above} g beim Schläger darüber. Der Verkauf bei zwei oder mehr Shops ist der Bonus, der jenen Schläger vorne hält.`:`Angegebenes Gewicht ${mine} g, niedriger als ${above} g beim Schläger darüber. Der Modelljahrgang ${y} ist der Bonus, der jenen Schläger vorne hält.`,
   };
   if(lead) return fact.via==='shops'?L.leadBoostShopOnly():L.leadBoostOnly(y);
   return line[lang]||line.en;
  }
  if(!fact.id) return fact.via==='shops'?(lead?L.leadBoostShopOnly():L.boostShopOnly()):(lead?L.leadBoostOnly(fact.year):L.boostOnly(fact.year));
  if(fact.id&&String(fact.id).includes('+')&&!lead) return L.gap(Name,mine,above)+' '+(fact.via==='shops'?L.boostShopOnly():L.boostOnly(fact.year));
  if(lead&&fact.id&&String(fact.id).includes('+')){const s=fact.via==='shops'?L.leadBoostShop(Name,mine,above):L.leadBoost(Name,mine,above,fact.year); return lang==='de'?s.replace(' ist ',' '):s.replace(' is ',' ');}
  if(fact.via==='shops') return lead?L.leadBoostShop(Name,mine,above):L.boostShop(Name,mine,above);
  return lead?L.leadBoost(Name,mine,above,fact.year):L.boost(Name,mine,above,fact.year);
 }
 return '';
}
export function pickL(k,lang){
 const sp=specOf(k,lang); const wj=/women|junior/.test(k);
 let base; if(sp?.f) base=rackets.filter(sp.f).map(r=>({r,s:sp.s(r)}));
 else { const ord=(k==='best-cheap-padel-rackets'?rackets.filter(r=>{const p=Pnum(r,lang);return p!=null&&p<=80}).sort((a,b)=>(b.ratings.forgiveness+b.ratings.comfort+b.ratings.value)-(a.ratings.forgiveness+a.ratings.comfort+a.ratings.value)):ALL[k].pick(rackets)).filter(r=>wj||gen(r)); const n=ord.length; base=ord.map((r,i)=>({r,s:100*(1-i/Math.max(n,1))*0.3})); }
 base.forEach(x=>{x.pre=x.s; x.s+=adj(x.r);}); base.sort((a,b)=>b.s-a.s);
 // variety: at most 2 per brand in the top 10 (the rest follow in score order)
 {const c={},top=[],rest=[]; for(const x of base){const b=x.r.brand; if(top.length<10&&(c[b]||0)<2){c[b]=(c[b]||0)+1;top.push(x)}else rest.push(x)} base=[...top,...rest];}
 const shown=base.slice(0,10).map(x=>x.s), hi=shown.length?Math.max(...shown):null, lo=shown.length?Math.min(...shown):null;
 const facts=whyFacts(k,lang,base.slice(0,10));
 return base.map((x,i)=>({...x.r,gs:hi==null?null:Math.max(1,Math.round(hi===lo?100:60+40*(x.s-lo)/(hi-lo))),...(i<10?{why:facts[i]}:{})}));}
export const method=k=>!!ALL[k]?.method;
