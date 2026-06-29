import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Rate limiting simple en mémoire (usage personnel)
const requestCounts = new Map()
const LIMIT = 20
const WINDOW_MS = 3_600_000

function checkRateLimit(userId) {
  const now = Date.now()
  const entry = requestCounts.get(userId) || { count: 0, windowStart: now }
  if (now - entry.windowStart > WINDOW_MS) {
    requestCounts.set(userId, { count: 1, windowStart: now })
    return true
  }
  if (entry.count >= LIMIT) return false
  entry.count++
  requestCounts.set(userId, entry)
  return true
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const { userId, sessionType, exercises, duration, feeling, readiness, athleteSummary } = body

  if (!userId) {
    return new Response('userId requis', { status: 400 })
  }

  if (!checkRateLimit(userId)) {
    return new Response('Rate limit atteint (20 analyses/heure)', { status: 429 })
  }

  const exercisesSummary = (exercises || []).map(ex => {
    const sets = (ex.sets || [])
      .filter(s => s.done)
      .map(s => `${s.weight > 0 ? s.weight + 'kg×' : ''}${s.reps > 0 ? s.reps + 'reps' : 'max'}(${s.rpe || '?'})`)
      .join(', ')
    return `- ${ex.name}: ${sets || 'aucun set complété'}`
  }).join('\n')

  const readinessSummary = readiness
    ? `Sommeil: ${readiness.sleep_quality}/5, Énergie: ${readiness.energy_level}/5, Stress: ${readiness.stress_level}/5`
    : 'Non renseigné'

  const prompt = `Tu es le coach IA personnel d'Anthony. Analyse sa séance de musculation et ajuste la prochaine séance.

PROFIL ATHLÈTE:
${athleteSummary || 'Profil non disponible'}

SÉANCE DU JOUR (${sessionType || 'Non précisé'} — ${duration || 0} minutes):
${exercisesSummary}

RESSENTI: ${feeling || 'non précisé'}
DISPONIBILITÉ DU JOUR: ${readinessSummary}

Réponds en français, de façon directe et personnalisée. Structure ta réponse ainsi:

**Bilan de la séance** (2-3 phrases)
Ce qui s'est bien passé et ce qui a été difficile.

**Points d'attention**
Ce que tu as observé (fatigue, douleur, déséquilibre...).

**Ajustements pour la prochaine séance**
Liste concrète avec poids conseillés si pertinent.

**Message de coach**
1 phrase de motivation personnalisée.`

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 600,
    messages: [{ role: 'user', content: prompt }]
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta?.text) {
            controller.enqueue(encoder.encode(chunk.delta.text))
          }
        }
      } finally {
        controller.close()
      }
    }
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Access-Control-Allow-Origin': '*'
    }
  })
}

export const config = { path: '/api/analyze-session' }
