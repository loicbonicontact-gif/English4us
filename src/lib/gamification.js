import { supabase } from '../supabaseClient'

// Nombre de cœurs maximum. Centralisé ici pour éviter les valeurs
// codées en dur qui finiraient par diverger entre composants.
export const MAX_HEARTS = 5

// Met à jour le streak selon la date de dernière activité
export function computeStreak(lastActivityDate, currentStreak) {
  const today = new Date().toISOString().split('T')[0]
  const last = lastActivityDate
  if (last === today) return currentStreak // déjà compté aujourd'hui

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yStr = yesterday.toISOString().split('T')[0]

  if (last === yStr) return currentStreak + 1 // continuité
  return 1 // streak cassé, on repart à 1
}

// Détermine le niveau CECRL selon l'XP total
export function levelFromXP(xp) {
  const thresholds = [0, 500, 1000, 1500, 2000, 2500]
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
  let idx = 0
  thresholds.forEach((t, i) => { if (xp >= t) idx = i })
  return levels[idx]
}

// Enregistre la complétion d'une leçon : XP, streak, progression
export async function completeLesson(userId, lessonId, score, xpReward, profile) {
  const newStreak = computeStreak(profile.last_activity_date, profile.streak_count)
  const newXP = profile.xp + xpReward
  const newLevel = levelFromXP(newXP)

  await supabase.from('user_progress').upsert({
    user_id: userId,
    lesson_id: lessonId,
    completed: true,
    score,
    completed_at: new Date().toISOString()
  })

  await supabase.from('profiles').update({
    xp: newXP,
    level: newLevel,
    streak_count: newStreak,
    last_activity_date: new Date().toISOString().split('T')[0]
  }).eq('id', userId)

  await supabase.from('streak_log').insert({
    user_id: userId,
    xp_earned: xpReward
  })

  return { newXP, newLevel, newStreak }
}

// Gestion des coeurs (vie) : perdue en cas d'erreur
export async function loseHeart(userId, currentHearts) {
  const newHearts = Math.max(0, currentHearts - 1)
  await supabase.from('profiles').update({ hearts: newHearts }).eq('id', userId)
  return newHearts
}

export async function refillHearts(userId) {
  await supabase.from('profiles').update({ hearts: MAX_HEARTS }).eq('id', userId)
}
