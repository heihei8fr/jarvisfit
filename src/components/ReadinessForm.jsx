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
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 16, marginBottom: 16 }}>
      <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px' }}>
        Comment tu te sens aujourd'hui ?
      </h2>
      {QUESTIONS.map(q => (
        <div key={q.key} style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{q.emoji} {q.label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#818cf8' }}>{scores[q.key]}/5</span>
          </div>
          <input
            type="range" min="1" max="5" value={scores[q.key]}
            onChange={e => setScores(s => ({ ...s, [q.key]: parseInt(e.target.value) }))}
            style={{ width: '100%', accentColor: '#6366f1' }}
          />
        </div>
      ))}
      <button
        onClick={handleSubmit}
        disabled={saving}
        className="btn-primary"
        style={{ marginTop: 4, opacity: saving ? 0.5 : 1 }}
      >
        {saving ? 'Enregistrement...' : 'Valider mon état'}
      </button>
    </div>
  )
}
