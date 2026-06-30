import { useState } from 'react'
import { PROGRAM_WEEKS } from '../data/program'

const SESSION_COLORS = {
  'Push': { bg: 'rgba(99,102,241,0.12)', border: '#6366f1', text: '#818cf8' },
  'Pull': { bg: 'rgba(139,92,246,0.12)', border: '#8b5cf6', text: '#a78bfa' },
  'Legs': { bg: 'rgba(16,185,129,0.12)', border: '#10b981', text: '#34d399' },
  'Full Body': { bg: 'rgba(245,158,11,0.12)', border: '#f59e0b', text: '#fbbf24' },
  'Upper': { bg: 'rgba(236,72,153,0.12)', border: '#ec4899', text: '#f472b6' },
  'Repos': { bg: 'transparent', border: 'var(--border)', text: 'var(--text-secondary)' },
}

const DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const DAY_NAMES = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

function getCurrentWeek() {
  const week = Math.floor((new Date().getDate() - 1) / 7) + 1
  return Math.min(week, 4)
}

function getSessionType(day) {
  if (!day || day.session_type === 'REPOS' || day.session_type === 'Repos') return 'Repos'
  const type = (day.session_type || '').toUpperCase()
  if (type === 'PUSH') return 'Push'
  if (type === 'PULL') return 'Pull'
  if (type === 'LEGS' || type.includes('LEG') || type.includes('JAMB')) return 'Legs'
  if (type === 'UPPER') return 'Upper'
  if (type.includes('FULL')) return 'Full Body'
  return day.session_type || 'Séance'
}

export default function ProgramPage() {
  const currentWeek = getCurrentWeek()
  const [selectedWeek, setSelectedWeek] = useState(currentWeek - 1) // 0-indexed

  // JS day: 0=Sunday, 1=Monday... → remap to 0=Monday..6=Sunday
  const jsDay = new Date().getDay()
  const todayDayIdx = jsDay === 0 ? 6 : jsDay - 1

  const weekNumber = selectedWeek + 1
  const weekData = PROGRAM_WEEKS[weekNumber] || {}

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100dvh', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: '48px 20px 20px', background: 'linear-gradient(180deg,#0d0d1a 0%,var(--bg-base) 100%)' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 4px', color: 'var(--text-primary)' }}>
          Programme
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
          4 semaines · Hypertrophie athlétique
        </p>
      </div>

      {/* Onglets semaines */}
      <div style={{ display: 'flex', gap: 8, padding: '0 16px 16px', overflowX: 'auto' }}>
        {[1, 2, 3, 4].map((week, i) => {
          const isActive = i === selectedWeek
          const isCurrent = week === currentWeek
          return (
            <button
              key={week}
              onClick={() => setSelectedWeek(i)}
              style={{
                flex: 'none',
                padding: '8px 18px',
                borderRadius: 20,
                border: isCurrent && !isActive ? '1px solid #6366f1' : '1px solid transparent',
                background: isActive ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'var(--bg-elevated)',
                color: isActive ? '#fff' : isCurrent ? '#818cf8' : 'var(--text-secondary)',
                fontWeight: 700, fontSize: 13, cursor: 'pointer',
                boxShadow: isActive ? '0 4px 12px rgba(99,102,241,0.3)' : 'none'
              }}
            >
              Semaine {week}
              {isCurrent && <span style={{ marginLeft: 4, fontSize: 10 }}>●</span>}
            </button>
          )
        })}
      </div>

      {/* Jours */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {DAY_KEYS.map((dayKey, dayIdx) => {
          const day = weekData[dayKey]
          const sessionType = getSessionType(day)
          const colors = SESSION_COLORS[sessionType] || { bg: 'var(--bg-elevated)', border: 'var(--border)', text: 'var(--text-primary)' }
          const isToday = (selectedWeek + 1 === currentWeek) && (dayIdx === todayDayIdx)
          const isRest = sessionType === 'Repos'

          return (
            <div
              key={dayKey}
              style={{
                background: isToday ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                border: `1px solid ${isToday ? '#6366f1' : 'var(--border)'}`,
                borderRadius: 16,
                padding: '14px 16px',
                opacity: isRest ? 0.6 : 1,
                boxShadow: isToday ? '0 0 0 1px #6366f130' : 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isRest ? 0 : 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {isToday && (
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', flexShrink: 0 }} />
                  )}
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: isToday ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {DAY_NAMES[dayIdx]}
                    </span>
                    {isToday && (
                      <span style={{ fontSize: 10, color: '#818cf8', marginLeft: 6, fontWeight: 600 }}>Aujourd'hui</span>
                    )}
                    {day?.label && !isRest && (
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1 }}>{day.label}</div>
                    )}
                  </div>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                  background: colors.bg, color: colors.text,
                  border: `1px solid ${colors.border}40`
                }}>
                  {sessionType}
                </span>
              </div>

              {!isRest && day?.exercises && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {day.exercises.slice(0, 5).map((ex, i) => (
                    <span key={i} style={{
                      fontSize: 11, padding: '3px 8px', borderRadius: 12,
                      background: 'var(--bg-elevated)', color: 'var(--text-secondary)',
                      border: '1px solid var(--border)'
                    }}>
                      {ex.name}
                    </span>
                  ))}
                  {(day.exercises?.length || 0) > 5 && (
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)', alignSelf: 'center' }}>
                      +{day.exercises.length - 5}
                    </span>
                  )}
                </div>
              )}

              {!day && (
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontStyle: 'italic' }}>Repos</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
