import { useEffect } from 'react'
import { useRestTimer } from '../hooks/useRestTimer'

const REST_PRESETS = [
  { label: '1min', seconds: 60 },
  { label: '90s', seconds: 90 },
  { label: '2min', seconds: 120 },
  { label: '3min', seconds: 180 },
]

function formatTime(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return m > 0 ? `${m}:${sec.toString().padStart(2, '0')}` : `${sec}s`
}

export default function RestTimerModal({ defaultSeconds = 90, onClose, exerciseName }) {
  const { isRunning, timeLeft, completed, progress, start, stop, addTime } = useRestTimer()

  useEffect(() => {
    start(defaultSeconds)
    return () => stop()
  }, [defaultSeconds])

  useEffect(() => {
    if (completed) {
      const t = setTimeout(onClose, 2000)
      return () => clearTimeout(t)
    }
  }, [completed])

  const circumference = 2 * Math.PI * 54
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 24,
      animation: 'fadeIn 0.2s ease'
    }}>
      {/* Titre */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
          Temps de repos
        </p>
        {exerciseName && (
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-secondary)' }}>
            {exerciseName}
          </p>
        )}
      </div>

      {/* Cercle SVG */}
      <div style={{ position: 'relative', width: 160, height: 160, marginBottom: 32 }}>
        <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle cx="80" cy="80" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          {/* Progress */}
          <circle
            cx="80" cy="80" r="54" fill="none"
            stroke={completed ? '#22c55e' : '#6366f1'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }}
          />
        </svg>

        {/* Temps centré */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center'
        }}>
          {completed ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40 }}>✅</div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#22c55e', marginTop: 4 }}>C'est parti !</p>
            </div>
          ) : (
            <>
              <span style={{ fontSize: 44, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-2px', lineHeight: 1 }}>
                {formatTime(timeLeft)}
              </span>
              {isRunning && (
                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>restantes</span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Presets durée */}
      {!completed && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {REST_PRESETS.map(p => (
            <button
              key={p.seconds}
              onClick={() => start(p.seconds)}
              style={{
                padding: '7px 14px',
                background: p.seconds === defaultSeconds ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 99,
                color: '#fff', fontSize: 13, fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {/* Boutons +30s et skip */}
      {!completed && (
        <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 300 }}>
          <button
            onClick={() => addTime(30)}
            style={{
              flex: 1, padding: '13px 0',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 14, color: '#fff',
              fontSize: 14, fontWeight: 700, cursor: 'pointer'
            }}
          >
            +30s
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 2, padding: '13px 0',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              border: 'none', borderRadius: 14, color: '#fff',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(99,102,241,0.4)'
            }}
          >
            Passer le repos →
          </button>
        </div>
      )}
    </div>
  )
}
