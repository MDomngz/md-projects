// GET  → { board: { cards: [...] }, favorites: [ids], updatedAt } or { empty: true }
// PUT  { board, favorites } → saves the signed-in user's profile.
import { getJSON, setJSON } from './_lib/redis.js';
import { requireSession } from './_lib/session.js';

const MAX_BYTES = 256 * 1024;
const COLUMNS = ['backlog', 'todo', 'inprogress', 'done'];
const URGENCY = ['', 'low', 'med', 'high', 'fire'];

function cleanCard(c) {
  return {
    id: String(c.id || '').slice(0, 40),
    text: String(c.text || '').slice(0, 500),
    notes: String(c.notes || '').slice(0, 4000),
    col: COLUMNS.includes(c.col) ? c.col : 'backlog',
    urgency: URGENCY.includes(c.urgency) ? c.urgency : ''
  };
}

export default async function handler(req, res) {
  const email = requireSession(req, res);
  if (!email) return;
  const key = `profile:${email}`;

  if (req.method === 'GET') {
    const profile = await getJSON(key);
    return res.status(200).json(profile || { empty: true });
  }

  if (req.method === 'PUT') {
    const body = req.body || {};
    if (JSON.stringify(body).length > MAX_BYTES) return res.status(413).json({ error: 'Profile too large' });
    const cards = body.board && Array.isArray(body.board.cards) ? body.board.cards : null;
    const favorites = Array.isArray(body.favorites) ? body.favorites : null;
    if (!cards || !favorites) return res.status(400).json({ error: 'Expected { board: { cards }, favorites }' });

    const profile = {
      board: { cards: cards.filter(c => c && c.id).map(cleanCard) },
      favorites: favorites.filter(n => Number.isInteger(n)),
      updatedAt: new Date().toISOString()
    };
    await setJSON(key, profile);
    return res.status(200).json({ ok: true, updatedAt: profile.updatedAt });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
