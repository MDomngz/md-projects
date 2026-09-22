import { clearSessionCookie } from '../_lib/session.js';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  clearSessionCookie(res);
  res.status(200).json({ ok: true });
}
