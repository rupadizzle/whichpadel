// Preview-only: on whichpadel.com the whichpadel-prices Worker route serves /api/prices before Pages; on *.pages.dev previews this proxies it.
export const onRequestGet = async () => { const r = await fetch('https://whichpadel.com/api/prices', { cf: { cacheTtl: 600 } });
 return new Response(r.body, { status: r.status, headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=600' } }); };
