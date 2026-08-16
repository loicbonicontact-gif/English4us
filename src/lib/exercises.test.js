import { describe, expect, it } from 'vitest'
import { usableExercises, usableReviewRows } from './exercises'

// Sans synthèse vocale, une dictée est une question muette : impossible à
// faire, et sans message d'erreur puisque rien ne plante. Ces tests
// vérifient qu'elle est bien écartée — et qu'on ne vide jamais l'écran.

const LIST = [
  { id: 1, type: 'qcm' },
  { id: 2, type: 'ecoute' },
  { id: 3, type: 'traduction' }
]

describe('usableExercises', () => {
  it('garde tout quand la synthèse vocale est disponible', () => {
    expect(usableExercises(LIST, true)).toHaveLength(3)
  })

  it('retire les dictées quand elle ne l\'est pas', () => {
    const kept = usableExercises(LIST, false)
    expect(kept).toHaveLength(2)
    expect(kept.some((ex) => ex.type === 'ecoute')).toBe(false)
  })

  it('ne renvoie jamais une liste vide, même si tout est dictée', () => {
    const onlyDictation = [{ id: 1, type: 'ecoute' }, { id: 2, type: 'ecoute' }]
    expect(usableExercises(onlyDictation, false)).toHaveLength(2)
  })

  it('supporte une liste vide sans planter', () => {
    expect(usableExercises([], false)).toEqual([])
  })
})

describe('usableReviewRows', () => {
  const ROWS = [
    { id: 10, exercise: { id: 1, type: 'qcm' } },
    { id: 11, exercise: { id: 2, type: 'ecoute' } }
  ]

  it('garde tout quand la synthèse vocale est disponible', () => {
    expect(usableReviewRows(ROWS, true)).toHaveLength(2)
  })

  it('retire les dictées quand elle ne l\'est pas', () => {
    const kept = usableReviewRows(ROWS, false)
    expect(kept).toHaveLength(1)
    expect(kept[0].exercise.type).toBe('qcm')
  })

  it('ne renvoie jamais une liste vide', () => {
    const onlyDictation = [{ id: 11, exercise: { id: 2, type: 'ecoute' } }]
    expect(usableReviewRows(onlyDictation, false)).toHaveLength(1)
  })
})
