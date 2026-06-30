import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useProgram } from '../hooks/useProgram'
import { useHistory } from '../hooks/useHistory'
import { useStreak } from '../hooks/useStreak'
import { calcACWR } from '../utils/fitness'
import ReadinessForm from '../components/ReadinessForm'
import WeekRing from '../components/WeekRing'
import StreakBadge from '../components/StreakBadge'
import TrainingWeather from '../components/TrainingWeather'
import WeekStats from '../components/WeekStats'
import ACWRAlert from '../components/ACWRAlert'
import PainLogger from '../components/PainLogger'

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const { todayProgram, weekPrograms, lastAnalysis, loading } = useProgram(user?.id)
  const { sessions } = useHistory(user?.id)
  const { current: streakCurrent, best: streakBest } = useStreak(sessions)
  const [readiness, setReadiness] = useState(null)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const navigate = useNavigate()

  const acwr = useMemo(() => {
    if (!sessions?.length) return null
    const now = Date.now()
    const weekMs = 7 * 24 * 60 * 60 * 1000
    const weeklyLoads = [0, 1, 2, 3].map(w => {
      const start = now - (w + 1) * weekMs
      const end = now - w * weekMs
      return sessions
        .filter(s => { const d = new Date(s.date).getTime(); return d >= start && d < end })
        .reduce((acc, s) => acc + (s.duration_minutes || 45), 0)
    })
    return calcACWR(weeklyLoads)
  }, [sessions])

  if (loading) return (
    <div style={{ minHeight:'100dvh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-base)' }}>
      <div style={{ width:40, height:40, borderRadius:'50%', border:'3px solid var(--border)', borderTopColor:'#6366f1', animation:'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const completedThisWeek = weekPrograms?.filter(p => p.completed).length || 0
  const totalThisWeek = weekPrograms?.length || 7

  return (
    <div style={{ background:'var(--bg-base)', minHeight:'100dvh', paddingBottom:80 }}>
      {/* Header */}
      <div style={{ padding:'48px 20px 20px', background:'linear-gradient(180deg,#0d0d1a 0%,var(--bg-base) 100%)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <p style={{ color:'var(--text-secondary)', fontSize:12, margin:'0 0 4px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' }}>
              {new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})}
            </p>
            <h1 style={{ fontSize:26, fontWeight:800, margin:0, color:'var(--text-primary)' }}>
              Bonjour Anthony 👋
            </h1>
          </div>
          <button onClick={signOut} style={{ background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:10, padding:'6px 12px', color:'var(--text-secondary)', fontSize:12, cursor:'pointer' }}>
            Déco
          </button>
        </div>
      </div>

      <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:14 }} className="animate-slide-up">

        {/* Stats row */}
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <div style={{ flex:1 }}><WeekStats sessions={sessions} /></div>
          <WeekRing completed={completedThisWeek} total={totalThisWeek} />
        </div>

        {/* Streak */}
        <StreakBadge current={streakCurrent} best={streakBest} />

        {/* ACWR Alert */}
        <ACWRAlert ratio={acwr} />

        {/* Disponibilité */}
        <ReadinessForm userId={user?.id} onSave={setReadiness} />

        {/* Météo entraînement */}
        {readiness && <TrainingWeather readiness={readiness} />}

        {/* Programme du jour */}
        {todayProgram ? (
          <div className="card" style={{ borderColor:'#6366f130' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <div>
                <span className="badge badge-accent" style={{ marginBottom:6, display:'inline-block' }}>Aujourd'hui</span>
                <h2 style={{ fontSize:20, fontWeight:800, margin:0, color:'var(--text-primary)' }}>
                  {todayProgram.session_type || 'Séance'}
                </h2>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:24, fontWeight:800, color:'#6366f1' }}>{todayProgram.exercises?.length || 0}</div>
                <div style={{ fontSize:11, color:'var(--text-secondary)' }}>exercices</div>
              </div>
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:16 }}>
              {(todayProgram.exercises||[]).slice(0,4).map((ex,i) => (
                <span key={i} className="badge badge-accent" style={{ fontSize:11 }}>{ex.name}</span>
              ))}
              {(todayProgram.exercises?.length||0) > 4 && (
                <span className="badge" style={{ background:'var(--bg-elevated)', color:'var(--text-secondary)', fontSize:11 }}>
                  +{todayProgram.exercises.length - 4}
                </span>
              )}
            </div>
            <button className="btn-primary" onClick={() => navigate(`/session/${todayProgram.id}`)}>
              🚀 Démarrer la séance
            </button>
          </div>
        ) : (
          <div className="card" style={{ textAlign:'center', padding:32 }}>
            <div style={{ fontSize:40, marginBottom:8 }}>🌙</div>
            <p style={{ color:'var(--text-secondary)', margin:0, fontWeight:600 }}>Repos mérité</p>
            <p style={{ color:'var(--text-secondary)', fontSize:13, margin:'6px 0 0', opacity:0.6 }}>Pas de séance prévue aujourd'hui</p>
          </div>
        )}

        {/* Dernière analyse Claude */}
        {lastAnalysis && (
          <div className="card">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:28, height:28, borderRadius:8, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>🤖</div>
                <span style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)' }}>Analyse Claude</span>
              </div>
              <button onClick={() => setShowAnalysis(!showAnalysis)} style={{ background:'none', border:'none', color:'#818cf8', fontSize:12, cursor:'pointer', fontWeight:600 }}>
                {showAnalysis ? 'Masquer' : 'Voir'}
              </button>
            </div>
            {showAnalysis && (
              <div style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.7, background:'var(--bg-elevated)', borderRadius:10, padding:12, maxHeight:200, overflowY:'auto' }}>
                {lastAnalysis.recommendation}
              </div>
            )}
          </div>
        )}

        {/* Suivi douleurs */}
        <PainLogger />
      </div>
    </div>
  )
}
