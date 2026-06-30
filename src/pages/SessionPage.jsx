import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useSession } from '../hooks/useSession'
import { useHistory } from '../hooks/useHistory'
import { calcOneRepMax } from '../utils/fitness'
import ExerciseBlock from '../components/ExerciseBlock'
import AnalysisPanel from '../components/AnalysisPanel'
import PRAlert from '../components/PRAlert'

function Spinner() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-base)' }}>
      <div style={{ width:32, height:32, border:'3px solid var(--accent)', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
    </div>
  )
}

const FEELINGS = [
  { value: 'great', emoji: '🔥', label: 'Top' },
  { value: 'good', emoji: '😊', label: 'Bien' },
  { value: 'average', emoji: '😐', label: 'Moyen' },
  { value: 'bad', emoji: '😓', label: 'Dur' },
]

export default function SessionPage() {
  const { programId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [program, setProgram] = useState(null)
  const [feeling, setFeeling] = useState('good')
  const [finishing, setFinishing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [elapsedMinutes, setElapsedMinutes] = useState(0)

  useEffect(() => {
    supabase
      .from('programs')
      .select('*')
      .eq('id', programId)
      .single()
      .then(({ data }) => setProgram(data))
  }, [programId])

  useEffect(() => {
    const interval = setInterval(() => setElapsedMinutes(m => m + 1), 60000)
    return () => clearInterval(interval)
  }, [])

  const { exercisesDone, updateSet, markSetDone, getDurationMinutes, getCompletedExercises } =
    useSession(program)

  const { getOneRepMaxHistory } = useHistory(user?.id)
  const [prAlert, setPrAlert] = useState(null)

  function checkPR(exerciseName, weight, reps) {
    if (!weight || !reps) return
    const newOrm = calcOneRepMax(weight, reps)
    const history = getOneRepMaxHistory(exerciseName)
    const bestOrm = history.length > 0 ? Math.max(...history.map(h => h.orm)) : 0
    if (newOrm > bestOrm) {
      setPrAlert({ exerciseName, newOrm })
      if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200])
    }
  }

  function handleSetDone(exerciseIdx, setIdx) {
    const ex = exercisesDone[exerciseIdx]
    const set = ex?.sets?.[setIdx]
    markSetDone(exerciseIdx, setIdx)
    if (set && ex) checkPR(ex.name, set.weight, set.reps)
  }

  const completedExercises = exercisesDone.filter(ex =>
    ex.sets?.every(s => s.done)
  ).length
  const totalExercises = exercisesDone.length
  const progressPct = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0

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
    <div style={{ minHeight:'100vh', background:'var(--bg-base)', paddingBottom:100 }}>
      {prAlert && (
        <PRAlert
          exerciseName={prAlert.exerciseName}
          newOrm={prAlert.newOrm}
          onDismiss={() => setPrAlert(null)}
        />
      )}
      {/* Sticky header + progress */}
      <div style={{ position:'sticky', top:0, zIndex:40, background:'var(--bg-base)', padding:'12px 16px 8px', borderBottom:'1px solid var(--border)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
          <button
            onClick={() => navigate('/')}
            style={{ background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:10, padding:'6px 12px', color:'var(--text-secondary)', fontSize:13, cursor:'pointer' }}
          >
            ← Retour
          </button>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{program.session_type}</div>
            <div style={{ fontSize:11, color:'var(--text-secondary)' }}>{elapsedMinutes} min</div>
          </div>
          <div style={{ width:70 }} />
        </div>

        <div style={{ background:'var(--border)', borderRadius:99, height:4, overflow:'hidden' }}>
          <div style={{
            background:'linear-gradient(90deg,#6366f1,#8b5cf6)',
            height:'100%',
            width:`${progressPct}%`,
            borderRadius:99,
            transition:'width 0.4s ease'
          }} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
          <span style={{ fontSize:11, color:'var(--text-secondary)' }}>{completedExercises} / {totalExercises} exercices</span>
          <span style={{ fontSize:11, color:'#6366f1', fontWeight:600 }}>{Math.round(progressPct)}%</span>
        </div>
      </div>

      {/* Exercices */}
      <div style={{ padding:'16px 16px 0' }}>
        {exercisesDone.map((ex, idx) => (
          <ExerciseBlock
            key={idx}
            exercise={ex}
            exerciseIdx={idx}
            onUpdate={updateSet}
            onSetDone={handleSetDone}
          />
        ))}

        {/* Feeling */}
        <div className="card" style={{ marginBottom:16 }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', marginBottom:12 }}>Ressenti global</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {FEELINGS.map(({ value, emoji, label }) => (
              <button
                key={value}
                onClick={() => setFeeling(value)}
                style={{
                  background: feeling === value ? 'var(--accent)' : 'var(--bg-elevated)',
                  border: `1px solid ${feeling === value ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius:12,
                  padding:'12px 8px',
                  textAlign:'center',
                  cursor:'pointer',
                  transition:'all 0.2s'
                }}
              >
                <div style={{ fontSize:24, marginBottom:4 }}>{emoji}</div>
                <div style={{ fontSize:12, fontWeight:600, color: feeling === value ? '#fff' : 'var(--text-secondary)' }}>{label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Finish button */}
        <button
          className="btn-primary"
          onClick={finishSession}
          disabled={finishing}
          style={{ width:'100%', marginTop:8, opacity: finishing ? 0.7 : 1, fontSize:15 }}
        >
          {finishing ? '⏳ Analyse en cours...' : '✅ Terminer la séance'}
        </button>
      </div>
    </div>
  )
}
