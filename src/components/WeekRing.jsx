export default function WeekRing({ completed, total }) {
  const pct = total > 0 ? completed / total : 0
  const r = 36
  const circ = 2 * Math.PI * r
  const dash = circ * pct

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={90} height={90} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={45} cy={45} r={r} fill="none" stroke="#1e1e30" strokeWidth={8} />
        <circle
          cx={45} cy={45} r={r} fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={8}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ textAlign: 'center', marginTop: -70, marginBottom: 40 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>{completed}<span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>/{total}</span></div>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, marginTop: -30 }}>séances</p>
    </div>
  )
}
