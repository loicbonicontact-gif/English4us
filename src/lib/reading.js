import { supabase } from '../supabaseClient'
import { completePassage, fetchPassageProgress } from './passageProgress'

// Compréhension écrite : accès aux textes et à leurs questions.

export const FORMAT_LABELS = {
  text_completion: 'Texte à compléter',
  passage: 'Lecture'
}

export const FORMAT_HINTS = {
  text_completion: 'Un texte avec des trous numérotés. Choisis le mot qui manque à chaque endroit.',
  passage: 'Lis le ou les documents, puis réponds aux questions. Tu peux relire autant que tu veux.'
}

// Habillage de chaque document : un e-mail ne se présente pas comme une
// annonce, et cette différence de forme fait partie de la compréhension.
export const DOCUMENT_LABELS = {
  email: 'E-mail',
  notice: 'Annonce',
  article: 'Article',
  message: 'Message',
  advert: 'Publicité',
  memo: 'Note de service',
  schedule: 'Horaires'
}

export async function fetchReadingPassages() {
  const { data, error } = await supabase
    .from('reading_passages')
    .select('id, level, format, title, context, position, xp_reward')
    .order('position', { ascending: true })

  if (error) throw error
  return data || []
}

export async function fetchReadingPassage(id) {
  const [passageRes, questionsRes] = await Promise.all([
    supabase.from('reading_passages').select('*').eq('id', id).single(),
    supabase
      .from('reading_questions')
      .select('*')
      .eq('passage_id', id)
      .order('position', { ascending: true })
  ])

  if (passageRes.error) throw passageRes.error
  if (questionsRes.error) throw questionsRes.error

  return { passage: passageRes.data, questions: questionsRes.data || [] }
}

export function fetchReadingProgress(userId) {
  return fetchPassageProgress('reading_progress', userId)
}

export function completeReading(userId, passage, score, profile) {
  return completePassage('reading_progress', userId, passage, score, profile)
}
