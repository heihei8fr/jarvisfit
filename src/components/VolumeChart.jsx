import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts'

export default function VolumeChart({ sessions }) {
  const data = useMemo(() => {
    if (!sessions?.length) return []

    const now = new Date()
    const weeks = []

    for (let w = 11; w >= 0; w--) {
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay() - w * 7 + 1)
      weekStart.setHours(0,0,0,0)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 7)

      const weekSessions = sessions.filter(s => {
        const d = new Date(s.date)
        return d >= weekStart && d < weekEnd
      })

      const volume = weekSessions.reduce((acc, s) => acc + (s.total_volume || 0), 0)
      const sessionCount = weekSessions.length

      const label = weekStart.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
      weeks.push({ label, volume: Math.round(volume / 1000 * 10) / 10, sessions: sessionCount, isCurrentWeek: w === 0 })
    }

    return weeks
  }, [sessions])

  const maxVol = Math.max(...data.map(d => d.volume), 0.1)
  const avgVol = data.filter(d => d.volume > 0).reduce((acc, d) => acc + d.volume, 0) / Math.max(data.filter(d => d.volume > 0).length, 1)

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px' }}>
        <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: 15, fontWeight: 800, color: '#6366f1' }}>{payload[0].value}t</p>
        <p style={{ fontSize: 11, color: '#475569' }}>{payload[0].payload.sessions} séances</p>
      </div>
    )
  }

  if (!data.some(d => d.volume > 0)) return null

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>Volume hebdomadaire</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>12 dernières semaines (tonnes)</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 17, fontWeight: 900, color: 'var(--accent)' }}>
            {data[data.length - 1]?.volume || 0}t
          </p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>cette semaine</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data} margin={{ top: 4, right: 0, left: -28, bottom: 0 }} barSize={14}>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 8, fill: '#475569' }}
            axisLine={false} tickLine={false}
            interval={2}
          />
          <YAxis tick={{ fontSize: 8, fill: '#475569' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <ReferenceLine y={avgVol} stroke="rgba(99,102,241,0.3)" strokeDasharray="4 4" />
          <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.isCurrentWeek ? '#6366f1' : entry.volume > avgVol ? 'rgba(99,102,241,0.6)' : 'rgba(99,102,241,0.25)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{avgVol.toFixed(1)}t</p>
          <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Moy. semaine</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{Math.max(...data.map(d => d.volume)).toFixed(1)}t</p>
          <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Record semaine</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{data.reduce((a, d) => a + d.sessions, 0)}</p>
          <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Séances (12sem)</p>
        </div>
      </div>
    </div>
  )
}
