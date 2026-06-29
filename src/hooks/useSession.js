import { useState } from 'react'

export function useSession(program) {
  const [startTime] = useState(Date.now())
  const [exercisesDone, setExercisesDone] = useState(
    () => (program?.exercises || []).map(ex => ({
      ...ex,
      sets: Array.from({ length: ex.sets || 1 }, (_, i) => ({
        setNumber: i + 1,
        weight: ex.weight || 0,
        reps: ex.reps || 0,
        rpe: null,
        done: false
      }))
    }))
  )

  function updateSet(exerciseIdx, setIdx, field, value) {
    setExercisesDone(prev => {
      const next = prev.map(ex => ({ ...ex, sets: [...ex.sets] }))
      next[exerciseIdx] = {
        ...next[exerciseIdx],
        sets: next[exerciseIdx].sets.map((s, i) =>
          i === setIdx ? { ...s, [field]: value } : s
        )
      }
      return next
    })
  }

  function markSetDone(exerciseIdx, setIdx) {
    updateSet(exerciseIdx, setIdx, 'done', true)
  }

  function getDurationMinutes() {
    return Math.round((Date.now() - startTime) / 60000)
  }

  function getCompletedExercises() {
    return exercisesDone.filter(ex => ex.sets.some(s => s.done))
  }

  return { exercisesDone, updateSet, markSetDone, getDurationMinutes, getCompletedExercises }
}
