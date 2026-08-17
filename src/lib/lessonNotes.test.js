import { describe, expect, it } from 'vitest'
import { readExamples } from './lessonNotes'

// `examples` est du JSON libre : il peut arriver déjà décodé (c'est ce que
// fait Supabase) ou en chaîne selon la façon dont la ligne a été écrite. La
// fiche ne doit jamais planter à cause de ça — au pire elle est plus courte.

describe('readExamples — lire la colonne examples', () => {
  it('accepte un tableau déjà décodé', () => {
    expect(readExamples([{ en: 'I am late.', fr: 'Je suis en retard.' }]))
      .toEqual([{ en: 'I am late.', fr: 'Je suis en retard.' }])
  })

  it('accepte la même chose sous forme de chaîne', () => {
    expect(readExamples('[{"en":"I am late.","fr":"Je suis en retard."}]'))
      .toEqual([{ en: 'I am late.', fr: 'Je suis en retard.' }])
  })

  it('écarte une entrée sans anglais', () => {
    // Une ligne vide alignée avec les autres ferait croire à un défaut
    // d'affichage. Mieux vaut une fiche plus courte.
    const list = readExamples([
      { en: 'I am late.', fr: 'Je suis en retard.' },
      { en: '   ', fr: 'Traduction orpheline' },
      { fr: 'Sans anglais du tout' }
    ])
    expect(list).toHaveLength(1)
  })

  it('accepte un exemple sans traduction', () => {
    expect(readExamples([{ en: 'Good morning.' }]))
      .toEqual([{ en: 'Good morning.', fr: '' }])
  })

  it('ne plante sur rien', () => {
    expect(readExamples(null)).toEqual([])
    expect(readExamples(undefined)).toEqual([])
    expect(readExamples('pas du json')).toEqual([])
    expect(readExamples('{"en":"objet, pas tableau"}')).toEqual([])
    expect(readExamples(42)).toEqual([])
  })
})
