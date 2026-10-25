import { searchIndex } from '../lib/search-index.js';
export function GET() {
  return new Response(JSON.stringify(searchIndex()), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' },
  });
}
