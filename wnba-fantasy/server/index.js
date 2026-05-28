const express = require('express');
const cors = require('cors');
const path = require('path');

require('./db');

const authRoutes = require('./routes/authRoutes');
const playerRoutes = require('./routes/playerRoutes');
const rosterRoutes = require('./routes/rosterRoutes');
const adminRoutes = require('./routes/adminRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/roster', rosterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/schedule', scheduleRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`WNBA Fantasy server running on http://localhost:${PORT}`);
});
