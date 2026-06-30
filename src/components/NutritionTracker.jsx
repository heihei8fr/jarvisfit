import { useState } from 'react'
import { useNutrition } from '../hooks/useNutrition'
import { useAuth } from '../hooks/useAuth'

// Aliments rapides musculation
const QUICK_FOODS = [
  { label: 'Whey 30g', protein: 24, kcal: 120, icon: '🥛' },
  { label: 'Poulet 150g', protein: 35, kcal: 165, icon: '🍗' },
  { label: 'Oeufs ×3', protein: 18, kcal: 210, icon: '🥚' },
  { label: 'Thon 100g', protein: 25, kcal: 116, icon: '🐟' },
  { label: 'Fromage blanc', protein: 12, kcal: 90, icon: '🥛' },
  { label: 'Steak 200g', protein: 44, kcal: 320, icon: '🥩' },
]

export default function NutritionTracker({ weightKg }) {
  const { user } = useAuth()
  const { todayLog, logNutrition, weekAvg } = useNutrition(user?.id)
  const [proteinInput, setProteinInput] = useState('')
  const [caloriesInput, setCaloriesInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Objectif protéines = 2g × poids (défaut 85kg si pas de poids)
  const proteinGoal = Math.round((weightKg || 85) * 2)
  const caloriesGoal = 2800

  const currentProtein = todayLog?.protein_g || 0
  const currentCalories = todayLog?.calories || 0
  const proteinPct = Math.min(100, Math.round((currentProtein / proteinGoal) * 100))
  const caloriesPct = Math.min(100, Math.round((currentCalories / caloriesGoal) * 100))

  async function handleSave() {
    const p = parseInt(proteinInput) || currentProtein
    const c = parseInt(caloriesInput) || currentCalories
    setSaving(true)
    await logNutrition({ protein_g: p, calories: c })
    setProteinInput('')
    setCaloriesInput('')
    setSaving(false)
    setIsOpen(false)
  }

  async function addQuickFood(food) {
    setSaving(true)
    await logNutrition({
      protein_g: currentProtein + food.protein,
      calories: currentCalories + food.kcal
    })
    setSaving(false)
  }

  const proteinColor = proteinPct >= 100 ? '#22c55e' : proteinPct >= 70 ? '#6366f1' : proteinPct >= 40 ? '#f59e0b' : '#ef4444'

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>🥩</span>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Nutrition</h3>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>Aujourd'hui</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: isOpen ? 'var(--bg-elevated)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            border: 'none', borderRadius: 10, padding: '6px 14px',
            color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer'
          }}
        >
          {isOpen ? 'Fermer' : '+ Log'}
        </button>
      </div>

      {/* Protéines — barre principale */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>Protéines</span>
          <div>
            <span style={{ fontSize: 22, fontWeight: 900, color: proteinColor }}>{currentProtein}</span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}> / {proteinGoal}g</span>
          </div>
        </div>
        <div style={{ height: 8, background: 'var(--bg-elevated)', borderRadius: 99 }}>
          <div style={{
            height: '100%', width: `${proteinPct}%`,
            background: `linear-gradient(90deg, ${proteinColor}, ${proteinColor}cc)`,
            borderRadius: 99, transition: 'width 0.4s ease'
          }} />
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
          {proteinPct >= 100 ? '✅ Objectif atteint !' :
           `${proteinGoal - currentProtein}g restants · objectif 2g/kg`}
        </p>
      </div>

      {/* Calories */}
      {currentCalories > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Calories</span>
            <div>
              <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)' }}>{currentCalories}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}> / {caloriesGoal} kcal</span>
            </div>
          </div>
          <div style={{ height: 5, background: 'var(--bg-elevated)', borderRadius: 99 }}>
            <div style={{
              height: '100%', width: `${caloriesPct}%`,
              background: 'linear-gradient(90deg, #f97316, #f59e0b)',
              borderRadius: 99, transition: 'width 0.4s ease'
            }} />
          </div>
        </div>
      )}

      {/* Formulaire */}
      {isOpen && (
        <div style={{ background: 'var(--bg-elevated)', borderRadius: 14, padding: 14, marginBottom: 12 }}>
          {/* Quick add */}
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
            Ajout rapide
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginBottom: 14 }}>
            {QUICK_FOODS.map((food, i) => (
              <button
                key={i}
                onClick={() => addQuickFood(food)}
                disabled={saving}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 10, padding: '8px 10px',
                  cursor: 'pointer', textAlign: 'left',
                  opacity: saving ? 0.7 : 1
                }}
              >
                <p style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>
                  {food.icon} {food.label}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  +{food.protein}g prot · {food.kcal}kcal
                </p>
              </button>
            ))}
          </div>

          {/* Manuel */}
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
            Saisie manuelle (total journée)
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
            <div>
              <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Protéines (g)</label>
              <input className="input-dark" type="number" placeholder={currentProtein.toString()} value={proteinInput} onChange={e => setProteinInput(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Calories</label>
              <input className="input-dark" type="number" placeholder={currentCalories.toString()} value={caloriesInput} onChange={e => setCaloriesInput(e.target.value)} />
            </div>
          </div>
          <button className="btn-primary" onClick={handleSave} disabled={saving || (!proteinInput && !caloriesInput)}>
            {saving ? 'Enregistrement...' : 'Mettre à jour'}
          </button>
        </div>
      )}

      {/* Moyenne semaine */}
      {weekAvg && (
        <div style={{ paddingTop: 10, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{weekAvg.protein}g</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Moy. prot. 7j</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{weekAvg.calories}</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Moy. kcal 7j</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: weekAvg.protein >= proteinGoal ? '#22c55e' : '#f59e0b' }}>
              {Math.round((weekAvg.protein / proteinGoal) * 100)}%
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Objectif prot.</p>
          </div>
        </div>
      )}
    </div>
  )
}
