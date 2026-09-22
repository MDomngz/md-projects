// POST { rating, type, message, view, promptId } → appends a row to the feedback Google Sheet
// via a Google Apps Script web app (see google-apps-script/feedback.gs).
// The script URL + shared secret stay server-side; the signed-in email is added here,
// not trusted from the browser.
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

  const row = {
    secret: process.env.FEEDBACK_SECRET,
    timestamp: new Date().toISOString(),
    email,
    rating: rating >= 1 && rating <= 5 ? rating : '',
    type: TYPES.includes(b.type) ? b.type : 'Other',
    message,
    view: String(b.view || '').slice(0, 60),
    promptId: b.promptId ? String(b.promptId).slice(0, 20) : '',
    userAgent: String(req.headers['user-agent'] || '').slice(0, 200)
  };

  const r = await fetch(process.env.FEEDBACK_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(row),
    redirect: 'follow'
  });
  const text = await r.text();
  if (!r.ok || !text.includes('"ok":true')) {
    console.error('Feedback sheet error', r.status, text.slice(0, 300));
    return res.status(502).json({ error: 'Could not save feedback' });
  }
  res.status(200).json({ ok: true });
}
