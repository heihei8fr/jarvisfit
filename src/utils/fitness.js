const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

export function calcOneRepMax(weight, reps) {
  if (reps === 0) return 0
  if (reps === 1) return weight
  return Math.round(weight * (1 + reps / 30))
}

export function calcACWR(weeklyLoads) {
  if (weeklyLoads.length < 4) return null
  const lastFour = weeklyLoads.slice(-4)
  const acute = lastFour[0]
  const chronic = lastFour.reduce((a, b) => a + b, 0) / 4
  return chronic === 0 ? null : acute / chronic
}

export function getDayKey(date = new Date()) {
  return DAYS[date.getDay()]
}

export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes}min`
  return `${Math.floor(minutes / 60)}h${String(minutes % 60).padStart(2, '0')}`
}
