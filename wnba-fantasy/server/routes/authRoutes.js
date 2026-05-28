const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { generateToken, authenticate } = require('../auth');

const router = express.Router();

router.post('/register', (req, res) => {
  const { username, email, password, team_name } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username, email);
  if (existing) {
    return res.status(409).json({ error: 'Username or email already taken' });
  }

  const hash = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    'INSERT INTO users (username, email, password, team_name) VALUES (?, ?, ?, ?)'
  ).run(username, email, hash, team_name || `${username}'s Team`);

  const user = db.prepare('SELECT id, username, email, role, team_name, budget FROM users WHERE id = ?').get(result.lastInsertRowid);
  const token = generateToken(user);
  res.status(201).json({ user, token });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const { password: _, ...safeUser } = user;
  const token = generateToken(safeUser);
  res.json({ user: safeUser, token });
});

router.get('/me', authenticate, (req, res) => {
  const user = db.prepare('SELECT id, username, email, role, team_name, budget, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

module.exports = router;
