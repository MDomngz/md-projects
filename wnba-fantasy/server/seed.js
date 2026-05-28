const bcrypt = require('bcryptjs');
const db = require('./db');

db.exec('DELETE FROM scoring_events; DELETE FROM rosters; DELETE FROM games; DELETE FROM players; DELETE FROM users;');

const adminHash = bcrypt.hashSync('admin123', 10);
db.prepare('INSERT INTO users (username, email, password, role, team_name) VALUES (?, ?, ?, ?, ?)').run('admin', 'admin@wnbafantasy.com', adminHash, 'admin', 'League Office');

const demoHash = bcrypt.hashSync('demo123', 10);
db.prepare('INSERT INTO users (username, email, password, role, team_name) VALUES (?, ?, ?, ?, ?)').run('demo', 'demo@wnbafantasy.com', demoHash, 'user', 'Demo Squad');

const players = [
  // Las Vegas Aces
  { name: "A'ja Wilson", team: 'Las Vegas Aces', position: 'F', number: 22, height: "6'4\"", price: 18.0, ppg: 22.2, rpg: 9.3, apg: 2.3, spg: 1.4, bpg: 2.6, fpg: 42.5 },
  { name: 'Kelsey Plum', team: 'Las Vegas Aces', position: 'G', number: 10, height: "5'8\"", price: 14.0, ppg: 17.8, rpg: 2.8, apg: 5.1, spg: 1.1, bpg: 0.2, fpg: 28.9 },
  { name: 'Jackie Young', team: 'Las Vegas Aces', position: 'G', number: 0, height: "6'0\"", price: 12.0, ppg: 15.5, rpg: 4.2, apg: 4.8, spg: 1.0, bpg: 0.3, fpg: 28.0 },
  { name: 'Chelsea Gray', team: 'Las Vegas Aces', position: 'G', number: 12, height: "5'11\"", price: 10.5, ppg: 9.5, rpg: 2.5, apg: 6.2, spg: 1.0, bpg: 0.1, fpg: 22.5 },
  { name: 'Kiah Stokes', team: 'Las Vegas Aces', position: 'C', number: 41, height: "6'3\"", price: 6.5, ppg: 5.2, rpg: 5.8, apg: 1.0, spg: 0.5, bpg: 1.2, fpg: 16.0 },
  { name: 'Tiffany Hayes', team: 'Las Vegas Aces', position: 'G', number: 15, height: "5'10\"", price: 8.0, ppg: 10.8, rpg: 2.5, apg: 2.2, spg: 0.8, bpg: 0.2, fpg: 17.5 },

  // New York Liberty
  { name: 'Breanna Stewart', team: 'New York Liberty', position: 'F', number: 30, height: "6'4\"", price: 17.5, ppg: 20.1, rpg: 8.4, apg: 3.1, spg: 1.5, bpg: 1.9, fpg: 39.8 },
  { name: 'Sabrina Ionescu', team: 'New York Liberty', position: 'G', number: 20, height: "5'11\"", price: 15.0, ppg: 19.3, rpg: 4.2, apg: 6.1, spg: 1.2, bpg: 0.3, fpg: 33.6 },
  { name: 'Jonquel Jones', team: 'New York Liberty', position: 'C', number: 35, height: "6'6\"", price: 15.0, ppg: 14.5, rpg: 8.3, apg: 2.4, spg: 1.1, bpg: 1.4, fpg: 31.5 },
  { name: 'Courtney Vandersloot', team: 'New York Liberty', position: 'G', number: 22, height: "5'8\"", price: 10.0, ppg: 7.5, rpg: 2.8, apg: 8.0, spg: 1.0, bpg: 0.1, fpg: 24.3 },
  { name: 'Betnijah Laney-Hamilton', team: 'New York Liberty', position: 'G', number: 44, height: "6'0\"", price: 9.0, ppg: 10.2, rpg: 3.5, apg: 3.0, spg: 1.1, bpg: 0.3, fpg: 20.5 },
  { name: 'Leonie Fiebich', team: 'New York Liberty', position: 'F', number: 5, height: "6'1\"", price: 7.0, ppg: 8.5, rpg: 3.2, apg: 2.0, spg: 0.9, bpg: 0.5, fpg: 17.0 },

  // Minnesota Lynx
  { name: 'Napheesa Collier', team: 'Minnesota Lynx', position: 'F', number: 24, height: "6'1\"", price: 16.5, ppg: 20.4, rpg: 9.7, apg: 3.4, spg: 1.8, bpg: 1.2, fpg: 40.1 },
  { name: 'Kayla McBride', team: 'Minnesota Lynx', position: 'G', number: 21, height: "5'11\"", price: 9.5, ppg: 13.8, rpg: 3.2, apg: 2.5, spg: 0.8, bpg: 0.3, fpg: 22.0 },
  { name: 'Courtney Williams', team: 'Minnesota Lynx', position: 'G', number: 10, height: "5'8\"", price: 8.5, ppg: 11.5, rpg: 3.8, apg: 4.5, spg: 1.2, bpg: 0.2, fpg: 23.8 },
  { name: 'Alanna Smith', team: 'Minnesota Lynx', position: 'F', number: 11, height: "6'4\"", price: 7.0, ppg: 8.0, rpg: 4.5, apg: 1.5, spg: 0.6, bpg: 0.8, fpg: 17.5 },
  { name: 'Dorka Juhász', team: 'Minnesota Lynx', position: 'C', number: 14, height: "6'5\"", price: 6.0, ppg: 6.5, rpg: 5.5, apg: 1.0, spg: 0.4, bpg: 0.9, fpg: 16.0 },
  { name: 'Natisha Hiedeman', team: 'Minnesota Lynx', position: 'G', number: 2, height: "5'9\"", price: 5.5, ppg: 7.0, rpg: 2.0, apg: 3.0, spg: 0.7, bpg: 0.1, fpg: 14.0 },

  // Connecticut Sun
  { name: 'Alyssa Thomas', team: 'Connecticut Sun', position: 'F', number: 25, height: "6'2\"", price: 14.5, ppg: 11.4, rpg: 8.2, apg: 7.9, spg: 1.6, bpg: 0.5, fpg: 35.2 },
  { name: 'DeWanna Bonner', team: 'Connecticut Sun', position: 'F', number: 24, height: "6'4\"", price: 12.5, ppg: 15.8, rpg: 5.8, apg: 2.7, spg: 1.2, bpg: 0.9, fpg: 28.7 },
  { name: 'Marina Mabrey', team: 'Connecticut Sun', position: 'G', number: 4, height: "5'11\"", price: 10.0, ppg: 14.6, rpg: 3.5, apg: 4.2, spg: 0.9, bpg: 0.3, fpg: 25.5 },
  { name: 'Brionna Jones', team: 'Connecticut Sun', position: 'C', number: 42, height: "6'3\"", price: 10.5, ppg: 14.0, rpg: 6.8, apg: 1.5, spg: 0.8, bpg: 1.1, fpg: 26.5 },
  { name: 'DiJonai Carrington', team: 'Connecticut Sun', position: 'G', number: 21, height: "6'0\"", price: 9.0, ppg: 12.5, rpg: 4.0, apg: 2.0, spg: 1.5, bpg: 0.4, fpg: 22.8 },
  { name: 'Tyasha Harris', team: 'Connecticut Sun', position: 'G', number: 52, height: "5'10\"", price: 5.0, ppg: 5.8, rpg: 1.8, apg: 3.5, spg: 0.6, bpg: 0.1, fpg: 13.0 },

  // Indiana Fever
  { name: 'Caitlin Clark', team: 'Indiana Fever', position: 'G', number: 22, height: "6'0\"", price: 16.0, ppg: 19.2, rpg: 5.7, apg: 8.4, spg: 1.3, bpg: 0.7, fpg: 38.5 },
  { name: 'Aliyah Boston', team: 'Indiana Fever', position: 'F', number: 7, height: "6'5\"", price: 12.0, ppg: 14.5, rpg: 8.9, apg: 2.5, spg: 0.9, bpg: 1.1, fpg: 30.5 },
  { name: 'Kelsey Mitchell', team: 'Indiana Fever', position: 'G', number: 0, height: "5'8\"", price: 9.5, ppg: 14.8, rpg: 2.5, apg: 2.8, spg: 0.9, bpg: 0.1, fpg: 22.0 },
  { name: 'NaLyssa Smith', team: 'Indiana Fever', position: 'F', number: 1, height: "6'4\"", price: 8.0, ppg: 9.5, rpg: 6.2, apg: 1.2, spg: 0.5, bpg: 0.7, fpg: 19.5 },
  { name: 'Lexie Hull', team: 'Indiana Fever', position: 'G', number: 10, height: "6'1\"", price: 5.5, ppg: 6.5, rpg: 2.8, apg: 1.5, spg: 0.8, bpg: 0.3, fpg: 13.5 },
  { name: 'Temi Fagbenle', team: 'Indiana Fever', position: 'C', number: 14, height: "6'4\"", price: 7.0, ppg: 8.0, rpg: 5.0, apg: 2.0, spg: 0.5, bpg: 0.6, fpg: 17.5 },

  // Chicago Sky
  { name: 'Angel Reese', team: 'Chicago Sky', position: 'F', number: 5, height: "6'3\"", price: 13.0, ppg: 13.1, rpg: 13.2, apg: 1.9, spg: 1.3, bpg: 0.5, fpg: 32.8 },
  { name: 'Chennedy Carter', team: 'Chicago Sky', position: 'G', number: 7, height: "5'9\"", price: 10.0, ppg: 16.0, rpg: 2.8, apg: 3.5, spg: 1.0, bpg: 0.1, fpg: 24.5 },
  { name: 'Dana Evans', team: 'Chicago Sky', position: 'G', number: 11, height: "5'6\"", price: 7.5, ppg: 10.5, rpg: 2.0, apg: 3.8, spg: 0.8, bpg: 0.1, fpg: 19.0 },
  { name: 'Elizabeth Williams', team: 'Chicago Sky', position: 'C', number: 1, height: "6'3\"", price: 7.5, ppg: 7.8, rpg: 4.8, apg: 1.5, spg: 0.6, bpg: 1.5, fpg: 19.5 },
  { name: 'Isabelle Harrison', team: 'Chicago Sky', position: 'F', number: 20, height: "6'3\"", price: 6.0, ppg: 7.0, rpg: 4.5, apg: 1.0, spg: 0.5, bpg: 0.8, fpg: 15.5 },
  { name: 'Lindsay Allen', team: 'Chicago Sky', position: 'G', number: 2, height: "5'8\"", price: 5.0, ppg: 5.5, rpg: 1.5, apg: 4.0, spg: 0.6, bpg: 0.0, fpg: 13.5 },

  // Phoenix Mercury
  { name: 'Kahleah Copper', team: 'Phoenix Mercury', position: 'G', number: 2, height: "6'0\"", price: 13.5, ppg: 21.5, rpg: 4.1, apg: 3.2, spg: 1.4, bpg: 0.5, fpg: 33.0 },
  { name: 'Brittney Griner', team: 'Phoenix Mercury', position: 'C', number: 42, height: "6'9\"", price: 13.0, ppg: 17.5, rpg: 6.3, apg: 1.5, spg: 0.5, bpg: 1.7, fpg: 28.4 },
  { name: 'Natasha Cloud', team: 'Phoenix Mercury', position: 'G', number: 9, height: "6'0\"", price: 9.0, ppg: 9.2, rpg: 3.0, apg: 6.5, spg: 1.2, bpg: 0.2, fpg: 23.5 },
  { name: 'Rebecca Allen', team: 'Phoenix Mercury', position: 'F', number: 9, height: "6'2\"", price: 6.5, ppg: 8.0, rpg: 3.5, apg: 1.5, spg: 0.7, bpg: 0.4, fpg: 15.5 },
  { name: 'Charisma Osborne', team: 'Phoenix Mercury', position: 'G', number: 1, height: "5'9\"", price: 5.5, ppg: 7.5, rpg: 2.2, apg: 3.0, spg: 0.8, bpg: 0.1, fpg: 15.0 },
  { name: 'Mikiah Herbert Harrigan', team: 'Phoenix Mercury', position: 'F', number: 21, height: "6'2\"", price: 5.0, ppg: 5.5, rpg: 3.5, apg: 0.8, spg: 0.4, bpg: 1.0, fpg: 13.0 },

  // Seattle Storm
  { name: 'Jewell Loyd', team: 'Seattle Storm', position: 'G', number: 24, height: "5'10\"", price: 14.0, ppg: 19.7, rpg: 3.1, apg: 4.5, spg: 1.3, bpg: 0.4, fpg: 31.2 },
  { name: 'Nneka Ogwumike', team: 'Seattle Storm', position: 'F', number: 30, height: "6'2\"", price: 11.0, ppg: 14.2, rpg: 6.1, apg: 2.3, spg: 0.9, bpg: 0.6, fpg: 26.0 },
  { name: 'Skylar Diggins-Smith', team: 'Seattle Storm', position: 'G', number: 4, height: "5'9\"", price: 11.5, ppg: 15.3, rpg: 3.5, apg: 5.8, spg: 1.3, bpg: 0.2, fpg: 29.0 },
  { name: 'Ezi Magbegor', team: 'Seattle Storm', position: 'C', number: 13, height: "6'4\"", price: 9.0, ppg: 10.5, rpg: 6.5, apg: 1.5, spg: 0.6, bpg: 1.8, fpg: 24.0 },
  { name: 'Jordan Horston', team: 'Seattle Storm', position: 'G', number: 25, height: "6'2\"", price: 7.0, ppg: 9.0, rpg: 3.5, apg: 2.5, spg: 0.9, bpg: 0.3, fpg: 17.5 },
  { name: 'Mercedes Russell', team: 'Seattle Storm', position: 'C', number: 2, height: "6'5\"", price: 5.5, ppg: 5.0, rpg: 4.5, apg: 0.8, spg: 0.3, bpg: 0.7, fpg: 13.0 },

  // Dallas Wings
  { name: 'Arike Ogunbowale', team: 'Dallas Wings', position: 'G', number: 24, height: "5'8\"", price: 13.5, ppg: 22.3, rpg: 3.1, apg: 5.0, spg: 1.1, bpg: 0.2, fpg: 32.2 },
  { name: 'Satou Sabally', team: 'Dallas Wings', position: 'F', number: 0, height: "6'4\"", price: 11.5, ppg: 13.8, rpg: 5.6, apg: 3.0, spg: 1.0, bpg: 0.6, fpg: 27.0 },
  { name: 'Natasha Howard', team: 'Dallas Wings', position: 'F', number: 6, height: "6'2\"", price: 9.5, ppg: 12.0, rpg: 5.5, apg: 1.8, spg: 0.8, bpg: 1.0, fpg: 23.5 },
  { name: 'Teaira McCowan', team: 'Dallas Wings', position: 'C', number: 15, height: "6'7\"", price: 7.5, ppg: 8.5, rpg: 7.0, apg: 0.8, spg: 0.4, bpg: 1.3, fpg: 20.0 },
  { name: 'Odyssey Sims', team: 'Dallas Wings', position: 'G', number: 2, height: "5'8\"", price: 6.5, ppg: 8.5, rpg: 2.5, apg: 3.5, spg: 0.8, bpg: 0.1, fpg: 16.5 },
  { name: 'Jacy Sheldon', team: 'Dallas Wings', position: 'G', number: 3, height: "5'10\"", price: 6.0, ppg: 7.8, rpg: 2.0, apg: 2.5, spg: 1.0, bpg: 0.2, fpg: 15.0 },

  // Los Angeles Sparks
  { name: 'Dearica Hamby', team: 'Los Angeles Sparks', position: 'F', number: 5, height: "6'3\"", price: 12.0, ppg: 18.2, rpg: 9.5, apg: 3.0, spg: 0.9, bpg: 0.7, fpg: 34.2 },
  { name: 'Cameron Brink', team: 'Los Angeles Sparks', position: 'F', number: 22, height: "6'4\"", price: 11.0, ppg: 8.1, rpg: 5.7, apg: 2.5, spg: 1.0, bpg: 2.3, fpg: 24.6 },
  { name: 'Rickea Jackson', team: 'Los Angeles Sparks', position: 'F', number: 2, height: "6'2\"", price: 10.5, ppg: 15.5, rpg: 4.8, apg: 1.7, spg: 0.8, bpg: 0.5, fpg: 24.0 },
  { name: 'Kia Nurse', team: 'Los Angeles Sparks', position: 'G', number: 12, height: "6'0\"", price: 7.5, ppg: 10.0, rpg: 2.5, apg: 2.0, spg: 0.7, bpg: 0.2, fpg: 16.0 },
  { name: 'Azurá Stevens', team: 'Los Angeles Sparks', position: 'C', number: 30, height: "6'6\"", price: 7.0, ppg: 8.5, rpg: 4.5, apg: 1.5, spg: 0.5, bpg: 1.0, fpg: 18.0 },
  { name: 'Aari McDonald', team: 'Los Angeles Sparks', position: 'G', number: 4, height: "5'6\"", price: 5.5, ppg: 7.0, rpg: 2.0, apg: 3.0, spg: 1.0, bpg: 0.1, fpg: 15.0 },

  // Atlanta Dream
  { name: 'Rhyne Howard', team: 'Atlanta Dream', position: 'G', number: 10, height: "6'2\"", price: 11.0, ppg: 16.2, rpg: 4.5, apg: 2.8, spg: 1.5, bpg: 0.4, fpg: 28.5 },
  { name: 'Tina Charles', team: 'Atlanta Dream', position: 'C', number: 31, height: "6'4\"", price: 10.0, ppg: 12.5, rpg: 7.2, apg: 1.8, spg: 0.6, bpg: 1.3, fpg: 25.8 },
  { name: 'Allisha Gray', team: 'Atlanta Dream', position: 'G', number: 15, height: "6'0\"", price: 9.5, ppg: 13.5, rpg: 3.8, apg: 2.5, spg: 1.0, bpg: 0.3, fpg: 22.5 },
  { name: 'Jordin Canada', team: 'Atlanta Dream', position: 'G', number: 21, height: "5'6\"", price: 6.5, ppg: 7.5, rpg: 2.0, apg: 4.5, spg: 1.0, bpg: 0.1, fpg: 17.5 },
  { name: 'Cheyenne Parker-Tyus', team: 'Atlanta Dream', position: 'F', number: 32, height: "6'4\"", price: 6.0, ppg: 7.0, rpg: 5.0, apg: 1.0, spg: 0.4, bpg: 0.8, fpg: 16.0 },
  { name: 'Naz Hillmon', team: 'Atlanta Dream', position: 'F', number: 00, height: "6'2\"", price: 5.0, ppg: 6.0, rpg: 4.0, apg: 0.8, spg: 0.3, bpg: 0.4, fpg: 12.5 },

  // Washington Mystics
  { name: 'Ariel Atkins', team: 'Washington Mystics', position: 'G', number: 7, height: "5'11\"", price: 10.0, ppg: 14.0, rpg: 3.5, apg: 3.5, spg: 1.2, bpg: 0.3, fpg: 24.5 },
  { name: 'Stefanie Dolson', team: 'Washington Mystics', position: 'C', number: 31, height: "6'5\"", price: 8.5, ppg: 8.2, rpg: 5.5, apg: 2.8, spg: 0.7, bpg: 0.9, fpg: 20.5 },
  { name: 'Myisha Hines-Allen', team: 'Washington Mystics', position: 'F', number: 2, height: "6'1\"", price: 8.0, ppg: 10.5, rpg: 5.0, apg: 2.0, spg: 0.8, bpg: 0.4, fpg: 20.0 },
  { name: 'Brittney Sykes', team: 'Washington Mystics', position: 'G', number: 5, height: "5'9\"", price: 6.5, ppg: 8.0, rpg: 2.8, apg: 2.5, spg: 1.2, bpg: 0.2, fpg: 16.5 },
  { name: 'Shakira Austin', team: 'Washington Mystics', position: 'C', number: 0, height: "6'5\"", price: 6.0, ppg: 7.0, rpg: 5.5, apg: 1.0, spg: 0.4, bpg: 1.0, fpg: 17.0 },
  { name: 'Julie Vanloo', team: 'Washington Mystics', position: 'G', number: 18, height: "5'7\"", price: 5.0, ppg: 6.5, rpg: 1.5, apg: 4.0, spg: 0.7, bpg: 0.0, fpg: 14.5 },
];

