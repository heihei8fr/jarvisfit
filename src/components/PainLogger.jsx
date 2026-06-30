import { useState } from 'react'
import { usePainLogs } from '../hooks/usePainLogs'
import { useAuth } from '../hooks/useAuth'

const BODY_ZONES = [
  { value: 'epaule_gauche', label: '🦴 Épaule gauche' },
  { value: 'epaule_droite', label: '🦴 Épaule droite' },
  { value: 'genou_gauche', label: '🦵 Genou gauche' },
  { value: 'genou_droit', label: '🦵 Genou droit' },
  { value: 'dos_bas', label: '🔙 Bas du dos' },
  { value: 'dos_haut', label: '🔙 Haut du dos' },
  { value: 'coude_gauche', label: '💪 Coude gauche' },
  { value: 'coude_droit', label: '💪 Coude droit' },
  { value: 'poignet_gauche', label: '✋ Poignet gauche' },
  { value: 'poignet_droit', label: '✋ Poignet droit' },
  { value: 'cheville', label: '🦶 Cheville' },
  { value: 'autre', label: '⚡ Autre' },
]

const INTENSITY_COLORS = ['', '#10b981','#10b981','#84cc16','#84cc16','#f59e0b','#f59e0b','#f97316','#f97316','#ef4444','#ef4444']

export default function PainLogger() {
  const { user } = useAuth()
  const { activePains, logPain, resolvePain } = usePainLogs(user?.id)
  const [isOpen, setIsOpen] = useState(false)
  const [zone, setZone] = useState('epaule_gauche')
  const [intensity, setIntensity] = useState(3)
  const [description, setDescription] = useState('')
  const [affectsTraining, setAffectsTraining] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleSubmit() {
    setSaving(true)
    await logPain({ body_zone: zone, intensity, description, affects_training: affectsTraining })
    setDescription('')
    setIntensity(3)
    setIsOpen(false)
    setSaving(false)
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>🩹</span>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Douleurs</h3>
            {activePains.length > 0 && (
              <p style={{ fontSize: 11, color: '#f59e0b', margin: 0 }}>{activePains.length} zone(s) active(s)</p>
            )}
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
          {isOpen ? 'Annuler' : '+ Ajouter'}
        </button>
      </div>

      {/* Formulaire */}
      {isOpen && (
        <div style={{ background: 'var(--bg-elevated)', borderRadius: 12, padding: 14, marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, fontWeight: 600 }}>Zone</label>
            <select
              value={zone}
              onChange={e => setZone(e.target.value)}
              className="input-dark"
              style={{ appearance: 'none' }}
            >
              {BODY_ZONES.map(z => (
                <option key={z.value} value={z.value}>{z.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, fontWeight: 600 }}>
              Intensité : <span style={{ color: INTENSITY_COLORS[intensity] || '#6366f1', fontWeight: 800 }}>{intensity}/10</span>
            </label>
            <input
              type="range" min={1} max={10} value={intensity}
              onChange={e => setIntensity(Number(e.target.value))}
              style={{ width: '100%', accentColor: INTENSITY_COLORS[intensity] || '#6366f1' }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, fontWeight: 600 }}>Note (optionnel)</label>
            <input
              className="input-dark"
              type="text"
              placeholder="ex: douleur à l'élévation latérale"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              onClick={() => setAffectsTraining(!affectsTraining)}
              style={{
                width: 44, height: 24, borderRadius: 99,
                background: affectsTraining ? '#6366f1' : 'var(--border)',
                position: 'relative', cursor: 'pointer', transition: 'background 0.2s'
              }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: '50%', background: '#fff',
                position: 'absolute', top: 3, left: affectsTraining ? 23 : 3,
                transition: 'left 0.2s'
              }} />
            </div>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Affecte l'entraînement</span>
          </div>

          <button className="btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer la douleur'}
          </button>
        </div>
      )}

      {/* Liste douleurs actives */}
      {activePains.length === 0 && !isOpen && (
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', padding: '12px 0', margin: 0 }}>
          Aucune douleur active 💪
        </p>
      )}
      {activePains.map(pain => {
        const zoneLabel = BODY_ZONES.find(z => z.value === pain.body_zone)?.label || pain.body_zone
        const daysSince = Math.round((Date.now() - new Date(pain.date).getTime()) / 86400000)
        return (
          <div key={pain.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 0', borderTop: '1px solid var(--border)'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                  background: `${INTENSITY_COLORS[pain.intensity] || '#6366f1'}20`,
                  color: INTENSITY_COLORS[pain.intensity] || '#6366f1'
                }}>
                  {pain.intensity}/10
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{zoneLabel}</span>
                {pain.affects_training && <span style={{ fontSize: 10, color: '#f59e0b' }}>⚠️ Training</span>}
              </div>
              {pain.description && <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: '3px 0 0' }}>{pain.description}</p>}
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: '2px 0 0', opacity: 0.6 }}>
                {daysSince === 0 ? "Aujourd'hui" : `Il y a ${daysSince}j`}
              </p>
            </div>
            <button
              onClick={() => resolvePain(pain.id)}
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid #10b98140', borderRadius: 8, padding: '5px 10px', color: '#34d399', fontSize: 12, fontWeight: 600, cursor: 'pointer', marginLeft: 8 }}
            >
              Résolu ✓
            </button>
          </div>
        )
      })}
    </div>
  )
}
