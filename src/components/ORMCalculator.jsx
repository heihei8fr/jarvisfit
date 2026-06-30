import { useState, useMemo } from 'react'

const FORMULAS = [
  { name: 'Epley', fn: (w, r) => w * (1 + r / 30) },
  { name: 'Brzycki', fn: (w, r) => w * (36 / (37 - r)) },
  { name: 'Lander', fn: (w, r) => (100 * w) / (101.3 - 2.67123 * r) },
]

const PERCENTAGE_TARGETS = [
  { pct: 100, label: '1RM', rpe: '10' },
  { pct: 95, label: '2 reps', rpe: '9.5' },
  { pct: 90, label: '3-4 reps', rpe: '9' },
  { pct: 85, label: '5-6 reps', rpe: '8' },
  { pct: 80, label: '7-8 reps', rpe: '7' },
  { pct: 75, label: '10 reps', rpe: '6.5' },
  { pct: 70, label: '12 reps', rpe: '6' },
  { pct: 65, label: '15 reps', rpe: '5' },
]

export default function ORMCalculator() {
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')
  const [formula, setFormula] = useState(0)

  const orm = useMemo(() => {
    const w = parseFloat(weight)
    const r = parseInt(reps)
    if (!w || !r || r < 1 || r > 30) return null
    if (r === 1) return w
    return Math.round(FORMULAS[formula].fn(w, r) * 10) / 10
  }, [weight, reps, formula])

  const table = useMemo(() => {
    if (!orm) return []
    return PERCENTAGE_TARGETS.map(t => ({
      ...t,
      kg: Math.round(orm * t.pct / 100 / 2.5) * 2.5
    }))
  }, [orm])

  return (
    <div className="card">
      <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>
        Calculateur 1RM
      </h3>

      {/* Inputs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <div>
          <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6, fontWeight: 600 }}>Poids (kg)</label>
          <input
            className="input-dark"
            type="number" step="0.5"
            placeholder="100"
            value={weight}
            onChange={e => setWeight(e.target.value)}
          />
        </div>
        <div>
          <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6, fontWeight: 600 }}>Reps</label>
          <input
            className="input-dark"
            type="number" min="1" max="30"
            placeholder="5"
            value={reps}
            onChange={e => setReps(e.target.value)}
          />
        </div>
      </div>

      {/* Formule selector */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {FORMULAS.map((f, i) => (
          <button
            key={i}
            onClick={() => setFormula(i)}
            style={{
              flex: 1, padding: '6px 0',
              borderRadius: 8,
              border: `1px solid ${formula === i ? 'var(--accent)' : 'var(--border)'}`,
              background: formula === i ? 'rgba(99,102,241,0.15)' : 'transparent',
              color: formula === i ? 'var(--accent)' : 'var(--text-muted)',
              fontSize: 11, fontWeight: 700, cursor: 'pointer'
            }}
          >{f.name}</button>
        ))}
      </div>

      {/* Résultat 1RM */}
      {orm ? (
        <>
          <div style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: 14, padding: '16px 20px',
            textAlign: 'center', marginBottom: 16
          }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>1RM estimé</p>
            <p style={{ fontSize: 44, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-2px', lineHeight: 1 }}>
              {orm}
              <span style={{ fontSize: 18, color: 'var(--text-muted)', fontWeight: 600, marginLeft: 4 }}>kg</span>
            </p>
          </div>

          {/* Table pourcentages */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
              Table d'entraînement
            </p>
            {table.map((row, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '7px 0',
                borderBottom: i < table.length - 1 ? '1px solid var(--border)' : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, width: 36,
                    color: i === 0 ? 'var(--accent)' : 'var(--text-muted)'
                  }}>{row.pct}%</span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{row.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>RPE {row.rpe}</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: i === 0 ? 'var(--accent)' : 'var(--text-primary)', minWidth: 56, textAlign: 'right' }}>
                    {row.kg} kg
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: 13 }}>
          Entre un poids et des reps pour calculer
        </div>
      )}
    </div>
  )
}
