import { supabase } from '../supabaseClient'
import { LEVELS } from '../data/curriculum'

// Charge toutes les leçons, triées dans l'ordre du parcours (A1.1 -> C2.5).
export async function fetchLessons() {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .order('unit_order', { ascending: true })

  if (error) throw error

  // Postgres ne connaît pas l'ordre des niveaux CECRL : on trie côté client.
  return (data || []).sort((a, b) => {
    const levelDiff = LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level)
    return levelDiff !== 0 ? levelDiff : a.unit_order - b.unit_order
  })
}

// Récupère la progression de l'utilisateur, indexée par id de leçon.
export async function fetchProgress(userId) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('lesson_id, completed, score')
    .eq('user_id', userId)

  if (error) throw error

  const byLesson = {}
  for (const row of data || []) byLesson[row.lesson_id] = row
  return byLesson
}

// Applique la règle de déverrouillage : la première leçon est toujours
// ouverte, les suivantes le deviennent quand la précédente est terminée.
// Renvoie les leçons regroupées par niveau, prêtes à l'affichage.
export function buildPath(lessons, progress) {
  let previousCompleted = true
  const decorated = lessons.map((lesson) => {
    const done = Boolean(progress[lesson.id]?.completed)
    const unlocked = previousCompleted
    previousCompleted = done
    return { ...lesson, completed: done, unlocked, score: progress[lesson.id]?.score ?? null }
  })

  // La leçon courante = la première ouverte mais pas encore terminée.
  const current = decorated.find((l) => l.unlocked && !l.completed) || null

  const byLevel = LEVELS.map((level) => ({
    level,
    lessons: decorated.filter((l) => l.level === level)
  })).filter((group) => group.lessons.length > 0)

  return { byLevel, current, decorated }
}
