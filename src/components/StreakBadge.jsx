export default function StreakBadge({ current, best }) {
  const isHot = current >= 3
  return (
    <div style={{ display:'flex', alignItems:'center', gap:16, background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:16, padding:'12px 16px' }}>
      <div style={{ width:48, height:48, borderRadius:14, background: isHot ? 'linear-gradient(135deg,#f59e0b,#ef4444)' : 'var(--bg-surface)', border: isHot ? 'none' : '1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, boxShadow: isHot ? '0 4px 16px rgba(245,158,11,0.3)' : 'none' }}>
        {isHot ? '🔥' : '💪'}
      </div>
      <div>
        <div style={{ fontSize:22, fontWeight:800, color: isHot ? '#fbbf24' : 'var(--text-primary)' }}>
          {current} <span style={{ fontSize:13, fontWeight:500, color:'var(--text-secondary)' }}>jours</span>
        </div>
        <div style={{ fontSize:12, color:'var(--text-secondary)' }}>Streak · Record : {best}j</div>
      </div>
    </div>
  )
}
