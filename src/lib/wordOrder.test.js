import { describe, expect, it } from 'vitest'
import { buildTiles, decoyWords, joinTiles, referenceSentence, sentenceWords } from './wordOrder'
import { isCorrect } from './answers'

// Ce que ces tests verrouillent, dans l'ordre d'importance :
//   1. le mélange ne rend JAMAIS la phrase déjà dans l'ordre ;
//   2. il est stable — sinon les étiquettes sautent de place à chaque clic ;
//   3. la phrase reconstruite passe la correction commune (lib/answers).

describe('sentenceWords — découper la phrase en étiquettes', () => {
  it('une étiquette par mot', () => {
    expect(sentenceWords('I drink tea every morning.'))
      .toEqual(['I', 'drink', 'tea', 'every', 'morning.'])
  })

  it('ne détache pas la ponctuation', () => {
    // Une étiquette « , » seule ne s'entend pas et ne se raisonne pas :
    // ce serait un piège gratuit. La correction ignore la ponctuation.
    expect(sentenceWords('Yes, I do.')).toEqual(['Yes,', 'I', 'do.'])
  })

  it('ne garde que la première formulation quand il y en a plusieurs', () => {
    // « / » sépare les variantes acceptées en base. Les étiquettes ne
    // peuvent en construire qu'une ; la correction accepte toujours les deux.
    expect(referenceSentence("I don't like coffee / I do not like coffee"))
      .toBe("I don't like coffee")
    expect(sentenceWords("I don't like coffee / I do not like coffee"))
      .toEqual(['I', "don't", 'like', 'coffee'])
  })

  it('supporte les espaces multiples et une réponse vide', () => {
    expect(sentenceWords('  She   is   here ')).toEqual(['She', 'is', 'here'])
    expect(sentenceWords('')).toEqual([])
    expect(sentenceWords()).toEqual([])
  })
})

describe('decoyWords — les étiquettes en trop', () => {
  it('lit les intrus rangés dans options', () => {
    expect(decoyWords(['very', 'much'])).toEqual(['very', 'much'])
  })

  it('accepte l’absence d’intrus', () => {
    expect(decoyWords(null)).toEqual([])
    expect(decoyWords(undefined)).toEqual([])
  })
})

describe('buildTiles — la réserve mélangée', () => {
  const exercise = { id: 42, correct_answer: 'I drink tea every morning.', options: null }

  it('contient exactement les mots de la phrase', () => {
    const tiles = buildTiles(exercise)
    expect(tiles.map((t) => t.word).sort())
      .toEqual(['I', 'drink', 'every', 'morning.', 'tea'].sort())
  })

  it('ajoute les intrus à la réserve', () => {
    const tiles = buildTiles({ id: 7, correct_answer: 'She is a doctor.', options: ['an', 'the'] })
    expect(tiles).toHaveLength(6)
    expect(tiles.map((t) => t.word)).toContain('an')
    expect(tiles.map((t) => t.word)).toContain('the')
  })

  it('donne un identifiant distinct à chaque étiquette, mots répétés compris', () => {
    // « the cat on the mat » contient deux « the » : l'interface doit
    // savoir laquelle des deux a été posée.
    const tiles = buildTiles({ id: 3, correct_answer: 'The cat is on the mat.', options: null })
    const ids = tiles.map((t) => t.id)
    expect(new Set(ids).size).toBe(tiles.length)
    expect(tiles.filter((t) => t.word.toLowerCase() === 'the')).toHaveLength(2)
  })

  it('est stable : deux appels donnent le même ordre', () => {
    // Le défaut évité : avec Math.random, React remélangerait à chaque
    // rendu et les étiquettes sauteraient de place au moindre clic.
    expect(buildTiles(exercise)).toEqual(buildTiles(exercise))
  })

  it('mélange différemment deux exercices différents', () => {
    const a = joinTiles(buildTiles({ id: 1, correct_answer: 'I drink tea every morning.' }))
    const b = joinTiles(buildTiles({ id: 2, correct_answer: 'I drink tea every morning.' }))
    expect(a).not.toBe(b)
  })

  it('ne rend jamais la phrase déjà dans l’ordre', () => {
    // Sur une phrase de deux mots, le hasard tombe juste une fois sur
    // deux : ce n'est pas un cas rare. On balaie 300 identifiants.
    for (let id = 1; id <= 300; id++) {
      for (const answer of ['She left.', 'I am here.', 'The red car is mine.']) {
        const shown = joinTiles(buildTiles({ id, correct_answer: answer }))
        expect(shown).not.toBe(answer)
      }
    }
  })

  it('renvoie une réserve vide plutôt que de planter', () => {
    expect(buildTiles(null)).toEqual([])
    expect(buildTiles({ id: 1, correct_answer: '' })).toEqual([])
  })
})

describe('la phrase reconstruite passe la correction commune', () => {
  it('remise dans l’ordre, elle est acceptée', () => {
    const exercise = { id: 42, correct_answer: 'I drink tea every morning.', options: null }
    const tiles = buildTiles(exercise)

    // On rejoue le geste de l'apprenant : poser les étiquettes dans le bon
    // ordre, en prenant chaque fois la première encore disponible.
    const rest = [...tiles]
    const built = sentenceWords(exercise.correct_answer).map((word) => {
      const at = rest.findIndex((tile) => tile.word === word)
      return rest.splice(at, 1)[0]
    })

    expect(isCorrect(joinTiles(built), exercise.correct_answer)).toBe(true)
  })

  it('dans le mauvais ordre, elle est refusée', () => {
    expect(isCorrect('tea I drink every morning', 'I drink tea every morning.')).toBe(false)
  })

  it('les deux variantes d’une contraction sont acceptées', () => {
    const expected = "I don't like coffee / I do not like coffee"
    expect(isCorrect("I don't like coffee", expected)).toBe(true)
    expect(isCorrect('I do not like coffee', expected)).toBe(true)
  })
})
