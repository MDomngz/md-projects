import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

function NavItem({ to, children, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive ? 'bg-wnba-orange/15 text-wnba-orange' : 'text-wnba-muted hover:text-white hover:bg-wnba-surface'
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navContent = (
    <>
      <NavItem to="/" end>Dashboard</NavItem>
      <NavItem to="/players">Players</NavItem>
      <NavItem to="/roster">My Roster</NavItem>
      <NavItem to="/leaderboard">Leaderboard</NavItem>
      <NavItem to="/player-stats">Player Stats</NavItem>
      <NavItem to="/schedule">Schedule</NavItem>
      {isAdmin && (
        <>
          <div className="border-t border-wnba-border my-2" />
          <p className="px-3 text-xs font-semibold text-wnba-muted uppercase tracking-wider mb-1">Admin</p>
          <NavItem to="/admin" end>Overview</NavItem>
          <NavItem to="/admin/players">Manage Players</NavItem>
          <NavItem to="/admin/users">Manage Users</NavItem>
        </>
      )}
    </>
  );

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-wnba-border bg-wnba-card p-4 fixed h-full">
        <div className="mb-8">
          <h1 className="text-xl font-extrabold tracking-tight">
            <span className="text-wnba-orange">WNBA</span> Fantasy
          </h1>
          <p className="text-xs text-wnba-muted mt-1">2025 Season</p>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {navContent}
        </nav>
        <div className="border-t border-wnba-border pt-4 mt-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-wnba-orange/20 flex items-center justify-center text-wnba-orange font-bold text-sm">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.username}</p>
              <p className="text-xs text-wnba-muted truncate">{user?.team_name}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-secondary w-full text-sm">
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-wnba-card border-b border-wnba-border px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-extrabold">
          <span className="text-wnba-orange">WNBA</span> Fantasy
        </h1>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-wnba-surface">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen
              ? <path d="M6 6l12 12M6 18L18 6" />
              : <path d="M3 6h18M3 12h18M3 18h18" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setMobileOpen(false)}>
          <div className="absolute right-0 top-14 bottom-0 w-64 bg-wnba-card border-l border-wnba-border p-4" onClick={e => e.stopPropagation()}>
            <nav className="flex flex-col gap-1" onClick={() => setMobileOpen(false)}>
              {navContent}
            </nav>
            <button onClick={handleLogout} className="btn-secondary w-full text-sm mt-6">Sign Out</button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
