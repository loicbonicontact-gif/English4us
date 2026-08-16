import { supabase } from '../supabaseClient'
import { computeStreak, levelFromXP } from './gamification'
import { addDays, todayISO } from './dates'

// ============================================
// Révision espacée
//
// Pourquoi : sans elle, une leçon terminée l'est pour toujours et ce qui a
// été appris s'oublie. La courbe de l'oubli est raide juste après
// l'apprentissage, puis s'aplatit : on revoit donc souvent au début, de
// plus en plus rarement ensuite.
//
// L'algorithme retenu est un système de paliers (Leitner), volontairement
// simple : chaque exercice porte un numéro de palier, chaque palier vaut un
// délai. Réussi, l'exercice monte d'un palier ; raté, il retombe au premier.
// Les algorithmes modernes (FSRS) sont plus efficaces mais demandent un
// historique de milliers de révisions pour se calibrer — inutile ici tant
// que l'app n'a pas d'utilisateurs anciens.
// ============================================

// Délai en jours avant la prochaine révision, palier par palier.
export const BOX_INTERVALS = [1, 3, 7, 14, 30]

// Palier atteint = acquis, l'exercice sort de la file.
export const MASTERED_BOX = BOX_INTERVALS.length

// Palier d'entrée d'un exercice RÉUSSI du premier coup.
//
// Pourquoi le faire entrer dans la file alors qu'il a été réussi : sans
// cela, un exercice juste du premier coup ne revenait jamais. Or sur un
// QCM à quatre choix, une bonne réponse sur quatre tombe juste par hasard —
// le système déclarait « acquis » ce que l'apprenant ne savait pas.
// Chaque contenu passait donc par UNE seule rencontre, quand il en faut
// huit à douze pour qu'un mot soit vraiment retenu.
//
// Il entre au palier 2 (revu à J+7) et non au palier 0 (J+1) : ce qui est
// su n'a pas besoin d'être revu dès demain, et la file resterait
// impraticable si tout y entrait au premier palier.
export const FIRST_BOX_WHEN_CORRECT = 2

// Palier d'entrée dans la file, selon le résultat de la première rencontre.
export function initialBox(right) {
  return right ? FIRST_BOX_WHEN_CORRECT : 0
}

// XP gagnés par bonne réponse en révision. Volontairement faible face aux
// 10-35 XP d'une leçon : réviser doit récompenser sans permettre de monter
// de niveau en boucle sur les mêmes exercices.
export const XP_PER_REVIEW = 2

// Les calculs de date vivent dans dates.js : la série quotidienne et les
// échéances de révision doivent parler du même « aujourd'hui ».
export { addDays, todayISO }

// Palier suivant : une réussite fait monter d'un cran, un échec ramène au
// premier. On ne descend jamais « d'un seul cran » : un mot qu'on rate à
// nouveau n'est pas à moitié su, il est à revoir demain.
export function nextBox(box, right) {
  if (!right) return 0
  return Math.min(box + 1, MASTERED_BOX)
}

// Date de la prochaine révision pour un palier donné.
// Renvoie null quand l'exercice est acquis : il n'a plus de rendez-vous.
export function dueDateForBox(box, from = todayISO()) {
  const interval = BOX_INTERVALS[box]
  if (interval === undefined) return null
  return addDays(from, interval)
}

// Résumé lisible d'un palier, pour l'écran de fin de révision.
export function boxLabel(box) {
  if (box >= MASTERED_BOX) return 'acquis'
  const interval = BOX_INTERVALS[box]
  return interval === 1 ? 'à revoir demain' : `à revoir dans ${interval} jours`
}

// ============================================
// Accès base
// ============================================

// Enregistre le résultat d'un exercice et met la file à jour.
//
// Règle : TOUT exercice rencontré entre dans la file, réussi ou raté. Seul
// le palier d'entrée diffère — raté, il revient demain ; réussi, dans une
// semaine. C'est ce qui fait passer chaque contenu d'une rencontre unique à
// cinq rencontres étalées sur environ deux mois.
export async function recordAnswer(userId, exerciseId, right) {
  if (!userId || !exerciseId) return { status: 'none' }

  const { data: existing, error } = await supabase
    .from('review_items')
    .select('id, box, wrong_count')
    .eq('user_id', userId)
    .eq('exercise_id', exerciseId)
    .maybeSingle()

  if (error) throw error

  // Première rencontre : l'exercice entre dans la file.
  if (!existing) {
    const box = initialBox(right)
    const { error: insertError } = await supabase.from('review_items').insert({
      user_id: userId,
      exercise_id: exerciseId,
      box,
      due_date: dueDateForBox(box),
      wrong_count: right ? 0 : 1
    })
    if (insertError) throw insertError
    return { status: right ? 'scheduled' : 'added', box }
  }

  const box = nextBox(existing.box, right)

  // Acquis : l'exercice quitte la file plutôt que d'y rester à traîner.
  if (box >= MASTERED_BOX) {
    const { error: deleteError } = await supabase
      .from('review_items')
      .delete()
      .eq('id', existing.id)
    if (deleteError) throw deleteError
    return { status: 'mastered', box }
  }

  const { error: updateError } = await supabase
    .from('review_items')
    .update({
      box,
      due_date: dueDateForBox(box),
      wrong_count: existing.wrong_count + (right ? 0 : 1)
    })
    .eq('id', existing.id)
  if (updateError) throw updateError

  return { status: right ? 'advanced' : 'reset', box }
}

// Nombre d'exercices dus aujourd'hui — sert la pastille de l'onglet.
// `head: true` ne rapatrie aucune ligne : seulement le compte.
export async function countDueReviews(userId) {
  if (!userId) return 0

  const { count, error } = await supabase
    .from('review_items')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .lte('due_date', todayISO())

  if (error) throw error
  return count || 0
}

// Les exercices à réviser aujourd'hui, les plus en retard d'abord.
// Plafonné : une session de révision doit rester faisable en une fois.
export async function fetchDueReviews(userId, limit = 15) {
  if (!userId) return []

  const { data, error } = await supabase
    .from('review_items')
    .select('id, box, due_date, exercise:exercises(*)')
    .eq('user_id', userId)
    .lte('due_date', todayISO())
    .order('due_date', { ascending: true })
    .limit(limit)

  if (error) throw error

  // Un exercice supprimé de la base laisserait une ligne sans contenu :
  // on l'écarte plutôt que de planter l'écran.
  return (data || []).filter((row) => row.exercise)
}

// Total des exercices en file, toutes échéances confondues (statistique profil).
export async function countPendingReviews(userId) {
  if (!userId) return 0

  const { count, error } = await supabase
    .from('review_items')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (error) throw error
  return count || 0
}

// Clôture une session de révision : XP, niveau, série.
// Même effet qu'une leçon terminée sur la série quotidienne — réviser
// compte comme travailler.
export async function completeReviewSession(userId, profile, correctCount) {
  const xpEarned = correctCount * XP_PER_REVIEW
  if (xpEarned === 0) return { xpEarned: 0, newXP: profile.xp, newStreak: profile.streak_count }

  const newXP = profile.xp + xpEarned
  const newStreak = computeStreak(profile.last_activity_date, profile.streak_count)

  const { error } = await supabase.from('profiles').update({
    xp: newXP,
    level: levelFromXP(newXP),
    streak_count: newStreak,
    last_activity_date: todayISO()
  }).eq('id', userId)

  if (error) throw error

  await supabase.from('streak_log').insert({ user_id: userId, xp_earned: xpEarned })

  return { xpEarned, newXP, newStreak }
}
