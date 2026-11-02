// Shoe prices: shoe price Worker (own D1) + US shoe offers.
import { merged } from './_us.js';
export const onRequestGet = (ctx) => merged(ctx.env,'SHOES','/api/prices','/api/shoe-prices',ctx);
