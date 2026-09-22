// POST { email } → emails a one-time sign-in link if the address is on the allowlist.
import crypto from 'node:crypto';
import { redis } from '../_lib/redis.js';
import { isAllowed, normalizeEmail } from '../_lib/session.js';

const LINK_TTL = 15 * 60; // 15 minutes

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const email = normalizeEmail(req.body && req.body.email);

  // Same response whether or not the email is allowed, so the allowlist can't be probed.
  const ok = () => res.status(200).json({ ok: true });
  if (!email || !isAllowed(email)) return ok();

  // Light throttle: max 5 link requests per email per 15 minutes.
  const throttleKey = `throttle:login:${email}`;
  const count = await redis('INCR', throttleKey);
  if (count === 1) await redis('EXPIRE', throttleKey, String(LINK_TTL));
  if (count > 5) return ok();

  const token = crypto.randomBytes(32).toString('base64url');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  await redis('SET', `login:${tokenHash}`, email, 'EX', String(LINK_TTL));

  const base = process.env.APP_URL || `https://${req.headers.host}`;
  const link = `${base}/api/auth/verify?token=${token}`;

  const sent = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || 'AI Workbench <onboarding@resend.dev>',
      to: email,
      subject: 'Your AI Workbench sign-in link',
      text: `Sign in to the AI Workbench:\n\n${link}\n\nThis link works once and expires in 15 minutes. If you didn't request it, you can ignore this email.`,
      html: `<p>Sign in to the AI Workbench:</p><p><a href="${link}">Sign in</a></p><p style="color:#5c6771;font-size:13px">This link works once and expires in 15 minutes. If you didn't request it, you can ignore this email.</p>`
    })
  });
  if (!sent.ok) {
    console.error('Resend error', sent.status, await sent.text());
    return res.status(502).json({ error: 'Could not send the sign-in email' });
  }
  return ok();
}
