import { describe, expect, it } from 'vitest'
import { computeStreak, levelFromXP, levelProgress } from './gamification'
import { addDays, todayISO } from './dates'

// La série quotidienne se casse silencieusement : personne ne s'en aperçoit
// avant le lendemain. Elle mérite donc des tests plutôt qu'un essai à l'œil.

describe('computeStreak', () => {
  const today = todayISO()

  it('ne compte pas deux fois la même journée', () => {
    expect(computeStreak(today, 7)).toBe(7)
  })

  it('prolonge la série après une activité la veille', () => {
    expect(computeStreak(addDays(today, -1), 7)).toBe(8)
  })

  it('repart à 1 après un jour sauté', () => {
    expect(computeStreak(addDays(today, -2), 7)).toBe(1)
  })

  it('repart à 1 pour une première activité', () => {
    expect(computeStreak(null, 0)).toBe(1)
  })

  it('repart à 1 après une longue absence', () => {
    expect(computeStreak(addDays(today, -60), 30)).toBe(1)
  })
})

describe('levelFromXP', () => {
  it('démarre en A1', () => {
    expect(levelFromXP(0)).toBe('A1')
    expect(levelFromXP(499)).toBe('A1')
  })

  it('change de niveau à chaque palier de 500', () => {
    expect(levelFromXP(500)).toBe('A2')
    expect(levelFromXP(1000)).toBe('B1')
    expect(levelFromXP(2500)).toBe('C2')
  })

  it('plafonne à C2', () => {
    expect(levelFromXP(99999)).toBe('C2')
  })
})

describe('levelProgress', () => {
  it('situe la progression à l\'intérieur du niveau', () => {
    const p = levelProgress(750)
    expect(p.current).toBe('A2')
    expect(p.next).toBe('B1')
    expect(p.inLevel).toBe(250)
    expect(p.percent).toBe(50)
  })

  it('affiche une barre pleine au dernier niveau', () => {
    const p = levelProgress(3000)
    expect(p.current).toBe('C2')
    expect(p.next).toBeNull()
    expect(p.percent).toBe(100)
  })
})
