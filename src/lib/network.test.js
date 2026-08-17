import { describe, expect, it, vi } from 'vitest'
import { isOffline, subscribeToNetwork, OFFLINE_MESSAGE } from './network'

describe('isOffline — détecter l’absence de réseau', () => {
  it('dit vrai quand le navigateur se déclare hors ligne', () => {
    expect(isOffline({ onLine: false })).toBe(true)
  })

  it('dit faux quand il se déclare connecté', () => {
    expect(isOffline({ onLine: true })).toBe(false)
  })

  it('dit faux quand l’information n’existe pas', () => {
    // Dans le doute, on ne montre PAS le bandeau. Un bandeau « hors ligne »
    // affiché à tort sur une connexion valide est plus déroutant que pas de
    // bandeau du tout.
    expect(isOffline(null)).toBe(false)
    expect(isOffline({})).toBe(false)
    expect(isOffline({ onLine: 'peut-être' })).toBe(false)
  })
})

describe('subscribeToNetwork — suivre les changements', () => {
  function fakeTarget() {
    const handlers = {}
    return {
      handlers,
      addEventListener: (type, fn) => { handlers[type] = fn },
      removeEventListener: (type, fn) => { if (handlers[type] === fn) delete handlers[type] }
    }
  }

  it('annonce la perte puis le retour du réseau', () => {
    const target = fakeTarget()
    const seen = []
    subscribeToNetwork((offline) => seen.push(offline), target)

    target.handlers.offline()
    target.handlers.online()

    expect(seen).toEqual([true, false])
  })

  it('se désinscrit proprement', () => {
    // Sans cela, un composant démonté continuerait de réagir — et React
    // avertirait d'une mise à jour sur un composant qui n'existe plus.
    const target = fakeTarget()
    const handler = vi.fn()
    const stop = subscribeToNetwork(handler, target)

    stop()

    expect(target.handlers.online).toBeUndefined()
    expect(target.handlers.offline).toBeUndefined()
  })

  it('ne plante pas sans cible', () => {
    expect(() => subscribeToNetwork(() => {}, null)()).not.toThrow()
    expect(() => subscribeToNetwork(() => {}, {})()).not.toThrow()
  })
})

describe('le message affiché', () => {
  it('ne promet pas ce qui n’est pas tenu', () => {
    // Le mode hors ligne garde l'INTERFACE, pas les données. Le message ne
    // doit donc jamais laisser croire qu'une réponse sera enregistrée.
    expect(OFFLINE_MESSAGE).not.toMatch(/enregistr[ée]e?s?\b(?!.*reprendra)/i)
    expect(OFFLINE_MESSAGE.toLowerCase()).not.toContain('erreur')
    expect(OFFLINE_MESSAGE.toLowerCase()).not.toContain('échec')
  })
})
