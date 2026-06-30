import { useLocation, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function SessionSummaryPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { session, prs } = location.state || {}

  const stats = useMemo(() => {
    if (!session) return null
    const exs = session.exercises_done || []
    const allSets = exs.flatMap(e => e.sets || []).filter(s => s.done)
    const totalVolume = allSets.reduce((acc, s) => acc + (s.weight || 0) * (s.reps || 0), 0)
    const totalSets = allSets.length
    const avgRpe = (() => {
      const rpeMap = { '6': 6, '7': 7, '7.5': 7.5, '8': 8, '8.5': 8.5, '9': 9, '9.5': 9.5, '10': 10 }
      const rpes = allSets.filter(s => s.rpe).map(s => rpeMap[s.rpe] || 0)
      return rpes.length ? (rpes.reduce((a, b) => a + b, 0) / rpes.length).toFixed(1) : null
    })()
    return { totalVolume, totalSets, exerciseCount: exs.length, avgRpe }
  }, [session])

  const volumeByExercise = useMemo(() => {
    if (!session) return []
    return (session.exercises_done || []).map(ex => {
      const vol = (ex.sets || []).filter(s => s.done).reduce((acc, s) => acc + (s.weight || 0) * (s.reps || 0), 0)
      return { name: ex.name?.split(' ').slice(0, 2).join(' ') || '', vol }
    }).filter(e => e.vol > 0).sort((a, b) => b.vol - a.vol).slice(0, 6)
  }, [session])

  if (!session) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Aucune séance à afficher</p>
        <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/')}>Retour</button>
      </div>
    )
  }

  const durationH = Math.floor((session.duration_minutes || 0) / 60)
  const durationM = (session.duration_minutes || 0) % 60

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg-base)' }}>
      {/* Hero header */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(99,102,241,0.15) 0%, transparent 100%)',
        padding: '40px 20px 24px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>🏁</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          Séance terminée !
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6 }}>
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 16px 16px' }}>
        <div className="stat-pill">
          <div className="stat-value">
            {durationH > 0 ? `${durationH}h${durationM.toString().padStart(2, '0')}` : `${durationM}min`}
          </div>
          <div className="stat-label">Durée</div>
        </div>
        <div className="stat-pill">
          <div className="stat-value">{stats?.totalSets || 0}</div>
          <div className="stat-label">Sets</div>
        </div>
        <div className="stat-pill">
          <div className="stat-value">{stats?.totalVolume ? `${(stats.totalVolume / 1000).toFixed(1)}t` : '0'}</div>
          <div className="stat-label">Volume total</div>
        </div>
        <div className="stat-pill">
          <div className="stat-value">{stats?.avgRpe || '—'}</div>
          <div className="stat-label">RPE moyen</div>
        </div>
      </div>

      {/* PRs */}
      {prs && prs.length > 0 && (
        <div style={{ padding: '0 16px 16px' }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(239,68,68,0.1))', borderColor: 'rgba(245,158,11,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 24 }}>🏆</span>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#fbbf24' }}>
                {prs.length} nouveau{prs.length > 1 ? 'x' : ''} record{prs.length > 1 ? 's' : ''} !
              </h3>
            </div>
            {prs.map((pr, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: i < prs.length - 1 ? '1px solid rgba(245,158,11,0.15)' : 'none'
              }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{pr.exerciseName}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fbbf24' }}>{pr.newOrm} kg 1RM</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Volume par exercice */}
      {volumeByExercise.length > 1 && (
        <div style={{ padding: '0 16px 16px' }}>
          <div className="card">
            <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 14, color: 'var(--text-primary)' }}>Volume par exercice</h3>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={volumeByExercise} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#475569' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#475569' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={v => [`${v} kg`, 'Volume']}
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Bar dataKey="vol" radius={[6, 6, 0, 0]}>
                  {volumeByExercise.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? '#6366f1' : `rgba(99,102,241,${0.8 - i * 0.1})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Récap exercices */}
      <div style={{ padding: '0 16px 16px' }}>
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12, color: 'var(--text-primary)' }}>Détail des exercices</h3>
          {(session.exercises_done || []).map((ex, i) => {
            const doneSets = (ex.sets || []).filter(s => s.done)
            if (!doneSets.length) return null
            const bestSet = doneSets.reduce((best, s) =>
              (s.weight || 0) * (s.reps || 0) > (best.weight || 0) * (best.reps || 0) ? s : best
            , doneSets[0])
            return (
              <div key={i} style={{
                padding: '10px 0',
                borderBottom: i < session.exercises_done.length - 1 ? '1px solid var(--border)' : 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{ex.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    {doneSets.length} set{doneSets.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent)' }}>
                    {bestSet.weight}kg × {bestSet.reps}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>meilleur set</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Boutons */}
      <div style={{ padding: '0 16px 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="btn-primary" onClick={() => navigate('/')}>
          Retour au tableau de bord
        </button>
        <button className="btn-secondary" onClick={() => navigate('/progress')}>
          Voir ma progression
        </button>
      </div>
    </div>
  )
}