const insert = db.prepare(
  `INSERT INTO players (name, team, position, number, height, price, ppg, rpg, apg, spg, bpg, fpg)
   VALUES (@name, @team, @position, @number, @height, @price, @ppg, @rpg, @apg, @spg, @bpg, @fpg)`
);

const insertMany = db.transaction((list) => {
  for (const p of list) insert.run(p);
});

insertMany(players);

// Seed schedule — games for the 2025 season
const teams = [
  'Las Vegas Aces', 'New York Liberty', 'Minnesota Lynx', 'Connecticut Sun',
  'Indiana Fever', 'Chicago Sky', 'Phoenix Mercury', 'Seattle Storm',
  'Dallas Wings', 'Los Angeles Sparks', 'Atlanta Dream', 'Washington Mystics'
];

const venues = {
  'Las Vegas Aces': 'Michelob ULTRA Arena',
  'New York Liberty': 'Barclays Center',
  'Minnesota Lynx': 'Target Center',
  'Connecticut Sun': 'Mohegan Sun Arena',
  'Indiana Fever': 'Gainbridge Fieldhouse',
  'Chicago Sky': 'Wintrust Arena',
  'Phoenix Mercury': 'Footprint Center',
  'Seattle Storm': 'Climate Pledge Arena',
  'Dallas Wings': 'College Park Center',
  'Los Angeles Sparks': 'Crypto.com Arena',
  'Atlanta Dream': 'Gateway Center Arena',
  'Washington Mystics': 'Entertainment & Sports Arena',
};

