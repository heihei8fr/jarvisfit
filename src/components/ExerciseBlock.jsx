import { useState } from 'react'
import SetRow from './SetRow'
import RestTimer from './RestTimer'
import { suggestWeight } from '../utils/weightSuggestion'
import WeightSuggestion from './WeightSuggestion'

export default function ExerciseBlock({ exercise, exerciseIdx, onUpdate, onSetDone, sessions }) {
  const [showTimer, setShowTimer] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(exercise.rest || 90)

  function handleSetDone(exIdx, setIdx) {
    onSetDone(exIdx, setIdx)
    if ((exercise.rest || 0) > 0) {
      setTimerSeconds(exercise.rest)
      setShowTimer(true)
    }
  }

  const suggestion = suggestWeight(exercise.name, exercise.weight || 0, sessions)

  const allDone = exercise.sets?.every(s => s.done)
  const doneSets = exercise.sets?.filter(s => s.done).length || 0
  const totalSets = exercise.sets?.length || 0

  return (
    <div style={{
      background:'var(--bg-surface)',
      border:`1px solid ${allDone ? '#10b981' : 'var(--border)'}`,
      borderRadius:16,
      marginBottom:12,
      overflow:'hidden',
      transition:'border-color 0.3s ease'
    }}>
      {/* Header */}
      <div style={{ padding:'14px 16px 12px', borderBottom:'1px solid var(--border)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div style={{ flex:1, marginRight:12 }}>
            <h3 style={{ fontSize:18, fontWeight:800, color:'var(--text-primary)', margin:0, marginBottom:4 }}>{exercise.name}</h3>
            {exercise.muscle && exercise.muscle.length > 0 && (
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {exercise.muscle.map((m, i) => (
                  <span key={i} style={{
                    background:'rgba(99,102,241,0.15)',
                    color:'#818cf8',
                    fontSize:11,
                    fontWeight:600,
                    padding:'2px 8px',
                    borderRadius:99
                  }}>{m}</span>
                ))}
              </div>
            )}
          </div>
          {/* Sets counter circle */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
            <div style={{
              width:40, height:40,
              borderRadius:'50%',
              background: allDone ? '#10b981' : 'var(--bg-elevated)',
              border:`2px solid ${allDone ? '#10b981' : 'var(--border)'}`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:12, fontWeight:800,
              color: allDone ? '#fff' : 'var(--text-primary)',
              transition:'all 0.3s'
            }}>
              {allDone ? '✓' : `${doneSets}/${totalSets}`}
            </div>
            {exercise.rest > 0 && !allDone && (
              <span style={{ fontSize:10, color:'var(--text-secondary)' }}>{exercise.rest}s repos</span>
            )}
          </div>
        </div>
      </div>

      {/* Sets */}
      <div style={{ padding:'4px 16px 8px' }}>
        <WeightSuggestion suggestion={suggestion} />
        {exercise.sets.map((set, setIdx) => (
          <SetRow
            key={setIdx}
            set={set}
            exerciseIdx={exerciseIdx}
            setIdx={setIdx}
            onUpdate={onUpdate}
            onDone={handleSetDone}
          />
        ))}
      </div>

      {showTimer && (
        <RestTimer
          seconds={timerSeconds}
          onDone={() => setShowTimer(false)}
        />
      )}
    </div>
  )
}
