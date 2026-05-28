import { useState } from 'react';

const SLOTS = {
  G: ['G1', 'G2', 'UTIL1', 'UTIL2', 'BENCH1', 'BENCH2', 'BENCH3'],
  F: ['F1', 'F2', 'UTIL1', 'UTIL2', 'BENCH1', 'BENCH2', 'BENCH3'],
  C: ['C', 'UTIL1', 'UTIL2', 'BENCH1', 'BENCH2', 'BENCH3'],
};

const SLOT_LABELS = {
  G1: 'Guard 1', G2: 'Guard 2', F1: 'Forward 1', F2: 'Forward 2', C: 'Center',
  UTIL1: 'Utility 1', UTIL2: 'Utility 2', BENCH1: 'Bench 1', BENCH2: 'Bench 2', BENCH3: 'Bench 3',
};

export default function DraftModal({ player, filledSlots, budget, onConfirm, onClose }) {
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!player) return null;

  const availableSlots = SLOTS[player.position]?.filter(s => !filledSlots.includes(s)) || [];
  const canAfford = budget >= player.price;

  const handleConfirm = async () => {
    if (!selectedSlot) return;
    setLoading(true);
    setError('');
    try {
      await onConfirm(player.id, selectedSlot);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="card max-w-md w-full" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold mb-1">Draft Player</h2>
        <p className="text-sm text-wnba-muted mb-4">Add {player.name} to your roster</p>

        <div className="flex items-center gap-4 p-3 bg-wnba-surface rounded-lg mb-4">
          <div className="w-12 h-12 rounded-lg bg-wnba-orange/20 flex items-center justify-center text-wnba-orange font-bold">
            #{player.number || '—'}
          </div>
          <div className="flex-1">
            <p className="font-semibold">{player.name}</p>
            <p className="text-sm text-wnba-muted">{player.team} &middot; {player.position}</p>
          </div>
          <p className="text-lg font-bold text-wnba-orange">${player.price}</p>
        </div>

        {!canAfford && (
          <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-3 mb-4 text-sm text-red-400">
            Insufficient budget. You have ${budget.toFixed(1)} remaining.
          </div>
        )}

        {availableSlots.length === 0 ? (
          <div className="bg-yellow-600/10 border border-yellow-600/20 rounded-lg p-3 mb-4 text-sm text-yellow-400">
            No available slots for this position. Drop a player first.
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select roster slot</label>
            <div className="grid grid-cols-2 gap-2">
              {availableSlots.map(slot => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-2.5 rounded-lg border text-sm font-medium transition-all ${
                    selectedSlot === slot
                      ? 'border-wnba-orange bg-wnba-orange/10 text-wnba-orange'
                      : 'border-wnba-border hover:border-wnba-muted text-wnba-muted hover:text-white'
                  }`}
                >
                  {SLOT_LABELS[slot]}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-3 mb-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button
            onClick={handleConfirm}
            disabled={!selectedSlot || !canAfford || loading}
            className="btn-primary flex-1"
          >
            {loading ? 'Drafting...' : 'Confirm Draft'}
          </button>
        </div>
      </div>
    </div>
  );
}
