import { rackets } from './data.js';
import { extraLists, isWomens } from './seo-content.js';
const GBP2EUR=1/0.842481, USD2EUR=1/1.121735;
export const eurN=r=>r.price==null?null:Math.round(r.currency==='EUR'?r.price:r.currency==='GBP'?r.price*GBP2EUR:r.price*USD2EUR);
import { priceText } from './price.js';
export const eur=r=>priceText(r,'ES','es')||'Ver precio';
export const T={shape:{round:'Redonda',teardrop:'Lágrima',diamond:'Diamante',hybrid:'Híbrida'},bal:{low:'Baja',medium:'Media',high:'Alta'},core:{soft:'Blando','medium-soft':'Medio-blando',medium:'Medio','medium-hard':'Medio-duro',hard:'Duro'},rt:{power:'Potencia',control:'Control',handling:'Manejabilidad',forgiveness:'Tolerancia',comfort:'Confort',value:'Calidad-precio'}};
export const t=(m,k)=>k?(T[m][k]||k):'—';
const allround=r=>(r.ratings.power+r.ratings.control+r.ratings.handling+r.ratings.forgiveness+r.ratings.comfort)/5;
export const esLists=[
 {id:'mejores-2026',h:'Las mejores palas de pádel de 2026',rule:'Modelos 2026 y 2027 con precio registrado, ordenados por la media de potencia, control, manejabilidad, tolerancia y confort.',rs:extraLists['best-padel-racket-2026'].pick(rackets).slice(0,10)},
 {id:'principiantes',h:'Mejores palas para principiantes',rule:'Forma redonda, ordenadas por tolerancia y después por confort.',rs:rackets.filter(r=>r.shape==='round').sort((a,b)=>b.ratings.forgiveness-a.ratings.forgiveness||b.ratings.comfort-a.ratings.comfort).slice(0,6)},
 {id:'potencia',h:'Mejores palas de potencia',rule:'Ordenadas por la puntuación de potencia.',rs:[...rackets].sort((a,b)=>b.ratings.power-a.ratings.power).slice(0,6)},
 {id:'control',h:'Mejores palas de control',rule:'Ordenadas por la puntuación de control y después por manejabilidad.',rs:[...rackets].sort((a,b)=>b.ratings.control-a.ratings.control||b.ratings.handling-a.ratings.handling).slice(0,6)},
 {id:'mujer',h:'Mejores palas de pádel para mujer',rule:'Modelos que la marca vende como versión de mujer (W, Woman o Mujer en el nombre oficial), ordenados por manejabilidad, tolerancia y confort.',rs:rackets.filter(isWomens).sort((a,b)=>(b.ratings.handling+b.ratings.forgiveness+b.ratings.comfort)-(a.ratings.handling+a.ratings.forgiveness+a.ratings.comfort)).slice(0,6)},
 {id:'baratas',h:'Mejores palas baratas (hasta 100 €)',rule:'Precio registrado de 100 € o menos, ordenadas por tolerancia, confort y calidad-precio.',rs:rackets.filter(r=>eurN(r)!=null&&eurN(r)<=100).sort((a,b)=>(b.ratings.forgiveness+b.ratings.comfort+b.ratings.value)-(a.ratings.forgiveness+a.ratings.comfort+a.ratings.value)).slice(0,6)},
];
export { allround };
