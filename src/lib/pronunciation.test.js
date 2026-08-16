import { describe, expect, it } from 'vitest'
import { PASS_SCORE, longestCommonSubsequence, scoreSpeech, speechFeedback, words } from './pronunciation'

// La reconnaissance vocale rend un texte approximatif : elle ajoute des
// mots, en avale, transcrit « I have » en « I've ». La notation doit
// tolérer ces écarts sans pour autant valider une phrase fausse.

describe('words', () => {
  it('découpe en ignorant ponctuation et majuscules', () => {
    expect(words('Hello, my name is Anna!')).toEqual(['hello', 'my', 'name', 'is', 'anna'])
  })

  it('renvoie une liste vide pour du vide', () => {
    expect(words('')).toEqual([])
    expect(words('   ')).toEqual([])
  })
})

describe('longestCommonSubsequence', () => {
  it('trouve les mots communs dans l\'ordre', () => {
    const r = longestCommonSubsequence(['i', 'have', 'two', 'cats'], ['i', 'have', 'two', 'cats'])
    expect(r.length).toBe(4)
    expect(r.matched).toEqual([true, true, true, true])
  })

  it('tolère un mot inséré par la reconnaissance', () => {
    const r = longestCommonSubsequence(['i', 'have', 'cats'], ['i', 'do', 'have', 'cats'])
    expect(r.length).toBe(3)
    expect(r.matched).toEqual([true, true, true])
  })

  it('repère le mot manquant, et lui seul', () => {
    const r = longestCommonSubsequence(['i', 'have', 'two', 'cats'], ['i', 'have', 'cats'])
    expect(r.matched).toEqual([true, true, false, true])
  })
})

describe('scoreSpeech', () => {
  const EXPECTED = 'I have two brothers'

  it('donne 100 pour une phrase exacte', () => {
    const r = scoreSpeech('I have two brothers', EXPECTED)
    expect(r.score).toBe(100)
    expect(r.passed).toBe(true)
  })

  it('ignore la ponctuation et la casse de la transcription', () => {
    expect(scoreSpeech('i have two brothers.', EXPECTED).score).toBe(100)
  })

  it('sanctionne un mot porteur de sens manqué', () => {
    const r = scoreSpeech('I have brothers', EXPECTED)
    expect(r.score).toBeLessThan(100)
    expect(r.words.find((w) => w.word === 'two').ok).toBe(false)
  })

  it('ne sanctionne pas un petit mot avalé', () => {
    // « the » est un mot faible : la reconnaissance l'invente ou l'oublie
    // selon le bruit ambiant, il ne dit rien de la prononciation.
    const r = scoreSpeech('I closed door', 'I closed the door')
    expect(r.score).toBe(100)
  })

  it('refuse une phrase sans rapport', () => {
    const r = scoreSpeech('good morning everyone', EXPECTED)
    expect(r.passed).toBe(false)
  })

  it('signale qu\'aucun son n\'a été capté', () => {
    const r = scoreSpeech('', EXPECTED)
    expect(r.heard).toBe(false)
    expect(r.score).toBe(0)
    expect(r.words.every((w) => !w.ok)).toBe(true)
  })

  it('garde la meilleure des formulations proposées', () => {
    const expected = 'I am from France/I come from France'
    expect(scoreSpeech('I come from France', expected).score).toBe(100)
    expect(scoreSpeech('I am from France', expected).score).toBe(100)
  })

  it('rend le détail mot par mot, pour montrer ce qui a manqué', () => {
    const r = scoreSpeech('I have two', EXPECTED)
    expect(r.words.map((w) => w.ok)).toEqual([true, true, true, false])
  })

  it('applique le seuil de réussite annoncé', () => {
    // 3 mots porteurs sur 4 retrouvés = 75 %, au-dessus du seuil de 70.
    const r = scoreSpeech('I like big red cars', 'I like big red bikes')
    expect(r.score).toBeGreaterThanOrEqual(PASS_SCORE)
    expect(r.passed).toBe(true)
  })
})

describe('speechFeedback', () => {
  it('explique quoi faire quand rien n\'est entendu', () => {
    const message = speechFeedback(scoreSpeech('', 'I have two brothers'))
    expect(message).toMatch(/micro/i)
  })

  it('félicite un sans-faute', () => {
    const message = speechFeedback(scoreSpeech('I have two brothers', 'I have two brothers'))
    expect(message).toMatch(/toute la phrase/i)
  })

  it('oriente vers le modèle quand la phrase n\'est pas reconnue', () => {
    const message = speechFeedback(scoreSpeech('bonjour', 'I have two brothers'))
    expect(message).toMatch(/écoute le modèle/i)
  })
})
