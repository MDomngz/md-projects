import { useState, useEffect, useMemo } from 'react';
import { players as playersApi } from '../api';

const STATS = [
  { key: 'fpg', label: 'Fantasy Pts', color: 'text-wnba-orange' },
  { key: 'ppg', label: 'Points' },
  { key: 'rpg', label: 'Rebounds' },
  { key: 'apg', label: 'Assists' },
  { key: 'spg', label: 'Steals' },
  { key: 'bpg', label: 'Blocks' },
];

const positionColors = { G: 'badge-g', F: 'badge-f', C: 'badge-c' };

export default function PlayerLeaderboard() {
  const [allPlayers, setAllPlayers] = useState([]);
  const [activeStat, setActiveStat] = useState('fpg');
  const [posFilter, setPosFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    playersApi.list({ sort: 'fpg', order: 'desc' }).then(setAllPlayers).catch(console.error).finally(() => setLoading(false));
  }, []);

  const sorted = useMemo(() => {
    let list = posFilter ? allPlayers.filter(p => p.position === posFilter) : allPlayers;
    return [...list].sort((a, b) => b[activeStat] - a[activeStat]);
  }, [allPlayers, activeStat, posFilter]);

  const maxVal = sorted.length > 0 ? sorted[0][activeStat] : 1;
  const statInfo = STATS.find(s => s.key === activeStat);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Player Leaderboard</h1>
        <p className="text-wnba-muted mt-1">Top WNBA performers ranked by stats</p>
      </div>

      {/* Stat selector */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-wnba-muted mr-1">Rank by:</span>
          {STATS.map(stat => (
            <button
              key={stat.key}
              onClick={() => setActiveStat(stat.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeStat === stat.key
                  ? 'bg-wnba-orange text-white'
                  : 'bg-wnba-surface text-wnba-muted hover:text-white border border-wnba-border'
              }`}
            >
              {stat.label}
            </button>
          ))}
          <div className="ml-auto flex gap-2">
            {['', 'G', 'F', 'C'].map(pos => (
              <button
                key={pos}
                onClick={() => setPosFilter(pos)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  posFilter === pos
                    ? 'bg-wnba-blue text-white'
                    : 'bg-wnba-surface text-wnba-muted hover:text-white border border-wnba-border'
                }`}
              >
                {pos || 'All'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top 3 spotlight */}
      {!loading && sorted.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 0, 2].map(idx => {
            const p = sorted[idx];
            const rank = idx + 1;
            const medalColors = [
              'from-yellow-500/20 to-yellow-600/5 border-yellow-500/30',
              'from-gray-400/20 to-gray-500/5 border-gray-400/30',
              'from-orange-600/20 to-orange-700/5 border-orange-600/30',
            ];
            return (
              <div key={p.id} className={`card bg-gradient-to-b ${medalColors[idx]} ${idx === 0 ? 'order-2' : idx === 1 ? 'order-1 mt-8' : 'order-3 mt-8'}`}>
                <div className="text-center">
                  <div className={`w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl font-extrabold ${
                    rank === 1 ? 'bg-yellow-500/30 text-yellow-400' : rank === 2 ? 'bg-gray-400/30 text-gray-300' : 'bg-orange-600/30 text-orange-400'
                  }`}>
                    {rank}
                  </div>
                  <p className="font-bold">{p.name}</p>
                  <p className="text-xs text-wnba-muted">{p.team}</p>
                  <span className={`badge ${positionColors[p.position]} mt-1`}>{p.position}</span>
                  <p className={`text-3xl font-extrabold mt-3 ${statInfo.color || 'text-white'}`}>
                    {p[activeStat]}
                  </p>
                  <p className="text-xs text-wnba-muted">{statInfo.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-3 border-wnba-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-wnba-border text-xs text-wnba-muted uppercase tracking-wider">
                <th className="text-left p-3 w-12">#</th>
                <th className="text-left p-3">Player</th>
                <th className="text-center p-3 w-16">Pos</th>
                <th className="text-right p-3 w-16">Price</th>
                {STATS.map(s => (
                  <th key={s.key} className={`text-right p-3 w-20 ${activeStat === s.key ? 'text-wnba-orange' : ''}`}>
                    {s.key.toUpperCase()}
                  </th>
                ))}
                <th className="p-3 w-40"></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => (
                <tr key={p.id} className="border-b border-wnba-border/50 last:border-0 hover:bg-wnba-surface/50 transition-colors">
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
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-wnba-orange/10 flex items-center justify-center text-xs font-bold text-wnba-orange">
                        #{p.number || '—'}
                      </div>
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-xs text-wnba-muted">{p.team}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`badge ${positionColors[p.position]}`}>{p.position}</span>
                  </td>
                  <td className="p-3 text-right font-medium">${p.price}</td>
                  {STATS.map(s => (
                    <td key={s.key} className={`p-3 text-right ${activeStat === s.key ? 'font-bold text-wnba-orange' : ''}`}>
                      {p[s.key]}
                    </td>
                  ))}
                  <td className="p-3">
                    <div className="w-full bg-wnba-surface rounded-full h-2">
                      <div
                        className="bg-wnba-orange rounded-full h-2 transition-all duration-500"
                        style={{ width: `${Math.max((p[activeStat] / maxVal) * 100, 2)}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 text-center text-sm text-wnba-muted">
        {sorted.length} players {posFilter ? `(${posFilter === 'G' ? 'Guards' : posFilter === 'F' ? 'Forwards' : 'Centers'})` : ''} ranked by {statInfo.label}
      </div>
    </div>
  );
}
