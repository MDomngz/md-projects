const express = require('express');
const db = require('../db');
const { authenticate, requireAdmin } = require('../auth');

const router = express.Router();

router.get('/users', authenticate, requireAdmin, (req, res) => {
  const users = db.prepare(`
    SELECT u.id, u.username, u.email, u.role, u.team_name, u.budget, u.created_at,
           COUNT(r.id) as roster_count,
           COALESCE(SUM(p.fpg), 0) as total_fpg
    FROM users u
    LEFT JOIN rosters r ON u.id = r.user_id
    LEFT JOIN players p ON r.player_id = p.id
    GROUP BY u.id
    ORDER BY total_fpg DESC
  `).all();
  res.json(users);
});

router.put('/users/:id/role', authenticate, requireAdmin, (req, res) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Role must be user or admin' });
  }
  db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, req.params.id);
  res.json({ success: true });
});

router.put('/users/:id/budget', authenticate, requireAdmin, (req, res) => {
  const { budget } = req.body;
  if (typeof budget !== 'number' || budget < 0) {
    return res.status(400).json({ error: 'Budget must be a non-negative number' });
  }
  db.prepare('UPDATE users SET budget = ? WHERE id = ?').run(budget, req.params.id);
  res.json({ success: true });
});

router.delete('/users/:id', authenticate, requireAdmin, (req, res) => {
  if (req.params.id == req.user.id) {
    return res.status(400).json({ error: 'Cannot delete yourself' });
  }
  db.prepare('DELETE FROM rosters WHERE user_id = ?').run(req.params.id);
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

router.get('/leaderboard', authenticate, (req, res) => {
  const leaderboard = db.prepare(`
    SELECT u.id, u.username, u.team_name,
           COUNT(r.id) as roster_count,
           ROUND(COALESCE(SUM(p.fpg), 0), 1) as total_fpg,
           ROUND(u.budget, 1) as budget
    FROM users u
    LEFT JOIN rosters r ON u.id = r.user_id
    LEFT JOIN players p ON r.player_id = p.id
    WHERE u.role = 'user'
    GROUP BY u.id
    ORDER BY total_fpg DESC
  `).all();
  res.json(leaderboard);
});

router.get('/stats', authenticate, requireAdmin, (req, res) => {
  const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('user').count;
  const totalPlayers = db.prepare('SELECT COUNT(*) as count FROM players WHERE is_active = 1').get().count;
  const totalDrafted = db.prepare('SELECT COUNT(DISTINCT player_id) as count FROM rosters').get().count;
  const avgBudget = db.prepare('SELECT ROUND(AVG(budget), 1) as avg FROM users WHERE role = ?').get('user').avg || 0;

  const maxFullTeams = Math.floor(totalPlayers / 10);
  res.json({ totalUsers, totalPlayers, totalDrafted, avgBudget, maxFullTeams });
});

router.post('/scoring', authenticate, requireAdmin, (req, res) => {
  const { player_id, game_date, points, rebounds, assists, steals, blocks, turnovers } = req.body;
  const fp = (points || 0) * 1 + (rebounds || 0) * 1.2 + (assists || 0) * 1.5 +
             (steals || 0) * 3 + (blocks || 0) * 3 - (turnovers || 0) * 1;

  db.prepare(
    `INSERT INTO scoring_events (player_id, game_date, points, rebounds, assists, steals, blocks, turnovers, fantasy_points)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(player_id, game_date, points || 0, rebounds || 0, assists || 0, steals || 0, blocks || 0, turnovers || 0, fp);

  const avg = db.prepare('SELECT ROUND(AVG(fantasy_points), 1) as avg FROM scoring_events WHERE player_id = ?').get(player_id).avg;
  db.prepare('UPDATE players SET fpg = ? WHERE id = ?').run(avg, player_id);

  res.status(201).json({ fantasy_points: fp });
});

module.exports = router;
