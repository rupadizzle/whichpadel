// Site feature switches.
// ACCOUNTS: magic-link sign-in and synced saved lists. Off until the ACCT D1 database and the EMAIL
// (Cloudflare Email Sending) binding are set up in wrangler.toml; until then /api/auth/*, /api/saved,
// /api/news and /api/alert return 503. Price alerts and newsletters go to /api/subscribe (SUBSCRIBERS KV).
export const ACCOUNTS = false;
