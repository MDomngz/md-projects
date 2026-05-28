import { useState } from 'react';

const positionColors = { G: 'badge-g', F: 'badge-f', C: 'badge-c' };
const positionNames = { G: 'Guard', F: 'Forward', C: 'Center' };

export default function PlayerCard({ player, onDraft, onDrop, actionLabel, disabled }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card hover:border-wnba-orange/40 transition-all duration-200 group">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-wnba-orange/20 to-wnba-blue/20 flex items-center justify-center text-xl font-bold text-wnba-orange shrink-0">
          #{player.number || '—'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-base truncate">{player.name}</h3>
            <span className={`badge ${positionColors[player.position]}`}>{positionNames[player.position]}</span>
          </div>
          <p className="text-sm text-wnba-muted mt-0.5">{player.team}</p>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="stat-pill"><span className="text-wnba-orange font-semibold">{player.fpg}</span> FPG</span>
            <span className="stat-pill">{player.ppg} PPG</span>
            <span className="stat-pill">{player.rpg} RPG</span>
            <span className="stat-pill">{player.apg} APG</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-bold text-wnba-orange">${player.price}</p>
          {onDraft && (
            <button onClick={() => onDraft(player)} disabled={disabled} className="btn-primary text-xs mt-2 px-3 py-1.5">
              {actionLabel || 'Draft'}
            </button>
          )}
          {onDrop && (
            <button onClick={() => onDrop(player)} className="btn-danger text-xs mt-2 px-3 py-1.5">
              Drop
            </button>
          )}
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-wnba-muted hover:text-white mt-3 flex items-center gap-1 transition-colors"
      >
        {expanded ? 'Hide' : 'Show'} details
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"
          className={`transition-transform ${expanded ? 'rotate-180' : ''}`}>
          <path d="M3 5l3 3 3-3" />
        </svg>
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-wnba-border grid grid-cols-3 sm:grid-cols-5 gap-3 text-center">
          {[
            ['PPG', player.ppg], ['RPG', player.rpg], ['APG', player.apg],
            ['SPG', player.spg], ['BPG', player.bpg],
          ].map(([label, val]) => (
            <div key={label}>
              <p className="text-lg font-bold">{val}</p>
              <p className="text-xs text-wnba-muted">{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
