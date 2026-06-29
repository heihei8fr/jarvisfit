import { supabase } from '../lib/supabase.js'
import { PROGRAM_WEEKS } from './program.js'

export async function seedProgramForUser(userId) {
  const rows = []
  for (const [week, days] of Object.entries(PROGRAM_WEEKS)) {
    for (const [day, data] of Object.entries(days)) {
      rows.push({
        user_id: userId,
        week_number: parseInt(week),
        day_of_week: day,
        session_type: data.session_type,
        exercises: data.exercises
      })
    }
  }
  const { error } = await supabase.from('programs').insert(rows)
  if (error) throw error
}

export async function seedAthleteSummary(userId) {
  const summary = {
    user_id: userId,
    profile: 'Anthony, 37 ans, 1m86, 85kg. Niveau intermédiaire en musculation depuis plusieurs mois sans programme structuré. 20 ans de handball. Objectifs : corps athlétique, reprise handball (explosivité, cardio, jambes), bien-être global. Développé couché max : 95kg. Squat : 65kg × 8 reps. Tractions : 10 reps sans lest. 5km en 26 min.',
    strengths: 'Haut du corps fort (pectoraux, triceps, dos). Bonne force relative aux tractions et dips. Régularité.',
    weaknesses: 'Déséquilibre haut/bas du corps (squat faible vs bench). Cardio à améliorer. Sommeil insuffisant (6-7h).',
    active_injuries: 'Épaule gauche sensible (séquelles handball). Élévations latérales plafonnées à 8kg.',
    trends: 'Première semaine de programme structuré. Séance PUSH S1 réalisée le soir (18h30-20h10). DC : 72.5kg (5,7,7 reps) puis 80kg (3 reps). Militaire limité à 14kg par fatigue accumulée.'
  }
  const { error } = await supabase.from('athlete_summary').upsert(summary)
  if (error) throw error
}
