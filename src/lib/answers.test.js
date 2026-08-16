import { describe, expect, it } from 'vitest'
import { isCorrect, normalize } from './answers'

// La dictée repose entièrement sur cette comparaison : l'apprenant tape une
// phrase entière à l'oreille. Une tolérance trop stricte le punirait pour
// une virgule ; une tolérance trop large validerait une faute d'orthographe.

describe('normalize', () => {
  it('ignore la casse et la ponctuation', () => {
    expect(normalize('Hello, my name is Anna!')).toBe('hello my name is anna')
  })

  it('ramène les apostrophes typographiques à l\'apostrophe simple', () => {
    // Le clavier d'iPhone produit « ’ » et non « ' » : sans cette
    // normalisation, toute réponse tapée sur mobile serait comptée fausse.
    expect(normalize('I don’t know')).toBe("i don't know")
  })

  it('écrase les espaces multiples', () => {
    expect(normalize('  I   am    here ')).toBe('i am here')
  })
})

describe('isCorrect — dictée', () => {
  it('accepte la phrase exacte', () => {
    expect(isCorrect('I have two brothers', 'I have two brothers')).toBe(true)
  })

  it('accepte une ponctuation et une casse différentes', () => {
    expect(isCorrect('i have two brothers.', 'I have two brothers')).toBe(true)
  })

  it('accepte la contraction à la place de la forme complète', () => {
    expect(isCorrect("She doesn't eat meat", 'She does not eat meat')).toBe(true)
  })

  it('accepte la forme complète à la place de la contraction', () => {
    expect(isCorrect('She does not eat meat', "She doesn't eat meat")).toBe(true)
  })

  it('accepte une variante déclarée avec une barre', () => {
    const expected = 'I have two brothers/I have 2 brothers'
    expect(isCorrect('I have 2 brothers', expected)).toBe(true)
    expect(isCorrect('I have two brothers', expected)).toBe(true)
  })

  it('refuse une faute d\'orthographe', () => {
    expect(isCorrect('I have two brothes', 'I have two brothers')).toBe(false)
  })

  it('refuse un mot manquant', () => {
    expect(isCorrect('I have brothers', 'I have two brothers')).toBe(false)
  })

  it('refuse une réponse vide', () => {
    expect(isCorrect('', 'I have two brothers')).toBe(false)
    expect(isCorrect('   ', 'I have two brothers')).toBe(false)
  })

  it('distingue bien fifteen de fifty — le piège d\'écoute le plus courant', () => {
    expect(isCorrect('There are fifty students', 'There are fifteen students')).toBe(false)
  })
})
