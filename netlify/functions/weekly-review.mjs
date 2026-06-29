import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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

  const { userId, sessions, athleteSummary, currentWeek } = body

  if (!userId) {
    return new Response('userId requis', { status: 400 })
  }

  const sessionsSummary = (sessions || []).map(s =>
    `${s.date} — ${s.session_type || 'Séance'} (${s.duration_minutes || 0}min, ressenti: ${s.general_feeling || 'non précisé'})`
  ).join('\n')

  const nextWeek = (currentWeek || 1) + 1

  const prompt = `Tu es le coach IA d'Anthony. Fais le bilan de sa semaine d'entraînement et programme la semaine suivante.

PROFIL: ${athleteSummary || 'Profil non disponible'}

SEMAINE ${currentWeek || 1} COMPLÉTÉE:
${sessionsSummary || 'Aucune séance enregistrée'}

Réponds en français. Structure:

**Bilan de la semaine** (progression, points forts, points faibles)

**Ajustements semaine ${nextWeek}**
Liste les modifications de charges et de volume par rapport au programme de base.

**Recommandations nutrition et récupération**

**Objectif de la semaine prochaine** (1 phrase clé)`

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 800,
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

export const config = { path: '/api/weekly-review' }
