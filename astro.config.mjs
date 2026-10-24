import {defineConfig} from 'astro/config';
import {localApi} from './scripts/dev-api.mjs';
// localApi proxies /api/all-prices, /api/shoe-prices and /api/geo during dev and preview.
export default defineConfig({output:'static', site:'https://whichpadel.com', vite:{plugins:[localApi()]}});
