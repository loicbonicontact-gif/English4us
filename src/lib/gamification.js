import { supabase } from '../supabaseClient'
import { addDays, todayISO } from './dates'

// Nombre de cœurs maximum. Centralisé ici pour éviter les valeurs
// codées en dur qui finiraient par diverger entre composants.
export const MAX_HEARTS = 5

// Met à jour le streak selon la date de dernière activité.
// Les dates viennent de dates.js : calculées en UTC, elles décalaient la
// journée d'un cran pour tout apprenant hors du fuseau de Greenwich.
export function computeStreak(lastActivityDate, currentStreak) {
  const today = todayISO()
  const last = lastActivityDate
  if (last === today) return currentStreak // déjà compté aujourd'hui

  if (last === addDays(today, -1)) return currentStreak + 1 // continuité
  return 1 // streak cassé, on repart à 1
}

// XP nécessaires pour passer d'un niveau CECRL au suivant.
export const XP_PER_LEVEL = 500

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

// Détermine le niveau CECRL selon l'XP total
export function levelFromXP(xp) {
  const thresholds = LEVEL_ORDER.map((_, i) => i * XP_PER_LEVEL)
  let idx = 0
  thresholds.forEach((t, i) => { if (xp >= t) idx = i })
  return LEVEL_ORDER[idx]
}

// Progression à l'intérieur du niveau courant : sert la barre du profil.
// Au dernier niveau, il n'y a plus de palier à atteindre — la barre est pleine.
export function levelProgress(xp) {
  const current = levelFromXP(xp)
  const idx = LEVEL_ORDER.indexOf(current)
  const isLast = idx === LEVEL_ORDER.length - 1

  if (isLast) {
    return { current, next: null, inLevel: XP_PER_LEVEL, needed: XP_PER_LEVEL, percent: 100 }
  }

  const inLevel = xp - idx * XP_PER_LEVEL
  return {
    current,
    next: LEVEL_ORDER[idx + 1],
    inLevel,
    needed: XP_PER_LEVEL,
    percent: Math.round((inLevel / XP_PER_LEVEL) * 100)
  }
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
    last_activity_date: todayISO()
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
