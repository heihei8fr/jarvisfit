import { useMemo } from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'

const MUSCLE_MAP = {
  'pectoraux': 'Pecs', 'chest': 'Pecs', 'bench': 'Pecs', 'développé': 'Pecs',
  'dos': 'Dos', 'tirage': 'Dos', 'rowing': 'Dos', 'tractions': 'Dos', 'row': 'Dos',
  'épaules': 'Épaules', 'press': 'Épaules', 'élévations': 'Épaules', 'shoulder': 'Épaules',
  'biceps': 'Biceps', 'curl': 'Biceps',
  'triceps': 'Triceps', 'dips': 'Triceps', 'extensions': 'Triceps',
  'jambes': 'Jambes', 'squat': 'Jambes', 'fentes': 'Jambes', 'leg': 'Jambes', 'quadriceps': 'Jambes',
  'mollets': 'Mollets', 'calf': 'Mollets',
  'abdominaux': 'Abdos', 'crunchs': 'Abdos', 'planche': 'Abdos',
  'fessiers': 'Fessiers', 'hip': 'Fessiers',
}

function detectMuscle(exerciseName) {
  const name = (exerciseName || '').toLowerCase()
  for (const [key, muscle] of Object.entries(MUSCLE_MAP)) {
    if (name.includes(key)) return muscle
  }
  return null
}

export default function MuscleChart({ sessions }) {
  const data = useMemo(() => {
    const counts = {}
    sessions.slice(0, 30).forEach(session => {
      (session.exercises_done || []).forEach(ex => {
        const muscle = detectMuscle(ex.name)
        if (muscle) {
          const sets = (ex.sets || []).filter(s => s.done).length
          counts[muscle] = (counts[muscle] || 0) + sets
        }
      })
    })

    const maxVal = Math.max(...Object.values(counts), 1)
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([name, value]) => ({ name, value, pct: Math.round((value / maxVal) * 100) }))
  }, [sessions])

  if (data.length < 3) return null

  const radarData = data.map(d => ({ subject: d.name, A: d.pct }))

  return (
    <div className="card">
      <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Répartition musculaire</h3>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>30 dernières séances</p>

      <ResponsiveContainer width="100%" height={180}>
        <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <PolarGrid stroke="rgba(255,255,255,0.06)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
          />
          <Radar
            name="Volume"
            dataKey="A"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Barres horizontales */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
        {data.map((item, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>{item.name}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.value} sets</span>
            </div>
            <div style={{ height: 4, background: 'var(--bg-elevated)', borderRadius: 99 }}>
              <div style={{
                height: '100%',
                width: `${item.pct}%`,
                background: i === 0 ? '#6366f1' : `rgba(99,102,241,${0.8 - i * 0.1})`,
                borderRadius: 99,
                transition: 'width 0.6s ease'
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
