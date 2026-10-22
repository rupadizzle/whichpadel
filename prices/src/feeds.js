// Affiliate product-feed adapters (Awin, CJ, TradeTracker, Zona de Padel). INACTIVE: accounts pending, no credentials.
// Interface: { id, enabled(env):bool, async fetchOffers(env): [{shop,url,racket_hint,price,currency,inStock,country}] }
// To activate one: implement fetchOffers, set its secret via `wrangler secret put`, then map racket_hint -> racket_id.
const stub=(id,secret)=>({id,enabled:env=>!!env[secret],async fetchOffers(){return [];}});
export const FEEDS=[stub('awin','AWIN_FEED_KEY'),stub('cj','CJ_API_KEY'),stub('tradetracker','TT_FEED_KEY'),stub('zonadepadel','ZDP_FEED_URL')];
