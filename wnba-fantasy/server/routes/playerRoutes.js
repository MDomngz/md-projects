const express = require('express');
const db = require('../db');
const { authenticate, requireAdmin } = require('../auth');

const router = express.Router();

router.get('/', authenticate, (req, res) => {
  const { position, team, search, sort, order, available } = req.query;
  let query = 'SELECT * FROM players WHERE is_active = 1';
  const params = [];

  if (position) {
    query += ' AND position = ?';
    params.push(position);
  }
  if (team) {
    query += ' AND team = ?';
    params.push(team);
  }
  if (search) {
    query += ' AND name LIKE ?';
    params.push(`%${search}%`);
  }
  if (available === 'true') {
    query += ' AND id NOT IN (SELECT player_id FROM rosters)';
  }

  const validSorts = ['name', 'price', 'ppg', 'rpg', 'apg', 'fpg', 'position', 'team'];
  const sortCol = validSorts.includes(sort) ? sort : 'fpg';
  const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
  query += ` ORDER BY ${sortCol} ${sortOrder}`;

  const players = db.prepare(query).all(...params);
  res.json(players);
});

router.get('/teams', authenticate, (req, res) => {
  const teams = db.prepare('SELECT DISTINCT team FROM players WHERE is_active = 1 ORDER BY team').all();
  res.json(teams.map(t => t.team));
});

router.get('/:id', authenticate, (req, res) => {
  const player = db.prepare('SELECT * FROM players WHERE id = ?').get(req.params.id);
  if (!player) return res.status(404).json({ error: 'Player not found' });

  const recentGames = db.prepare(
    'SELECT * FROM scoring_events WHERE player_id = ? ORDER BY game_date DESC LIMIT 10'
  ).all(req.params.id);

  res.json({ ...player, recentGames });
});

router.post('/', authenticate, requireAdmin, (req, res) => {
  const { name, team, position, number, height, price, ppg, rpg, apg, spg, bpg, fpg, headshot_url } = req.body;
  if (!name || !team || !position) {
    return res.status(400).json({ error: 'Name, team, and position are required' });
  }

  const result = db.prepare(
    `INSERT INTO players (name, team, position, number, height, price, ppg, rpg, apg, spg, bpg, fpg, headshot_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(name, team, position, number || null, height || null, price || 10, ppg || 0, rpg || 0, apg || 0, spg || 0, bpg || 0, fpg || 0, headshot_url || null);

  const player = db.prepare('SELECT * FROM players WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(player);
});

router.put('/:id', authenticate, requireAdmin, (req, res) => {
  const { name, team, position, number, height, price, ppg, rpg, apg, spg, bpg, fpg, headshot_url, is_active } = req.body;

  const existing = db.prepare('SELECT * FROM players WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Player not found' });

  db.prepare(
    `UPDATE players SET name=?, team=?, position=?, number=?, height=?, price=?, ppg=?, rpg=?, apg=?, spg=?, bpg=?, fpg=?, headshot_url=?, is_active=? WHERE id=?`
  ).run(
    name ?? existing.name, team ?? existing.team, position ?? existing.position,
    number ?? existing.number, height ?? existing.height, price ?? existing.price,
    ppg ?? existing.ppg, rpg ?? existing.rpg, apg ?? existing.apg,
    spg ?? existing.spg, bpg ?? existing.bpg, fpg ?? existing.fpg,
    headshot_url ?? existing.headshot_url, is_active ?? existing.is_active, req.params.id
  );

  const player = db.prepare('SELECT * FROM players WHERE id = ?').get(req.params.id);
  res.json(player);
});

router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  db.prepare('UPDATE players SET is_active = 0 WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
