import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { admin } from '../api';

function StatCard({ label, value, color }) {
  return (
    <div className="card">
      <p className="text-sm text-wnba-muted mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color || ''}`}>{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    admin.stats().then(setStats).catch(console.error);
    admin.leaderboard().then(setLeaderboard).catch(console.error);
  }, []);

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="badge bg-red-500/20 text-red-400">Admin</span>
        </div>
        <h1 className="text-2xl font-bold">League Overview</h1>
        <p className="text-wnba-muted mt-1">Manage your WNBA Fantasy league</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Registered Users" value={stats?.totalUsers ?? '—'} />
        <StatCard label="Active Players" value={stats?.totalPlayers ?? '—'} />
        <StatCard label="Players Drafted" value={stats?.totalDrafted ?? '—'} color="text-wnba-orange" />
        <StatCard label="Avg Budget Left" value={stats ? `$${stats.avgBudget}` : '—'} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-bold text-lg mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/admin/players" className="p-4 rounded-xl bg-wnba-surface hover:bg-wnba-border/50 border border-wnba-border transition-all text-center">
              <div className="text-2xl mb-2">🏀</div>
              <p className="font-medium text-sm">Manage Players</p>
              <p className="text-xs text-wnba-muted mt-1">Add, edit, remove</p>
            </Link>
            <Link to="/admin/users" className="p-4 rounded-xl bg-wnba-surface hover:bg-wnba-border/50 border border-wnba-border transition-all text-center">
              <div className="text-2xl mb-2">👥</div>
              <p className="font-medium text-sm">Manage Users</p>
              <p className="text-xs text-wnba-muted mt-1">Roles & budgets</p>
            </Link>
            <Link to="/players" className="p-4 rounded-xl bg-wnba-surface hover:bg-wnba-border/50 border border-wnba-border transition-all text-center">
              <div className="text-2xl mb-2">📊</div>
              <p className="font-medium text-sm">Player Market</p>
              <p className="text-xs text-wnba-muted mt-1">View all players</p>
            </Link>
            <Link to="/leaderboard" className="p-4 rounded-xl bg-wnba-surface hover:bg-wnba-border/50 border border-wnba-border transition-all text-center">
              <div className="text-2xl mb-2">🏆</div>
              <p className="font-medium text-sm">Leaderboard</p>
              <p className="text-xs text-wnba-muted mt-1">Team rankings</p>
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="font-bold text-lg mb-4">Top Teams</h2>
          {leaderboard.length === 0 ? (
            <p className="text-wnba-muted text-center py-8">No teams yet</p>
          ) : (
            <div className="space-y-2">
              {leaderboard.slice(0, 8).map((entry, i) => (
                <div key={entry.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-wnba-surface transition-colors">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    i < 3 ? 'bg-wnba-orange/20 text-wnba-orange' : 'text-wnba-muted'
                  }`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{entry.team_name}</p>
                  </div>
                  <span className="text-sm text-wnba-muted">{entry.roster_count}p</span>
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
