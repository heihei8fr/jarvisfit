import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useNutrition(userId) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    supabase
      .from('nutrition_logs')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(30)
      .then(({ data }) => {
        setLogs(data || [])
        setLoading(false)
      })
  }, [userId])

  const today = new Date().toISOString().split('T')[0]
  const todayLog = logs.find(l => l.date === today) || null

  async function logNutrition({ protein_g, calories, notes }) {
    const { data, error } = await supabase
      .from('nutrition_logs')
      .upsert({ user_id: userId, date: today, protein_g, calories, notes: notes || '' }, { onConflict: 'user_id,date' })
      .select().single()
    if (!error && data) {
      setLogs(prev => {
        const without = prev.filter(l => l.date !== today)
        return [data, ...without].sort((a, b) => b.date.localeCompare(a.date))
      })
    }
    return { error }
  }

  const weekAvg = (() => {
    const weekLogs = logs.slice(0, 7)
    if (!weekLogs.length) return null
    return {
      protein: Math.round(weekLogs.reduce((a, l) => a + l.protein_g, 0) / weekLogs.length),
      calories: Math.round(weekLogs.reduce((a, l) => a + l.calories, 0) / weekLogs.length)
    }
  })()

  return { logs, todayLog, loading, logNutrition, weekAvg }
}
