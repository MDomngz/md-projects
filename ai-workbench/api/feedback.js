// POST { rating, type, message, view, promptId } → stores one feedback row in Redis.
// The Google Sheet pulls new rows on a timer via /api/feedback-export (see
// google-apps-script/feedback.gs), so no public Apps Script web app is needed.
// The signed-in email is added here, not trusted from the browser.
import { redis } from './_lib/redis.js';
import { getSessionEmail } from './_lib/session.js';

const TYPES = ['Bug', 'Idea', 'Prompt content', 'Other'];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const email = getSessionEmail(req);
  if (!email) return res.status(401).json({ error: 'Not signed in' });

  const b = req.body || {};
  const message = String(b.message || '').trim().slice(0, 4000);
  const rating = Number(b.rating);
  if (!message && !rating) return res.status(400).json({ error: 'Add a rating or a message' });

  const id = await redis('INCR', 'feedback:seq');
  const row = {
    id,
    timestamp: new Date().toISOString(),
    email,
    rating: rating >= 1 && rating <= 5 ? rating : '',
    type: TYPES.includes(b.type) ? b.type : 'Other',
    message,
    view: String(b.view || '').slice(0, 60),
    promptId: b.promptId ? String(b.promptId).slice(0, 20) : '',
    userAgent: String(req.headers['user-agent'] || '').slice(0, 200)
  };
  await redis('RPUSH', 'feedback:rows', JSON.stringify(row));
  res.status(200).json({ ok: true });
}
