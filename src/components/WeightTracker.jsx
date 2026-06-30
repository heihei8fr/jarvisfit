import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { useBodyWeight } from '../hooks/useBodyWeight'
import { useAuth } from '../hooks/useAuth'

export default function WeightTracker() {
  const { user } = useAuth()
  const { entries, loading, logWeight, current, totalChange, weekChange } = useBodyWeight(user?.id)
  const [input, setInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleLog() {
    const val = parseFloat(input.replace(',', '.'))
    if (!val || val < 30 || val > 300) {
      setError('Poids invalide (30–300 kg)')
      return
    }
    setSaving(true)
    setError('')
    await logWeight(val)
    setInput('')
    setSaving(false)
  }

  const chartData = [...entries]
    .reverse()
    .slice(-30)
    .map(e => ({ date: e.date.slice(5), weight: parseFloat(e.weight_kg) }))

  const targetWeight = 83 // Objectif Anthony

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Poids corporel</h3>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0' }}>
            {entries.length > 0 ? `${entries.length} mesures` : 'Aucune mesure'}
          </p>
        </div>
        {current && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)' }}>{current} <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>kg</span></div>
            {weekChange !== null && (
              <div style={{ fontSize: 12, fontWeight: 600, color: parseFloat(weekChange) < 0 ? '#10b981' : parseFloat(weekChange) > 0 ? '#f59e0b' : 'var(--text-secondary)' }}>
                {parseFloat(weekChange) > 0 ? '+' : ''}{weekChange} kg cette semaine
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          className="input-dark"
          type="number"
          step="0.1"
          placeholder="85.5"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLog()}
          style={{ flex: 1 }}
        />
        <button
          onClick={handleLog}
          disabled={saving || !input}
          style={{
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            border: 'none', borderRadius: 12,
            padding: '0 18px', color: '#fff',
            fontWeight: 700, fontSize: 14, cursor: 'pointer',
            opacity: saving || !input ? 0.6 : 1
          }}
        >
          {saving ? '...' : 'Log'}
        </button>
      </div>
      {error && <p style={{ fontSize: 12, color: '#ef4444', margin: '-10px 0 10px' }}>{error}</p>}

      {/* Graphique */}
      {chartData.length > 1 ? (
        <>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 9, fill: '#64748b' }} domain={['auto', 'auto']} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={v => [`${v} kg`, 'Poids']}
                contentStyle={{ background: '#141420', border: '1px solid #1e1e30', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#64748b' }}
              />
              <ReferenceLine y={targetWeight} stroke="#10b981" strokeDasharray="4 4" strokeOpacity={0.6} />
              <Line type="monotone" dataKey="weight" stroke="#6366f1" strokeWidth={2} dot={{ r: 3, fill: '#6366f1', strokeWidth: 0 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: '6px 0 0', textAlign: 'center' }}>
            — Objectif : {targetWeight} kg
          </p>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-secondary)', fontSize: 13 }}>
          Entre ton premier poids pour démarrer le suivi
        </div>
      )}

      {/* Stats */}
      {totalChange !== null && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: parseFloat(totalChange) < 0 ? '#10b981' : '#f59e0b' }}>
              {parseFloat(totalChange) > 0 ? '+' : ''}{totalChange} kg
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Total</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>{entries.length}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Mesures</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: current >= targetWeight ? '#f59e0b' : '#10b981' }}>
              {current ? Math.abs(current - targetWeight).toFixed(1) : '—'} kg
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Objectif</div>
          </div>
        </div>
      )}
    </div>
  )
}
