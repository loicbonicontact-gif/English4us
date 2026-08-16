import { describe, expect, it } from 'vitest'
import { MAX_HEARTS, REFILL_MS, computeRefill, formatWait } from './hearts'

// La recharge se calcule à partir d'une date, jamais d'une minuterie :
// l'application est fermée la plupart du temps, et c'est justement là que
// les heures passent. Ces tests simulent donc le temps qui s'écoule.

const NOW = new Date('2026-08-16T20:00:00Z').getTime()
const hoursAgo = (h) => new Date(NOW - h * 60 * 60 * 1000).toISOString()

describe('computeRefill', () => {
  it('ne touche à rien quand les cœurs sont pleins', () => {
    const r = computeRefill(MAX_HEARTS, hoursAgo(50), NOW)
    expect(r.hearts).toBe(MAX_HEARTS)
    expect(r.gained).toBe(0)
  })

  it('ne rend rien avant quatre heures', () => {
    const r = computeRefill(2, hoursAgo(3), NOW)
    expect(r.hearts).toBe(2)
    expect(r.gained).toBe(0)
  })

  it('rend un cœur après quatre heures', () => {
    const r = computeRefill(2, hoursAgo(4), NOW)
    expect(r.hearts).toBe(3)
    expect(r.gained).toBe(1)
  })

  it('rend deux cœurs après neuf heures', () => {
    const r = computeRefill(2, hoursAgo(9), NOW)
    expect(r.hearts).toBe(4)
    expect(r.gained).toBe(2)
  })

  it('remonte de zéro à plein après vingt heures', () => {
    const r = computeRefill(0, hoursAgo(20), NOW)
    expect(r.hearts).toBe(MAX_HEARTS)
  })

  it('ne dépasse jamais le maximum, même après une longue absence', () => {
    const r = computeRefill(0, hoursAgo(500), NOW)
    expect(r.hearts).toBe(MAX_HEARTS)
    expect(r.gained).toBe(MAX_HEARTS)
  })

  it('ne perd pas les minutes déjà écoulées vers le cœur suivant', () => {
    // 5 h écoulées : un cœur rendu, et il reste 3 h avant le suivant.
    // Si la date de référence était remise à « maintenant », l'apprenant
    // repartirait de 4 h à chaque ouverture et n'obtiendrait plus rien.
    const r = computeRefill(2, hoursAgo(5), NOW)
    expect(r.gained).toBe(1)
    expect(Math.round(r.msUntilNext / 60000)).toBe(180)
  })

  it('reste stable si on relance le calcul juste après', () => {
    const first = computeRefill(2, hoursAgo(5), NOW)
    const second = computeRefill(first.hearts, first.updatedAt, NOW)
    expect(second.gained).toBe(0)
    expect(second.hearts).toBe(first.hearts)
  })

  it('démarre le compteur quand aucune date n\'est enregistrée', () => {
    const r = computeRefill(1, null, NOW)
    expect(r.gained).toBe(0)
    expect(r.msUntilNext).toBe(REFILL_MS)
    // La date renvoyée doit être « maintenant » ET non nulle : c'est elle
    // que applyRefill enregistre pour démarrer réellement l'attente. Sans
    // cet enregistrement, le compte à rebours resterait figé sur 4 h à
    // chaque ouverture et aucun cœur ne reviendrait jamais.
    expect(r.updatedAt).toBe(new Date(NOW).toISOString())
  })

  it('le compteur démarré avance réellement au rechargement suivant', () => {
    // Première ouverture, sans date : le compteur démarre.
    const start = computeRefill(1, null, NOW)

    // Deux heures plus tard : l'attente doit avoir diminué de deux heures.
    const later = computeRefill(1, start.updatedAt, NOW + 2 * 60 * 60 * 1000)
    expect(Math.round(later.msUntilNext / 60000)).toBe(120)

    // Quatre heures après le départ : le cœur est rendu.
    const done = computeRefill(1, start.updatedAt, NOW + 4 * 60 * 60 * 1000)
    expect(done.gained).toBe(1)
    expect(done.hearts).toBe(2)
  })

  it('supporte une date invalide sans planter', () => {
    const r = computeRefill(1, 'pas une date', NOW)
    expect(r.hearts).toBe(1)
    expect(r.gained).toBe(0)
  })

  it('ne rend pas de cœur si la date est dans le futur', () => {
    const future = new Date(NOW + 60 * 60 * 1000).toISOString()
    expect(computeRefill(1, future, NOW).gained).toBe(0)
  })
})

describe('formatWait', () => {
  it('affiche les minutes seules en dessous d\'une heure', () => {
    expect(formatWait(47 * 60 * 1000)).toBe('47 min')
  })

  it('affiche les heures et les minutes', () => {
    expect(formatWait((3 * 60 + 12) * 60 * 1000)).toBe('3 h 12')
  })

  it('affiche l\'heure seule quand les minutes tombent juste', () => {
    expect(formatWait(2 * 60 * 60 * 1000)).toBe('2 h')
  })

  it('ne renvoie rien quand il n\'y a plus d\'attente', () => {
    expect(formatWait(0)).toBeNull()
    expect(formatWait(-1000)).toBeNull()
  })
})
