import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import InstallPrompt from './components/InstallPrompt'
import BottomNav from './components/BottomNav'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import SessionPage from './pages/SessionPage'
import HistoryPage from './pages/HistoryPage'
import ProgressPage from './pages/ProgressPage'
import ProgramPage from './pages/ProgramPage'
import SessionDetailPage from './pages/SessionDetailPage'
import SessionSummaryPage from './pages/SessionSummaryPage'
import WeeklyReviewPage from './pages/WeeklyReviewPage'
import OnboardingPage from './pages/OnboardingPage'
import ProfilePage from './pages/ProfilePage'

function Spinner() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid var(--accent)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )
}

export default function App() {
  const { user, loading } = useAuth()

  if (loading) return <Spinner />
  if (!user) return <LoginPage />

  return (
    <BrowserRouter>
      <div className="app-shell">
        <div className="page-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/session/:programId" element={<SessionPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/history/:id" element={<SessionDetailPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/program" element={<ProgramPage />} />
            <Route path="/session/summary" element={<SessionSummaryPage />} />
            <Route path="/weekly-review" element={<WeeklyReviewPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
      <InstallPrompt />
    </BrowserRouter>
  )
}
