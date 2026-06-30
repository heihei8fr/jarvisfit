import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'

const STEPS = [
  {
    id: 'goal',
    emoji: '🎯',
    title: 'Quel est ton objectif ?',
    subtitle: 'On adaptera ton programme en conséquence'
  },
  {
    id: 'level',
    emoji: '💪',
    title: 'Ton niveau actuel',
    subtitle: "Sois honnête, c'est pour mieux progresser"
  },
  {
    id: 'frequency',
    emoji: '📅',
    title: 'Combien de séances par semaine ?',
    subtitle: 'Ton programme sera adapté à ta dispo'
  }
]

const GOALS = [
  { value: 'strength', label: 'Force & Muscle', icon: '🏋️', desc: 'Gagner en force et masse musculaire' },
  { value: 'weight_loss', label: 'Perte de poids', icon: '⚖️', desc: 'Brûler des graisses et affiner' },
  { value: 'performance', label: 'Performance', icon: '⚡', desc: 'Améliorer mes records et endurance' },
  { value: 'health', label: 'Santé & Bien-être', icon: '❤️', desc: 'Rester actif et en forme' }
]

const LEVELS = [
  { value: 'beginner', label: 'Débutant', icon: '🌱', desc: 'Moins de 1 an de pratique' },
  { value: 'intermediate', label: 'Intermédiaire', icon: '🔥', desc: '1-3 ans de pratique' },
  { value: 'advanced', label: 'Avancé', icon: '⚡', desc: '3+ ans, je connais mes lifts' }
]

const FREQUENCIES = [3, 4, 5, 6]

export default function OnboardingPage() {
  const { user } = useAuth()
  const { saveProfile } = useProfile(user?.id)
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState('')
  const [level, setLevel] = useState('')
  const [frequency, setFrequency] = useState(4)
  const [weightGoal, setWeightGoal] = useState('')
  const [saving, setSaving] = useState(false)

  const currentStep = STEPS[step]
  const progress = ((step + 1) / STEPS.length) * 100

  async function handleFinish() {
    setSaving(true)
    await saveProfile({
      level,
      weekly_frequency: frequency,
      weight_goal_kg: weightGoal ? parseFloat(weightGoal) : null,
      onboarding_done: true
    })
    navigate('/')
  }

  function canAdvance() {
    if (step === 0) return !!goal
    if (step === 1) return !!level
    return true
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-base)',
      display: 'flex', flexDirection: 'column',
      maxWidth: 430, margin: '0 auto', padding: '0 20px'
    }}>
      {/* Progress bar */}
      <div style={{ paddingTop: 24, paddingBottom: 8 }}>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--accent), var(--accent-2))',
            borderRadius: 99,
            transition: 'width 0.4s ease'
          }} />
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, textAlign: 'right' }}>
          {step + 1} / {STEPS.length}
        </p>
      </div>

      {/* Step content */}
      <div style={{ flex: 1, paddingTop: 32 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>{currentStep.emoji}</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.5px', marginBottom: 8 }}>
            {currentStep.title}
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {currentStep.subtitle}
          </p>
        </div>

        {/* Step 0 — Objectif */}
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {GOALS.map(g => (
              <div
                key={g.value}
                onClick={() => setGoal(g.value)}
                style={{
                  padding: '14px 16px',
                  borderRadius: 16,
                  border: `1px solid ${goal === g.value ? 'var(--accent)' : 'rgba(255,255,255,0.06)'}`,
                  background: goal === g.value ? 'rgba(99,102,241,0.12)' : 'var(--bg-card)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 14,
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: 28 }}>{g.icon}</span>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{g.label}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{g.desc}</p>
                </div>
                {goal === g.value && (
                  <div style={{
                    marginLeft: 'auto', width: 22, height: 22, borderRadius: '50%',
                    background: 'var(--accent)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 12, color: '#fff', fontWeight: 800
                  }}>✓</div>
                )}
              </div>
            ))}

            {/* Poids objectif optionnel */}
            {goal === 'weight_loss' && (
              <div style={{ marginTop: 8 }}>
                <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>
                  Poids objectif (optionnel)
                </label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input
                    className="input-dark"
                    type="number"
                    placeholder="ex: 80"
                    value={weightGoal}
                    onChange={e => setWeightGoal(e.target.value)}
                  />
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600, flexShrink: 0 }}>kg</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 1 — Niveau */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {LEVELS.map(l => (
              <div
                key={l.value}
                onClick={() => setLevel(l.value)}
                style={{
                  padding: '18px 16px',
                  borderRadius: 16,
                  border: `1px solid ${level === l.value ? 'var(--accent)' : 'rgba(255,255,255,0.06)'}`,
                  background: level === l.value ? 'rgba(99,102,241,0.12)' : 'var(--bg-card)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 14,
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: 32 }}>{l.icon}</span>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{l.label}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{l.desc}</p>
                </div>
                {level === l.value && (
                  <div style={{
                    marginLeft: 'auto', width: 22, height: 22, borderRadius: '50%',
                    background: 'var(--accent)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 12, color: '#fff', fontWeight: 800
                  }}>✓</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step 2 — Fréquence */}
        {step === 2 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
              {FREQUENCIES.map(f => (
                <div
                  key={f}
                  onClick={() => setFrequency(f)}
                  style={{
                    padding: '22px 16px',
                    borderRadius: 16,
                    border: `1px solid ${frequency === f ? 'var(--accent)' : 'rgba(255,255,255,0.06)'}`,
                    background: frequency === f ? 'rgba(99,102,241,0.12)' : 'var(--bg-card)',
                    cursor: 'pointer', textAlign: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <p style={{ fontSize: 36, fontWeight: 900, color: frequency === f ? 'var(--accent)' : 'var(--text-primary)' }}>{f}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                    séance{f > 1 ? 's' : ''}/semaine
                  </p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
              {frequency <= 3 ? '✅ Idéal pour bien récupérer' :
               frequency === 4 ? '🔥 Le sweet spot force/récupération' :
               frequency === 5 ? '⚡ Bon si tu gères bien le volume' :
               '🎯 Programme haute fréquence'}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ padding: '24px 0 40px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {step < STEPS.length - 1 ? (
          <button
            className="btn-primary"
            onClick={() => setStep(s => s + 1)}
            disabled={!canAdvance()}
          >
            Continuer →
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={handleFinish}
            disabled={saving}
          >
            {saving ? 'Enregistrement...' : 'Démarrer JarvisFit 🚀'}
          </button>
        )}
        {step > 0 && (
          <button className="btn-secondary" onClick={() => setStep(s => s - 1)}>
            Retour
          </button>
        )}
        <button
          onClick={handleFinish}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer', padding: '4px 0' }}
        >
          Passer l'onboarding
        </button>
      </div>
    </div>
  )
}
