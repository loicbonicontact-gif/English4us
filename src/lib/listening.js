import { supabase } from '../supabaseClient'
import { completePassage, fetchPassageProgress } from './passageProgress'

// Compréhension orale : accès aux passages et à leurs questions.

export const FORMAT_LABELS = {
  question_response: 'Question — réponse',
  conversation: 'Conversation',
  talk: 'Annonce'
}

// Ce que l'apprenant doit faire, en une phrase, avant de lancer l'écoute.
export const FORMAT_HINTS = {
  question_response: 'Tu vas entendre une question, puis trois réponses possibles. Rien ne sera écrit.',
  conversation: 'Tu vas entendre deux personnes discuter, puis répondre à des questions sur leur échange.',
  talk: 'Tu vas entendre une annonce lue par une seule personne, puis répondre à des questions.'
}

// Tous les passages, triés dans l'ordre du parcours.
export async function fetchPassages() {
  const { data, error } = await supabase
    .from('listening_passages')
    .select('id, level, format, title, context, audio_url, position, xp_reward')
    .order('position', { ascending: true })

  if (error) throw error
  return data || []
}

// Un passage avec son script et ses questions.
export async function fetchPassage(id) {
  const [passageRes, questionsRes] = await Promise.all([
    supabase.from('listening_passages').select('*').eq('id', id).single(),
    supabase
      .from('listening_questions')
      .select('*')
      .eq('passage_id', id)
      .order('position', { ascending: true })
  ])

  if (passageRes.error) throw passageRes.error
  if (questionsRes.error) throw questionsRes.error

  return { passage: passageRes.data, questions: questionsRes.data || [] }
}

// Progression et clôture : même comptabilité que la compréhension écrite,
// tenue une seule fois dans passageProgress.js.
export function fetchListeningProgress(userId) {
  return fetchPassageProgress('listening_progress', userId)
}

export function completeListening(userId, passage, score, profile) {
  return completePassage('listening_progress', userId, passage, score, profile)
}
