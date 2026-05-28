import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Players from './pages/Players';
import MyRoster from './pages/MyRoster';
import Leaderboard from './pages/Leaderboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminPlayers from './pages/AdminPlayers';
import AdminUsers from './pages/AdminUsers';
import Schedule from './pages/Schedule';
import PlayerLeaderboard from './pages/PlayerLeaderboard';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;
  return children;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-wnba-dark">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-wnba-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-wnba-muted">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="players" element={<Players />} />
        <Route path="roster" element={<MyRoster />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="player-stats" element={<PlayerLeaderboard />} />
        <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="admin/players" element={<AdminRoute><AdminPlayers /></AdminRoute>} />
        <Route path="admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
      </Route>
    </Routes>
  );
}
