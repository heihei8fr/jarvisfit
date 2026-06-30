import { useMemo, useState } from 'react'

const COLORS = [
  'rgba(255,255,255,0.05)',  // 0 séances
  'rgba(99,102,241,0.25)',   // 1 séance
  'rgba(99,102,241,0.5)',    // 2 séances
  'rgba(99,102,241,0.75)',   // 3 séances
  '#6366f1',                  // 4+ séances
]

const DAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const MONTH_LABELS_FR = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc']

export default function ActivityCalendar({ sessions }) {
  const [tooltip, setTooltip] = useState(null)

  const { weeks, monthMarkers } = useMemo(() => {
    const now = new Date()
    const WEEKS = 16
    const countMap = {}
    sessions.forEach(s => {
      const d = s.date?.split('T')[0] || s.date
      if (d) countMap[d] = (countMap[d] || 0) + 1
    })

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const dayOfWeek = (today.getDay() + 6) % 7
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - dayOfWeek - (WEEKS - 1) * 7)

    const weeks = []
    const monthMarkersArr = []
    let lastMonth = -1

    for (let w = 0; w < WEEKS; w++) {
      const week = []
      for (let d = 0; d < 7; d++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + w * 7 + d)
        const dateStr = date.toISOString().split('T')[0]
        const count = countMap[dateStr] || 0
        const isFuture = date > today
        const isToday = dateStr === today.toISOString().split('T')[0]

        if (d === 0 && date.getMonth() !== lastMonth) {
          monthMarkersArr.push({ weekIdx: w, month: date.getMonth() })
          lastMonth = date.getMonth()
        }

        week.push({ date: dateStr, count, isFuture, isToday, dayLabel: date.getDate() })
      }
      weeks.push(week)
    }

    return { weeks, monthMarkers: monthMarkersArr }
  }, [sessions])

  const totalDays = weeks.flat().filter(d => d.count > 0).length
  const currentStreak = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    const sessionDates = new Set(sessions.map(s => (s.date || '').split('T')[0]))
    let streak = 0
    let d = new Date()
    while (true) {
      const ds = d.toISOString().split('T')[0]
      if (sessionDates.has(ds)) { streak++; d.setDate(d.getDate() - 1) }
      else if (ds === today) { d.setDate(d.getDate() - 1) }
      else break
    }
    return streak
  }, [sessions])

  const CELL = 14
  const GAP = 3
  const gridWidth = weeks.length * (CELL + GAP) - GAP

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>Activité</h3>
        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 16, fontWeight: 900, color: 'var(--accent)' }}>{currentStreak}</p>
            <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>streak</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)' }}>{totalDays}</p>
            <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>jours actifs</p>
          </div>
        </div>
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
        <div style={{ position: 'relative', width: gridWidth + 24, minWidth: 'min-content' }}>
          <div style={{ height: 16, position: 'relative', marginBottom: 4 }}>
            {monthMarkers.map((m, i) => (
              <span key={i} style={{
                position: 'absolute',
                left: m.weekIdx * (CELL + GAP),
                fontSize: 9, color: 'var(--text-muted)',
                fontWeight: 600, letterSpacing: '0.04em'
              }}>
                {MONTH_LABELS_FR[m.month]}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: GAP }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: GAP, marginRight: 2 }}>
              {DAY_LABELS.map((l, i) => (
                <div key={i} style={{
                  width: 10, height: CELL,
                  display: 'flex', alignItems: 'center',
                  fontSize: 8, color: i % 2 === 0 ? 'var(--text-muted)' : 'transparent',
                  fontWeight: 600
                }}>{l}</div>
              ))}
            </div>

            {weeks.map((week, wi) => (
              <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
                {week.map((day, di) => {
                  const colorIdx = day.isFuture ? 0 : Math.min(day.count, COLORS.length - 1)
                  const color = COLORS[colorIdx]
                  return (
                    <div
                      key={di}
                      style={{
                        width: CELL, height: CELL,
                        borderRadius: 3,
                        background: color,
                        border: day.isToday ? '1.5px solid var(--accent)' : '1px solid rgba(255,255,255,0.04)',
                        cursor: day.count > 0 ? 'pointer' : 'default',
                        transition: 'transform 0.1s',
                        flexShrink: 0
                      }}
                      onMouseEnter={() => day.count > 0 && setTooltip({ date: day.date, count: day.count, x: wi, y: di })}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  )
                })}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>Moins</span>
            {COLORS.map((c, i) => (
              <div key={i} style={{ width: 11, height: 11, borderRadius: 2, background: c, border: '1px solid rgba(255,255,255,0.06)' }} />
            ))}
            <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>Plus</span>
          </div>
        </div>
      </div>

      {tooltip && (
        <div style={{
          marginTop: 8, padding: '6px 12px',
          background: 'var(--bg-elevated)', borderRadius: 8,
          fontSize: 12, color: 'var(--text-secondary)',
          border: '1px solid var(--border)', textAlign: 'center'
        }}>
          {new Date(tooltip.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          {' · '}<strong style={{ color: 'var(--accent)' }}>{tooltip.count} séance{tooltip.count > 1 ? 's' : ''}</strong>
        </div>
      )}
    </div>
  )
}
