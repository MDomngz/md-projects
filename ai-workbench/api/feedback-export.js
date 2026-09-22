// GET ?after=<id> with header "Authorization: Bearer <FEEDBACK_SECRET>"
// → { rows: [...] } for every feedback row with id > after, oldest first.
// Called by the Apps Script in google-apps-script/feedback.gs on a timer.
import crypto from 'node:crypto';
import { redis } from './_lib/redis.js';

function authorized(req) {
  const expected = process.env.FEEDBACK_SECRET;
  if (!expected) return false;
  const given = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!authorized(req)) return res.status(401).json({ error: 'unauthorized' });

  const after = Number(req.query.after) || 0;
  const raw = await redis('LRANGE', 'feedback:rows', '0', '-1');
  const rows = (raw || []).map(r => JSON.parse(r)).filter(r => r.id > after);
  res.status(200).json({ rows });
}
