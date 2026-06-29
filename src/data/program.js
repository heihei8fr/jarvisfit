export const PROGRAM_WEEKS = {
  1: {
    monday: {
      session_type: 'PUSH',
      label: 'Poitrine · Épaules · Triceps',
      exercises: [
        { name: 'Développé couché barre', sets: 4, reps: 8, weight: 72, rest: 90, muscle: ['pectoraux', 'deltoïdes ant.'] },
        { name: 'Développé incliné haltères', sets: 3, reps: 10, weight: 24, rest: 75, muscle: ['pectoraux haut'] },
        { name: 'Élévations latérales', sets: 3, reps: 12, weight: 8, rest: 60, muscle: ['deltoïdes lat.'] },
        { name: 'Développé militaire haltères', sets: 4, reps: 8, weight: 22, rest: 90, muscle: ['épaules'] },
        { name: 'Dips lestés', sets: 3, reps: 8, weight: 20, rest: 90, muscle: ['triceps', 'pectoraux'] },
        { name: 'Pompes diamant', sets: 3, reps: 0, weight: 0, rest: 60, isMaxReps: true, muscle: ['triceps'] },
        { name: 'Planche + Crunchs', sets: 3, reps: 20, weight: 0, rest: 45, hasPlank: true, plankSeconds: 60, muscle: ['core'] }
      ]
    },
    tuesday: {
      session_type: 'PULL',
      label: 'Dos · Biceps · Core',
      exercises: [
        { name: 'Tractions lestées', sets: 4, reps: 6, weight: 15, rest: 120, muscle: ['grand dorsal', 'biceps'] },
        { name: 'Rowing barre', sets: 4, reps: 8, weight: 60, rest: 90, muscle: ['dos épais'] },
        { name: 'Tirage poulie haute prise large', sets: 3, reps: 10, weight: 65, rest: 75, muscle: ['grand dorsal'] },
        { name: 'Face pulls câble', sets: 3, reps: 15, weight: 20, rest: 60, muscle: ['rotateurs', 'trapèzes'] },
        { name: 'Curl barre EZ', sets: 3, reps: 10, weight: 35, rest: 75, muscle: ['biceps'] },
        { name: 'Curl marteau haltères', sets: 3, reps: 12, weight: 15, rest: 60, muscle: ['brachioradial'] },
        { name: 'Gainage latéral + Russian twist', sets: 3, reps: 20, weight: 0, rest: 45, hasPlank: true, plankSeconds: 45, muscle: ['core'] }
      ]
    },
    wednesday: {
      session_type: 'LEGS',
      label: 'Jambes · Explosivité Handball',
      exercises: [
        { name: 'Squat barre', sets: 4, reps: 8, weight: 55, rest: 120, muscle: ['quadriceps', 'fessiers'] },
        { name: 'Leg press', sets: 4, reps: 10, weight: 100, rest: 90, muscle: ['quadriceps'] },
        { name: 'Fentes marchées haltères', sets: 3, reps: 12, weight: 15, rest: 90, muscle: ['fessiers', 'quadriceps'] },
        { name: 'Leg curl couché', sets: 3, reps: 12, weight: 30, rest: 75, muscle: ['ischios'] },
        { name: 'Mollets debout', sets: 4, reps: 15, weight: 20, rest: 60, muscle: ['mollets'] },
        { name: 'Box jumps', sets: 4, reps: 8, weight: 0, rest: 90, muscle: ['explosivité'] },
        { name: 'Sprint 10m (allers-retours)', sets: 5, reps: 5, weight: 0, rest: 60, muscle: ['handball'] }
      ]
    },
    thursday: {
      session_type: 'UPPER',
      label: 'Hypertrophie · Bras',
      exercises: [
        { name: 'Développé couché prise serrée', sets: 4, reps: 10, weight: 70, rest: 75, muscle: ['triceps', 'pectoraux int.'] },
        { name: 'Rowing haltère unilatéral', sets: 3, reps: 10, weight: 30, rest: 60, muscle: ['grand dorsal'] },
        { name: 'Oiseau rear delt', sets: 3, reps: 15, weight: 8, rest: 60, muscle: ['deltoïdes post.'] },
        { name: 'Pullover haltère', sets: 3, reps: 12, weight: 24, rest: 75, muscle: ['grand dorsal', 'pectoraux'] },
        { name: 'Superset Curl EZ + Pushdown câble', sets: 4, reps: 12, weight: 25, rest: 60, isSuperset: true, muscle: ['biceps', 'triceps'] },
        { name: 'Shrugs barre', sets: 3, reps: 15, weight: 80, rest: 60, muscle: ['trapèzes sup.'] },
        { name: 'Leg raise + Planche', sets: 3, reps: 12, weight: 0, rest: 60, hasPlank: true, plankSeconds: 45, muscle: ['core'] }
      ]
    },
    friday: {
      session_type: 'LEGS 2',
      label: 'Jambes · Cardio déficit',
      exercises: [
        { name: 'Bulgarian split squat', sets: 4, reps: 10, weight: 15, rest: 90, muscle: ['quadriceps', 'fessiers'] },
        { name: 'Leg extension', sets: 3, reps: 15, weight: 35, rest: 60, muscle: ['quadriceps'] },
        { name: 'Romanian deadlift', sets: 4, reps: 10, weight: 60, rest: 90, muscle: ['ischios'] },
        { name: 'HIIT vélo 30s/30s', sets: 10, reps: 1, weight: 0, rest: 0, isHIIT: true, muscle: ['cardio handball'] },
        { name: 'Planche variations', sets: 4, reps: 1, weight: 0, rest: 0, hasPlank: true, plankSeconds: 45, muscle: ['core'] }
      ]
    },
    saturday: {
      session_type: 'FULL BODY',
      label: 'Fonctionnel · Handball',
      exercises: [
        { name: 'Clean & Press barre', sets: 4, reps: 6, weight: 40, rest: 90, muscle: ['full body'] },
        { name: 'Thruster haltères', sets: 3, reps: 10, weight: 15, rest: 75, muscle: ['full body'] },
        { name: 'Romanian deadlift haltères', sets: 4, reps: 12, weight: 15, rest: 75, muscle: ['chaîne post.'] },
        { name: 'Tractions + Dips superset', sets: 3, reps: 0, weight: 0, rest: 90, isMaxReps: true, isSuperset: true, muscle: ['dos', 'triceps'] },
        { name: 'Circuit handball', sets: 3, reps: 1, weight: 0, rest: 120, isCircuit: true, durationMinutes: 5, muscle: ['handball'] }
      ]
    },
    sunday: {
      session_type: 'REPOS',
      label: 'Repos actif · Marche · Étirements',
      exercises: []
    }
  },
  2: {
    monday: {
      session_type: 'PUSH',
      label: 'Poitrine · Épaules · Triceps S2',
      exercises: [
        { name: 'Développé couché barre', sets: 4, reps: 8, weight: 77, rest: 90, muscle: ['pectoraux', 'deltoïdes ant.'] },
        { name: 'Développé incliné haltères', sets: 3, reps: 10, weight: 26, rest: 75, muscle: ['pectoraux haut'] },
        { name: 'Élévations latérales', sets: 3, reps: 12, weight: 8, rest: 60, muscle: ['deltoïdes lat.'] },
        { name: 'Développé militaire haltères', sets: 4, reps: 8, weight: 24, rest: 90, muscle: ['épaules'] },
        { name: 'Dips lestés', sets: 3, reps: 8, weight: 25, rest: 90, muscle: ['triceps', 'pectoraux'] },
        { name: 'Pompes diamant', sets: 3, reps: 0, weight: 0, rest: 60, isMaxReps: true, muscle: ['triceps'] },
        { name: 'Planche + Crunchs', sets: 3, reps: 20, weight: 0, rest: 45, hasPlank: true, plankSeconds: 60, muscle: ['core'] }
      ]
    },
    tuesday: {
      session_type: 'PULL',
      label: 'Dos · Biceps S2',
      exercises: [
        { name: 'Tractions lestées', sets: 4, reps: 6, weight: 20, rest: 120, muscle: ['grand dorsal', 'biceps'] },
        { name: 'Rowing barre', sets: 4, reps: 8, weight: 65, rest: 90, muscle: ['dos épais'] },
        { name: 'Tirage poulie haute prise large', sets: 3, reps: 10, weight: 70, rest: 75, muscle: ['grand dorsal'] },
        { name: 'Face pulls câble', sets: 3, reps: 15, weight: 22, rest: 60, muscle: ['rotateurs', 'trapèzes'] },
        { name: 'Curl barre EZ', sets: 3, reps: 10, weight: 37, rest: 75, muscle: ['biceps'] },
        { name: 'Curl marteau haltères', sets: 3, reps: 12, weight: 15, rest: 60, muscle: ['brachioradial'] },
        { name: 'Gainage latéral + Russian twist', sets: 3, reps: 20, weight: 0, rest: 45, hasPlank: true, plankSeconds: 45, muscle: ['core'] }
      ]
    },
    wednesday: {
      session_type: 'LEGS',
      label: 'Jambes · Explosivité S2',
      exercises: [
        { name: 'Squat barre', sets: 4, reps: 8, weight: 65, rest: 120, muscle: ['quadriceps', 'fessiers'] },
        { name: 'Leg press', sets: 4, reps: 10, weight: 110, rest: 90, muscle: ['quadriceps'] },
        { name: 'Fentes marchées haltères', sets: 3, reps: 12, weight: 17, rest: 90, muscle: ['fessiers', 'quadriceps'] },
        { name: 'Leg curl couché', sets: 3, reps: 12, weight: 33, rest: 75, muscle: ['ischios'] },
        { name: 'Mollets debout', sets: 4, reps: 15, weight: 22, rest: 60, muscle: ['mollets'] },
        { name: 'Box jumps', sets: 4, reps: 10, weight: 0, rest: 90, muscle: ['explosivité'] },
        { name: 'Sprint 10m (allers-retours)', sets: 6, reps: 5, weight: 0, rest: 60, muscle: ['handball'] }
      ]
    },
    thursday: {
      session_type: 'UPPER',
      label: 'Hypertrophie S2',
      exercises: [
        { name: 'Développé couché prise serrée', sets: 4, reps: 10, weight: 75, rest: 75, muscle: ['triceps', 'pectoraux int.'] },
        { name: 'Rowing haltère unilatéral', sets: 3, reps: 10, weight: 32, rest: 60, muscle: ['grand dorsal'] },
        { name: 'Oiseau rear delt', sets: 3, reps: 15, weight: 9, rest: 60, muscle: ['deltoïdes post.'] },
        { name: 'Pullover haltère', sets: 3, reps: 12, weight: 26, rest: 75, muscle: ['grand dorsal', 'pectoraux'] },
        { name: 'Superset Curl EZ + Pushdown câble', sets: 4, reps: 12, weight: 27, rest: 60, isSuperset: true, muscle: ['biceps', 'triceps'] },
        { name: 'Shrugs barre', sets: 3, reps: 15, weight: 85, rest: 60, muscle: ['trapèzes sup.'] },
        { name: 'Leg raise + Planche', sets: 3, reps: 12, weight: 0, rest: 60, hasPlank: true, plankSeconds: 50, muscle: ['core'] }
      ]
    },
    friday: {
      session_type: 'LEGS 2',
      label: 'Jambes · HIIT S2',
      exercises: [
        { name: 'Bulgarian split squat', sets: 4, reps: 10, weight: 17, rest: 90, muscle: ['quadriceps', 'fessiers'] },
        { name: 'Leg extension', sets: 3, reps: 15, weight: 38, rest: 60, muscle: ['quadriceps'] },
        { name: 'Romanian deadlift', sets: 4, reps: 10, weight: 65, rest: 90, muscle: ['ischios'] },
        { name: 'HIIT vélo 30s/30s', sets: 12, reps: 1, weight: 0, rest: 0, isHIIT: true, muscle: ['cardio handball'] },
        { name: 'Planche variations', sets: 4, reps: 1, weight: 0, rest: 0, hasPlank: true, plankSeconds: 50, muscle: ['core'] }
      ]
    },
    saturday: {
      session_type: 'FULL BODY',
      label: 'Fonctionnel S2',
      exercises: [
        { name: 'Clean & Press barre', sets: 4, reps: 6, weight: 45, rest: 90, muscle: ['full body'] },
        { name: 'Thruster haltères', sets: 3, reps: 10, weight: 17, rest: 75, muscle: ['full body'] },
        { name: 'Romanian deadlift haltères', sets: 4, reps: 12, weight: 17, rest: 75, muscle: ['chaîne post.'] },
        { name: 'Tractions + Dips superset', sets: 3, reps: 0, weight: 0, rest: 90, isMaxReps: true, isSuperset: true, muscle: ['dos', 'triceps'] },
        { name: 'Circuit handball', sets: 3, reps: 1, weight: 0, rest: 120, isCircuit: true, durationMinutes: 5, muscle: ['handball'] }
      ]
    },
    sunday: {
      session_type: 'REPOS',
      label: 'Repos actif S2',
      exercises: []
    }
  },
  3: {
    monday: {
      session_type: 'PUSH',
      label: 'Poitrine · Épaules · Triceps S3',
      exercises: [
        { name: 'Développé couché barre', sets: 4, reps: 8, weight: 82, rest: 90, muscle: ['pectoraux', 'deltoïdes ant.'] },
        { name: 'Développé incliné haltères', sets: 4, reps: 10, weight: 28, rest: 75, muscle: ['pectoraux haut'] },
        { name: 'Élévations latérales', sets: 4, reps: 12, weight: 8, rest: 60, muscle: ['deltoïdes lat.'] },
        { name: 'Développé militaire haltères', sets: 4, reps: 8, weight: 26, rest: 90, muscle: ['épaules'] },
        { name: 'Dips lestés', sets: 4, reps: 8, weight: 27, rest: 90, muscle: ['triceps', 'pectoraux'] },
        { name: 'Pompes diamant', sets: 3, reps: 0, weight: 0, rest: 60, isMaxReps: true, muscle: ['triceps'] },
        { name: 'Planche + Crunchs', sets: 4, reps: 25, weight: 0, rest: 45, hasPlank: true, plankSeconds: 60, muscle: ['core'] }
      ]
    },
    tuesday: { session_type: 'PULL', label: 'Dos · Biceps S3', exercises: [
      { name: 'Tractions lestées', sets: 4, reps: 6, weight: 25, rest: 120, muscle: ['grand dorsal', 'biceps'] },
      { name: 'Rowing barre', sets: 4, reps: 8, weight: 70, rest: 90, muscle: ['dos épais'] },
      { name: 'Tirage poulie haute prise large', sets: 4, reps: 10, weight: 72, rest: 75, muscle: ['grand dorsal'] },
      { name: 'Face pulls câble', sets: 3, reps: 15, weight: 25, rest: 60, muscle: ['rotateurs', 'trapèzes'] },
      { name: 'Curl barre EZ', sets: 4, reps: 10, weight: 40, rest: 75, muscle: ['biceps'] },
      { name: 'Curl marteau haltères', sets: 3, reps: 12, weight: 15, rest: 60, muscle: ['brachioradial'] },
      { name: 'Gainage latéral + Russian twist', sets: 3, reps: 25, weight: 0, rest: 45, hasPlank: true, plankSeconds: 50, muscle: ['core'] }
    ]},
    wednesday: { session_type: 'LEGS', label: 'Jambes · Explosivité S3', exercises: [
      { name: 'Squat barre', sets: 4, reps: 6, weight: 72, rest: 120, muscle: ['quadriceps', 'fessiers'] },
      { name: 'Leg press', sets: 4, reps: 10, weight: 120, rest: 90, muscle: ['quadriceps'] },
      { name: 'Fentes marchées haltères', sets: 4, reps: 12, weight: 17, rest: 90, muscle: ['fessiers', 'quadriceps'] },
      { name: 'Leg curl couché', sets: 4, reps: 12, weight: 35, rest: 75, muscle: ['ischios'] },
      { name: 'Mollets debout', sets: 4, reps: 15, weight: 25, rest: 60, muscle: ['mollets'] },
      { name: 'Box jumps', sets: 4, reps: 10, weight: 0, rest: 90, muscle: ['explosivité'] },
      { name: 'Sprint 10m (allers-retours)', sets: 6, reps: 6, weight: 0, rest: 60, muscle: ['handball'] }
    ]},
    thursday: { session_type: 'UPPER', label: 'Hypertrophie S3', exercises: [
      { name: 'Développé couché prise serrée', sets: 4, reps: 10, weight: 80, rest: 75, muscle: ['triceps', 'pectoraux int.'] },
      { name: 'Rowing haltère unilatéral', sets: 4, reps: 10, weight: 34, rest: 60, muscle: ['grand dorsal'] },
      { name: 'Oiseau rear delt', sets: 3, reps: 15, weight: 10, rest: 60, muscle: ['deltoïdes post.'] },
      { name: 'Pullover haltère', sets: 3, reps: 12, weight: 28, rest: 75, muscle: ['grand dorsal', 'pectoraux'] },
      { name: 'Superset Curl EZ + Pushdown câble', sets: 4, reps: 12, weight: 30, rest: 60, isSuperset: true, muscle: ['biceps', 'triceps'] },
      { name: 'Shrugs barre', sets: 3, reps: 15, weight: 90, rest: 60, muscle: ['trapèzes sup.'] },
      { name: 'Leg raise + Planche', sets: 4, reps: 12, weight: 0, rest: 60, hasPlank: true, plankSeconds: 55, muscle: ['core'] }
    ]},
    friday: { session_type: 'LEGS 2', label: 'Jambes · HIIT S3', exercises: [
      { name: 'Bulgarian split squat', sets: 4, reps: 10, weight: 19, rest: 90, muscle: ['quadriceps', 'fessiers'] },
      { name: 'Leg extension', sets: 4, reps: 15, weight: 40, rest: 60, muscle: ['quadriceps'] },
      { name: 'Romanian deadlift', sets: 4, reps: 10, weight: 70, rest: 90, muscle: ['ischios'] },
      { name: 'HIIT vélo 30s/30s', sets: 12, reps: 1, weight: 0, rest: 0, isHIIT: true, muscle: ['cardio handball'] },
      { name: 'Planche variations', sets: 4, reps: 1, weight: 0, rest: 0, hasPlank: true, plankSeconds: 55, muscle: ['core'] }
    ]},
    saturday: { session_type: 'FULL BODY', label: 'Fonctionnel S3', exercises: [
      { name: 'Clean & Press barre', sets: 4, reps: 6, weight: 47, rest: 90, muscle: ['full body'] },
      { name: 'Thruster haltères', sets: 4, reps: 10, weight: 19, rest: 75, muscle: ['full body'] },
      { name: 'Romanian deadlift haltères', sets: 4, reps: 12, weight: 19, rest: 75, muscle: ['chaîne post.'] },
      { name: 'Tractions + Dips superset', sets: 4, reps: 0, weight: 0, rest: 90, isMaxReps: true, isSuperset: true, muscle: ['dos', 'triceps'] },
      { name: 'Circuit handball', sets: 3, reps: 1, weight: 0, rest: 120, isCircuit: true, durationMinutes: 6, muscle: ['handball'] }
    ]},
    sunday: { session_type: 'REPOS', label: 'Repos actif S3', exercises: [] }
  },
  4: {
    monday: { session_type: 'PUSH', label: 'PR Test Poitrine S4', exercises: [
      { name: 'Développé couché barre', sets: 5, reps: 5, weight: 87, rest: 120, muscle: ['pectoraux', 'deltoïdes ant.'] },
      { name: 'Développé incliné haltères', sets: 3, reps: 8, weight: 30, rest: 90, muscle: ['pectoraux haut'] },
      { name: 'Élévations latérales', sets: 3, reps: 12, weight: 8, rest: 60, muscle: ['deltoïdes lat.'] },
      { name: 'Développé militaire haltères', sets: 3, reps: 8, weight: 28, rest: 90, muscle: ['épaules'] },
      { name: 'Dips lestés', sets: 3, reps: 8, weight: 30, rest: 90, muscle: ['triceps', 'pectoraux'] },
      { name: 'Planche + Crunchs', sets: 3, reps: 25, weight: 0, rest: 45, hasPlank: true, plankSeconds: 60, muscle: ['core'] }
    ]},
    tuesday: { session_type: 'PULL', label: 'PR Test Dos S4', exercises: [
      { name: 'Tractions lestées', sets: 5, reps: 5, weight: 30, rest: 120, muscle: ['grand dorsal', 'biceps'] },
      { name: 'Rowing barre', sets: 3, reps: 8, weight: 72, rest: 90, muscle: ['dos épais'] },
      { name: 'Curl barre EZ', sets: 3, reps: 10, weight: 42, rest: 75, muscle: ['biceps'] },
      { name: 'Gainage latéral + Russian twist', sets: 3, reps: 25, weight: 0, rest: 45, hasPlank: true, plankSeconds: 55, muscle: ['core'] }
    ]},
    wednesday: { session_type: 'LEGS', label: 'PR Test Squat S4', exercises: [
      { name: 'Squat barre', sets: 5, reps: 5, weight: 80, rest: 120, muscle: ['quadriceps', 'fessiers'] },
      { name: 'Leg press', sets: 3, reps: 10, weight: 120, rest: 90, muscle: ['quadriceps'] },
      { name: 'Romanian deadlift', sets: 3, reps: 10, weight: 70, rest: 90, muscle: ['ischios'] },
      { name: 'Box jumps', sets: 4, reps: 10, weight: 0, rest: 90, muscle: ['explosivité'] }
    ]},
    thursday: { session_type: 'UPPER', label: 'Hypertrophie S4', exercises: [
      { name: 'Développé couché prise serrée', sets: 4, reps: 10, weight: 82, rest: 75, muscle: ['triceps', 'pectoraux int.'] },
      { name: 'Rowing haltère unilatéral', sets: 4, reps: 10, weight: 35, rest: 60, muscle: ['grand dorsal'] },
      { name: 'Superset Curl EZ + Pushdown câble', sets: 4, reps: 12, weight: 32, rest: 60, isSuperset: true, muscle: ['biceps', 'triceps'] },
      { name: 'Leg raise + Planche', sets: 3, reps: 12, weight: 0, rest: 60, hasPlank: true, plankSeconds: 60, muscle: ['core'] }
    ]},
    friday: { session_type: 'CARDIO', label: 'Test 5km S4', exercises: [
      { name: 'Course 5km (test PR)', sets: 1, reps: 1, weight: 0, rest: 0, isHIIT: false, muscle: ['cardio'] }
    ]},
    saturday: { session_type: 'DELOAD', label: 'Déload S4 — Full body léger', exercises: [
      { name: 'Développé couché barre', sets: 3, reps: 8, weight: 60, rest: 90, muscle: ['pectoraux'] },
      { name: 'Tractions', sets: 3, reps: 0, weight: 0, rest: 90, isMaxReps: true, muscle: ['dos'] },
      { name: 'Squat barre', sets: 3, reps: 8, weight: 50, rest: 90, muscle: ['jambes'] },
      { name: 'Planche', sets: 3, reps: 1, weight: 0, rest: 60, hasPlank: true, plankSeconds: 60, muscle: ['core'] }
    ]},
    sunday: { session_type: 'BILAN', label: 'Bilan du mois — Repos total', exercises: [] }
  }
}

export const SESSION_TYPES = {
  PUSH: { color: 'blue', emoji: '💪' },
  PULL: { color: 'green', emoji: '🔄' },
  LEGS: { color: 'orange', emoji: '🦵' },
  UPPER: { color: 'blue', emoji: '🏋️' },
  'LEGS 2': { color: 'orange', emoji: '⚡' },
  'FULL BODY': { color: 'purple', emoji: '🏆' },
  REPOS: { color: 'gray', emoji: '😴' },
  CARDIO: { color: 'green', emoji: '🏃' },
  DELOAD: { color: 'yellow', emoji: '🔋' },
  BILAN: { color: 'gray', emoji: '📊' }
}
