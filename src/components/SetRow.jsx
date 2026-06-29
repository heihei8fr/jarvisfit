import { useState } from 'react'

const RPE_OPTIONS = [
  { value: 'easy', label: 'Facile', color: 'bg-green-100 text-green-700' },
  { value: 'normal', label: 'Normal', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'hard', label: 'Difficile', color: 'bg-red-100 text-red-700' }
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
      <div className="flex items-center gap-2 py-2 opacity-50">
        <span className="text-green-500 font-bold text-sm">✓</span>
        <span className="text-sm text-gray-600">
          {set.setNumber}. {set.weight > 0 ? `${set.weight}kg × ` : ''}{set.reps > 0 ? `${set.reps} reps` : 'max'}
        </span>
        {set.rpe && <span className="text-xs text-gray-400 ml-auto">{set.rpe}</span>}
      </div>
    )
  }

  return (
    <div className="py-3 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-bold text-gray-400 w-4 shrink-0">{set.setNumber}</span>

        {set.weight > 0 && (
          <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
            <button
              onClick={() => onUpdate(exerciseIdx, setIdx, 'weight', Math.max(0, set.weight - 2.5))}
              className="px-3 py-2 text-gray-600 font-bold text-lg active:bg-gray-200"
            >−</button>
            <span className="px-2 text-sm font-bold min-w-[52px] text-center">{set.weight}kg</span>
            <button
              onClick={() => onUpdate(exerciseIdx, setIdx, 'weight', set.weight + 2.5)}
              className="px-3 py-2 text-gray-600 font-bold text-lg active:bg-gray-200"
            >+</button>
          </div>
        )}

        <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
          <button
            onClick={() => onUpdate(exerciseIdx, setIdx, 'reps', Math.max(0, set.reps - 1))}
            className="px-3 py-2 text-gray-600 font-bold text-lg active:bg-gray-200"
          >−</button>
          <span className="px-2 text-sm font-bold min-w-[36px] text-center">
            {set.reps === 0 ? 'max' : set.reps}
          </span>
          <button
            onClick={() => onUpdate(exerciseIdx, setIdx, 'reps', set.reps + 1)}
            className="px-3 py-2 text-gray-600 font-bold text-lg active:bg-gray-200"
          >+</button>
        </div>

        <button
          onClick={handleDone}
          className="ml-auto bg-blue-600 text-white rounded-xl px-4 py-2 text-sm font-bold active:bg-blue-700"
        >✓</button>
      </div>

      {showRpe && (
        <div className="flex gap-2 mt-1">
          {RPE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleRpe(opt.value)}
              className={`flex-1 text-xs py-1.5 rounded-lg font-semibold ${opt.color}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
