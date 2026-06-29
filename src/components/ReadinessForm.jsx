import { useState } from 'react'
import { supabase } from '../lib/supabase'

const QUESTIONS = [
  { key: 'sleep_quality', label: 'Qualité du sommeil', emoji: '😴' },
  { key: 'energy_level', label: "Niveau d'énergie", emoji: '⚡' },
  { key: 'stress_level', label: 'Niveau de stress (1=max, 5=zen)', emoji: '🧘' }
]

export default function ReadinessForm({ userId, onSubmit }) {
  const [scores, setScores] = useState({ sleep_quality: 3, energy_level: 3, stress_level: 3 })
  const [saving, setSaving] = useState(false)

  async function handleSubmit() {
    setSaving(true)
    const { error } = await supabase.from('readiness_scores').upsert({
      user_id: userId,
      date: new Date().toISOString().split('T')[0],
      ...scores
    })
    setSaving(false)
    if (!error) onSubmit(scores)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
      <h2 className="text-sm font-bold text-gray-800 mb-3">Comment tu te sens aujourd'hui ?</h2>
      {QUESTIONS.map(q => (
        <div key={q.key} className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>{q.emoji} {q.label}</span>
            <span className="font-bold text-blue-600">{scores[q.key]}/5</span>
          </div>
          <input
            type="range" min="1" max="5" value={scores[q.key]}
            onChange={e => setScores(s => ({ ...s, [q.key]: parseInt(e.target.value) }))}
            className="w-full accent-blue-600"
          />
        </div>
      ))}
      <button
        onClick={handleSubmit}
        disabled={saving}
        className="w-full bg-blue-600 text-white rounded-xl py-2.5 text-sm font-semibold mt-1 disabled:opacity-50"
      >
        {saving ? 'Enregistrement...' : 'Valider mon état'}
      </button>
    </div>
  )
}
