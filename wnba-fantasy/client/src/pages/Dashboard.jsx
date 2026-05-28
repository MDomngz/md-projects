import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { roster as rosterApi, admin } from '../api';

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="card">
      <p className="text-sm text-wnba-muted mb-1">{label}</p>
      <p className={`text-2xl font-bold ${accent ? 'text-wnba-orange' : ''}`}>{value}</p>
      {sub && <p className="text-xs text-wnba-muted mt-1">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [rosterData, setRosterData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    rosterApi.get().then(setRosterData).catch(() => {});
    admin.leaderboard().then(setLeaderboard).catch(() => {});
  }, []);

  const totalFpg = rosterData?.roster?.reduce((sum, p) => sum + (p.fpg || 0), 0).toFixed(1) || '0.0';
  const rosterCount = rosterData?.roster?.length || 0;
  const myRank = leaderboard.findIndex(l => l.id === user.id) + 1;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Welcome back, {user.username}</h1>
        <p className="text-wnba-muted mt-1">{user.team_name}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Fantasy Pts" value={totalFpg} sub="Per game" accent />
        <StatCard label="Roster Size" value={`${rosterCount}/10`} sub="Players drafted" />
        <StatCard label="Budget Remaining" value={`$${rosterData?.budget?.toFixed(1) || user.budget}`} sub="Of $100.0" />
        <StatCard label="League Rank" value={myRank ? `#${myRank}` : '—'} sub={`of ${leaderboard.length} teams`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">Your Roster</h2>
            <Link to="/roster" className="text-sm text-wnba-orange hover:underline">View all</Link>
          </div>
          {rosterCount === 0 ? (
            <div className="text-center py-8">
              <p className="text-wnba-muted mb-3">No players drafted yet</p>
              <Link to="/players" className="btn-primary text-sm">Browse Players</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {rosterData.roster.slice(0, 5).map(p => (
                <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-wnba-surface transition-colors">
                  <span className="text-xs font-mono text-wnba-muted w-12">{p.slot}</span>
                  <span className="font-medium flex-1">{p.name}</span>
                  <span className="text-sm text-wnba-muted">{p.team}</span>
                  <span className="text-sm font-semibold text-wnba-orange">{p.fpg} FP</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">Leaderboard</h2>
            <Link to="/leaderboard" className="text-sm text-wnba-orange hover:underline">View all</Link>
          </div>
          {leaderboard.length === 0 ? (
            <p className="text-wnba-muted text-center py-8">No teams yet</p>
          ) : (
            <div className="space-y-2">
              {leaderboard.slice(0, 5).map((entry, i) => (
                <div key={entry.id} className={`flex items-center gap-3 p-2 rounded-lg ${entry.id === user.id ? 'bg-wnba-orange/10' : 'hover:bg-wnba-surface'} transition-colors`}>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    i === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                    i === 1 ? 'bg-gray-400/20 text-gray-300' :
                    i === 2 ? 'bg-orange-700/20 text-orange-400' :
                    'bg-wnba-surface text-wnba-muted'
                  }`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{entry.team_name}</p>
                    <p className="text-xs text-wnba-muted">{entry.username}</p>
                  </div>
                  <span className="text-sm font-bold text-wnba-orange">{entry.total_fpg} FP</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
