// Stateless session cookie: base64url(email).expiry.hmac — signed with SESSION_SECRET.
import crypto from 'node:crypto';

const COOKIE = 'wb_session';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error('SESSION_SECRET must be set (32+ chars)');
  return s;
}

function sign(payload) {
  return crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
}

export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

// Only the ~6 designers on the pilot can sign in. Comma-separated list in env.
export function isAllowed(email) {
  const list = (process.env.ALLOWED_EMAILS || '').split(',').map(normalizeEmail).filter(Boolean);
  return list.includes(normalizeEmail(email));
}

export function setSessionCookie(res, email) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = `${Buffer.from(email).toString('base64url')}.${exp}`;
  const value = `${payload}.${sign(payload)}`;
  res.setHeader('Set-Cookie', `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`);
}

export function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);
}

// Returns the signed-in email, or null.
export function getSessionEmail(req) {
  const cookies = Object.fromEntries((req.headers.cookie || '').split(';').map(c => {
    const i = c.indexOf('=');
    return [c.slice(0, i).trim(), c.slice(i + 1).trim()];
  }));
  const raw = cookies[COOKIE];
  if (!raw) return null;
  const [emailB64, exp, sig] = raw.split('.');
  if (!emailB64 || !exp || !sig) return null;
  const expected = sign(`${emailB64}.${exp}`);
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  if (Number(exp) < Date.now() / 1000) return null;
  const email = Buffer.from(emailB64, 'base64url').toString();
  // Removing someone from ALLOWED_EMAILS revokes their access immediately.
  return isAllowed(email) ? email : null;
}

export function requireSession(req, res) {
  const email = getSessionEmail(req);
  if (!email) res.status(401).json({ error: 'Not signed in' });
  return email;
}
