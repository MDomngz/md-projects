// Minimal Upstash Redis client over its REST API — no SDK dependency.
// Works with env vars from either the Upstash integration (UPSTASH_REDIS_REST_*)
// or the Vercel Marketplace "KV" flavor of it (KV_REST_API_*).
const URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

export async function redis(...command) {
  if (!URL || !TOKEN) throw new Error('Redis is not configured (UPSTASH_REDIS_REST_URL / _TOKEN)');
  const res = await fetch(URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command)
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error('Redis error: ' + (data.error || res.status));
  return data.result;
}

export async function getJSON(key) {
  const raw = await redis('GET', key);
  return raw ? JSON.parse(raw) : null;
}

export async function setJSON(key, value, ttlSeconds) {
  const args = ['SET', key, JSON.stringify(value)];
  if (ttlSeconds) args.push('EX', String(ttlSeconds));
  return redis(...args);
}
