// Prebuilt price JSON stored in D1 (chunked under the 2 MB row limit) and served with long edge cache.
// Page views read these rows only — they never JOIN price_observations.

export const CHUNK = 700_000; // bytes per row; D1 max row is 2 MB
export const SNAPSHOT_MAX_AGE = 20 * 3600e3; // rebuild at most ~once per day
export const PRUNE_BATCH = 5000; // cap deletes/day so free write quota isn't blown on first prune

export function chunkBody(json) {
  const chunks = [];
  for (let i = 0; i < json.length; i += CHUNK) chunks.push(json.slice(i, i + CHUNK));
  return chunks;
}

export function joinChunks(chunks) {
  return chunks.join('');
}

/** Persist a full export payload ({updated,r}) as meta + c00..cnn rows. */
export async function saveExport(env, data) {
  const json = typeof data === 'string' ? data : JSON.stringify(data);
  const chunks = chunkBody(json);
  const built = Date.now();
  const updated = typeof data === 'object' && data && data.updated ? data.updated : new Date(built).toISOString();
  const stmts = [env.DB.prepare('DELETE FROM price_exports')];
  stmts.push(
    env.DB.prepare('INSERT INTO price_exports(key,built_at,body) VALUES(?,?,?)').bind(
      'meta',
      built,
      JSON.stringify({ n: chunks.length, updated, bytes: json.length }),
    ),
  );
  for (let i = 0; i < chunks.length; i++) {
    const key = 'c' + String(i).padStart(2, '0');
    stmts.push(env.DB.prepare('INSERT INTO price_exports(key,built_at,body) VALUES(?,?,?)').bind(key, built, chunks[i]));
  }
  await env.DB.batch(stmts);
  return { built, chunks: chunks.length, bytes: json.length };
}

/** Load the prebuilt JSON string, or null if missing. One D1 query. */
export async function loadExport(env) {
  const { results } = await env.DB.prepare(
    "SELECT key, built_at, body FROM price_exports WHERE key = 'meta' OR key GLOB 'c*' ORDER BY key",
  ).all();
  if (!results?.length) return null;
  const meta = results.find((r) => r.key === 'meta');
  if (!meta) return null;
  const chunks = results.filter((r) => r.key.startsWith('c')).map((r) => r.body);
  const info = JSON.parse(meta.body);
  if (chunks.length !== info.n) return null;
  return { json: joinChunks(chunks), built_at: meta.built_at, updated: info.updated, bytes: info.bytes };
}

/** True when a rebuild is due (no snapshot, or older than SNAPSHOT_MAX_AGE). */
export async function needsRebuild(env) {
  const row = await env.DB.prepare("SELECT built_at FROM price_exports WHERE key = 'meta'").first();
  if (!row) return true;
  return Date.now() - row.built_at >= SNAPSHOT_MAX_AGE;
}

/** Delete oldest observations beyond 90 days, capped to protect free write quota. */
export async function pruneHistory(env, olderThan) {
  const res = await env.DB.prepare(
    'DELETE FROM price_observations WHERE rowid IN (SELECT rowid FROM price_observations WHERE ts < ? ORDER BY ts LIMIT ?)',
  )
    .bind(olderThan, PRUNE_BATCH)
    .run();
  return res?.meta?.changes ?? 0;
}
