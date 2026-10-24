// Padel ball catalogue (data/balls.json: 3-ball tube offers from shop product pages). Live prices ride on the shoe price engine as "ball-<slug>".
import raw from '../../data/balls.json'; import { pick, DEFAULT_REGION } from './price.js';
export const BALL_CHECKED=raw.checked;
export const balls=raw.balls.map(b=>({...b,offs:b.offs.map(({h,...o})=>o),shops:b.offs.length,inStock:b.offs.filter(o=>o.s).length}));
export const ballBySlug=Object.fromEntries(balls.map(b=>[b.slug,b]));
export const ballImg=b=>b.imgs?`/balls/g/${b.slug}-400.webp`:null;
export const ballPrice=(b,lang)=>{const p=pick(b,DEFAULT_REGION(lang)); return p.none?null:p.v;};
export const rankBalls=(list,lang='en')=>[...list].sort((a,b)=>b.inStock-a.inStock||(b.tour?1:0)-(a.tour?1:0)||(ballPrice(a,lang)??1e9)-(ballPrice(b,lang)??1e9)||a.name.localeCompare(b.name));
