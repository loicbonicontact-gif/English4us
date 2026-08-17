import { describe, expect, it } from 'vitest'
import { isPushSupported, shouldAskPush, urlBase64ToUint8Array, LESSONS_BEFORE_ASKING_PUSH } from './push'

describe('isPushSupported — le navigateur sait-il faire', () => {
  it('reconnaît un navigateur capable', () => {
    expect(isPushSupported({ Notification: {}, PushManager: {}, navigator: { serviceWorker: {} } })).toBe(true)
  })

  it('refuse un iPhone en onglet Safari ordinaire', () => {
    // Sur iOS, `PushManager` n'existe QUE si l'application a été installée
    // sur l'écran d'accueil. Proposer les rappels dans un onglet reviendrait
    // à promettre ce qui n'arrivera jamais.
    expect(isPushSupported({ Notification: {}, navigator: { serviceWorker: {} } })).toBe(false)
  })

  it('refuse un navigateur sans service worker', () => {
    expect(isPushSupported({ Notification: {}, PushManager: {}, navigator: {} })).toBe(false)
    expect(isPushSupported(null)).toBe(false)
  })
})

describe('shouldAskPush — quand proposer les rappels', () => {
  const ok = { lessonsDone: 5, pushAskedAt: null, supported: true }

  it('propose après trois leçons', () => {
    expect(shouldAskPush({ ...ok, lessonsDone: LESSONS_BEFORE_ASKING_PUSH })).toBe(true)
  })

  it('ne propose rien avant', () => {
    expect(shouldAskPush({ ...ok, lessonsDone: 2 })).toBe(false)
  })

  it('ne redemande JAMAIS', () => {
    // Un refus navigateur est definitif : on ne peut plus reposer la
    // question sans passer par les reglages du telephone. Reinsister est
    // donc inutile ET penible.
    expect(shouldAskPush({ ...ok, pushAskedAt: '2026-08-17T18:00:00.000Z' })).toBe(false)
  })

  it('se tait si le navigateur ne sait pas faire', () => {
    expect(shouldAskPush({ ...ok, supported: false })).toBe(false)
  })

  it('se tait tant que la migration n’est pas passée', () => {
    expect(shouldAskPush({ lessonsDone: 30, pushAskedAt: undefined, supported: true })).toBe(false)
    expect(shouldAskPush()).toBe(false)
  })
})

describe('urlBase64ToUint8Array — la clé publique', () => {
  it('décode le base64url en octets', () => {
    // « - » et « _ » remplacent « + » et « / » en base64url, et le
    // remplissage « = » est retiré : sans cette conversion, `subscribe`
    // rejette la clé.
    const bytes = urlBase64ToUint8Array('SGVsbG8')
    expect(Array.from(bytes)).toEqual([72, 101, 108, 108, 111])   // « Hello »
  })

  it('accepte une chaîne déjà complète', () => {
    expect(Array.from(urlBase64ToUint8Array('SGk='))).toEqual([72, 105])
  })
})

describe('le seuil choisi', () => {
  it('demande après que l’application a fait ses preuves, pas avant', () => {
    expect(LESSONS_BEFORE_ASKING_PUSH).toBeGreaterThanOrEqual(2)
    expect(LESSONS_BEFORE_ASKING_PUSH).toBeLessThan(5)   // avant la demande de note
  })
})
