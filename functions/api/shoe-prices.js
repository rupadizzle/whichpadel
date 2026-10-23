// Shoe prices: shoe price Worker (own D1) + US shoe offers.
import { merged } from './_us.js';
export const onRequestGet = ({env}) => merged(env,'SHOES','/api/prices','/api/shoe-prices');
