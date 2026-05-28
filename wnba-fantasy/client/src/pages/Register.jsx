import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '', team_name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-wnba-dark">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">
            <span className="text-wnba-orange">WNBA</span> Fantasy
          </h1>
          <p className="text-wnba-muted mt-2">Create your account and start drafting</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          {error && (
            <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-3 text-sm text-red-400">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1.5">Username</label>
            <input value={form.username} onChange={e => update('username', e.target.value)} placeholder="Choose a username" className="w-full" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com" className="w-full" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <input type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder="At least 6 characters" className="w-full" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Team Name</label>
            <input value={form.team_name} onChange={e => update('team_name', e.target.value)} placeholder="Your fantasy team name" className="w-full" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating...' : 'Create Account'}
          </button>
          <p className="text-center text-sm text-wnba-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-wnba-orange hover:underline font-medium">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
