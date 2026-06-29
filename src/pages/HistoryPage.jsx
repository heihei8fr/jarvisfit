import { useAuth } from '../hooks/useAuth'
import { useHistory } from '../hooks/useHistory'
import { formatDuration } from '../utils/fitness'

const FEELING_EMOJI = { great: '🔥', good: '😊', average: '😐', bad: '😓' }
const FEELING_LABEL = { great: 'Top', good: 'Bien', average: 'Moyen', bad: 'Difficile' }

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function HistoryPage() {
  const { user } = useAuth()
  const { sessions, loading } = useHistory(user?.id)

  if (loading) return <Spinner />

  return (
    <div className="min-h-screen bg-gray-50 p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-4 pt-2">Historique</h1>

      {sessions.length === 0 && (
        <div className="text-center text-gray-400 py-16">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-sm">Aucune séance enregistrée</p>
          <p className="text-xs text-gray-300 mt-1">Lance ta première séance depuis le dashboard</p>
        </div>
      )}

      {sessions.map(session => (
        <div key={session.id} className="bg-white rounded-2xl border border-gray-100 p-4 mb-3">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{FEELING_EMOJI[session.general_feeling] || '💪'}</span>
                <span className="text-sm font-bold text-gray-900">
                  {session.exercises_done?.[0]?.session_type || 'Séance'}
                </span>
                <span className="text-xs text-gray-400">· {FEELING_LABEL[session.general_feeling] || ''}</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                {new Date(session.date).toLocaleDateString('fr-FR', {
                  weekday: 'long', day: 'numeric', month: 'long'
                })}
              </p>
            </div>
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
              {formatDuration(session.duration_minutes || 0)}
            </span>
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            {session.exercises_done?.slice(0, 4).map((ex, i) => (
              <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                {ex.name}
              </span>
            ))}
            {(session.exercises_done?.length || 0) > 4 && (
              <span className="text-xs text-gray-400 self-center">
                +{session.exercises_done.length - 4} exercices
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
