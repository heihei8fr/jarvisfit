import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { calcOneRepMax } from '../utils/fitness'

export function useHistory(userId) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    supabase
      .from('session_logs')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(30)
      .then(({ data }) => {
        setSessions(data || [])
        setLoading(false)
      })
  }, [userId])

  function getOneRepMaxHistory(exerciseName) {
    return sessions
      .filter(s => s.exercises_done?.some(e => e.name === exerciseName))
      .map(s => {
        const ex = s.exercises_done.find(e => e.name === exerciseName)
        const bestSet = (ex?.sets || [])
          .filter(s => s.done && s.weight > 0 && s.reps > 0)
          .reduce((best, set) => {
            const orm = calcOneRepMax(set.weight, set.reps)
            return orm > (best?.orm || 0) ? { ...set, orm } : best
          }, null)
        return bestSet ? { date: s.date, orm: bestSet.orm } : null
      })
      .filter(Boolean)
      .reverse()
  }

  return { sessions, loading, getOneRepMaxHistory }
}
