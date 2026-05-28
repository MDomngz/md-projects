import { useState, useEffect, useMemo } from 'react';
import { players as playersApi, roster as rosterApi } from '../api';
import PlayerCard from '../components/PlayerCard';
import DraftModal from '../components/DraftModal';

export default function Players() {
  const [allPlayers, setAllPlayers] = useState([]);
  const [rosterData, setRosterData] = useState({ roster: [], budget: 100 });
  const [search, setSearch] = useState('');
  const [posFilter, setPosFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [sort, setSort] = useState('fpg');
  const [order, setOrder] = useState('desc');
  const [showAvailable, setShowAvailable] = useState(false);
  const [teams, setTeams] = useState([]);
  const [draftPlayer, setDraftPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [p, t, r] = await Promise.all([
        playersApi.list({ sort, order, position: posFilter, team: teamFilter, available: showAvailable ? 'true' : '' }),
        playersApi.teams(),
        rosterApi.get(),
      ]);
      setAllPlayers(p);
      setTeams(t);
      setRosterData(r);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [sort, order, posFilter, teamFilter, showAvailable]);

  const filtered = useMemo(() => {
    if (!search) return allPlayers;
    const q = search.toLowerCase();
    return allPlayers.filter(p => p.name.toLowerCase().includes(q));
  }, [allPlayers, search]);

  const filledSlots = rosterData.roster.map(r => r.slot);
  const rosterPlayerIds = new Set(rosterData.roster.map(r => r.player_id));

  const handleDraft = async (playerId, slot) => {
    await rosterApi.add(playerId, slot);
    await fetchData();
  };

  const toggleSort = (col) => {
    if (sort === col) {
      setOrder(o => o === 'desc' ? 'asc' : 'desc');
    } else {
      setSort(col);
      setOrder('desc');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Player Market</h1>
        <p className="text-wnba-muted mt-1">Browse and draft WNBA players for your roster</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-wnba-muted mb-1">Search</label>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search players..."
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-wnba-muted mb-1">Position</label>
            <select value={posFilter} onChange={e => setPosFilter(e.target.value)} className="min-w-[120px]">
              <option value="">All</option>
              <option value="G">Guard</option>
              <option value="F">Forward</option>
              <option value="C">Center</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-wnba-muted mb-1">Team</label>
            <select value={teamFilter} onChange={e => setTeamFilter(e.target.value)} className="min-w-[160px]">
              <option value="">All Teams</option>
              {teams.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer pb-2">
            <input type="checkbox" checked={showAvailable} onChange={e => setShowAvailable(e.target.checked)}
              className="w-4 h-4 rounded border-wnba-border bg-wnba-surface accent-wnba-orange" />
            Available only
          </label>
        </div>

        <div className="flex gap-2 mt-3 flex-wrap">
          <span className="text-xs text-wnba-muted pt-1">Sort by:</span>
          {[['fpg', 'Fantasy Pts'], ['ppg', 'Points'], ['rpg', 'Rebounds'], ['apg', 'Assists'], ['price', 'Price'], ['name', 'Name']].map(([col, label]) => (
            <button
              key={col}
              onClick={() => toggleSort(col)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                sort === col ? 'border-wnba-orange text-wnba-orange bg-wnba-orange/10' : 'border-wnba-border text-wnba-muted hover:text-white'
              }`}
            >
              {label} {sort === col && (order === 'desc' ? '↓' : '↑')}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-wnba-muted">{filtered.length} players</p>
        <p className="text-sm">
          Budget: <span className="font-bold text-wnba-orange">${rosterData.budget?.toFixed(1)}</span>
          <span className="text-wnba-muted ml-2">Roster: {rosterData.roster.length}/10</span>
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-3 border-wnba-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-wnba-muted">No players found matching your filters</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map(p => (
            <PlayerCard
              key={p.id}
              player={p}
              onDraft={rosterPlayerIds.has(p.id) ? undefined : () => setDraftPlayer(p)}
              actionLabel={rosterPlayerIds.has(p.id) ? undefined : 'Draft'}
              disabled={rosterPlayerIds.has(p.id)}
            />
          ))}
        </div>
      )}

      {draftPlayer && (
        <DraftModal
          player={draftPlayer}
          filledSlots={filledSlots}
          budget={rosterData.budget}
          onConfirm={handleDraft}
          onClose={() => setDraftPlayer(null)}
        />
      )}
    </div>
  );
}
