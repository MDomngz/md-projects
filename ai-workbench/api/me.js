import { requireSession } from './_lib/session.js';

export default function handler(req, res) {
  const email = requireSession(req, res);
  if (!email) return;
  res.status(200).json({ email });
}
