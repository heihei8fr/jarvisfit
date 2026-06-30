import { useEffect, useState } from 'react'

export default function PRAlert({ exerciseName, newOrm, onDismiss }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false)
      onDismiss?.()
    }, 3500)
    return () => clearTimeout(t)
  }, [])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', top: 20, left: 16, right: 16, zIndex: 200,
      background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
      borderRadius: 16, padding: '14px 18px',
      display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 8px 32px rgba(245,158,11,0.4)',
      animation: 'slideDown 0.3s ease-out'
    }}>
      <style>{`
        @keyframes slideDown {
          from { opacity:0; transform:translateY(-20px) }
          to { opacity:1; transform:translateY(0) }
        }
      `}</style>
      <span style={{ fontSize: 32 }}>🏆</span>
      <div>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>Nouveau record !</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>
          {exerciseName} — 1RM estimé : <strong>{newOrm} kg</strong>
        </div>
      </div>
    </div>
  )
}
