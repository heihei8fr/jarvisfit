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

function SplashScreen() {
  return (
    <div style={{
      height: '100vh', background: 'var(--bg-base)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 20
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: 22,
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 36,
        boxShadow: '0 8px 40px rgba(99,102,241,0.5)',
        animation: 'pulse 2s ease-in-out infinite'
      }}>
        {‘💪’}
      </div>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: 28, fontWeight: 900,
          letterSpacing: '-0.5px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>JarvisFit</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Chargement...</p>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--accent)',
            animation: `pulse 1.2s ${i * 0.2}s ease-in-out infinite`
          }} />
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const { user, loading } = useAuth()

  if (loading) return <SplashScreen />
  if (!user) return <LoginPage />

  return (
    <BrowserRouter>
      <div className="app-shell">
        <div className="page-content">
          <PageTransition>
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
          </PageTransition>
        </div>
        <BottomNav />
      </div>
      <InstallPrompt />
    </BrowserRouter>
  )
}

