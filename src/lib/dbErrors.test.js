import { describe, expect, it } from 'vitest'
import { isMissingTable } from './dbErrors'

// Une migration oubliée est l'erreur la plus fréquente en développement.
// Le message affiché doit dire quoi faire — encore faut-il reconnaître
// l'erreur, et elle ne se présente pas sous une seule forme.

describe('isMissingTable', () => {
  it('reconnaît le code Postgres', () => {
    expect(isMissingTable({ code: '42P01' })).toBe(true)
  })

  it('reconnaît le code PostgREST, celui que renvoie Supabase', () => {
    // C'est ce cas qui se produit réellement : PostgREST garde la liste des
    // tables en mémoire et répond avant même d'interroger la base.
    expect(isMissingTable({
      code: 'PGRST205',
      message: "Could not find the table 'public.listening_passages' in the schema cache"
    })).toBe(true)
  })

  it('reconnaît le message même sans code', () => {
    expect(isMissingTable({ message: 'relation "review_items" does not exist' })).toBe(true)
    expect(isMissingTable({ message: 'not found in the schema cache' })).toBe(true)
  })

  it('ne se déclenche pas sur une autre erreur', () => {
    expect(isMissingTable({ code: '23505', message: 'duplicate key value' })).toBe(false)
    expect(isMissingTable({ message: 'network error' })).toBe(false)
  })

  it('supporte une erreur absente', () => {
    expect(isMissingTable(null)).toBe(false)
    expect(isMissingTable(undefined)).toBe(false)
  })
})
