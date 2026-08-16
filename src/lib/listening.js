import { supabase } from '../supabaseClient'
import { computeStreak, levelFromXP } from './gamification'
import { todayISO } from './dates'

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

// Progression de l'apprenant, indexée par passage.
export async function fetchListeningProgress(userId) {
  if (!userId) return {}

  const { data, error } = await supabase
    .from('listening_progress')
    .select('passage_id, score')
    .eq('user_id', userId)

  if (error) throw error

  const byPassage = {}
  for (const row of data || []) byPassage[row.passage_id] = row
  return byPassage
}

// Enregistre un passage terminé : score, XP, série quotidienne.
//
// L'XP n'est accordé qu'au-dessus de 60 % de bonnes réponses. Écouter sans
// comprendre ne doit pas rapporter autant que comprendre : sinon il suffirait
// d'enchaîner les passages au hasard.
export async function completeListening(userId, passage, score, profile) {
  const earned = score >= 60 ? passage.xp_reward : 0

  const { error: progressError } = await supabase.from('listening_progress').upsert({
    user_id: userId,
    passage_id: passage.id,
    score,
    completed_at: new Date().toISOString()
  })
  if (progressError) throw progressError

  if (earned === 0) return { earned: 0, newXP: profile.xp, newStreak: profile.streak_count }

  const newXP = profile.xp + earned
  const newStreak = computeStreak(profile.last_activity_date, profile.streak_count)

  const { error } = await supabase.from('profiles').update({
    xp: newXP,
    level: levelFromXP(newXP),
    streak_count: newStreak,
    last_activity_date: todayISO()
  }).eq('id', userId)
  if (error) throw error

  await supabase.from('streak_log').insert({ user_id: userId, xp_earned: earned })

  return { earned, newXP, newStreak }
}
