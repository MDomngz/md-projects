import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { roster as rosterApi } from '../api';
import { useAuth } from '../context/AuthContext';

const SLOT_ORDER = ['G1', 'G2', 'F1', 'F2', 'C', 'UTIL1', 'UTIL2', 'BENCH1', 'BENCH2', 'BENCH3'];
const SLOT_LABELS = {
  G1: 'Guard 1', G2: 'Guard 2', F1: 'Forward 1', F2: 'Forward 2', C: 'Center',
  UTIL1: 'Utility 1', UTIL2: 'Utility 2', BENCH1: 'Bench 1', BENCH2: 'Bench 2', BENCH3: 'Bench 3',
};
const SECTION_BREAKS = { G1: 'Starters', UTIL1: 'Utility', BENCH1: 'Bench' };

export default function MyRoster() {
  const { user, refreshUser } = useAuth();
  const [rosterData, setRosterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropping, setDropping] = useState(null);
  const [autoDrafting, setAutoDrafting] = useState(false);
  const [autoDraftResult, setAutoDraftResult] = useState(null);

  const fetchRoster = async () => {
    setLoading(true);
    try {
      const data = await rosterApi.get();
      setRosterData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRoster(); }, []);

  const handleDrop = async (playerId) => {
    setDropping(playerId);
    try {
      await rosterApi.remove(playerId);
      await fetchRoster();
      await refreshUser();
    } catch (e) {
      alert(e.message);
    } finally {
      setDropping(null);
    }
  };

  const handleAutoDraft = async () => {
    setAutoDrafting(true);
    setAutoDraftResult(null);
    try {
      const result = await rosterApi.autoDraft();
      setAutoDraftResult(result);
      await fetchRoster();
      await refreshUser();
    } catch (e) {
      alert(e.message);
    } finally {
      setAutoDrafting(false);
    }
  };

  const rosterMap = {};
  rosterData?.roster?.forEach(r => { rosterMap[r.slot] = r; });

  const totalFpg = rosterData?.roster?.reduce((s, p) => s + (p.fpg || 0), 0) || 0;
  const starterFpg = rosterData?.roster?.filter(r => !r.slot.startsWith('BENCH')).reduce((s, p) => s + (p.fpg || 0), 0) || 0;
  const emptySlotCount = SLOT_ORDER.length - (rosterData?.roster?.length || 0);

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Roster</h1>
          <p className="text-wnba-muted mt-1">{user.team_name}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-wnba-muted">Budget</p>
            <p className="text-lg font-bold text-wnba-orange">${rosterData?.budget?.toFixed(1) || '—'}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-wnba-muted">Starter FPG</p>
            <p className="text-lg font-bold">{starterFpg.toFixed(1)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-wnba-muted">Total FPG</p>
            <p className="text-lg font-bold">{totalFpg.toFixed(1)}</p>
          </div>
          {emptySlotCount > 0 && (
            <button
              onClick={handleAutoDraft}
              disabled={autoDrafting}
              className="btn-primary text-sm ml-2"
            >
              {autoDrafting ? 'Drafting...' : `Auto-Draft (${emptySlotCount} slots)`}
            </button>
          )}
        </div>
      </div>

      {autoDraftResult && (
        <div className={`card mb-6 border ${autoDraftResult.drafted.length > 0 ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-yellow-500/30 bg-yellow-500/5'}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm">{autoDraftResult.message}</h3>
            <button onClick={() => setAutoDraftResult(null)} className="text-wnba-muted hover:text-white text-xs">
              Dismiss
            </button>
          </div>
          {autoDraftResult.drafted.length > 0 && (
            <div className="space-y-1">
              {autoDraftResult.drafted.map(d => (
                <div key={d.id} className="flex items-center gap-3 text-sm py-1">
                  <span className="text-xs font-mono text-wnba-muted w-16">{d.slot}</span>
                  <span className="font-medium flex-1">{d.name}</span>
                  <span className="text-wnba-orange font-semibold">{d.fpg} FPG</span>
                  <span className="text-wnba-muted">${d.price}</span>
                </div>
              ))}
              <p className="text-xs text-wnba-muted pt-2 border-t border-wnba-border mt-2">
                Remaining budget: ${autoDraftResult.budget.toFixed(1)}
              </p>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-3 border-wnba-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-1">
          {SLOT_ORDER.map(slot => {
            const section = SECTION_BREAKS[slot];
            const player = rosterMap[slot];
            return (
              <div key={slot}>
                {section && (
                  <div className="flex items-center gap-3 mt-6 mb-3 first:mt-0">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-wnba-muted">{section}</h2>
                    <div className="flex-1 border-t border-wnba-border" />
                  </div>
                )}
                <div className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                  player ? 'bg-wnba-card border border-wnba-border hover:border-wnba-orange/30' : 'bg-wnba-surface/50 border border-dashed border-wnba-border'
                }`}>
                  <span className="text-xs font-mono text-wnba-muted w-16 shrink-0">{SLOT_LABELS[slot]}</span>
                  {player ? (
                    <>
                      <div className="w-10 h-10 rounded-lg bg-wnba-orange/20 flex items-center justify-center text-wnba-orange font-bold text-sm shrink-0">
                        #{player.number || '—'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{player.name}</p>
                        <p className="text-xs text-wnba-muted">{player.team} &middot; {player.position}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex gap-2">
                          <span className="stat-pill text-xs">{player.ppg} PPG</span>
                          <span className="stat-pill text-xs">{player.rpg} RPG</span>
                          <span className="stat-pill text-xs">{player.apg} APG</span>
                        </div>
                        <span className="text-sm font-bold text-wnba-orange">{player.fpg} FP</span>
                        <button
                          onClick={() => handleDrop(player.player_id)}
                          disabled={dropping === player.player_id}
                          className="btn-danger text-xs px-2.5 py-1"
                        >
                          {dropping === player.player_id ? '...' : 'Drop'}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 text-center">
                      <Link to="/players" className="text-sm text-wnba-muted hover:text-wnba-orange transition-colors">
                        + Draft a player
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
