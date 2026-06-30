export default function ACWRAlert({ ratio }) {
  if (!ratio || ratio < 1.3) return null

  const isHigh = ratio >= 1.5
  const color = isHigh ? '#ef4444' : '#f59e0b'
  const bgColor = isHigh ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)'

  return (
    <div style={{
      background: bgColor,
      border: `1px solid ${color}40`,
      borderRadius: 16, padding: '14px 16px',
      display: 'flex', alignItems: 'center', gap: 12
    }}>
      <span style={{ fontSize: 28 }}>{isHigh ? '🚨' : '⚠️'}</span>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color }}>
          {isHigh ? 'Surmenage détecté' : 'Charge élevée'}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
          ACWR : {ratio.toFixed(2)} · {isHigh ? 'Réduis le volume cette semaine.' : 'Surveille ta récupération.'}
        </div>
      </div>
    </div>
  )
}
