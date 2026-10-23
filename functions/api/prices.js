// Preview-only: on whichpadel.com the whichpadel-prices Worker route serves /api/prices before Pages; on *.pages.dev previews this proxies it and adds US offers.
import { merged } from './_us.js';
export const onRequestGet = () => merged('https://whichpadel.com/api/prices','/api/prices');
