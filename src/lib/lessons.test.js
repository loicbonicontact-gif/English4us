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

describe('buildPath — écoutes intercalées', () => {
  it('place une écoute toutes les deux leçons', () => {
    const kinds = itemsOf(buildPath(LESSONS, {}, PASSAGES)).map((i) => i.kind)
    expect(kinds).toEqual([
      'lesson', 'lesson', 'listening',
      'lesson', 'lesson', 'listening',
      'lesson', 'listening'
    ])
  })

  it('n\'oublie aucune écoute, même la dernière', () => {
    const listenings = itemsOf(buildPath(LESSONS, {}, PASSAGES))
      .filter((i) => i.kind === 'listening')
    expect(listenings.map((l) => l.id)).toEqual([101, 102, 103])
  })

  it('verrouille une écoute tant que la leçon qui la précède n\'est pas faite', () => {
    const items = itemsOf(buildPath(LESSONS, {}, PASSAGES))
    expect(items[2].kind).toBe('listening')
    expect(items[2].unlocked).toBe(false)
  })

  it('ouvre l\'écoute dès que la leçon qui la précède est terminée', () => {
    const progress = { 1: { completed: true }, 2: { completed: true } }
    const items = itemsOf(buildPath(LESSONS, progress, PASSAGES))
    expect(items[2].unlocked).toBe(true)
  })

  it('ne bloque jamais la leçon suivante, même si l\'écoute n\'est pas faite', () => {
    const progress = { 1: { completed: true }, 2: { completed: true } }
    const items = itemsOf(buildPath(LESSONS, progress, PASSAGES))
    const lessonAfterListening = items[3]
    expect(lessonAfterListening.kind).toBe('lesson')
    expect(lessonAfterListening.unlocked).toBe(true)
  })

  it('marque une écoute terminée avec son score', () => {
    const progress = { 1: { completed: true }, 2: { completed: true } }
    const items = itemsOf(buildPath(LESSONS, progress, PASSAGES, { 101: { score: 67 } }))
    expect(items[2].completed).toBe(true)
    expect(items[2].score).toBe(67)
  })

  it('affiche le parcours normalement quand aucune écoute n\'existe', () => {
    const items = itemsOf(buildPath(LESSONS, {}))
    expect(items).toHaveLength(5)
    expect(items.every((i) => i.kind === 'lesson')).toBe(true)
  })

  it('n\'affecte pas le compte de leçons du niveau', () => {
    const group = buildPath(LESSONS, {}, PASSAGES).byLevel.find((g) => g.level === 'A1')
    expect(group.lessons).toHaveLength(5)
  })
})
