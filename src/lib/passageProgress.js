import { supabase } from '../supabaseClient'
import { computeStreak, levelFromXP } from './gamification'
import { todayISO } from './dates'

// Enregistrement commun aux passages d'écoute et de lecture.
//
// Les deux modules diffèrent par leur contenu, pas par leur comptabilité :
// même score, même seuil d'XP, même effet sur la série quotidienne. Ce
// fichier évite d'en tenir deux copies qui finiraient par diverger.

// Seuil à partir duquel un passage rapporte de l'XP.
//
// Lire ou écouter sans comprendre ne doit pas rapporter autant que
// comprendre : sinon il suffirait d'enchaîner les passages au hasard. Mais
// la progression, elle, n'est jamais bloquée — on peut refaire le passage
// autant de fois qu'on veut, tout de suite.
export const PASS_SCORE = 60

export async function completePassage(table, userId, passage, score, profile) {
  const earned = score >= PASS_SCORE ? passage.xp_reward : 0

  const { error: progressError } = await supabase.from(table).upsert({
    user_id: userId,
    passage_id: passage.id,
    score,
    completed_at: new Date().toISOString()
  })
  if (progressError) throw progressError

  if (earned === 0) {
    return { earned: 0, newXP: profile.xp, newStreak: profile.streak_count }
  }

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

// Progression de l'apprenant sur une table de passages, indexée par id.
export async function fetchPassageProgress(table, userId) {
  if (!userId) return {}

  const { data, error } = await supabase
    .from(table)
    .select('passage_id, score')
    .eq('user_id', userId)

  if (error) throw error

  const byPassage = {}
  for (const row of data || []) byPassage[row.passage_id] = row
  return byPassage
}
