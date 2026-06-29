import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getDayKey } from '../utils/fitness'
import { seedProgramForUser, seedAthleteSummary } from '../data/seedProgram'

export function useProgram(userId) {
  const [todayProgram, setTodayProgram] = useState(null)
  const [weekPrograms, setWeekPrograms] = useState([])
  const [lastAnalysis, setLastAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    loadProgram()
  }, [userId])

  async function loadProgram() {
    setLoading(true)
    const dayKey = getDayKey()

    let { data: programs, error } = await supabase
      .from('programs')
      .select('*')
      .eq('user_id', userId)
      .eq('week_number', 1)

    if (error || !programs?.length) {
      await seedProgramForUser(userId)
      await seedAthleteSummary(userId);
      ({ data: programs } = await supabase
        .from('programs')
        .select('*')
        .eq('user_id', userId)
        .eq('week_number', 1))
    }

    setWeekPrograms(programs || [])
    setTodayProgram(programs?.find(p => p.day_of_week === dayKey) || null)

    const { data: analysis } = await supabase
      .from('ai_recommendations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    setLastAnalysis(analysis)
    setLoading(false)
  }

  return { todayProgram, weekPrograms, lastAnalysis, loading, reload: loadProgram }
}
