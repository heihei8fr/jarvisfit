import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { signIn, signUp } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password)
        if (error) throw error
        setSuccess('Vérifie ta boîte mail pour confirmer ton compte.')
      } else {
        const { error } = await signIn(email, password)
        if (error) throw error
      }
    } catch (err) {
      setError(err.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, margin: '0 auto 16px',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)'
        }}>💪</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }} className="gradient-text">JarvisFit</h1>
        <p style={{ color: 'var(--text-secondary)', margin: '6px 0 0', fontSize: 14 }}>
          Ton coach IA personnel
        </p>
      </div>

      {/* Card */}
      <div className="card" style={{ width: '100%', maxWidth: 400 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 20px', color: 'var(--text-primary)' }}>
          {isSignUp ? 'Créer un compte' : 'Connexion'}
        </h2>

        {error && (
          <div className="badge badge-danger" style={{ marginBottom: 16, display: 'block', padding: '10px 14px', borderRadius: 10 }}>
            {error}
          </div>
        )}
        {success && (
          <div className="badge badge-success" style={{ marginBottom: 16, display: 'block', padding: '10px 14px', borderRadius: 10 }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, fontWeight: 600 }}>Email</label>
            <input
              className="input-dark"
              type="email"
              placeholder="ton@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, fontWeight: 600 }}>Mot de passe</label>
            <input
              className="input-dark"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? '...' : isSignUp ? 'Créer le compte' : 'Se connecter'}
          </button>
        </form>

        <button
          onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccess('') }}
          style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', width: '100%', textAlign: 'center', marginTop: 16, fontSize: 14, fontWeight: 600 }}
        >
          {isSignUp ? 'Déjà un compte ? Se connecter' : "Pas encore de compte ? S'inscrire"}
        </button>
      </div>
    </div>
  )
}
