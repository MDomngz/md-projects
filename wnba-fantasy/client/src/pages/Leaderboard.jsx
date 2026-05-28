import { useState, useEffect } from 'react';
import { admin } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Leaderboard() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    admin.leaderboard().then(setEntries).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <p className="text-wnba-muted mt-1">Fantasy points rankings across all teams</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-3 border-wnba-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : entries.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-wnba-muted">No teams registered yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Top 3 podium */}
          {entries.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[1, 0, 2].map(idx => {
                const e = entries[idx];
                if (!e) return null;
                const rank = idx + 1;
                const colors = ['bg-yellow-500/20 text-yellow-400 border-yellow-500/30', 'bg-gray-400/20 text-gray-300 border-gray-400/30', 'bg-orange-700/20 text-orange-400 border-orange-700/30'];
                const sizes = ['text-4xl h-20 w-20', 'text-3xl h-16 w-16', 'text-3xl h-16 w-16'];
                return (
                  <div key={e.id} className={`card text-center ${idx === 0 ? 'order-2' : idx === 1 ? 'order-1 mt-6' : 'order-3 mt-6'}`}>
                    <div className={`${sizes[idx]} rounded-full ${colors[idx]} border-2 flex items-center justify-center font-extrabold mx-auto mb-3`}>
                      {rank}
                    </div>
                    <p className="font-bold truncate">{e.team_name}</p>
                    <p className="text-xs text-wnba-muted">{e.username}</p>
                    <p className="text-2xl font-bold text-wnba-orange mt-2">{e.total_fpg}</p>
                    <p className="text-xs text-wnba-muted">Fantasy Points</p>
                    <div className="flex justify-center gap-4 mt-3 text-xs text-wnba-muted">
                      <span>{e.roster_count} players</span>
                      <span>${e.budget} left</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Rest of leaderboard */}
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-wnba-border text-xs text-wnba-muted uppercase tracking-wider">
                  <th className="text-left p-3 w-12">#</th>
                  <th className="text-left p-3">Team</th>
                  <th className="text-right p-3">Players</th>
                  <th className="text-right p-3">Budget</th>
                  <th className="text-right p-3">Fantasy Pts</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e, i) => (
                  <tr key={e.id} className={`border-b border-wnba-border/50 last:border-0 transition-colors ${
                    e.id === user.id ? 'bg-wnba-orange/5' : 'hover:bg-wnba-surface/50'
                  }`}>
                    <td className="p-3">
                      <span className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-bold ${
                        i === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                        i === 1 ? 'bg-gray-400/20 text-gray-300' :
                        i === 2 ? 'bg-orange-700/20 text-orange-400' :
                        'text-wnba-muted'
                      }`}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="p-3">
                      <p className="font-semibold">{e.team_name}</p>
                      <p className="text-xs text-wnba-muted">{e.username}</p>
                    </td>
                    <td className="p-3 text-right text-sm">{e.roster_count}/10</td>
                    <td className="p-3 text-right text-sm">${e.budget}</td>
                    <td className="p-3 text-right">
                      <span className="font-bold text-wnba-orange">{e.total_fpg}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
