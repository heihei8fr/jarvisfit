import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useSession } from '../hooks/useSession'
import ExerciseBlock from '../components/ExerciseBlock'
import AnalysisPanel from '../components/AnalysisPanel'

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function SessionPage() {
  const { programId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [program, setProgram] = useState(null)
  const [feeling, setFeeling] = useState('good')
  const [finishing, setFinishing] = useState(false)
  const [analysis, setAnalysis] = useState(null)

  useEffect(() => {
    supabase
      .from('programs')
      .select('*')
      .eq('id', programId)
      .single()
      .then(({ data }) => setProgram(data))
  }, [programId])

  const { exercisesDone, updateSet, markSetDone, getDurationMinutes, getCompletedExercises } =
    useSession(program)

  async function finishSession() {
    setFinishing(true)
    const duration = getDurationMinutes()
    const completed = getCompletedExercises()

    const { data: session } = await supabase
      .from('session_logs')
      .insert({
        user_id: user.id,
        program_id: programId,
        duration_minutes: duration,
        exercises_done: completed,
        general_feeling: feeling,
        date: new Date().toISOString().split('T')[0]
      })
      .select()
      .single()

    if (session) {
      await fetchAnalysis(session.id, completed, duration)
    }
    setFinishing(false)
  }

  async function fetchAnalysis(sessionId, exercises, duration) {
    const { data: summary } = await supabase
      .from('athlete_summary')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    const { data: readiness } = await supabase
      .from('readiness_scores')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', new Date().toISOString().split('T')[0])
      .maybeSingle()

    setAnalysis('')

    try {
      const response = await fetch('/.netlify/functions/analyze-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userId: user.id,
          sessionType: program?.session_type,
          exercises,
          duration,
          feeling,
          readiness,
          athleteSummary: summary?.profile
        })
      })

      if (!response.ok) throw new Error('Analyse indisponible')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullText += decoder.decode(value)
        setAnalysis(fullText)
      }

      await supabase.from('ai_recommendations').insert({
        user_id: user.id,
        session_id: sessionId,
        type: 'post_session',
        recommendation: fullText
      })
    } catch {
      setAnalysis('Analyse temporairement indisponible. Ta séance a bien été enregistrée !')
    }
  }

  if (!program) return <Spinner />
  if (analysis !== null) return <AnalysisPanel analysis={analysis} onClose={() => navigate('/')} />

  return (
    <div className="min-h-screen bg-gray-50 p-4 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-4 pt-2">
        <button onClick={() => navigate('/')} className="text-gray-400 text-xl">←</button>
        <div>
          <h1 className="text-base font-bold text-gray-900">{program.session_type}</h1>
          <p className="text-xs text-gray-500">{program.exercises?.length} exercices · {program.label}</p>
        </div>
      </div>

      {exercisesDone.map((ex, idx) => (
        <ExerciseBlock
          key={idx}
          exercise={ex}
          exerciseIdx={idx}
          onUpdate={updateSet}
          onSetDone={markSetDone}
        />
      ))}

      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Ressenti global de la séance</h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            ['great', '🔥', 'Top'],
            ['good', '😊', 'Bien'],
            ['average', '😐', 'Moyen'],
            ['bad', '😓', 'Dur']
          ].map(([val, emoji, label]) => (
            <button
              key={val}
              onClick={() => setFeeling(val)}
              className={`rounded-xl p-2 text-center text-xs font-semibold transition-all ${
                feeling === val ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <div className="text-xl mb-1">{emoji}</div>
              {label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={finishSession}
        disabled={finishing}
        className="w-full bg-blue-600 text-white rounded-2xl py-4 font-bold text-base mb-6 disabled:opacity-50"
      >
        {finishing ? 'Enregistrement...' : 'Terminer et analyser avec Claude 🤖'}
      </button>
    </div>
  )
}
