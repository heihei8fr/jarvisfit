import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import SessionPage from './pages/SessionPage'
import HistoryPage from './pages/HistoryPage'
import ProgressPage from './pages/ProgressPage'

function NavBar() {
  const links = [
    { to: '/', icon: '🏠', label: 'Accueil' },
    { to: '/history', icon: '📋', label: 'Historique' },
    { to: '/progress', icon: '📈', label: 'Stats' },
  ]
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'var(--bg-surface)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      zIndex: 50
    }}>
      {links.map(({ to, icon, label }) => (
        <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '10px 0', textDecoration: 'none',
          color: isActive ? '#6366f1' : '#64748b',
          fontSize: 10, fontWeight: isActive ? 700 : 500, gap: 3,
          transition: 'color 0.15s'
        })}>
          <span style={{ fontSize: 22 }}>{icon}</span>
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  const { user, loading, signOut } = useAuth()

  if (loading) return <Spinner />
  if (!user) return <LoginPage />

  return (
    <BrowserRouter>
      <div className="pb-16 max-w-lg mx-auto">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/session/:programId" element={<SessionPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <NavBar />
    </BrowserRouter>
  )
}
