// POST { email, code } → signs the user in if their email is on ALLOWED_EMAILS
// (managed by hand in Vercel env vars). If ACCESS_CODE is set, the code must match too.
import crypto from 'node:crypto';
import { redis } from '../_lib/redis.js';
import { isAllowed, normalizeEmail, setSessionCookie } from '../_lib/session.js';

const WINDOW = 15 * 60;   // 15 minutes
const MAX_FAILURES = 10;  // per IP per window

function codeMatches(code) {
  const expected = process.env.ACCESS_CODE;
  if (!expected) return true;
  const a = Buffer.from(String(code || ''));
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const throttleKey = `throttle:login:${ip}`;
  const failures = Number(await redis('GET', throttleKey)) || 0;
  if (failures >= MAX_FAILURES) return res.status(429).json({ error: 'Too many attempts. Try again in 15 minutes.' });

  const email = normalizeEmail(req.body && req.body.email);
  if (!email || !isAllowed(email) || !codeMatches(req.body && req.body.code)) {
    const n = await redis('INCR', throttleKey);
    if (n === 1) await redis('EXPIRE', throttleKey, String(WINDOW));
    return res.status(403).json({ error: 'not_allowed' });
  }

  setSessionCookie(res, email);
  res.status(200).json({ email });
}
