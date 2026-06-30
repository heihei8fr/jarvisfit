export default function WeightSuggestion({ suggestion }) {
  if (!suggestion || suggestion.reason === 'Programme') return null

  const { reason, diff, lastWeight, weight } = suggestion
  const isIncrease = diff && diff.startsWith('+')
  const isDecrease = diff && diff.startsWith('-')

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '6px 10px',
      background: isIncrease ? 'rgba(16,185,129,0.1)' : isDecrease ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)',
      borderRadius: 10,
      marginBottom: 8
    }}>
      <span style={{ fontSize: 14 }}>
        {isIncrease ? '📈' : isDecrease ? '📉' : '🎯'}
      </span>
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
          Suggéré : {weight}kg
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)', marginLeft: 6 }}>
          {reason}
        </span>
      </div>
      {diff && (
        <span style={{
          fontSize: 11, fontWeight: 700,
          color: isIncrease ? '#10b981' : isDecrease ? '#ef4444' : '#818cf8'
        }}>
          {diff}
        </span>
      )}
    </div>
  )
}
