import { getSessionEmail } from './_lib/session.js';

export default function handler(req, res) {
  const email = getSessionEmail(req);
  // needsCode tells the sign-in screen whether to show the access-code field.
  if (!email) return res.status(401).json({ error: 'Not signed in', needsCode: !!process.env.ACCESS_CODE });
  res.status(200).json({ email });
}
