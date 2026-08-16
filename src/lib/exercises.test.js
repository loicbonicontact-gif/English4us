import { describe, expect, it } from 'vitest'
import { usableExercises, usableReviewRows } from './exercises'

// Deux types d'exercices dépendent du navigateur : la dictée a besoin de la
// synthèse vocale, la prononciation de la reconnaissance vocale (absente de
// Firefox). Un exercice impossible doit disparaître, jamais s'afficher mort.
// Mais l'écran ne doit jamais se retrouver vide non plus.

const LIST = [
  { id: 1, type: 'qcm' },
  { id: 2, type: 'ecoute' },
  { id: 3, type: 'oral' },
  { id: 4, type: 'traduction' }
]

const typesOf = (list) => list.map((ex) => ex.type)

describe('usableExercises', () => {
  it('garde tout quand le navigateur sait tout faire', () => {
    expect(usableExercises(LIST, true, true)).toHaveLength(4)
  })

  it('retire les dictées sans synthèse vocale', () => {
    expect(typesOf(usableExercises(LIST, false, true))).toEqual(['qcm', 'oral', 'traduction'])
  })

  it('retire la prononciation sans reconnaissance vocale (cas Firefox)', () => {
    expect(typesOf(usableExercises(LIST, true, false))).toEqual(['qcm', 'ecoute', 'traduction'])
  })

  it('retire les deux quand rien n\'est disponible', () => {
    expect(typesOf(usableExercises(LIST, false, false))).toEqual(['qcm', 'traduction'])
  })

  it('ne renvoie jamais une liste vide, même si tout est impossible', () => {
    const impossible = [{ id: 1, type: 'ecoute' }, { id: 2, type: 'oral' }]
    expect(usableExercises(impossible, false, false)).toHaveLength(2)
  })

  it('supporte une liste vide sans planter', () => {
    expect(usableExercises([], false, false)).toEqual([])
  })
})

describe('usableReviewRows', () => {
  const ROWS = [
    { id: 10, exercise: { id: 1, type: 'qcm' } },
    { id: 11, exercise: { id: 2, type: 'ecoute' } },
    { id: 12, exercise: { id: 3, type: 'oral' } }
  ]

  it('garde tout quand le navigateur sait tout faire', () => {
    expect(usableReviewRows(ROWS, true, true)).toHaveLength(3)
  })

  it('retire la prononciation sans reconnaissance vocale', () => {
    const kept = usableReviewRows(ROWS, true, false)
    expect(kept.map((r) => r.exercise.type)).toEqual(['qcm', 'ecoute'])
  })

  it('ne renvoie jamais une liste vide', () => {
    const onlyOral = [{ id: 12, exercise: { id: 3, type: 'oral' } }]
    expect(usableReviewRows(onlyOral, true, false)).toHaveLength(1)
  })
})
