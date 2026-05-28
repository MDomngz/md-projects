import { useState, useEffect } from 'react';
import { admin } from '../api';
import { useAuth } from '../context/AuthContext';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const data = await admin.users();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    await admin.updateRole(userId, newRole);
    await fetchUsers();
  };

  const handleBudgetReset = async (userId) => {
    await admin.updateBudget(userId, 100);
    await fetchUsers();
  };

  const handleDelete = async (userId, username) => {
    if (!confirm(`Delete user "${username}"? This will also remove their roster.`)) return;
    await admin.deleteUser(userId);
    await fetchUsers();
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="badge bg-red-500/20 text-red-400">Admin</span>
        </div>
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <p className="text-wnba-muted mt-1">{users.length} registered users</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-3 border-wnba-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {users.map(u => (
            <div key={u.id} className={`card flex flex-col sm:flex-row sm:items-center gap-4 ${u.id === currentUser.id ? 'border-wnba-orange/30' : ''}`}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-wnba-orange/20 flex items-center justify-center text-wnba-orange font-bold shrink-0">
                  {u.username[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold truncate">{u.username}</p>
                    {u.role === 'admin' && <span className="badge bg-red-500/20 text-red-400">Admin</span>}
                    {u.id === currentUser.id && <span className="badge bg-wnba-orange/20 text-wnba-orange">You</span>}
                  </div>
                  <p className="text-xs text-wnba-muted truncate">{u.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="font-bold">{u.team_name || '—'}</p>
                  <p className="text-xs text-wnba-muted">Team</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">{u.roster_count}/10</p>
                  <p className="text-xs text-wnba-muted">Roster</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-wnba-orange">${u.budget?.toFixed(1)}</p>
                  <p className="text-xs text-wnba-muted">Budget</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">{u.total_fpg?.toFixed(1)}</p>
                  <p className="text-xs text-wnba-muted">FPG</p>
                </div>
              </div>

              {u.id !== currentUser.id && (
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleRoleToggle(u.id, u.role)} className="btn-secondary text-xs">
                    {u.role === 'admin' ? 'Demote' : 'Promote'}
                  </button>
                  <button onClick={() => handleBudgetReset(u.id)} className="btn-secondary text-xs">
                    Reset $
                  </button>
                  <button onClick={() => handleDelete(u.id, u.username)} className="btn-danger text-xs">
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
