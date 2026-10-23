// Preview: shoe prices come from the preview-only shoe price Worker (separate D1), plus US offers. Not routed on whichpadel.com.
import { merged } from './_us.js';
export const onRequestGet = () => merged('https://whichpadel-shoe-prices-preview.rupertwallace.workers.dev/api/prices','/api/shoe-prices');
