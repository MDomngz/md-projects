const express = require('express');
const db = require('../db');
const { authenticate } = require('../auth');

const router = express.Router();

router.get('/', authenticate, (req, res) => {
  const { date, team, status } = req.query;
  let query = 'SELECT * FROM games WHERE 1=1';
  const params = [];

  if (date) {
    query += ' AND game_date = ?';
    params.push(date);
  }
  if (team) {
    query += ' AND (home_team = ? OR away_team = ?)';
    params.push(team, team);
  }
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ' ORDER BY game_date ASC, game_time ASC';
  const games = db.prepare(query).all(...params);
  res.json(games);
});

router.get('/today', authenticate, (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const games = db.prepare(
    'SELECT * FROM games WHERE game_date = ? ORDER BY game_time ASC'
  ).all(today);
  res.json(games);
});

router.get('/week', authenticate, (req, res) => {
  const { start } = req.query;
  const startDate = start || new Date().toISOString().split('T')[0];
  const endDate = new Date(new Date(startDate).getTime() + 7 * 86400000).toISOString().split('T')[0];

  const games = db.prepare(
    'SELECT * FROM games WHERE game_date >= ? AND game_date < ? ORDER BY game_date ASC, game_time ASC'
  ).all(startDate, endDate);
  res.json(games);
});

router.get('/dates', authenticate, (req, res) => {
  const dates = db.prepare(
    `SELECT game_date, COUNT(*) as game_count,
            SUM(CASE WHEN status = 'live' THEN 1 ELSE 0 END) as live_count,
            SUM(CASE WHEN status = 'final' THEN 1 ELSE 0 END) as final_count,
            SUM(CASE WHEN status = 'scheduled' THEN 1 ELSE 0 END) as scheduled_count
     FROM games GROUP BY game_date ORDER BY game_date ASC`
  ).all();
  res.json(dates);
});

module.exports = router;
