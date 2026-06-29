import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import SessionPage from './pages/SessionPage'
import HistoryPage from './pages/HistoryPage'
import ProgressPage from './pages/ProgressPage'

function NavBar({ signOut }) {
  const linkClass = ({ isActive }) =>
    `flex flex-col items-center text-xs gap-1 px-3 py-1 ${isActive ? 'text-blue-600' : 'text-gray-400'}`

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-2 z-50">
      <NavLink to="/" end className={linkClass}>
        <span className="text-xl">🏠</span>
        <span>Home</span>
      </NavLink>
      <NavLink to="/history" className={linkClass}>
        <span className="text-xl">📋</span>
        <span>Historique</span>
      </NavLink>
      <NavLink to="/progress" className={linkClass}>
        <span className="text-xl">📈</span>
        <span>Progrès</span>
      </NavLink>
      <button onClick={signOut} className="flex flex-col items-center text-xs text-gray-400 gap-1 px-3 py-1">
        <span className="text-xl">🚪</span>
        <span>Sortir</span>
      </button>
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
      <NavBar signOut={signOut} />
    </BrowserRouter>
  )
}
