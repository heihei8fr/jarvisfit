import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useHistory } from '../hooks/useHistory'
import { supabase } from '../lib/supabase'

export default function WeeklyReviewPage() {
  const { user } = useAuth()
  const { sessions, loading } = useHistory(user?.id)
  const navigate = useNavigate()
  const [review, setReview] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const reviewRef = useRef(null)

  // Séances de la semaine écoulée
  const weekSessions = sessions.filter(s => {
    const d = new Date(s.date).getTime()
    return d >= Date.now() - 7 * 86400000
  })

  // Stats semaine
  const weekStats = {
    count: weekSessions.length,
    totalMin: weekSessions.reduce((acc, s) => acc + (s.duration_minutes || 0), 0),
    totalVolume: weekSessions.reduce((acc, s) => acc + (s.total_volume || 0), 0),
  }

  async function startReview() {
    setIsStreaming(true)
    setReview('')
    setError('')

    try {
      // Charger athlete_summary
      const { data: summaryData } = await supabase
        .from('athlete_summary')
        .select('summary_text')
        .eq('user_id', user.id)
        .single()

      const res = await fetch('/api/weekly-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify({
          sessions: weekSessions.slice(0, 5),
          athleteSummary: summaryData?.summary_text || ''
        })
      })

      if (!res.ok) throw new Error(`Erreur ${res.status}`)

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done: d, value } = await reader.read()
        if (d) break
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const json = JSON.parse(line.slice(6))
              if (json.type === 'content_block_delta' && json.delta?.text) {
                accumulated += json.delta.text
                setReview(accumulated)
                reviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
              }
            } catch {}
          }
        }
      }

      setDone(true)
    } catch (e) {
      setError(e.message || "Erreur lors de l'analyse")
    } finally {
      setIsStreaming(false)
    }
  }

  const formatVolume = (kg) => kg >= 1000 ? `${(kg/1000).toFixed(1)}t` : `${kg}kg`

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg-base)' }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 0' }}>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: 0, marginBottom: 16 }}
        >
          ← Retour
        </button>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          Bilan hebdomadaire
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
          Semaine du {new Date(Date.now() - 7*86400000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Stats semaine */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, padding: '20px 16px 0' }}>
        <div className="stat-pill">
          <div className="stat-value">{weekStats.count}</div>
          <div className="stat-label">Séances</div>
        </div>
        <div className="stat-pill">
          <div className="stat-value">{weekStats.totalMin}min</div>
          <div className="stat-label">Durée</div>
        </div>
        <div className="stat-pill">
          <div className="stat-value">{formatVolume(weekStats.totalVolume)}</div>
          <div className="stat-label">Volume</div>
        </div>
      </div>

      {/* Séances de la semaine */}
      {weekSessions.length > 0 && (
        <div style={{ padding: '16px 16px 0' }}>
          <div className="card">
            <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12, color: 'var(--text-primary)' }}>Séances cette semaine</h3>
            {weekSessions.map((s, i) => (
              <div key={s.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 0',
                borderBottom: i < weekSessions.length - 1 ? '1px solid var(--border)' : 'none'
              }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {new Date(s.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.duration_minutes}min</p>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {s.session_type && <span className="badge badge-accent">{s.session_type}</span>}
                  {s.feeling && <span className="badge badge-gray">{s.feeling}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && weekSessions.length === 0 && !isStreaming && (
        <div style={{ padding: 24, textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>
            Aucune séance cette semaine enregistrée.
          </p>
        </div>
      )}

      {/* Bouton démarrer */}
      {!isStreaming && !done && (
        <div style={{ padding: '20px 16px 0' }}>
          <button
            className="btn-primary"
            onClick={startReview}
            disabled={loading || weekSessions.length === 0}
          >
            {weekSessions.length === 0 ? 'Aucune séance à analyser' : '🤖 Générer le bilan Claude'}
          </button>
          {weekSessions.length === 0 && (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
              Fais au moins une séance cette semaine
            </p>
          )}
        </div>
      )}

      {/* Streaming */}
      {(isStreaming || review) && (
        <div style={{ padding: '20px 16px 0' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16
              }}>🤖</div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Analyse Claude</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {isStreaming ? 'En cours...' : 'Terminé'}
                </p>
              </div>
              {isStreaming && (
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 3 }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)',
                      animation: `pulse 1.2s ${i * 0.2}s ease-in-out infinite`
                    }} />
                  ))}
                </div>
              )}
            </div>
            <div style={{
              fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)',
              whiteSpace: 'pre-wrap'
            }}>
              {review}
            </div>
            <div ref={reviewRef} />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ padding: '16px 16px 0' }}>
          <div className="card" style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)' }}>
            <p style={{ color: '#f87171', fontSize: 13 }}>⚠️ {error}</p>
            <button className="btn-secondary" style={{ marginTop: 12 }} onClick={startReview}>
              Réessayer
            </button>
          </div>
        </div>
      )}

      {/* Redo button */}
      {done && (
        <div style={{ padding: '16px 16px 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn-secondary" onClick={() => { setDone(false); setReview('') }}>
            Regénérer l'analyse
          </button>
          <button className="btn-primary" onClick={() => navigate('/')}>
            Retour au tableau de bord
          </button>
        </div>
      )}

      <div style={{ height: 32 }} />
    </div>
  )
}
