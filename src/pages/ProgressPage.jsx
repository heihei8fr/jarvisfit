import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useHistory } from '../hooks/useHistory'
import PRChart from '../components/PRChart'
import WeightTracker from '../components/WeightTracker'
import ActivityCalendar from '../components/ActivityCalendar'
import VolumeChart from '../components/VolumeChart'
import MuscleChart from '../components/MuscleChart'
import ORMCalculator from '../components/ORMCalculator'

const TRACKED_EXERCISES = [
  'Développé couché barre',
  'Squat barre',
  'Tractions lestées',
  'Développé militaire haltères',
  'Romanian deadlift'
]

function Spinner() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid var(--accent)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )
}

export default function ProgressPage() {
  const { user } = useAuth()
  const { sessions, getOneRepMaxHistory, loading } = useHistory(user?.id)
  const [selected, setSelected] = useState(TRACKED_EXERCISES[0])

  if (loading) return <Spinner />

  const data = getOneRepMaxHistory(selected)
  const currentOrm = data.length > 0 ? data[data.length - 1].orm : null
  const firstOrm = data.length > 0 ? data[0].orm : null
  const progression = currentOrm && firstOrm ? currentOrm - firstOrm : null

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 16px' }}>
        <h1 className="page-title">Progression</h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>Ton historique complet</p>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ActivityCalendar sessions={sessions || []} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <VolumeChart sessions={sessions || []} />
          <MuscleChart sessions={sessions || []} />
        </div>
        <ORMCalculator />
        <WeightTracker />

        {/* Exercise selector */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {TRACKED_EXERCISES.map(ex => (
            <button
              key={ex}
              onClick={() => setSelected(ex)}
              style={{
                flexShrink: 0,
                padding: '6px 14px',
                borderRadius: 99,
                border: `1px solid ${selected === ex ? 'var(--accent)' : 'var(--border-strong)'}`,
                background: selected === ex ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                color: selected === ex ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {ex}
            </button>
          ))}
        </div>

        {/* Chart card */}
        <div className="card">
          <PRChart data={data} exerciseName={selected} />
        </div>

        {/* Stats */}
        {currentOrm && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--accent)' }}>{currentOrm} kg</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>1RM actuel</div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 28, fontWeight: 900,
                color: progression > 0 ? 'var(--green)' : progression < 0 ? 'var(--red)' : 'var(--text-muted)'
              }}>
                {progression !== null ? `${progression > 0 ? '+' : ''}${progression} kg` : '—'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>Progression totale</div>
            </div>
          </div>
        )}

        {data.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>📈</div>
            <p style={{ fontWeight: 600 }}>Commence à logger tes séances</p>
            <p style={{ fontSize: 13, marginTop: 4, opacity: 0.7 }}>Ton 1RM estimé apparaîtra ici</p>
          </div>
        )}
      </div>
    </div>
  )
}
