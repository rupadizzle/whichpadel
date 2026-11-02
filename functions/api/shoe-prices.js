// Shoe prices: shoe price Worker (own D1) + US shoe offers.
// Edge-cached 24h via caches.default inside merged().
import { merged } from './_us.js';
export const onRequestGet = (ctx) => merged(ctx.env,'SHOES','/api/prices','/api/shoe-prices',ctx);
