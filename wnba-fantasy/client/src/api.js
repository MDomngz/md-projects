const API = '/api';

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: getHeaders(),
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const auth = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),
};

export const players = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/players?${qs}`);
  },
  teams: () => request('/players/teams'),
  get: (id) => request(`/players/${id}`),
  create: (body) => request('/players', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/players/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => request(`/players/${id}`, { method: 'DELETE' }),
};

export const roster = {
  get: () => request('/roster'),
  add: (player_id, slot) => request('/roster/add', { method: 'POST', body: JSON.stringify({ player_id, slot }) }),
  remove: (playerId) => request(`/roster/${playerId}`, { method: 'DELETE' }),
  move: (player_id, new_slot) => request('/roster/move', { method: 'PUT', body: JSON.stringify({ player_id, new_slot }) }),
  autoDraft: () => request('/roster/auto-draft', { method: 'POST' }),
};

export const schedule = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/schedule?${qs}`);
  },
  today: () => request('/schedule/today'),
  week: (start) => request(`/schedule/week${start ? `?start=${start}` : ''}`),
  dates: () => request('/schedule/dates'),
};

export const admin = {
  users: () => request('/admin/users'),
  stats: () => request('/admin/stats'),
  leaderboard: () => request('/admin/leaderboard'),
  updateRole: (id, role) => request(`/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
  updateBudget: (id, budget) => request(`/admin/users/${id}/budget`, { method: 'PUT', body: JSON.stringify({ budget }) }),
  deleteUser: (id) => request(`/admin/users/${id}`, { method: 'DELETE' }),
  addScoring: (body) => request('/admin/scoring', { method: 'POST', body: JSON.stringify(body) }),
};
