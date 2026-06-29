import { useState } from 'react'
import SetRow from './SetRow'
import RestTimer from './RestTimer'

export default function ExerciseBlock({ exercise, exerciseIdx, onUpdate, onSetDone }) {
  const [showTimer, setShowTimer] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(exercise.rest || 90)

  function handleSetDone(exIdx, setIdx) {
    onSetDone(exIdx, setIdx)
    if ((exercise.rest || 0) > 0) {
      setTimerSeconds(exercise.rest)
      setShowTimer(true)
    }
  }

  const allDone = exercise.sets?.every(s => s.done)
  const doneSets = exercise.sets?.filter(s => s.done).length || 0

  return (
    <div className={`bg-white rounded-2xl border p-4 mb-3 transition-all ${allDone ? 'border-green-200 opacity-70' : 'border-gray-100'}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 mr-2">
          <h3 className="text-sm font-bold text-gray-900">{exercise.name}</h3>
          <p className="text-xs text-gray-400">{exercise.muscle?.join(' · ')}</p>
        </div>
        <div className="text-right shrink-0">
          {allDone
            ? <div className="text-green-500 font-bold text-sm">✓ Terminé</div>
            : <span className="text-xs text-gray-400">{doneSets}/{exercise.sets?.length} sets · {exercise.rest}s repos</span>
          }
        </div>
      </div>

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

      {showTimer && (
        <RestTimer
          seconds={timerSeconds}
          onDone={() => setShowTimer(false)}
        />
      )}
    </div>
  )
}
