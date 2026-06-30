import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useSession } from '../hooks/useSession'
import { useHistory } from '../hooks/useHistory'
import { calcOneRepMax } from '../utils/fitness'
import AnalysisPanel from '../components/AnalysisPanel'
import PRAlert from '../components/PRAlert'
import WeightSuggestion from '../components/WeightSuggestion'
import RestTimer from '../components/RestTimer'
import { suggestWeight } from '../utils/weightSuggestion'

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

const RPE_OPTIONS = ['', '6', '7', '7.5', '8', '8.5', '9', '9.5', '10']

function SetRowPro({ set, setIdx, exerciseIdx, onUpdate, onDone }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '32px 1fr 80px 64px 64px 36px',
      gap: 6, padding: '6px 4px',
      borderBottom: '1px solid var(--border)',
      alignItems: 'center',
      opacity: set.done ? 0.5 : 1,
      background: set.done ? 'rgba(99,102,241,0.04)' : 'transparent',
      transition: 'all 0.2s',
      borderRadius: 8
    }}>
      {/* Numéro set */}
      <div style={{
        width: 26, height: 26, borderRadius: '50%',
        background: set.done ? 'var(--accent)' : 'var(--bg-elevated)',
        border: `1px solid ${set.done ? 'var(--accent)' : 'var(--border-strong)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 800,
        color: set.done ? '#fff' : 'var(--text-secondary)'
      }}>
        {setIdx + 1}
      </div>

      {/* Vide */}
      <div />

      {/* KG */}
      <input
        type="number" step="0.5"
        value={set.weight || ''}
        onChange={e => onUpdate(exerciseIdx, setIdx, 'weight', parseFloat(e.target.value) || 0)}
        disabled={set.done}
        className="num-input"
        placeholder="0"
      />

      {/* REPS */}
      <input
        type="number"
        value={set.reps || ''}
        onChange={e => onUpdate(exerciseIdx, setIdx, 'reps', parseInt(e.target.value) || 0)}
        disabled={set.done}
        className="num-input"
        placeholder="0"
      />

      {/* RPE */}
      <select
        value={set.rpe || ''}
        onChange={e => onUpdate(exerciseIdx, setIdx, 'rpe', e.target.value || null)}
        disabled={set.done}
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-strong)',
          borderRadius: 8,
          color: 'var(--text-primary)',
          fontSize: 13, fontWeight: 700,
          padding: '8px 2px',
          width: '100%',
          textAlign: 'center',
          outline: 'none',
          fontFamily: 'inherit'
        }}
      >
        {RPE_OPTIONS.map(r => <option key={r} value={r}>{r || '—'}</option>)}
      </select>

      {/* Check */}
      <button
        className={`check-btn${set.done ? ' done' : ''}`}
        onClick={() => !set.done && onDone(exerciseIdx, setIdx)}
        disabled={set.done}
      >
        {set.done ? '✓' : ''}
      </button>
    </div>
  )
}

function ExerciseBlockPro({ exercise, exerciseIdx, onUpdate, onSetDone, sessions }) {
  const [showTimer, setShowTimer] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(exercise.rest || 90)

  function handleSetDone(exIdx, setIdx) {
    onSetDone(exIdx, setIdx)
    if ((exercise.rest || 0) > 0) {
      setTimerSeconds(exercise.rest)
      setShowTimer(true)
    }
  }

  const suggestion = suggestWeight(exercise.name, exercise.weight || 0, sessions)
  const muscles = exercise.muscles || exercise.muscle || []

  return (
    <div className="card" style={{ margin: '0 16px 12px' }}>
      {/* Nom exercice + muscles */}
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{exercise.name}</h3>
        {muscles.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {muscles.map((m, i) => (
              <span key={i} className="badge badge-gray">{m}</span>
            ))}
          </div>
        )}
      </div>

      <WeightSuggestion suggestion={suggestion} />

      {/* Table header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '32px 1fr 80px 64px 64px 36px',
        gap: 6, padding: '0 4px 8px',
        borderBottom: '1px solid var(--border)',
        fontSize: 10, fontWeight: 700, color: 'var(--text-muted)',
        letterSpacing: '0.08em', textTransform: 'uppercase'
      }}>
        <div>SET</div><div></div><div style={{textAlign:'center'}}>KG</div>
        <div style={{textAlign:'center'}}>REPS</div>
        <div style={{textAlign:'center'}}>RPE</div>
        <div></div>
      </div>

      {/* Set rows */}
      {exercise.sets.map((set, si) => (
        <SetRowPro
          key={si}
          set={set}
          setIdx={si}
          exerciseIdx={exerciseIdx}
          onUpdate={onUpdate}
          onDone={handleSetDone}
        />
      ))}

      {showTimer && (
        <RestTimer
          seconds={timerSeconds}
          onDone={() => setShowTimer(false)}
        />
      )}
    </div>
  )
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function SessionPage() {
  const { programId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [program, setProgram] = useState(null)
  const [feeling, setFeeling] = useState('good')
  const [finishing, setFinishing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    supabase
      .from('programs')
      .select('*')
      .eq('id', programId)
      .single()
      .then(({ data }) => setProgram(data))
  }, [programId])

  useEffect(() => {
    const interval = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  const { exercisesDone, updateSet, markSetDone, getDurationMinutes, getCompletedExercises } =
    useSession(program)

  const { sessions, getOneRepMaxHistory } = useHistory(user?.id)
  const [prAlert, setPrAlert] = useState(null)

  // Compute stats for header
  const completedSets = exercisesDone.reduce((acc, ex) => acc + (ex.sets?.filter(s => s.done).length || 0), 0)
  const totalSets = exercisesDone.reduce((acc, ex) => acc + (ex.sets?.length || 0), 0)

  const todayProgram = program

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
    <div style={{ minHeight:'100vh', background:'var(--bg-base)', paddingBottom: 24 }}>
      {prAlert && (
        <PRAlert
          exerciseName={prAlert.exerciseName}
          newOrm={prAlert.newOrm}
          onDismiss={() => setPrAlert(null)}
        />
      )}

      {/* Sticky header + progress */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(8,8,16,0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        padding: '12px 20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 1 }}>{todayProgram?.session_type || 'Séance'}</p>
            <p style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)' }}>{formatTime(elapsed)}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{completedSets}/{totalSets} sets</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{Math.round(completedSets/Math.max(totalSets,1)*100)}%</p>
          </div>
        </div>
        <div style={{ height: 3, background: 'var(--bg-elevated)', borderRadius: 99 }}>
          <div style={{
            height: '100%',
            width: `${Math.round(completedSets/Math.max(totalSets,1)*100)}%`,
            background: 'linear-gradient(90deg, var(--accent), var(--accent-2))',
            borderRadius: 99,
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* Exercices */}
      <div style={{ paddingTop: 16 }}>
        {exercisesDone.map((ex, idx) => (
          <ExerciseBlockPro
            key={idx}
            exercise={ex}
            exerciseIdx={idx}
            onUpdate={updateSet}
            onSetDone={handleSetDone}
            sessions={sessions}
          />
        ))}

        {/* Feeling */}
        <div className="card" style={{ margin: '0 16px 16px' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Ressenti global</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {FEELINGS.map(({ value, emoji, label }) => (
              <button
                key={value}
                onClick={() => setFeeling(value)}
                style={{
                  background: feeling === value ? 'var(--accent)' : 'var(--bg-elevated)',
                  border: `1px solid ${feeling === value ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 12,
                  padding: '12px 8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 4 }}>{emoji}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: feeling === value ? '#fff' : 'var(--text-secondary)' }}>{label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Finish button */}
        <div style={{ padding: '0 16px' }}>
          <button
            className="btn-primary"
            onClick={finishSession}
            disabled={finishing}
            style={{ opacity: finishing ? 0.7 : 1 }}
          >
            {finishing ? '⏳ Analyse en cours...' : '✅ Terminer la séance'}
          </button>
        </div>
      </div>
    </div>
  )
}
