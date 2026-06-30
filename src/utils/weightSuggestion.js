/**
 * Calcule le poids suggéré pour un exercice basé sur les sessions précédentes
 * @param {string} exerciseName - Nom de l'exercice
 * @param {number} defaultWeight - Poids par défaut du programme
 * @param {Array} sessions - Historique des sessions
 * @returns {{ weight: number, reason: string, diff: string|null }}
 */
export function suggestWeight(exerciseName, defaultWeight, sessions) {
  if (!sessions?.length || !exerciseName) {
    return { weight: defaultWeight, reason: 'Programme', diff: null }
  }

  // Trouver la dernière session contenant cet exercice
  const lastSession = sessions.find(s =>
    s.exercises_done?.some(e =>
      e.name?.toLowerCase() === exerciseName.toLowerCase()
    )
  )

  if (!lastSession) {
    return { weight: defaultWeight, reason: 'Programme', diff: null }
  }

  const lastExercise = lastSession.exercises_done.find(e =>
    e.name?.toLowerCase() === exerciseName.toLowerCase()
  )

  if (!lastExercise?.sets?.length) {
    return { weight: defaultWeight, reason: 'Programme', diff: null }
  }

  // Prendre le dernier set complété avec un poids
  const doneSets = lastExercise.sets.filter(s => s.done && s.weight > 0)
  if (!doneSets.length) {
    return { weight: defaultWeight, reason: 'Programme', diff: null }
  }

  const lastSet = doneSets[doneSets.length - 1]
  const lastWeight = lastSet.weight
  const lastRpe = lastSet.rpe

  let suggestedWeight = lastWeight
  let reason = 'Identique à J-1'
  let diff = null

  if (lastRpe === 'hard') {
    suggestedWeight = Math.max(lastWeight * 0.95, lastWeight - 5)
    suggestedWeight = Math.round(suggestedWeight / 2.5) * 2.5
    reason = 'RPE difficile → -5%'
    diff = `${(suggestedWeight - lastWeight).toFixed(1)}kg`
  } else if (lastRpe === 'easy') {
    suggestedWeight = lastWeight + 2.5
    reason = 'RPE facile → +2.5kg'
    diff = '+2.5kg'
  } else {
    // normal ou pas de RPE
    suggestedWeight = lastWeight
    diff = null
  }

  return { weight: suggestedWeight, reason, diff, lastWeight }
}

/**
 * Retourne la moyenne RPE de la dernière séance pour un exercice
 */
export function getLastRPESummary(exerciseName, sessions) {
  if (!sessions?.length) return null
  const lastSession = sessions.find(s =>
    s.exercises_done?.some(e => e.name?.toLowerCase() === exerciseName.toLowerCase())
  )
  if (!lastSession) return null
  const lastEx = lastSession.exercises_done.find(e =>
    e.name?.toLowerCase() === exerciseName.toLowerCase()
  )
  const rpes = lastEx?.sets?.filter(s => s.done && s.rpe).map(s => s.rpe) || []
  if (!rpes.length) return null
  if (rpes.every(r => r === 'easy')) return 'easy'
  if (rpes.every(r => r === 'hard')) return 'hard'
  return 'normal'
}
