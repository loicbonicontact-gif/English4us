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
// Une mise en pratique après CHAQUE leçon.
//
// Une leçon apprend une règle ; l'écoute et la lecture la font rencontrer
// dans un vrai document. Les espacer davantage reviendrait à empiler les
// règles avant de s'en servir — l'ordre inverse de ce qui fait apprendre.
const LESSONS_BETWEEN_PRACTICE = 1

// Renvoie le parcours regroupé par niveau, prêt à l'affichage.
//
// Les passages d'écoute sont insérés DANS chaque niveau, entre les leçons :
// la compréhension orale fait partie de l'apprentissage, elle n'est pas une
// annexe. Ils ne bloquent jamais la suite, en revanche — rater une écoute
// est normal quand on progresse, et cela ne doit pas arrêter le parcours.
export function buildPath(
  lessons,
  progress,
  listeningPassages = [],
  listeningProgress = {},
  readingPassages = [],
  readingProgress = {}
) {
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
  // Toujours une leçon, jamais une mise en pratique : c'est la leçon qui
  // fait avancer le parcours.
  const current = decorated.find((l) => l.unlocked && !l.completed) || null

  const byLevel = LEVELS.map((level) => {
    const levelLessons = decorated.filter((l) => l.level === level)

    const decorate = (list, kind, done) => list
      .filter((p) => p.level === level)
      .map((p) => ({
        ...p,
        kind,
        completed: done[p.id] != null,
        score: done[p.id]?.score ?? null
      }))

    const listenings = decorate(listeningPassages, 'listening', listeningProgress)
    const readings = decorate(readingPassages, 'reading', readingProgress)

    return {
      level,
      lessons: levelLessons,
      items: interleave(levelLessons, listenings, readings)
    }
  }).filter((group) => group.lessons.length > 0)

  return { byLevel, current, decorated }
}

// Intercale les mises en pratique entre les leçons d'un niveau.
//
// Les deux files alternent — une écoute, puis une lecture, puis une écoute —
// pour qu'un niveau ne devienne pas un bloc d'écoutes suivi d'un bloc de
// lectures. On travaille les deux compétences en parallèle.
//
// Chacune s'ouvre dès que la leçon qui la précède est terminée, et ne bloque
// JAMAIS la leçon suivante : rater une mise en pratique est normal, cela ne
// doit pas arrêter le parcours.
function interleave(levelLessons, listenings, readings) {
  const items = []
  const queues = [[...listenings], [...readings]]
  let turn = 0

  // Prend l'élément suivant en alternant les files, en sautant celles qui
  // sont vides — sinon un niveau sans lecture perdrait un tour sur deux.
  function nextPractice() {
    for (let tried = 0; tried < queues.length; tried += 1) {
      const queue = queues[turn]
      turn = (turn + 1) % queues.length
      if (queue.length > 0) return queue.shift()
    }
    return null
  }

  levelLessons.forEach((lesson, i) => {
    items.push(lesson)

    if ((i + 1) % LESSONS_BETWEEN_PRACTICE !== 0) return
    const practice = nextPractice()
    if (practice) items.push({ ...practice, unlocked: lesson.completed })
  })

  // Le reste en fin de niveau, ouvert si la dernière leçon est terminée :
  // aucune mise en pratique ne doit disparaître silencieusement.
  const lastDone = levelLessons[levelLessons.length - 1]?.completed ?? false
  let leftover = nextPractice()
  while (leftover) {
    items.push({ ...leftover, unlocked: lastDone })
    leftover = nextPractice()
  }

  return items
}
