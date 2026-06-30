import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useHistory } from '../hooks/useHistory'

const TYPE_COLORS = {
  PUSH: '#6366f1', PULL: '#8b5cf6', LEGS: '#f97316',
  UPPER: '#ec4899', FULL: '#14b8a6', REST: '#475569'
}

const FEELING_EMOJI = { great: '🔥', good: '😊', average: '😐', bad: '😴' }

export default function HistoryPage() {
  const { user } = useAuth()
  const { sessions, loading } = useHistory(user?.id)
  const navigate = useNavigate()
  const [filter, setFilter] = useState('ALL')

  const types = ['ALL', ...new Set(sessions.map(s => s.session_type).filter(Boolean))]

  const filtered = filter === 'ALL' ? sessions : sessions.filter(s => s.session_type === filter)

  // Grouper par mois
  const grouped = filtered.reduce((acc, s) => {
    const month = new Date(s.date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    if (!acc[month]) acc[month] = []
    acc[month].push(s)
    return acc
  }, {})

  // Stats globales
  const totalVolume = sessions.reduce((acc, s) => acc + (s.total_volume || 0), 0)
  const totalMinutes = sessions.reduce((acc, s) => acc + (s.duration_minutes || 0), 0)

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg-base)' }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 0', background: 'linear-gradient(180deg, rgba(99,102,241,0.06) 0%, transparent 100%)' }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Historique</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, marginBottom: 16 }}>
          {sessions.length} séances enregistrées
        </p>

        {/* Stats globales */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
          <div className="stat-pill">
            <div className="stat-value">{sessions.length}</div>
            <div className="stat-label">Séances</div>
          </div>
          <div className="stat-pill">
            <div className="stat-value">{Math.round(totalMinutes / 60)}h</div>
            <div className="stat-label">Temps total</div>
          </div>
          <div className="stat-pill">
            <div className="stat-value">{totalVolume >= 1000 ? `${(totalVolume/1000).toFixed(0)}t` : `${totalVolume}kg`}</div>
            <div className="stat-label">Volume</div>
          </div>
        </div>

        {/* Filtres type */}
        {types.length > 1 && (
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, scrollbarWidth: 'none' }}>
            {types.map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                style={{
                  flexShrink: 0,
                  padding: '6px 14px',
                  borderRadius: 99,
                  border: `1px solid ${filter === t ? (TYPE_COLORS[t] || 'var(--accent)') : 'rgba(255,255,255,0.08)'}`,
                  background: filter === t ? `${TYPE_COLORS[t] || 'var(--accent)'}20` : 'transparent',
                  color: filter === t ? (TYPE_COLORS[t] || 'var(--accent)') : 'var(--text-muted)',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer'
                }}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Liste groupée par mois */}
      <div style={{ padding: '8px 16px 16px' }}>
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1,2,3].map(i => (
              <div key={i} className="skeleton" style={{ height: 80, borderRadius: 16 }} />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Aucune séance trouvée</p>
          </div>
        )}

        {Object.entries(grouped).map(([month, monthSessions]) => (
          <div key={month} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {month}
              </h3>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{monthSessions.length} séances</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {monthSessions.map(session => {
                const exCount = session.exercises_done?.length || 0
                const vol = session.total_volume || 0
                const typeColor = TYPE_COLORS[session.session_type] || 'var(--accent)'

                return (
                  <div
                    key={session.id}
                    className="card"
                    onClick={() => navigate(`/history/${session.id}`, { state: { session } })}
                    style={{ cursor: 'pointer', padding: '14px 16px', transition: 'background 0.15s' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {/* Indicateur type */}
                      <div style={{
                        width: 4, height: 48, borderRadius: 99,
                        background: typeColor, flexShrink: 0
                      }} />

                      {/* Contenu */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 3 }}>
                              {session.session_type || 'Séance'}
                              {session.feeling && <span style={{ marginLeft: 6 }}>{FEELING_EMOJI[session.feeling] || ''}</span>}
                            </p>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                              {new Date(session.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' })}
                            </p>
                          </div>
                          <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>›</span>
                        </div>

                        <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
                          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                            ⏱ {session.duration_minutes}min
                          </span>
                          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                            💪 {exCount} exercices
                          </span>
                          {vol > 0 && (
                            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                              🏋️ {vol >= 1000 ? `${(vol/1000).toFixed(1)}t` : `${vol}kg`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
