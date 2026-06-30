import { useMemo } from 'react'

function calcScore(sessions) {
  if (!sessions?.length) return { score: 50, label: 'Données insuffisantes', color: '#94a3b8', advice: 'Commence à logger tes séances !' }

  const now = Date.now()
  const dayMs = 86400000

  // 1. Récupération : idéal = 1-2 jours de repos depuis dernière séance
  const lastSession = sessions[0]
  const daysSinceLast = lastSession
    ? Math.round((now - new Date(lastSession.date).getTime()) / dayMs)
    : 99
  let recoveryScore = 0
  if (daysSinceLast === 0) recoveryScore = 60
  else if (daysSinceLast === 1) recoveryScore = 100
  else if (daysSinceLast === 2) recoveryScore = 90
  else if (daysSinceLast === 3) recoveryScore = 75
  else if (daysSinceLast >= 4) recoveryScore = 50

  // 2. Constance : séances dans les 7 derniers jours
  const weekSessions = sessions.filter(s => new Date(s.date).getTime() > now - 7 * dayMs).length
  const consistencyScore = Math.min(weekSessions * 20, 100)

  // 3. Volume tendance : cette semaine vs semaine passée
  const thisWeekVol = sessions.filter(s => new Date(s.date).getTime() > now - 7 * dayMs).reduce((a, s) => a + (s.total_volume || 0), 0)
  const lastWeekVol = sessions.filter(s => {
    const d = new Date(s.date).getTime()
    return d > now - 14 * dayMs && d <= now - 7 * dayMs
  }).reduce((a, s) => a + (s.total_volume || 0), 0)
  let trendScore = 70
  if (lastWeekVol > 0) {
    const ratio = thisWeekVol / lastWeekVol
    if (ratio > 1.3) trendScore = 90
    else if (ratio > 1.0) trendScore = 80
    else if (ratio > 0.7) trendScore = 70
    else trendScore = 50
  }

  const score = Math.round(recoveryScore * 0.5 + consistencyScore * 0.3 + trendScore * 0.2)

  let label, color, advice
  if (score >= 85) { label = 'Excellent'; color = '#22c55e'; advice = "Tu es au top, pousse fort aujourd'hui !" }
  else if (score >= 70) { label = 'Bon'; color = '#6366f1'; advice = 'Bonne forme, séance normale.' }
  else if (score >= 55) { label = 'Moyen'; color = '#f59e0b'; advice = 'Corps en récupération, modère le volume.' }
  else { label = 'Repos conseillé'; color = '#ef4444'; advice = 'Récupère avant ta prochaine séance.' }

  return { score, label, color, advice }
}

export default function FormScore({ sessions }) {
  const { score, label, color, advice } = useMemo(() => calcScore(sessions), [sessions])

  const circumference = 2 * Math.PI * 36
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {/* Cercle score */}
      <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
        <svg width="90" height="90" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="45" cy="45" r="36" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
          <circle cx="45" cy="45" r="36" fill="none"
            stroke={color} strokeWidth="7" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.3s ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 1 }}>/ 100</span>
        </div>
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 16, fontWeight: 900, color }}>
            {label}
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{advice}</p>
      </div>
    </div>
  )
}
