import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function usePainLogs(userId) {
  const [painLogs, setPainLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    supabase
      .from('pain_logs')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setPainLogs(data || [])
        setLoading(false)
      })
  }, [userId])

  async function logPain({ body_zone, intensity, description, affects_training }) {
    const { data, error } = await supabase
      .from('pain_logs')
      .insert({
        user_id: userId,
        date: new Date().toISOString().split('T')[0],
        body_zone,
        intensity,
        description: description || '',
        affects_training: affects_training ?? false
      })
      .select()
      .single()

    if (!error && data) {
      setPainLogs(prev => [data, ...prev])
    }
    return { error }
  }

  async function resolvePain(id) {
    await supabase.from('pain_logs').delete().eq('id', id)
    setPainLogs(prev => prev.filter(p => p.id !== id))
  }

  const activePains = painLogs.filter(p => {
    const daysSince = Math.round((Date.now() - new Date(p.date).getTime()) / 86400000)
    return daysSince <= 14
  })

  return { painLogs, activePains, loading, logPain, resolvePain }
}
