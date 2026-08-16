import { describe, expect, it } from 'vitest'
import { buildPath } from './lessons'

// Le parcours mélange deux choses : des leçons, qui se déverrouillent en
// chaîne, et des écoutes, qui s'intercalent sans jamais bloquer la suite.
// Une erreur ici rendrait une leçon inaccessible — le pire défaut possible.

const LESSONS = [
  { id: 1, level: 'A1', unit_order: 1, title: 'Se présenter', xp_reward: 10 },
  { id: 2, level: 'A1', unit_order: 2, title: 'La famille', xp_reward: 10 },
  { id: 3, level: 'A1', unit_order: 3, title: 'Les nombres', xp_reward: 10 },
  { id: 4, level: 'A1', unit_order: 4, title: 'La nourriture', xp_reward: 10 },
  { id: 5, level: 'A1', unit_order: 5, title: 'Les verbes', xp_reward: 15 }
]

const PASSAGES = [
  { id: 101, level: 'A1', title: 'Une question simple', position: 1, xp_reward: 10 },
  { id: 102, level: 'A1', title: 'Au café', position: 2, xp_reward: 15 },
  { id: 103, level: 'A1', title: 'Annonce à la gare', position: 3, xp_reward: 15 }
]

function itemsOf(path, level = 'A1') {
  return path.byLevel.find((g) => g.level === level).items
}

describe('buildPath — déverrouillage des leçons', () => {
  it('ouvre la première leçon et verrouille les suivantes', () => {
    const path = buildPath(LESSONS, {})
    expect(path.decorated[0].unlocked).toBe(true)
    expect(path.decorated[1].unlocked).toBe(false)
  })

  it('ouvre la suivante quand la précédente est terminée', () => {
    const path = buildPath(LESSONS, { 1: { completed: true, score: 80 } })
    expect(path.decorated[1].unlocked).toBe(true)
    expect(path.decorated[2].unlocked).toBe(false)
  })

  it('désigne comme courante la première leçon ouverte non terminée', () => {
    const path = buildPath(LESSONS, { 1: { completed: true } })
    expect(path.current.id).toBe(2)
  })
})

const READINGS = [
  { id: 201, level: 'A1', title: 'Un e-mail de confirmation', position: 1, xp_reward: 15 },
  { id: 202, level: 'A1', title: 'Une annonce de magasin', position: 2, xp_reward: 15 }
]

describe('buildPath — mises en pratique intercalées', () => {
  it('place une mise en pratique après chaque leçon, en alternant écoute et lecture', () => {
    const kinds = itemsOf(buildPath(LESSONS, {}, PASSAGES, {}, READINGS, {})).map((i) => i.kind)
    expect(kinds).toEqual([
      'lesson', 'listening',
      'lesson', 'reading',
      'lesson', 'listening',
      'lesson', 'reading',
      'lesson', 'listening'
    ])
  })

  it('n\'oublie aucun passage, même quand il y en a plus que de leçons', () => {
    const manyReadings = [...READINGS,
      { id: 203, level: 'A1', title: 'Un troisième texte', position: 3, xp_reward: 15 },
      { id: 204, level: 'A1', title: 'Un quatrième texte', position: 4, xp_reward: 15 }
    ]
    const items = itemsOf(buildPath(LESSONS, {}, PASSAGES, {}, manyReadings, {}))
    const ids = items.filter((i) => i.kind !== 'lesson').map((i) => i.id).sort()
    expect(ids).toEqual([101, 102, 103, 201, 202, 203, 204])
  })

  it('ne saute pas de tour quand une seule file est fournie', () => {
    // Sans lecture, les écoutes doivent se succéder sans laisser de trou.
    const kinds = itemsOf(buildPath(LESSONS, {}, PASSAGES)).map((i) => i.kind)
    expect(kinds).toEqual([
      'lesson', 'listening',
      'lesson', 'listening',
      'lesson', 'listening',
      'lesson', 'lesson'
    ])
  })

  it('verrouille une mise en pratique tant que la leçon qui la précède n\'est pas faite', () => {
    const items = itemsOf(buildPath(LESSONS, {}, PASSAGES, {}, READINGS, {}))
    expect(items[1].kind).toBe('listening')
    expect(items[1].unlocked).toBe(false)
  })

  it('l\'ouvre dès que la leçon qui la précède est terminée', () => {
    const items = itemsOf(buildPath(LESSONS, { 1: { completed: true } }, PASSAGES, {}, READINGS, {}))
    expect(items[1].unlocked).toBe(true)
  })

  it('ne bloque jamais la leçon suivante', () => {
    const items = itemsOf(buildPath(LESSONS, { 1: { completed: true } }, PASSAGES, {}, READINGS, {}))
    expect(items[2].kind).toBe('lesson')
    expect(items[2].unlocked).toBe(true)
  })

  it('marque une écoute terminée avec son score', () => {
    const items = itemsOf(buildPath(LESSONS, { 1: { completed: true } }, PASSAGES, { 101: { score: 67 } }, READINGS, {}))
    expect(items[1].completed).toBe(true)
    expect(items[1].score).toBe(67)
  })

  it('marque une lecture terminée avec son score', () => {
    const progress = { 1: { completed: true }, 2: { completed: true } }
    const items = itemsOf(buildPath(LESSONS, progress, PASSAGES, {}, READINGS, { 201: { score: 100 } }))
    const reading = items.find((i) => i.kind === 'reading')
    expect(reading.completed).toBe(true)
    expect(reading.score).toBe(100)
  })

  it('affiche le parcours normalement quand aucune mise en pratique n\'existe', () => {
    const items = itemsOf(buildPath(LESSONS, {}))
    expect(items).toHaveLength(5)
    expect(items.every((i) => i.kind === 'lesson')).toBe(true)
  })

  it('n\'affecte pas le compte de leçons du niveau', () => {
    const group = buildPath(LESSONS, {}, PASSAGES, {}, READINGS, {}).byLevel.find((g) => g.level === 'A1')
    expect(group.lessons).toHaveLength(5)
  })
})
