import { describe, expect, it } from 'vitest'
import {
  blockPassed,
  buildBlocks,
  lessonsSkipped,
  nextLevelToTest,
  passMark,
  placementLevelFrom,
  totalAsked,
  totalCorrect
} from './placement'

// Le placement décide où l'apprenant commence. Deux erreurs coûtent cher et
// en sens inverse : le placer trop haut le noie, trop bas l'ennuie. Ces
// tests verrouillent la règle de l'escalier.

const full = (level, correct) => ({ level, correct, total: 5 })

describe('passMark — barre de réussite d’un bloc', () => {
  it('exige 4 bonnes réponses sur 5', () => {
    expect(passMark(5)).toBe(4)
  })

  it('arrondit vers le haut sur un bloc incomplet', () => {
    // 0,8 × 3 = 2,4 → 3. Un niveau pauvre en questions ne doit pas
    // devenir plus facile à franchir qu'un niveau complet.
    expect(passMark(3)).toBe(3)
    expect(passMark(4)).toBe(4)
  })

  it('refuse un bloc vide : rien de mesuré, rien d’acquis', () => {
    expect(blockPassed(0, 0)).toBe(false)
  })
})

describe('placementLevelFrom — niveau retenu', () => {
  it('place au premier niveau échoué', () => {
    const blocks = [full('A1', 5), full('A2', 4), full('B1', 2)]
    expect(placementLevelFrom(blocks)).toBe('B1')
  })

  it('place en A1 quand le premier bloc échoue', () => {
    expect(placementLevelFrom([full('A1', 1)])).toBe('A1')
  })

  it('place en C2 quand les six niveaux sont réussis', () => {
    const blocks = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((l) => full(l, 5))
    expect(placementLevelFrom(blocks)).toBe('C2')
  })

  it('ne se laisse pas tromper par un 3 sur 5', () => {
    // 3 sur 5, c'est 60 % : au-dessus du hasard, en dessous de la maîtrise.
    // Le niveau doit être travaillé, pas sauté.
    expect(placementLevelFrom([full('A1', 3)])).toBe('A1')
  })
})

describe('nextLevelToTest — enchaînement des blocs', () => {
  it('commence en A1', () => {
    expect(nextLevelToTest([])).toBe('A1')
  })

  it('monte d’un niveau après un bloc réussi', () => {
    expect(nextLevelToTest([full('A1', 4)])).toBe('A2')
    expect(nextLevelToTest([full('A1', 5), full('A2', 5)])).toBe('B1')
  })

  it('s’arrête au premier bloc échoué', () => {
    expect(nextLevelToTest([full('A1', 5), full('A2', 2)])).toBe(null)
  })

  it('s’arrête après C2 : il n’y a rien au-dessus', () => {
    const blocks = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((l) => full(l, 5))
    expect(nextLevelToTest(blocks)).toBe(null)
  })

  it('pose au plus 30 questions', () => {
    // Six niveaux, cinq questions : la borne haute du test. Un apprenant
    // qui va au bout ne doit pas y passer un quart d'heure.
    let blocks = []
    let level = nextLevelToTest(blocks)
    while (level) {
      blocks = [...blocks, full(level, 5)]
      level = nextLevelToTest(blocks)
    }
    expect(totalAsked(blocks)).toBe(30)
    expect(totalCorrect(blocks)).toBe(30)
  })

  it('ne pose que 5 questions à un vrai débutant', () => {
    const blocks = [full('A1', 1)]
    expect(nextLevelToTest(blocks)).toBe(null)
    expect(totalAsked(blocks)).toBe(5)
  })
})

describe('lessonsSkipped — ce que le placement épargne', () => {
  it('ne saute rien en A1', () => {
    expect(lessonsSkipped('A1')).toBe(0)
  })

  it('saute dix leçons en B1', () => {
    // A1 et A2, cinq leçons chacun. C'est le chiffre annoncé à l'apprenant.
    expect(lessonsSkipped('B1')).toBe(10)
  })

  it('saute vingt-cinq leçons en C2', () => {
    expect(lessonsSkipped('C2')).toBe(25)
  })
})

describe('buildBlocks — tirage des questions', () => {
  const rows = []
  for (const level of ['A1', 'A2', 'B1']) {
    for (let i = 0; i < 12; i += 1) {
      rows.push({
        id: `${level}-${i}`,
        question: `q${i}`,
        options: ['a', 'b', 'c', 'd'],
        correct_answer: 'a',
        lesson: { id: 1, level }
      })
    }
  }

  it('prend cinq questions par niveau', () => {
    const blocks = buildBlocks(rows)
    expect(blocks.A1).toHaveLength(5)
    expect(blocks.B1).toHaveLength(5)
  })

  it('ne mélange jamais les niveaux', () => {
    const blocks = buildBlocks(rows)
    expect(blocks.A2.every((q) => q.lesson.level === 'A2')).toBe(true)
  })

  it('renvoie un bloc vide pour un niveau sans question', () => {
    // B2, C1 et C2 n'ont rien ici. Le test doit s'arrêter proprement
    // plutôt que de planter sur `block[index]`.
    const blocks = buildBlocks(rows)
    expect(blocks.C1).toEqual([])
  })

  it('écarte les questions sans vrai choix', () => {
    // Une ligne sans options afficherait un écran sans bouton :
    // l'apprenant serait bloqué au milieu du test.
    const broken = [
      { id: 1, options: null, lesson: { level: 'A1' } },
      { id: 2, options: ['seul'], lesson: { level: 'A1' } },
      { id: 3, options: ['a', 'b'], lesson: { level: 'A1' } }
    ]
    expect(buildBlocks(broken).A1).toHaveLength(1)
  })

  it('écarte un exercice sans leçon rattachée', () => {
    const orphan = [{ id: 1, options: ['a', 'b'], lesson: null }]
    expect(buildBlocks(orphan).A1).toEqual([])
  })

  it('ne pose pas deux fois la même question dans un bloc', () => {
    const blocks = buildBlocks(rows)
    const ids = blocks.A1.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
