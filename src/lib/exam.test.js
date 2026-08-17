import { describe, expect, it } from 'vitest'
import {
  SECTION_MAX,
  SECTION_MIN,
  examDuration,
  formatCountdown,
  gradeExam,
  levelForScore,
  scaleSection,
  scoreRange,
  shuffle,
  totalScore
} from './exam'

// Le score affiché engage la crédibilité de l'application : un apprenant
// qui lit « 780 » va y croire. La conversion doit donc être exacte dans ses
// bornes, et l'incertitude honnêtement représentée.

describe('scaleSection', () => {
  it('donne le minimum officiel avec zéro bonne réponse', () => {
    expect(scaleSection(0, 100)).toBe(SECTION_MIN)
  })

  it('donne le maximum officiel avec un sans-faute', () => {
    expect(scaleSection(100, 100)).toBe(SECTION_MAX)
  })

  it('reste dans les bornes officielles quel que soit le score', () => {
    for (let correct = 0; correct <= 50; correct += 1) {
      const s = scaleSection(correct, 50)
      expect(s).toBeGreaterThanOrEqual(SECTION_MIN)
      expect(s).toBeLessThanOrEqual(SECTION_MAX)
    }
  })

  it('ne rend que des multiples de 5, comme le vrai barème', () => {
    for (let correct = 0; correct <= 42; correct += 1) {
      expect(scaleSection(correct, 42) % 5).toBe(0)
    }
  })

  it('ne divise jamais par zéro sur une section vide', () => {
    expect(scaleSection(0, 0)).toBe(SECTION_MIN)
  })

  it('borne un score aberrant plutôt que de le laisser filer', () => {
    expect(scaleSection(120, 100)).toBe(SECTION_MAX)
    expect(scaleSection(-5, 100)).toBe(SECTION_MIN)
  })
})

describe('totalScore', () => {
  it('respecte les bornes 10 et 990 du TOEIC', () => {
    expect(totalScore(SECTION_MIN, SECTION_MIN)).toBe(10)
    expect(totalScore(SECTION_MAX, SECTION_MAX)).toBe(990)
  })
})

describe('scoreRange', () => {
  it('encadre le score d\'une marge de part et d\'autre', () => {
    const r = scoreRange(700)
    expect(r.low).toBeLessThan(700)
    expect(r.high).toBeGreaterThan(700)
  })

  it('ne descend jamais sous 10 ni ne dépasse 990', () => {
    expect(scoreRange(10).low).toBe(10)
    expect(scoreRange(990).high).toBe(990)
  })
})

describe('levelForScore', () => {
  it('associe les seuils publiés par ETS', () => {
    expect(levelForScore(950).level).toBe('C1')
    expect(levelForScore(800).level).toBe('B2')
    expect(levelForScore(600).level).toBe('B1')
    expect(levelForScore(300).level).toBe('A2')
    expect(levelForScore(100).level).toBe('A1')
  })

  it('ne renvoie jamais rien, même pour un score minimal', () => {
    expect(levelForScore(10).level).toBe('A1')
    expect(levelForScore(0).level).toBeDefined()
  })
})

describe('examDuration', () => {
  it('accorde plus de temps à la lecture qu\'à l\'écoute', () => {
    expect(examDuration(0, 10)).toBeGreaterThan(examDuration(10, 0))
  })

  it('reste proche des cadences réelles de l\'examen', () => {
    // 100 questions d'écoute doivent tourner autour des 45 minutes réelles.
    const minutes = examDuration(100, 0) / 60000
    expect(minutes).toBeGreaterThan(40)
    expect(minutes).toBeLessThan(50)
  })
})

describe('formatCountdown', () => {
  it('affiche minutes et secondes en dessous d\'une heure', () => {
    expect(formatCountdown(65 * 1000)).toBe('01:05')
  })

  it('ajoute les heures au-delà', () => {
    expect(formatCountdown((3600 + 125) * 1000)).toBe('1:02:05')
  })

  it('ne descend jamais en négatif', () => {
    expect(formatCountdown(-5000)).toBe('00:00')
  })
})

describe('shuffle', () => {
  it('ne modifie pas la liste d\'origine', () => {
    const source = [1, 2, 3, 4, 5]
    shuffle(source)
    expect(source).toEqual([1, 2, 3, 4, 5])
  })

  it('conserve tous les éléments', () => {
    const result = shuffle([1, 2, 3, 4, 5])
    expect(result.sort()).toEqual([1, 2, 3, 4, 5])
  })
})

describe('gradeExam', () => {
  const exam = {
    listening: [
      { id: 1, correct_answer: 'A' },
      { id: 2, correct_answer: 'B' }
    ],
    reading: [
      { id: 10, correct_answer: 'X' },
      { id: 11, correct_answer: 'Y' },
      { id: 12, correct_answer: 'Z' }
    ]
  }

  it('compte séparément les deux sections', () => {
    const r = gradeExam(exam, { 1: 'A', 2: 'wrong', 10: 'X', 11: 'Y', 12: 'Z' })
    expect(r.listeningCorrect).toBe(1)
    expect(r.readingCorrect).toBe(3)
  })

  it('donne le score maximal pour un sans-faute', () => {
    const r = gradeExam(exam, { 1: 'A', 2: 'B', 10: 'X', 11: 'Y', 12: 'Z' })
    expect(r.total).toBe(990)
    expect(r.level.level).toBe('C1')
  })

  it('donne le score minimal quand rien n\'est répondu', () => {
    const r = gradeExam(exam, {})
    expect(r.total).toBe(10)
  })

  it('ne compte pas une question laissée vide comme juste', () => {
    // Piege classique : si correct_answer et la reponse absente valent tous
    // deux « undefined », la comparaison serait vraie et offrirait le point.
    const blanks = { listening: [{ id: 1, correct_answer: undefined }], reading: [] }
    expect(gradeExam(blanks, {}).listeningCorrect).toBe(0)
  })

  it('fournit une fourchette et un niveau exploitables', () => {
    const r = gradeExam(exam, { 1: 'A', 10: 'X' })
    expect(r.range.low).toBeLessThanOrEqual(r.total)
    expect(r.range.high).toBeGreaterThanOrEqual(r.total)
    expect(r.level.label).toBeTruthy()
  })
})
