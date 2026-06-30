import { useState, useEffect } from 'react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShown(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!shown || !deferredPrompt) return null

  async function handleInstall() {
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setShown(false)
  }

  return (
    <div style={{
      position: 'fixed', bottom: 72, left: 16, right: 16, zIndex: 100,
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      borderRadius: 16, padding: '14px 16px',
      display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 8px 32px rgba(99,102,241,0.4)'
    }}>
      <span style={{ fontSize: 28 }}>📱</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Installer JarvisFit</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>Accès rapide depuis ton écran d'accueil</div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => setShown(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, padding: '6px 10px', color: '#fff', fontSize: 12, cursor: 'pointer' }}>Plus tard</button>
        <button onClick={handleInstall} style={{ background: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', color: '#6366f1', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Installer</button>
      </div>
    </div>
  )
}
