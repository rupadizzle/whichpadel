// Racket prices for the site: production racket Worker (whichpadel.com/api/prices, untouched) + US offers.
import { merged } from './_us.js';
export const onRequestGet = (ctx) => merged(ctx.env,'PRICES','/api/prices','/api/prices',ctx);
