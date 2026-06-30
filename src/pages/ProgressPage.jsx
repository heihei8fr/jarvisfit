import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useHistory } from '../hooks/useHistory'
import PRChart from '../components/PRChart'
import WeightTracker from '../components/WeightTracker'

const TRACKED_EXERCISES = [
  'Développé couché barre',
  'Squat barre',
  'Tractions lestées',
  'Développé militaire haltères',
  'Romanian deadlift'
]

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function ProgressPage() {
  const { user } = useAuth()
  const { getOneRepMaxHistory, loading } = useHistory(user?.id)
  const [selected, setSelected] = useState(TRACKED_EXERCISES[0])

  if (loading) return <Spinner />

  const data = getOneRepMaxHistory(selected)
  const currentOrm = data.length > 0 ? data[data.length - 1].orm : null
  const firstOrm = data.length > 0 ? data[0].orm : null
  const progression = currentOrm && firstOrm ? currentOrm - firstOrm : null

  return (
    <div className="min-h-screen bg-gray-50 p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-4 pt-2">Progression</h1>

      <WeightTracker />

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide mt-4">
        {TRACKED_EXERCISES.map(ex => (
          <button
            key={ex}
            onClick={() => setSelected(ex)}
            className={`flex-none text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
              selected === ex
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600'
            }`}
          >
            {ex}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
        <PRChart data={data} exerciseName={selected} />
      </div>

      {currentOrm && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{currentOrm} kg</div>
            <div className="text-xs text-gray-400 mt-1">1RM actuel</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <div className={`text-2xl font-bold ${progression > 0 ? 'text-green-600' : progression < 0 ? 'text-red-500' : 'text-gray-400'}`}>
              {progression !== null ? `${progression > 0 ? '+' : ''}${progression} kg` : '—'}
            </div>
            <div className="text-xs text-gray-400 mt-1">Progression totale</div>
          </div>
        </div>
      )}

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <div className="text-3xl mb-2">📈</div>
          <p className="text-sm">Commence à logger tes séances</p>
          <p className="text-xs text-gray-300 mt-1">Ton 1RM estimé apparaîtra ici</p>
        </div>
      )}
    </div>
  )
}
