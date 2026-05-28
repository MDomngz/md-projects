import { useState, useEffect } from 'react';
import { players as playersApi } from '../api';

const emptyForm = { name: '', team: '', position: 'G', number: '', height: '', price: 10, ppg: 0, rpg: 0, apg: 0, spg: 0, bpg: 0, fpg: 0 };

export default function AdminPlayers() {
  const [allPlayers, setAllPlayers] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchPlayers = async () => {
    setLoading(true);
    const data = await playersApi.list({ sort: 'name', order: 'asc' });
    setAllPlayers(data);
    setLoading(false);
  };

  useEffect(() => { fetchPlayers(); }, []);

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleEdit = (player) => {
    setEditing(player.id);
    setForm({
      name: player.name, team: player.team, position: player.position,
      number: player.number || '', height: player.height || '',
      price: player.price, ppg: player.ppg, rpg: player.rpg, apg: player.apg,
      spg: player.spg, bpg: player.bpg, fpg: player.fpg,
    });
    setShowForm(true);
    setError('');
  };

  const handleNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
    setError('');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        number: form.number ? Number(form.number) : null,
        price: Number(form.price),
        ppg: Number(form.ppg), rpg: Number(form.rpg), apg: Number(form.apg),
        spg: Number(form.spg), bpg: Number(form.bpg), fpg: Number(form.fpg),
      };
      if (editing) {
        await playersApi.update(editing, payload);
      } else {
        await playersApi.create(payload);
      }
      setShowForm(false);
      await fetchPlayers();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Deactivate ${name}? They will be removed from drafts.`)) return;
    await playersApi.remove(id);
    await fetchPlayers();
  };

  const filtered = search
    ? allPlayers.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    : allPlayers;

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge bg-red-500/20 text-red-400">Admin</span>
          </div>
          <h1 className="text-2xl font-bold">Manage Players</h1>
          <p className="text-wnba-muted mt-1">{allPlayers.length} active players</p>
        </div>
        <button onClick={handleNew} className="btn-primary">+ Add Player</button>
      </div>

      {showForm && (
        <div className="card mb-6 border-wnba-orange/30">
          <h2 className="font-bold mb-4">{editing ? 'Edit Player' : 'Add New Player'}</h2>
          {error && <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-3 mb-4 text-sm text-red-400">{error}</div>}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs text-wnba-muted mb-1">Name *</label>
              <input value={form.name} onChange={e => update('name', e.target.value)} className="w-full" />
            </div>
            <div>
              <label className="block text-xs text-wnba-muted mb-1">Team *</label>
              <input value={form.team} onChange={e => update('team', e.target.value)} className="w-full" />
            </div>
            <div>
              <label className="block text-xs text-wnba-muted mb-1">Position *</label>
              <select value={form.position} onChange={e => update('position', e.target.value)} className="w-full">
                <option value="G">Guard</option>
                <option value="F">Forward</option>
                <option value="C">Center</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-wnba-muted mb-1">Number</label>
              <input type="number" value={form.number} onChange={e => update('number', e.target.value)} className="w-full" />
            </div>
            <div>
              <label className="block text-xs text-wnba-muted mb-1">Height</label>
              <input value={form.height} onChange={e => update('height', e.target.value)} placeholder="6'2&quot;" className="w-full" />
            </div>
            <div>
              <label className="block text-xs text-wnba-muted mb-1">Price</label>
              <input type="number" step="0.5" value={form.price} onChange={e => update('price', e.target.value)} className="w-full" />
            </div>
          </div>

          <p className="text-xs text-wnba-muted mb-2">Stats</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
            {['ppg', 'rpg', 'apg', 'spg', 'bpg', 'fpg'].map(stat => (
              <div key={stat}>
                <label className="block text-xs text-wnba-muted mb-1 uppercase">{stat}</label>
                <input type="number" step="0.1" value={form[stat]} onChange={e => update(stat, e.target.value)} className="w-full" />
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editing ? 'Update Player' : 'Add Player'}
            </button>
          </div>
        </div>
      )}

      <div className="mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search players..." className="w-full max-w-sm" />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-3 border-wnba-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-wnba-border text-xs text-wnba-muted uppercase tracking-wider">
                <th className="text-left p-3">Player</th>
                <th className="text-left p-3">Team</th>
                <th className="text-center p-3">Pos</th>
                <th className="text-right p-3">Price</th>
                <th className="text-right p-3">FPG</th>
                <th className="text-right p-3">PPG</th>
                <th className="text-right p-3">RPG</th>
                <th className="text-right p-3">APG</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-wnba-border/50 last:border-0 hover:bg-wnba-surface/50 transition-colors">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 text-wnba-muted">{p.team}</td>
                  <td className="p-3 text-center">
                    <span className={`badge ${p.position === 'G' ? 'badge-g' : p.position === 'F' ? 'badge-f' : 'badge-c'}`}>
                      {p.position}
                    </span>
                  </td>
                  <td className="p-3 text-right font-semibold text-wnba-orange">${p.price}</td>
                  <td className="p-3 text-right font-bold">{p.fpg}</td>
                  <td className="p-3 text-right">{p.ppg}</td>
                  <td className="p-3 text-right">{p.rpg}</td>
                  <td className="p-3 text-right">{p.apg}</td>
                  <td className="p-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => handleEdit(p)} className="text-xs text-wnba-orange hover:underline">Edit</button>
                      <button onClick={() => handleDelete(p.id, p.name)} className="text-xs text-red-400 hover:underline">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
