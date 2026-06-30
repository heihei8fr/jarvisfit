import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const FEELING_EMOJI = { great: '🔥', good: '😊', average: '😐', bad: '😴' }
const FEELING_LABEL = { great: 'Excellent', good: 'Bien', average: 'Moyen', bad: 'Difficile' }

export default function SessionDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const { user } = useAuth()
  const [session, setSession] = useState(location.state?.session || null)
  const [loading, setLoading] = useState(!session)

  useEffect(() => {
    if (session) return
    supabase
      .from('sessions')
      .select('*')
      .eq('id', id)
      .eq('user_id', user?.id)
      .single()
      .then(({ data }) => {
        setSession(data)
        setLoading(false)
      })
  }, [id])

  if (loading) return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <div className="skeleton" style={{ height: 200, borderRadius: 16 }} />
    </div>
  )

  if (!session) return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)' }}>Séance introuvable</p>
      <button className="btn-secondary" style={{ marginTop: 16, width: 'auto', padding: '10px 20px' }} onClick={() => navigate('/history')}>Retour</button>
    </div>
  )

  const allSets = (session.exercises_done || []).flatMap(e => (e.sets || []).filter(s => s.done))
  const totalVolume = allSets.reduce((acc, s) => acc + (s.weight || 0) * (s.reps || 0), 0)

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg-base)' }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 0', background: 'linear-gradient(180deg, rgba(99,102,241,0.08) 0%, transparent 100%)' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: 0, marginBottom: 16 }}
        >
          ← Retour
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
              {session.session_type || 'Séance'}
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              {new Date(session.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          {session.feeling && (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '8px 12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 24 }}>{FEELING_EMOJI[session.feeling]}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{FEELING_LABEL[session.feeling]}</div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
          <div className="stat-pill">
            <div className="stat-value">{session.duration_minutes}min</div>
            <div className="stat-label">Durée</div>
          </div>
          <div className="stat-pill">
            <div className="stat-value">{allSets.length}</div>
            <div className="stat-label">Sets</div>
          </div>
          <div className="stat-pill">
            <div className="stat-value">{totalVolume >= 1000 ? `${(totalVolume/1000).toFixed(1)}t` : `${totalVolume}kg`}</div>
            <div className="stat-label">Volume</div>
          </div>
        </div>
      </div>

      {/* Exercices */}
      <div style={{ padding: '0 16px 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(session.exercises_done || []).map((ex, i) => {
          const doneSets = (ex.sets || []).filter(s => s.done)
          if (!doneSets.length) return null
          const vol = doneSets.reduce((acc, s) => acc + (s.weight || 0) * (s.reps || 0), 0)
          const bestSet = doneSets.reduce((best, s) =>
            (s.weight || 0) >= (best.weight || 0) ? s : best, doneSets[0])

          return (
            <div key={i} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>{ex.name}</h3>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{vol}kg vol.</span>
              </div>

              {/* Table sets */}
              <div style={{ display: 'grid', gridTemplateColumns: '32px 80px 60px 56px', gap: 6, padding: '0 0 8px', borderBottom: '1px solid var(--border)', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                <div>SET</div><div style={{textAlign:'center'}}>KG</div><div style={{textAlign:'center'}}>REPS</div><div style={{textAlign:'center'}}>RPE</div>
              </div>

              {doneSets.map((set, si) => (
                <div key={si} style={{ display: 'grid', gridTemplateColumns: '32px 80px 60px 56px', gap: 6, padding: '7px 0', borderBottom: si < doneSets.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'center' }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'var(--bg-elevated)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 800, color: 'var(--text-muted)'
                  }}>{si + 1}</div>
                  <div style={{ textAlign: 'center', fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>{set.weight || 0}</div>
                  <div style={{ textAlign: 'center', fontSize: 15, fontWeight: 700, color: 'var(--text-secondary)' }}>{set.reps || 0}</div>
                  <div style={{ textAlign: 'center', fontSize: 13, color: set.rpe ? 'var(--accent)' : 'var(--text-muted)' }}>{set.rpe || '—'}</div>
                </div>
              ))}

              <div style={{ marginTop: 10, padding: '8px 10px', background: 'var(--bg-elevated)', borderRadius: 10, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Meilleur set</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent)' }}>
                  {bestSet.weight}kg × {bestSet.reps} reps
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
