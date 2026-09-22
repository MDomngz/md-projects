// GET ?token=… — the link from the sign-in email. Single use: the token is deleted on read.
import crypto from 'node:crypto';
import { redis } from '../_lib/redis.js';
import { isAllowed, setSessionCookie } from '../_lib/session.js';

export default async function handler(req, res) {
  const token = String(req.query.token || '');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const email = token ? await redis('GETDEL', `login:${tokenHash}`) : null;

  if (!email || !isAllowed(email)) {
    res.writeHead(302, { Location: '/?login=expired' });
    return res.end();
  }
  setSessionCookie(res, email);
  res.writeHead(302, { Location: '/' });
  res.end();
}
