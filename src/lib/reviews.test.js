import { describe, expect, it } from 'vitest'
import {
  BOX_INTERVALS,
  MASTERED_BOX,
  addDays,
  boxLabel,
  dueDateForBox,
  nextBox
} from './reviews'

// Tests de l'algorithme d'espacement.
//
// Seules les fonctions pures sont testées ici : ce sont elles qui décident
// quand un exercice revient, et une erreur de calcul de date ne se voit pas
// à l'écran avant plusieurs jours.

describe('addDays', () => {
  it('avance d\'un jour', () => {
    expect(addDays('2026-08-16', 1)).toBe('2026-08-17')
  })

  it('franchit une fin de mois', () => {
    expect(addDays('2026-08-31', 1)).toBe('2026-09-01')
  })

  it('franchit une fin d\'année', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
  })

  it('gère le 29 février d\'une année bissextile', () => {
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29')
  })

  it('ignore le 29 février hors année bissextile', () => {
    expect(addDays('2027-02-28', 1)).toBe('2027-03-01')
  })

  it('ajoute un intervalle long sans dériver', () => {
    expect(addDays('2026-08-16', 30)).toBe('2026-09-15')
  })
})

describe('nextBox', () => {
  it('monte d\'un palier quand la réponse est juste', () => {
    expect(nextBox(0, true)).toBe(1)
    expect(nextBox(3, true)).toBe(4)
  })

  it('ramène au premier palier quand la réponse est fausse', () => {
    expect(nextBox(0, false)).toBe(0)
    expect(nextBox(4, false)).toBe(0)
  })

  it('ne dépasse jamais le palier « acquis »', () => {
    expect(nextBox(MASTERED_BOX, true)).toBe(MASTERED_BOX)
    expect(nextBox(BOX_INTERVALS.length - 1, true)).toBe(MASTERED_BOX)
  })
})

describe('dueDateForBox', () => {
  it('reprogramme à demain au premier palier', () => {
    expect(dueDateForBox(0, '2026-08-16')).toBe('2026-08-17')
  })

  it('applique l\'intervalle de chaque palier', () => {
    expect(dueDateForBox(1, '2026-08-16')).toBe('2026-08-19')   // +3
    expect(dueDateForBox(2, '2026-08-16')).toBe('2026-08-23')   // +7
    expect(dueDateForBox(3, '2026-08-16')).toBe('2026-08-30')   // +14
    expect(dueDateForBox(4, '2026-08-16')).toBe('2026-09-15')   // +30
  })

  it('ne donne plus de rendez-vous une fois acquis', () => {
    expect(dueDateForBox(MASTERED_BOX, '2026-08-16')).toBeNull()
  })

  it('espace de plus en plus : chaque palier attend plus que le précédent', () => {
    for (let i = 1; i < BOX_INTERVALS.length; i += 1) {
      expect(BOX_INTERVALS[i]).toBeGreaterThan(BOX_INTERVALS[i - 1])
    }
  })
})

describe('parcours complet d\'un exercice raté', () => {
  it('sort de la file après cinq réussites d\'affilée', () => {
    let box = 0
    for (let i = 0; i < BOX_INTERVALS.length; i += 1) box = nextBox(box, true)
    expect(box).toBe(MASTERED_BOX)
    expect(dueDateForBox(box)).toBeNull()
  })

  it('une seule erreur en fin de parcours renvoie au début', () => {
    let box = 0
    box = nextBox(box, true)   // 1
    box = nextBox(box, true)   // 2
    box = nextBox(box, true)   // 3
    box = nextBox(box, false)  // raté : retour au premier palier
    expect(box).toBe(0)
    expect(dueDateForBox(box, '2026-08-16')).toBe('2026-08-17')
  })
})

describe('boxLabel', () => {
  it('parle au singulier pour demain', () => {
    expect(boxLabel(0)).toBe('à revoir demain')
  })

  it('donne le nombre de jours ensuite', () => {
    expect(boxLabel(1)).toBe('à revoir dans 3 jours')
  })

  it('annonce l\'acquisition au dernier palier', () => {
    expect(boxLabel(MASTERED_BOX)).toBe('acquis')
  })
})
