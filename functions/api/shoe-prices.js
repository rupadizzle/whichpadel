// Preview: shoe prices come from the preview-only shoe price Worker (separate D1). Not routed on whichpadel.com.
export const onRequestGet = async () => { const r = await fetch('https://whichpadel-shoe-prices-preview.rupertwallace.workers.dev/api/prices', { cf: { cacheTtl: 600 } });
 return new Response(r.body, { status: r.status, headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=600' } }); };
