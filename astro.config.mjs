import {defineConfig} from 'astro/config';
import {localApi} from './scripts/dev-api.mjs';
// localApi proxies /api/all-prices, /api/shoe-prices and /api/geo during dev and preview.
// src/middleware.js and public/_redirects send old URLs (including /racket-finder/) to their current paths.
export default defineConfig({output:'static', site:'https://whichpadel.com', vite:{plugins:[localApi()]}});
