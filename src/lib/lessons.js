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
// Nombre de leçons entre deux écoutes, à l'intérieur d'un niveau.
// Deux : assez pour avoir appris du vocabulaire à reconnaître, assez peu
// pour que l'oreille travaille régulièrement plutôt qu'en fin de niveau.
const LESSONS_BETWEEN_LISTENINGS = 2

// Renvoie le parcours regroupé par niveau, prêt à l'affichage.
//
// Les passages d'écoute sont insérés DANS chaque niveau, entre les leçons :
// la compréhension orale fait partie de l'apprentissage, elle n'est pas une
// annexe. Ils ne bloquent jamais la suite, en revanche — rater une écoute
// est normal quand on progresse, et cela ne doit pas arrêter le parcours.
export function buildPath(lessons, progress, passages = [], listeningProgress = {}) {
  let previousCompleted = true
  const decorated = lessons.map((lesson) => {
    const done = Boolean(progress[lesson.id]?.completed)
    const unlocked = previousCompleted
    previousCompleted = done
    return {
      ...lesson,
      kind: 'lesson',
      completed: done,
      unlocked,
      score: progress[lesson.id]?.score ?? null
    }
  })

  // La leçon courante = la première ouverte mais pas encore terminée.
  // Toujours une leçon, jamais une écoute : c'est la leçon qui fait avancer.
  const current = decorated.find((l) => l.unlocked && !l.completed) || null

  const byLevel = LEVELS.map((level) => {
    const levelLessons = decorated.filter((l) => l.level === level)
    const levelPassages = passages
      .filter((p) => p.level === level)
      .map((p) => ({
        ...p,
        kind: 'listening',
        completed: listeningProgress[p.id] != null,
        score: listeningProgress[p.id]?.score ?? null
      }))

    return { level, lessons: levelLessons, items: interleave(levelLessons, levelPassages) }
  }).filter((group) => group.lessons.length > 0)

  return { byLevel, current, decorated }
}

// Intercale les écoutes entre les leçons d'un niveau.
//
// Une écoute s'ouvre dès que la leçon qui la précède est terminée. Les
// écoutes restantes sont ajoutées à la fin si le niveau compte moins de
// leçons que prévu : aucune ne doit disparaître silencieusement.
function interleave(levelLessons, levelPassages) {
  const items = []
  const queue = [...levelPassages]

  levelLessons.forEach((lesson, i) => {
    items.push(lesson)

    const isBreakpoint = (i + 1) % LESSONS_BETWEEN_LISTENINGS === 0
    if (isBreakpoint && queue.length > 0) {
      items.push({ ...queue.shift(), unlocked: lesson.completed })
    }
  })

  // Le reste en fin de niveau, ouvert si la dernière leçon est terminée.
  const lastDone = levelLessons[levelLessons.length - 1]?.completed ?? false
  queue.forEach((passage) => items.push({ ...passage, unlocked: lastDone }))

  return items
}
