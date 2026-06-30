import { useMemo } from 'react'

export default function WeekComparison({ sessions }) {
  const { thisWeek, lastWeek, diff } = useMemo(() => {
    const now = Date.now()
    const weekMs = 7 * 24 * 60 * 60 * 1000

    function weekStats(start, end) {
      const ws = sessions.filter(s => {
        const d = new Date(s.date).getTime()
        return d >= start && d < end
      })
      return {
        sessions: ws.length,
        volume: ws.reduce((acc, s) => acc + (s.total_volume || 0), 0),
        minutes: ws.reduce((acc, s) => acc + (s.duration_minutes || 0), 0),
        sets: ws.reduce((acc, s) =>
          acc + (s.exercises_done || []).flatMap(e => (e.sets || []).filter(s => s.done)).length, 0)
      }
    }

    const tw2 = weekStats(now - weekMs, now)
    const lw2 = weekStats(now - 2 * weekMs, now - weekMs)

    const volumeDiff = lw2.volume > 0 ? Math.round(((tw2.volume - lw2.volume) / lw2.volume) * 100) : null
    const sessionsDiff = tw2.sessions - lw2.sessions

    return { thisWeek: tw2, lastWeek: lw2, diff: { volume: volumeDiff, sessions: sessionsDiff } }
  }, [sessions])

  if (thisWeek.sessions === 0 && lastWeek.sessions === 0) return null

  const DiffBadge = ({ value, unit = '' }) => {
    if (value === null || value === 0) return <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>stable</span>
    const positive = value > 0
    return (
      <span style={{
        fontSize: 11, fontWeight: 700,
        color: positive ? '#22c55e' : '#f97316'
      }}>
        {positive ? '↑' : '↓'} {Math.abs(value)}{unit}
      </span>
    )
  }

  return (
    <div className="card">
      <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>
        Cette semaine vs semaine passée
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {/* Séances */}
        <div style={{ background: 'var(--bg-elevated)', borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
          <p style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)' }}>{thisWeek.sessions}</p>
          <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: '2px 0 4px' }}>Séances</p>
          <DiffBadge value={diff.sessions} />
        </div>

        {/* Volume */}
        <div style={{ background: 'var(--bg-elevated)', borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
          <p style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)' }}>
            {thisWeek.volume >= 1000 ? `${(thisWeek.volume / 1000).toFixed(1)}t` : `${thisWeek.volume}kg`}
          </p>
          <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: '2px 0 4px' }}>Volume</p>
          <DiffBadge value={diff.volume} unit="%" />
        </div>

        {/* Temps */}
        <div style={{ background: 'var(--bg-elevated)', borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
          <p style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)' }}>{thisWeek.minutes}m</p>
          <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: '2px 0 4px' }}>Temps</p>
          <DiffBadge value={thisWeek.minutes - lastWeek.minutes} unit="m" />
        </div>
      </div>

      {/* Barre progression semaine */}
      {lastWeek.sessions > 0 && (
        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Progression vs S-1</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: diff.volume > 0 ? '#22c55e' : diff.volume < 0 ? '#f97316' : 'var(--text-muted)' }}>
              {diff.volume !== null ? `${diff.volume > 0 ? '+' : ''}${diff.volume}%` : '—'}
            </span>
          </div>
          <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 99, position: 'relative' }}>
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'var(--border-strong)' }} />
            <div style={{
              height: '100%',
              width: `${Math.min(Math.abs(diff.volume || 0), 100) / 2}%`,
              marginLeft: diff.volume > 0 ? '50%' : `${50 - Math.min(Math.abs(diff.volume || 0), 100) / 2}%`,
              background: diff.volume > 0 ? '#22c55e' : '#f97316',
              borderRadius: 99,
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
      )}
    </div>
  )
}
