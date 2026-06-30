import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'
import { useHistory } from '../hooks/useHistory'
import { useBodyWeight } from '../hooks/useBodyWeight'

const LEVEL_LABELS = { beginner: 'Débutant', intermediate: 'Intermédiaire', advanced: 'Avancé' }
const LEVEL_ICONS = { beginner: '🌱', intermediate: '🔥', advanced: '⚡' }

const MENU_SECTIONS = [
  {
    title: 'Compte',
    items: [
      { icon: '🎯', label: 'Modifier mes objectifs', action: 'goals' },
      { icon: '🔔', label: 'Notifications', action: 'notifs' },
    ]
  },
  {
    title: 'Application',
    items: [
      { icon: '📱', label: 'Installer l\'app (PWA)', action: 'pwa' },
      { icon: '📊', label: 'Exporter mes données', action: 'export' },
    ]
  }
]

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const { profile, saveProfile } = useProfile(user?.id)
  const { sessions } = useHistory(user?.id)
  const { current: currentWeight } = useBodyWeight(user?.id)
  const navigate = useNavigate()
  const [editingGoals, setEditingGoals] = useState(false)
  const [weightGoal, setWeightGoal] = useState('')
  const [level, setLevel] = useState('')
  const [frequency, setFrequency] = useState('')
  const [saving, setSaving] = useState(false)

  // Stats globales
  const totalSessions = sessions.length
  const totalMinutes = sessions.reduce((acc, s) => acc + (s.duration_minutes || 0), 0)
  const totalVolume = sessions.reduce((acc, s) => acc + (s.total_volume || 0), 0)
  const allSets = sessions.flatMap(s => (s.exercises_done || []).flatMap(e => (e.sets || []).filter(s => s.done)))
  const totalSets = allSets.length

  // Première séance
  const firstSession = sessions.length > 0 ? sessions[sessions.length - 1] : null
  const daysSinceStart = firstSession
    ? Math.round((Date.now() - new Date(firstSession.date).getTime()) / 86400000)
    : 0

  const initials = (user?.email || 'A').slice(0, 1).toUpperCase()
  const email = user?.email || ''

  async function handleSaveGoals() {
    setSaving(true)
    await saveProfile({
      weight_goal_kg: weightGoal ? parseFloat(weightGoal) : profile?.weight_goal_kg,
      level: level || profile?.level,
      weekly_frequency: frequency ? parseInt(frequency) : profile?.weekly_frequency
    })
    setSaving(false)
    setEditingGoals(false)
  }

  function openEdit() {
    setWeightGoal(profile?.weight_goal_kg?.toString() || '')
    setLevel(profile?.level || 'intermediate')
    setFrequency(profile?.weekly_frequency?.toString() || '4')
    setEditingGoals(true)
  }

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg-base)' }}>
      {/* Hero profil */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(99,102,241,0.12) 0%, transparent 100%)',
        padding: '32px 20px 24px',
        textAlign: 'center'
      }}>
        {/* Avatar */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%', margin: '0 auto 14px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, fontWeight: 900, color: '#fff',
          boxShadow: '0 8px 32px rgba(99,102,241,0.4)'
        }}>{initials}</div>

        <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 4 }}>
          Anthony
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>{email}</p>

        {/* Badges */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {profile?.level && (
            <span className="badge badge-accent">
              {LEVEL_ICONS[profile.level]} {LEVEL_LABELS[profile.level]}
            </span>
          )}
          {profile?.weekly_frequency && (
            <span className="badge badge-gray">
              📅 {profile.weekly_frequency}x/semaine
            </span>
          )}
          {daysSinceStart > 0 && (
            <span className="badge badge-green">
              🏆 {daysSinceStart}j de pratique
            </span>
          )}
        </div>
      </div>

      {/* Stats globales */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
          <div className="stat-pill">
            <div className="stat-value">{totalSessions}</div>
            <div className="stat-label">Séances totales</div>
          </div>
          <div className="stat-pill">
            <div className="stat-value">{Math.round(totalMinutes / 60)}h</div>
            <div className="stat-label">Temps d'entraînement</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div className="stat-pill">
            <div className="stat-value">{totalVolume >= 1000000 ? `${(totalVolume/1000000).toFixed(1)}Kt` : totalVolume >= 1000 ? `${(totalVolume/1000).toFixed(0)}t` : `${totalVolume}kg`}</div>
            <div className="stat-label">Volume total soulevé</div>
          </div>
          <div className="stat-pill">
            <div className="stat-value">{totalSets}</div>
            <div className="stat-label">Sets complétés</div>
          </div>
        </div>
      </div>

      {/* Objectifs actuels */}
      <div style={{ padding: '0 16px 16px' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>Mes objectifs</h3>
            <button
              onClick={openEdit}
              style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
            >
              Modifier
            </button>
          </div>

          {!editingGoals ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Poids actuel</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {currentWeight ? `${currentWeight} kg` : '—'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Objectif poids</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>
                  {profile?.weight_goal_kg ? `${profile.weight_goal_kg} kg` : '—'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Niveau</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {profile?.level ? `${LEVEL_ICONS[profile.level]} ${LEVEL_LABELS[profile.level]}` : '—'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Fréquence</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {profile?.weekly_frequency ? `${profile.weekly_frequency}x / semaine` : '—'}
                </span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Poids objectif (kg)</label>
                <input className="input-dark" type="number" step="0.5" value={weightGoal} onChange={e => setWeightGoal(e.target.value)} placeholder="ex: 83" />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Niveau</label>
                <select className="input-dark" value={level} onChange={e => setLevel(e.target.value)}>
                  <option value="beginner">🌱 Débutant</option>
                  <option value="intermediate">🔥 Intermédiaire</option>
                  <option value="advanced">⚡ Avancé</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Séances / semaine</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[3,4,5,6].map(f => (
                    <button key={f} onClick={() => setFrequency(f.toString())} style={{
                      flex: 1, padding: '10px 0', borderRadius: 10,
                      border: `1px solid ${frequency == f ? 'var(--accent)' : 'var(--border)'}`,
                      background: frequency == f ? 'rgba(99,102,241,0.15)' : 'var(--bg-elevated)',
                      color: frequency == f ? 'var(--accent)' : 'var(--text-secondary)',
                      fontSize: 14, fontWeight: 800, cursor: 'pointer'
                    }}>{f}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setEditingGoals(false)}>Annuler</button>
                <button className="btn-primary" style={{ flex: 2 }} onClick={handleSaveGoals} disabled={saving}>
                  {saving ? '...' : 'Sauvegarder'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Liens menu */}
      {MENU_SECTIONS.map(section => (
        <div key={section.title} style={{ padding: '0 16px 16px' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
            {section.title}
          </p>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {section.items.map((item, i) => (
              <div
                key={item.action}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px',
                  borderBottom: i < section.items.length - 1 ? '1px solid var(--border)' : 'none',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{item.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>{item.label}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 16 }}>›</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Déconnexion */}
      <div style={{ padding: '0 16px 40px' }}>
        <button
          onClick={signOut}
          style={{
            width: '100%', padding: '14px 24px',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 14, color: '#f87171',
            fontSize: 15, fontWeight: 700, cursor: 'pointer'
          }}
        >
          Se déconnecter
        </button>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 16 }}>
          JarvisFit · Propulsé par Claude
        </p>
      </div>
    </div>
  )
}
