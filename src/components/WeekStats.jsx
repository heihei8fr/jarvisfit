import { useMemo } from 'react'

export default function WeekStats({ sessions }) {
  const stats = useMemo(() => {
    if (!sessions?.length) return { seances:0, duree:0, series:0 }
    const monday = new Date()
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))
    monday.setHours(0,0,0,0)
    const thisWeek = sessions.filter(s => new Date(s.date) >= monday)
    return {
      seances: thisWeek.length,
      duree: thisWeek.reduce((a,s) => a + (s.duration_minutes||0), 0),
      series: thisWeek.reduce((a,s) => a + (s.exercises_done||[]).reduce((b,ex) => b + (ex.sets||[]).filter(set=>set.done).length, 0), 0)
    }
  }, [sessions])
  const items = [
    { label:'Séances', value:stats.seances, icon:'🏋️', color:'#6366f1' },
    { label:'Minutes', value:stats.duree, icon:'⏱', color:'#8b5cf6' },
    { label:'Séries', value:stats.series, icon:'✅', color:'#10b981' },
  ]
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
      {items.map(({ label, value, icon, color }) => (
        <div key={label} style={{ background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:14, padding:'14px 10px', textAlign:'center' }}>
          <div style={{ fontSize:20, marginBottom:4 }}>{icon}</div>
          <div style={{ fontSize:22, fontWeight:800, color }}>{value}</div>
          <div style={{ fontSize:11, color:'var(--text-secondary)', marginTop:2 }}>{label}</div>
        </div>
      ))}
    </div>
  )
}
