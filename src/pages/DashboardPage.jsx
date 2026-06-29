import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useProgram } from '../hooks/useProgram'
import { SESSION_TYPES } from '../data/program'
import ReadinessForm from '../components/ReadinessForm'
import WeekRing from '../components/WeekRing'

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { todayProgram, weekPrograms, lastAnalysis, loading } = useProgram(user?.id)
  const [readinessDone, setReadinessDone] = useState(false)
  const navigate = useNavigate()

  const trainingSessions = weekPrograms.filter(p => p.session_type !== 'REPOS' && p.session_type !== 'BILAN')
  const sessionType = todayProgram ? SESSION_TYPES[todayProgram.session_type] : null

  if (loading) return <Spinner />

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex justify-between items-start mb-6 pt-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Bonjour Anthony 👋</h1>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <WeekRing completed={0} total={trainingSessions.length} />
      </div>

      {!readinessDone && (
        <ReadinessForm userId={user.id} onSubmit={() => setReadinessDone(true)} />
      )}

      {todayProgram && todayProgram.session_type !== 'REPOS' && todayProgram.session_type !== 'BILAN' ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{sessionType?.emoji || '🏋️'}</span>
            <div>
              <h2 className="text-base font-bold text-gray-900">{todayProgram.session_type}</h2>
              <p className="text-xs text-gray-500">{todayProgram.exercises?.length} exercices · {todayProgram.label}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-4 line-clamp-2">
            {todayProgram.exercises?.slice(0, 4).map(e => e.name).join(' · ')}
            {todayProgram.exercises?.length > 4 ? ` · +${todayProgram.exercises.length - 4}` : ''}
          </p>
          <button
            onClick={() => navigate(`/session/${todayProgram.id}`)}
            className="w-full bg-blue-600 text-white rounded-xl py-3 font-semibold text-sm"
          >
            Démarrer la séance 🏋️
          </button>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 mb-4 text-center">
          <span className="text-3xl mb-2 block">😴</span>
          <p className="text-sm font-semibold text-gray-700">Jour de repos</p>
          <p className="text-xs text-gray-400">Marche légère et étirements recommandés</p>
        </div>
      )}

      {lastAnalysis && (
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4">
          <h3 className="text-xs font-bold text-blue-800 mb-2">🤖 Dernière analyse Claude</h3>
          <p className="text-xs text-blue-700 leading-relaxed line-clamp-4">{lastAnalysis.recommendation}</p>
          <p className="text-xs text-blue-400 mt-2">
            {new Date(lastAnalysis.created_at).toLocaleDateString('fr-FR')}
          </p>
        </div>
      )}
    </div>
  )
}
