import { useMemo } from 'react'

export function useStreak(sessions) {
  return useMemo(() => {
    if (!sessions?.length) return { current: 0, best: 0 }
    const dates = [...new Set(sessions.map(s => s.date))].sort().reverse()
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    if (dates[0] !== today && dates[0] !== yesterday) return { current: 0, best: 1 }
    let streak = 1, best = 1, prev = dates[0]
    for (let i = 1; i < dates.length; i++) {
      const diff = Math.round((new Date(prev) - new Date(dates[i])) / 86400000)
      if (diff === 1) { streak++; if (streak > best) best = streak }
      else { streak = 1 }
      prev = dates[i]
    }
    return { current: streak, best }
  }, [sessions])
}
