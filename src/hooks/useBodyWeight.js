import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useBodyWeight(userId) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    supabase
      .from('body_weight')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(60)
      .then(({ data }) => {
        setEntries(data || [])
        setLoading(false)
      })
  }, [userId])

  async function logWeight(weightKg, notes = '') {
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('body_weight')
      .upsert({
        user_id: userId,
        date: today,
        weight_kg: weightKg,
        notes
      }, { onConflict: 'user_id,date' })
      .select()
      .single()

    if (!error && data) {
      setEntries(prev => {
        const without = prev.filter(e => e.date !== today)
        return [data, ...without].sort((a, b) => b.date.localeCompare(a.date))
      })
    }
    return { error }
  }

  const current = entries[0]?.weight_kg || null
  const firstEntry = entries.length > 1 ? entries[entries.length - 1]?.weight_kg : null
  const totalChange = current && firstEntry ? (current - firstEntry).toFixed(1) : null
  const weekChange = (() => {
    if (entries.length < 2) return null
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]
    const weekEntry = entries.find(e => e.date <= weekAgo)
    if (!weekEntry || !current) return null
    return (current - weekEntry.weight_kg).toFixed(1)
  })()

  return { entries, loading, logWeight, current, totalChange, weekChange }
}
