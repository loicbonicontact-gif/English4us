import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { buildTiles, joinTiles, referenceSentence, sentenceWords } from './wordOrder'
import { isCorrect } from './answers'

// ============================================
// Les 60 exercices RÉELS, passés au banc d'essai
//
// Les tests de wordOrder.test.js vérifient la mécanique sur des phrases
// choisies. Ceux-ci la vérifient sur le contenu qui partira en base, lu
// directement dans le script SQL — parce qu'un exercice infaisable ne se
// verrait pas autrement : il faudrait tomber dessus dans une leçon.
//
// Ce qui est vérifié pour CHAQUE exercice :
//   1. les étiquettes ne s'affichent jamais déjà dans l'ordre ;
//   2. remises dans l'ordre, elles sont acceptées par la correction ;
//   3. chaque variante acceptée est CONSTRUCTIBLE avec les étiquettes
//      affichées — sinon on promet une tolérance qui n'existe pas.
// ============================================

const SQL = new URL('../../supabase/seed-word-order.sql', import.meta.url)

// Découpe les valeurs d'un INSERT en respectant les quotes doublées ('').
function splitValues(line) {
  const parts = []
  let buf = ''
  let inString = false

  for (let k = 0; k < line.length; k++) {
    const c = line[k]
    if (inString) {
      if (c === "'") {
        if (line[k + 1] === "'") { buf += "'"; k++; continue }
        inString = false
        continue
      }
      buf += c
    } else if (c === "'") {
      inString = true
    } else if (c === ',') {
      parts.push(buf.trim()); buf = ''
    } else {
      buf += c
    }
  }
  parts.push(buf.trim())
  return parts
}

function readExercises() {
  const text = readFileSync(SQL, 'utf8')
  const out = []

  for (const raw of text.split('\n')) {
    const line = raw.trim()
    if (!line.startsWith('(')) continue
    const body = line.replace(/^\(/, '').replace(/\)[,;]?$/, '')
    const [lessonId, type, question, options, correctAnswer, explanation] = splitValues(body)
    if (type !== 'ordre') continue

    out.push({
      // `id` sert de graine au mélange : en base ce sera l'identifiant réel.
      // Ici on prend le rang, ce qui couvre autant de graines différentes.
      id: out.length + 1,
      lesson_id: Number(lessonId),
      type,
      question,
      options: options === 'null' ? null : JSON.parse(options),
      correct_answer: correctAnswer,
      explanation
    })
  }

  return out
}

const EXERCISES = readExercises()

// Rejoue le geste de l'apprenant : poser les étiquettes une à une pour
// former la phrase visée. Renvoie null si une étiquette manque — c'est
// exactement le cas d'un exercice infaisable.
function buildSentence(exercise, target) {
  const rest = [...buildTiles(exercise)]
  const placed = []

  for (const word of target.split(/\s+/).filter(Boolean)) {
    const at = rest.findIndex((tile) => tile.word.toLowerCase() === word.toLowerCase())
    if (at === -1) return null
    placed.push(rest.splice(at, 1)[0])
  }

  return joinTiles(placed)
}

describe('seed-word-order.sql — le contenu réel', () => {
  it('contient 60 exercices, 2 par leçon sur les 30 leçons', () => {
    expect(EXERCISES).toHaveLength(60)
    const byLesson = new Map()
    for (const ex of EXERCISES) byLesson.set(ex.lesson_id, (byLesson.get(ex.lesson_id) || 0) + 1)
    expect(byLesson.size).toBe(30)
    expect([...byLesson.values()].every((n) => n === 2)).toBe(true)
  })

  it('porte le marqueur [ordre], qui rend le script rejouable', () => {
    for (const ex of EXERCISES) {
      expect(ex.explanation.endsWith('[ordre]'), ex.question).toBe(true)
    }
  })
})

describe('chaque exercice réel est faisable', () => {
  it('n’affiche jamais la phrase déjà dans l’ordre', () => {
    for (const ex of EXERCISES) {
      const shown = joinTiles(buildTiles(ex))
      expect(shown, ex.correct_answer).not.toBe(referenceSentence(ex.correct_answer))
    }
  })

  it('accepte la phrase remise dans l’ordre', () => {
    for (const ex of EXERCISES) {
      const built = buildSentence(ex, referenceSentence(ex.correct_answer))
      expect(built, `étiquette manquante : ${ex.correct_answer}`).not.toBeNull()
      expect(isCorrect(built, ex.correct_answer), ex.correct_answer).toBe(true)
    }
  })

  it('rend constructible CHAQUE variante acceptée', () => {
    // Une variante qu'on accepte mais qu'aucune combinaison d'étiquettes ne
    // permet de saisir est un mensonge silencieux. Les intrus comptent : la
    // variante « Can you send the report to me » n'existe que parce que
    // « to » figure dans la réserve.
    for (const ex of EXERCISES) {
      for (const variant of ex.correct_answer.split('/').map((v) => v.trim())) {
        const built = buildSentence(ex, variant)
        expect(built, `variante inconstructible : « ${variant} »`).not.toBeNull()
        expect(isCorrect(built, ex.correct_answer), variant).toBe(true)
      }
    }
  })

  it('donne au moins trois étiquettes — en dessous, il n’y a pas d’ordre à trouver', () => {
    for (const ex of EXERCISES) {
      expect(sentenceWords(ex.correct_answer).length, ex.correct_answer).toBeGreaterThanOrEqual(3)
    }
  })

  it('n’a que des étiquettes d’un seul mot', () => {
    for (const ex of EXERCISES) {
      for (const tile of buildTiles(ex)) {
        expect(tile.word.includes(' '), `${ex.correct_answer} → « ${tile.word} »`).toBe(false)
      }
    }
  })

  it('pose un énoncé en français, jamais la phrase à trouver', () => {
    // L'énoncé donne la phrase FRANÇAISE. S'il contenait la phrase anglaise,
    // l'exercice se lirait dans la question.
    for (const ex of EXERCISES) {
      const target = referenceSentence(ex.correct_answer).toLowerCase()
      expect(ex.question.toLowerCase().includes(target), ex.question).toBe(false)
    }
  })
})
