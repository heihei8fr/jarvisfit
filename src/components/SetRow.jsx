import { useState } from 'react'

const RPE_OPTIONS = [
  { value: 'easy', label: '😌 Easy', bg: 'rgba(16,185,129,0.15)', color: '#10b981' },
  { value: 'normal', label: '💪 Normal', bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
  { value: 'hard', label: '🔥 Hard', bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
]

export default function SetRow({ set, exerciseIdx, setIdx, onUpdate, onDone }) {
  const [showRpe, setShowRpe] = useState(false)

  function handleDone() {
    setShowRpe(true)
  }

  function handleRpe(rpe) {
    onUpdate(exerciseIdx, setIdx, 'rpe', rpe)
    onDone(exerciseIdx, setIdx)
    setShowRpe(false)
  }

  if (set.done) {
    return (
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', opacity:0.55, background:'rgba(99,102,241,0.04)', borderRadius:8, marginBottom:4, paddingLeft:8 }}>
        <div style={{
          width:24, height:24, borderRadius:'50%',
          background:'#10b981', display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:12, color:'#fff', fontWeight:800, flexShrink:0
        }}>✓</div>
        <span style={{ fontSize:13, color:'var(--text-secondary)', fontWeight:600 }}>
          Set {set.setNumber} — {set.weight > 0 ? `${set.weight}kg × ` : ''}{set.reps > 0 ? `${set.reps} reps` : 'max'}
        </span>
        {set.rpe && (
          <span style={{ fontSize:11, color:'var(--text-secondary)', marginLeft:'auto', paddingRight:8 }}>{set.rpe}</span>
        )}
      </div>
    )
  }

  return (
    <div style={{ paddingTop:8, paddingBottom:4, borderBottom:'1px solid var(--border)', marginBottom:4 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        {/* Set number circle */}
        <div style={{
          width:28, height:28, borderRadius:'50%',
          background:'var(--bg-elevated)', border:'1px solid var(--border)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:12, fontWeight:800, color:'var(--text-secondary)', flexShrink:0
        }}>
          {set.setNumber}
        </div>

        {/* Weight control */}
        {set.weight > 0 && (
          <div style={{ display:'flex', alignItems:'center', background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:10, overflow:'hidden' }}>
            <button
              onClick={() => onUpdate(exerciseIdx, setIdx, 'weight', Math.max(0, set.weight - 2.5))}
              style={{ padding:'6px 10px', background:'transparent', border:'none', color:'var(--text-secondary)', fontSize:18, fontWeight:700, cursor:'pointer' }}
            >−</button>
            <span style={{ padding:'0 4px', fontSize:14, fontWeight:800, color:'var(--text-primary)', minWidth:52, textAlign:'center' }}>{set.weight}kg</span>
            <button
              onClick={() => onUpdate(exerciseIdx, setIdx, 'weight', set.weight + 2.5)}
              style={{ padding:'6px 10px', background:'transparent', border:'none', color:'var(--text-secondary)', fontSize:18, fontWeight:700, cursor:'pointer' }}
            >+</button>
          </div>
        )}

        {/* Reps control */}
        <div style={{ display:'flex', alignItems:'center', background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:10, overflow:'hidden' }}>
          <button
            onClick={() => onUpdate(exerciseIdx, setIdx, 'reps', Math.max(0, set.reps - 1))}
            style={{ padding:'6px 10px', background:'transparent', border:'none', color:'var(--text-secondary)', fontSize:18, fontWeight:700, cursor:'pointer' }}
          >−</button>
          <span style={{ padding:'0 4px', fontSize:14, fontWeight:800, color:'var(--text-primary)', minWidth:36, textAlign:'center' }}>
            {set.reps === 0 ? 'max' : set.reps}
          </span>
          <button
            onClick={() => onUpdate(exerciseIdx, setIdx, 'reps', set.reps + 1)}
            style={{ padding:'6px 10px', background:'transparent', border:'none', color:'var(--text-secondary)', fontSize:18, fontWeight:700, cursor:'pointer' }}
          >+</button>
        </div>

        {/* Done button */}
        <button
          onClick={handleDone}
          style={{
            marginLeft:'auto',
            background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
            border:'none', borderRadius:10,
            padding:'8px 14px', color:'#fff',
            fontSize:14, fontWeight:800, cursor:'pointer',
            flexShrink:0
          }}
        >✓</button>
      </div>

      {/* RPE selection */}
      {showRpe && (
        <div style={{ display:'flex', gap:8, marginTop:8 }}>
          {RPE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleRpe(opt.value)}
              style={{
                flex:1, padding:'8px 4px', borderRadius:10,
                background:opt.bg, border:`1px solid ${opt.color}`,
                color:opt.color, fontSize:12, fontWeight:700, cursor:'pointer'
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
