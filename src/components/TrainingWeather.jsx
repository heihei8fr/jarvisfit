export default function TrainingWeather({ readiness }) {
  if (!readiness) return null
  const score = readiness.total_score || ((readiness.sleep_quality + readiness.energy_level + (6 - readiness.stress_level)) / 3)
  let icon, label, color, advice
  if (score >= 4) { icon='⚡'; label='Optimal'; color='#10b981'; advice='Tu es au top. Pousse les charges.' }
  else if (score >= 3) { icon='☀️'; label='Bon'; color='#6366f1'; advice="Bonne séance en vue." }
  else if (score >= 2) { icon='🌤'; label='Moyen'; color='#f59e0b'; advice='Réduis le volume de 20%.' }
  else { icon='🌧'; label='Repos conseillé'; color='#ef4444'; advice='Récupère aujourd\'hui.' }
  return (
    <div style={{ background:'var(--bg-elevated)', border:`1px solid ${color}40`, borderRadius:16, padding:'14px 16px', display:'flex', alignItems:'center', gap:14 }}>
      <div style={{ fontSize:32 }}>{icon}</div>
      <div style={{ flex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
          <span style={{ fontWeight:700, fontSize:15, color:'var(--text-primary)' }}>Météo : {label}</span>
          <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:20, background:`${color}20`, color }}>{score.toFixed(1)}/5</span>
        </div>
        <p style={{ fontSize:12, color:'var(--text-secondary)', margin:0 }}>{advice}</p>
      </div>
    </div>
  )
}
