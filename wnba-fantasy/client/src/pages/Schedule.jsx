import { useState, useEffect, useMemo } from 'react';
import { schedule as scheduleApi, players as playersApi } from '../api';

const STATUS_STYLES = {
  live: 'bg-red-500/20 text-red-400 border-red-500/30',
  final: 'bg-wnba-surface text-wnba-muted border-wnba-border',
  scheduled: 'bg-wnba-blue/20 text-blue-300 border-blue-500/30',
};

const STATUS_LABELS = { live: 'LIVE', final: 'Final', scheduled: 'Upcoming' };

function GameCard({ game }) {
  const isLive = game.status === 'live';
  const isFinal = game.status === 'final';

  return (
    <div className={`card border ${isLive ? 'border-red-500/40 bg-red-500/5' : ''} transition-all`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`badge border ${STATUS_STYLES[game.status]}`}>
            {isLive && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse mr-1.5" />}
            {STATUS_LABELS[game.status]}
          </span>
          {game.broadcast && (
            <span className="text-xs text-wnba-muted">{game.broadcast}</span>
          )}
        </div>
        <span className="text-xs text-wnba-muted">{game.game_time}</span>
      </div>

      <div className="space-y-2">
        {/* Away team */}
        <div className={`flex items-center justify-between p-2.5 rounded-lg ${
          isFinal && game.away_score > game.home_score ? 'bg-wnba-orange/10' : 'bg-wnba-surface/50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-wnba-surface flex items-center justify-center text-xs font-bold text-wnba-muted">
              {game.away_team.split(' ').pop().slice(0, 3).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-sm">{game.away_team}</p>
              <p className="text-xs text-wnba-muted">Away</p>
            </div>
          </div>
          {(isLive || isFinal) && (
            <span className={`text-xl font-bold ${
              isFinal && game.away_score > game.home_score ? 'text-wnba-orange' : ''
            }`}>
              {game.away_score}
            </span>
          )}
        </div>

        {/* Home team */}
        <div className={`flex items-center justify-between p-2.5 rounded-lg ${
          isFinal && game.home_score > game.away_score ? 'bg-wnba-orange/10' : 'bg-wnba-surface/50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-wnba-surface flex items-center justify-center text-xs font-bold text-wnba-muted">
              {game.home_team.split(' ').pop().slice(0, 3).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-sm">{game.home_team}</p>
              <p className="text-xs text-wnba-muted">Home</p>
            </div>
          </div>
          {(isLive || isFinal) && (
            <span className={`text-xl font-bold ${
              isFinal && game.home_score > game.away_score ? 'text-wnba-orange' : ''
            }`}>
              {game.home_score}
            </span>
          )}
        </div>
      </div>

      {game.venue && (
        <p className="text-xs text-wnba-muted mt-3 pt-3 border-t border-wnba-border">{game.venue}</p>
      )}
    </div>
  );
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const diff = Math.round((d - today) / 86400000);

  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';

  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function Schedule() {
  const [games, setGames] = useState([]);
  const [teams, setTeams] = useState([]);
  const [teamFilter, setTeamFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [weekOffset, setWeekOffset] = useState(0);
  const [loading, setLoading] = useState(true);

  const startDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + weekOffset * 7 - 7);
    return d.toISOString().split('T')[0];
  }, [weekOffset]);

  useEffect(() => {
    playersApi.teams().then(setTeams).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (teamFilter) params.team = teamFilter;
    if (statusFilter) params.status = statusFilter;

    const endDate = new Date(new Date(startDate).getTime() + 14 * 86400000).toISOString().split('T')[0];

    scheduleApi.list(params).then(all => {
      const inRange = all.filter(g => g.game_date >= startDate && g.game_date <= endDate);
      setGames(inRange);
    }).catch(console.error).finally(() => setLoading(false));
  }, [startDate, teamFilter, statusFilter]);

  const grouped = useMemo(() => {
    const map = {};
    games.forEach(g => {
      if (!map[g.game_date]) map[g.game_date] = [];
      map[g.game_date].push(g);
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [games]);

  const liveGames = games.filter(g => g.status === 'live');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Schedule</h1>
        <p className="text-wnba-muted mt-1">WNBA game schedule and scores</p>
      </div>

      {liveGames.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="font-bold text-red-400">Live Now</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveGames.map(g => <GameCard key={g.id} game={g} />)}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-wnba-muted mb-1">Team</label>
            <select value={teamFilter} onChange={e => setTeamFilter(e.target.value)} className="min-w-[160px]">
              <option value="">All Teams</option>
              {teams.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-wnba-muted mb-1">Status</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="min-w-[120px]">
              <option value="">All</option>
              <option value="scheduled">Upcoming</option>
              <option value="live">Live</option>
              <option value="final">Final</option>
            </select>
          </div>
          <div className="flex gap-2 ml-auto">
            <button onClick={() => setWeekOffset(w => w - 1)} className="btn-secondary text-sm px-3">
              &larr; Prev
            </button>
            <button onClick={() => setWeekOffset(0)} className="btn-secondary text-sm px-3">
              This Week
            </button>
            <button onClick={() => setWeekOffset(w => w + 1)} className="btn-secondary text-sm px-3">
              Next &rarr;
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-3 border-wnba-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : grouped.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-wnba-muted">No games found for this period</p>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(([date, dayGames]) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="font-bold text-lg">{formatDate(date)}</h2>
                <span className="text-sm text-wnba-muted">
                  {new Date(date + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="badge bg-wnba-surface text-wnba-muted">{dayGames.length} game{dayGames.length !== 1 ? 's' : ''}</span>
                <div className="flex-1 border-t border-wnba-border" />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dayGames.map(g => <GameCard key={g.id} game={g} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