const broadcasts = ['ESPN', 'ESPN2', 'ABC', 'CBS Sports', 'ION', 'NBA TV', 'Amazon Prime'];
const gameTimes = ['12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '5:00 PM', '7:00 PM', '7:30 PM', '8:00 PM', '9:00 PM', '10:00 PM'];

const insertGame = db.prepare(
  `INSERT INTO games (home_team, away_team, game_date, game_time, home_score, away_score, status, venue, broadcast)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
);

const now = new Date();
const toDateStr = (d) => d.toISOString().split('T')[0];

const seedGames = db.transaction(() => {
  // Past games (completed) — last 2 weeks
  for (let d = 14; d >= 1; d--) {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    const dateStr = toDateStr(date);
    const gamesPerDay = 2 + Math.floor(Math.random() * 3);

    const shuffled = [...teams].sort(() => Math.random() - 0.5);
    for (let g = 0; g < gamesPerDay && g * 2 + 1 < shuffled.length; g++) {
      const home = shuffled[g * 2];
      const away = shuffled[g * 2 + 1];
      const homeScore = 70 + Math.floor(Math.random() * 30);
      const awayScore = 70 + Math.floor(Math.random() * 30);
      const time = gameTimes[Math.floor(Math.random() * gameTimes.length)];
      const bc = broadcasts[Math.floor(Math.random() * broadcasts.length)];
      insertGame.run(home, away, dateStr, time, homeScore, awayScore, 'final', venues[home], bc);
    }
  }

  // Today's games (mix of live and scheduled)
  const today = toDateStr(now);
  const todayShuffled = [...teams].sort(() => Math.random() - 0.5);
  for (let g = 0; g < 3 && g * 2 + 1 < todayShuffled.length; g++) {
    const home = todayShuffled[g * 2];
    const away = todayShuffled[g * 2 + 1];
    const time = gameTimes[4 + Math.floor(Math.random() * 6)];
    const bc = broadcasts[Math.floor(Math.random() * broadcasts.length)];
    if (g === 0) {
      const homeScore = 40 + Math.floor(Math.random() * 20);
      const awayScore = 40 + Math.floor(Math.random() * 20);
      insertGame.run(home, away, today, '3:00 PM', homeScore, awayScore, 'live', venues[home], bc);
    } else {
      insertGame.run(home, away, today, time, null, null, 'scheduled', venues[home], bc);
    }
  }

  // Future games — next 3 weeks
  for (let d = 1; d <= 21; d++) {
    const date = new Date(now);
    date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];
    const gamesPerDay = 2 + Math.floor(Math.random() * 4);

    const shuffled = [...teams].sort(() => Math.random() - 0.5);
    for (let g = 0; g < gamesPerDay && g * 2 + 1 < shuffled.length; g++) {
      const home = shuffled[g * 2];
      const away = shuffled[g * 2 + 1];
      const time = gameTimes[Math.floor(Math.random() * gameTimes.length)];
      const bc = broadcasts[Math.floor(Math.random() * broadcasts.length)];
      insertGame.run(home, away, dateStr, time, null, null, 'scheduled', venues[home], bc);
    }
  }
});

seedGames();

const gameCount = db.prepare('SELECT COUNT(*) as c FROM games').get().c;
console.log(`Seeded ${players.length} players, ${gameCount} games, and 2 users`);
console.log(`Max full teams: ${Math.floor(players.length / 10)} (${players.length} players / 10 roster slots)`);
console.log('Admin login: admin@wnbafantasy.com / admin123');
console.log('Demo login:  demo@wnbafantasy.com / demo123');
