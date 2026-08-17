import { describe, expect, it } from 'vitest'
import { shouldAskFeedback, LESSONS_BEFORE_ASKING } from './feedback'

// La question ne doit se poser qu'UNE fois, et seulement quand la personne
// a de quoi se faire un avis. Ces tests verrouillent les deux.

describe('shouldAskFeedback — quand demander la note', () => {
  it('ne demande rien avant le seuil', () => {
    expect(shouldAskFeedback({ lessonsDone: 0, feedbackAskedAt: null })).toBe(false)
    expect(shouldAskFeedback({ lessonsDone: 4, feedbackAskedAt: null })).toBe(false)
  })

  it('demande à partir du seuil', () => {
    expect(shouldAskFeedback({ lessonsDone: LESSONS_BEFORE_ASKING, feedbackAskedAt: null })).toBe(true)
    expect(shouldAskFeedback({ lessonsDone: 40, feedbackAskedAt: null })).toBe(true)
  })

  it('ne redemande JAMAIS une fois la question posée', () => {
    // Le cas qui compte : la personne a refusé. Rien ne la distingue en base
    // de celle qui a noté — dans les deux cas, `feedback_asked_at` est
    // rempli, et on ne revient pas.
    const asked = '2026-08-17T10:00:00.000Z'
    expect(shouldAskFeedback({ lessonsDone: 5, feedbackAskedAt: asked })).toBe(false)
    expect(shouldAskFeedback({ lessonsDone: 900, feedbackAskedAt: asked })).toBe(false)
  })

  it('ne demande rien tant que la migration n’est pas passée', () => {
    // Colonne absente => `undefined`. Afficher le formulaire ferait échouer
    // l'enregistrement sans que l'apprenant comprenne pourquoi.
    expect(shouldAskFeedback({ lessonsDone: 30, feedbackAskedAt: undefined })).toBe(false)
    expect(shouldAskFeedback({ lessonsDone: 30 })).toBe(false)
  })

  it('ne plante sur rien', () => {
    expect(shouldAskFeedback()).toBe(false)
    expect(shouldAskFeedback({})).toBe(false)
    expect(shouldAskFeedback({ lessonsDone: null, feedbackAskedAt: null })).toBe(false)
  })
})

describe('le seuil choisi', () => {
  it('laisse le temps de se faire un avis, sans attendre l’abandon', () => {
    // Moins, on demande son avis à quelqu'un qui n'en a pas encore.
    // Plus, on ne demande jamais rien à la majorité, qui s'arrête avant.
    expect(LESSONS_BEFORE_ASKING).toBeGreaterThanOrEqual(3)
    expect(LESSONS_BEFORE_ASKING).toBeLessThanOrEqual(10)
  })
})
