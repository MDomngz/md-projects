const express = require('express');
const db = require('../db');
const { authenticate } = require('../auth');

const router = express.Router();

const SLOT_LIMITS = {
  G1: 'G', G2: 'G',
  F1: 'F', F2: 'F',
  C: 'C',
  UTIL1: null, UTIL2: null,
  BENCH1: null, BENCH2: null, BENCH3: null,
};

router.get('/', authenticate, (req, res) => {
  const roster = db.prepare(`
    SELECT r.*, p.name, p.team, p.position, p.number, p.price, p.ppg, p.rpg, p.apg, p.fpg, p.headshot_url
    FROM rosters r
    JOIN players p ON r.player_id = p.id
    WHERE r.user_id = ?
    ORDER BY r.slot
  `).all(req.user.id);

  const user = db.prepare('SELECT budget FROM users WHERE id = ?').get(req.user.id);
  res.json({ roster, budget: user.budget });
});

router.post('/add', authenticate, (req, res) => {
  const { player_id, slot } = req.body;
  if (!player_id || !slot) {
    return res.status(400).json({ error: 'player_id and slot are required' });
  }
  if (!(slot in SLOT_LIMITS)) {
    return res.status(400).json({ error: 'Invalid slot' });
  }

  const player = db.prepare('SELECT * FROM players WHERE id = ? AND is_active = 1').get(player_id);
  if (!player) return res.status(404).json({ error: 'Player not found' });

  const requiredPosition = SLOT_LIMITS[slot];
  if (requiredPosition && player.position !== requiredPosition) {
    return res.status(400).json({ error: `Slot ${slot} requires position ${requiredPosition}` });
  }

  const alreadyOwned = db.prepare('SELECT id FROM rosters WHERE user_id = ? AND player_id = ?').get(req.user.id, player_id);
  if (alreadyOwned) {
    return res.status(409).json({ error: 'Player already on your roster' });
  }

  const slotTaken = db.prepare('SELECT id FROM rosters WHERE user_id = ? AND slot = ?').get(req.user.id, slot);
  if (slotTaken) {
    return res.status(409).json({ error: 'Slot already filled' });
  }

  const user = db.prepare('SELECT budget FROM users WHERE id = ?').get(req.user.id);
  if (user.budget < player.price) {
    return res.status(400).json({ error: 'Insufficient budget' });
  }

  const takenByOther = db.prepare('SELECT r.id, u.username FROM rosters r JOIN users u ON r.user_id = u.id WHERE r.player_id = ?').get(player_id);
  if (takenByOther) {
    return res.status(409).json({ error: `Player already drafted by ${takenByOther.username}` });
  }

  db.prepare('INSERT INTO rosters (user_id, player_id, slot) VALUES (?, ?, ?)').run(req.user.id, player_id, slot);
  db.prepare('UPDATE users SET budget = budget - ? WHERE id = ?').run(player.price, req.user.id);

  const updatedUser = db.prepare('SELECT budget FROM users WHERE id = ?').get(req.user.id);
  res.status(201).json({ success: true, budget: updatedUser.budget });
});

router.delete('/:playerId', authenticate, (req, res) => {
  const entry = db.prepare('SELECT r.*, p.price FROM rosters r JOIN players p ON r.player_id = p.id WHERE r.user_id = ? AND r.player_id = ?').get(req.user.id, req.params.playerId);
  if (!entry) return res.status(404).json({ error: 'Player not on your roster' });

  db.prepare('DELETE FROM rosters WHERE user_id = ? AND player_id = ?').run(req.user.id, req.params.playerId);
  db.prepare('UPDATE users SET budget = budget + ? WHERE id = ?').run(entry.price, req.user.id);

  const user = db.prepare('SELECT budget FROM users WHERE id = ?').get(req.user.id);
  res.json({ success: true, budget: user.budget });
});

router.post('/auto-draft', authenticate, (req, res) => {
  const user = db.prepare('SELECT budget FROM users WHERE id = ?').get(req.user.id);
  const currentRoster = db.prepare('SELECT slot FROM rosters WHERE user_id = ?').all(req.user.id);
  const filledSlots = new Set(currentRoster.map(r => r.slot));
  const myPlayerIds = new Set(
    db.prepare('SELECT player_id FROM rosters WHERE user_id = ?').all(req.user.id).map(r => r.player_id)
  );

  const allSlots = ['G1', 'G2', 'F1', 'F2', 'C', 'UTIL1', 'UTIL2', 'BENCH1', 'BENCH2', 'BENCH3'];
  const emptySlots = allSlots.filter(s => !filledSlots.has(s));

  if (emptySlots.length === 0) {
    return res.json({ drafted: [], message: 'Roster is already full', budget: user.budget });
  }

  const takenPlayerIds = new Set(
    db.prepare('SELECT player_id FROM rosters').all().map(r => r.player_id)
  );

  const availablePlayers = db.prepare(
    'SELECT * FROM players WHERE is_active = 1 ORDER BY fpg DESC'
  ).all().filter(p => !takenPlayerIds.has(p.id) && !myPlayerIds.has(p.id));

  let budget = user.budget;
  const drafted = [];

  const draftTransaction = db.transaction(() => {
    for (const slot of emptySlots) {
      const requiredPos = SLOT_LIMITS[slot];
      const candidate = availablePlayers.find(p => {
        if (p.price > budget) return false;
        if (requiredPos && p.position !== requiredPos) return false;
        if (drafted.some(d => d.id === p.id)) return false;
        return true;
      });

      if (!candidate) continue;

      db.prepare('INSERT INTO rosters (user_id, player_id, slot) VALUES (?, ?, ?)').run(req.user.id, candidate.id, slot);
      db.prepare('UPDATE users SET budget = budget - ? WHERE id = ?').run(candidate.price, req.user.id);
      budget -= candidate.price;
      drafted.push({ id: candidate.id, name: candidate.name, slot, price: candidate.price, fpg: candidate.fpg });
    }
  });

  draftTransaction();

  const updatedUser = db.prepare('SELECT budget FROM users WHERE id = ?').get(req.user.id);
  res.json({
    drafted,
    message: `Auto-drafted ${drafted.length} player${drafted.length !== 1 ? 's' : ''}`,
    budget: updatedUser.budget,
  });
});

router.put('/move', authenticate, (req, res) => {
  const { player_id, new_slot } = req.body;
  if (!player_id || !new_slot) {
    return res.status(400).json({ error: 'player_id and new_slot are required' });
  }

  const entry = db.prepare('SELECT r.*, p.position FROM rosters r JOIN players p ON r.player_id = p.id WHERE r.user_id = ? AND r.player_id = ?').get(req.user.id, player_id);
  if (!entry) return res.status(404).json({ error: 'Player not on your roster' });

  const requiredPosition = SLOT_LIMITS[new_slot];
  if (requiredPosition && entry.position !== requiredPosition) {
    return res.status(400).json({ error: `Slot ${new_slot} requires position ${requiredPosition}` });
  }

  const slotTaken = db.prepare('SELECT player_id FROM rosters WHERE user_id = ? AND slot = ?').get(req.user.id, new_slot);
  if (slotTaken) {
    db.prepare('UPDATE rosters SET slot = ? WHERE user_id = ? AND slot = ?').run(entry.slot, req.user.id, new_slot);
  }

  db.prepare('UPDATE rosters SET slot = ? WHERE user_id = ? AND player_id = ?').run(new_slot, req.user.id, player_id);
  res.json({ success: true });
});

module.exports = router;
