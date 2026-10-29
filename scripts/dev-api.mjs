// astro dev is a static server and does not run the Pages functions in functions/api.
// Proxy the read-only price and geo endpoints to production so localhost matches the live site.
const ORIGIN = 'https://whichpadel.com';
const PATHS = new Set(['/api/all-prices', '/api/shoe-prices', '/api/geo']);
const REDIR = new Map([
  ['/racket-finder', '/finder/'],
  ['/compare', '/rackets/'],
  ['/rackets/compare', '/rackets/'],
  ['/es/comparador-palas-padel', '/es/palas/'],
  ['/es/palas/comparar', '/es/palas/'],
  ['/fr/comparateur-raquettes-padel', '/fr/raquettes/'],
  ['/fr/raquettes/comparer', '/fr/raquettes/'],
  ['/pt/comparador-raquetes-padel', '/pt/raquetes/'],
  ['/pt/raquetes/comparar', '/pt/raquetes/'],
  ['/it/confronto-racchette-padel', '/it/racchette/'],
  ['/it/racchette/confronta', '/it/racchette/'],
  ['/de/padelschlaeger-vergleich', '/de/schlaeger/'],
  ['/de/schlaeger/vergleich', '/de/schlaeger/'],
  ['/shoes/compare', '/shoes/'],
  ['/es/zapatillas/comparar', '/es/zapatillas/'],
  ['/fr/chaussures/comparer', '/fr/chaussures/'],
  ['/pt/sapatilhas/comparar', '/pt/sapatilhas/'],
  ['/it/scarpe/confronta', '/it/scarpe/'],
  ['/de/schuhe/vergleich', '/de/schuhe/'],
]);
const TTL = 10 * 60 * 1000;

export function localApi() {
  const cache = new Map();
  const handle = async (req, res, next) => {
    const raw = req.originalUrl || req.url || '';
    const path = raw.split('?')[0].replace(/\/$/, '') || '/';
    const to = REDIR.get(path);
    if (to && (req.method === 'GET' || req.method === 'HEAD')) {
      const q = raw.includes('?') ? raw.slice(raw.indexOf('?')) : '';
      res.statusCode = 301;
      res.setHeader('location', to + q);
      res.end();
      return;
    }
    if ((req.method !== 'GET' && req.method !== 'HEAD') || !PATHS.has(path)) return next();
    try {
      let hit = cache.get(path);
      if (!hit || hit.exp < Date.now()) {
        const r = await fetch(ORIGIN + path, {headers: {accept: 'application/json'}});
        hit = {exp: Date.now() + TTL, status: r.status, type: r.headers.get('content-type') || 'application/json', body: Buffer.from(await r.arrayBuffer())};
        if (r.ok) cache.set(path, hit);
      }
      res.statusCode = hit.status;
      res.setHeader('content-type', hit.type);
      res.setHeader('cache-control', 'private, max-age=60');
      res.end(req.method === 'HEAD' ? undefined : hit.body);
    } catch {
      res.statusCode = 502;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({error: 'local price proxy failed'}));
    }
  };
  const attach = server => { server.middlewares.use(handle); };
  return {name: 'local-price-api', configureServer: attach, configurePreviewServer: attach};
}
