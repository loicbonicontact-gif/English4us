import { describe, expect, it } from 'vitest'
import { buildPath } from './lessons'

// Le parcours mélange deux choses : des leçons, qui se déverrouillent en
// chaîne, et des écoutes, qui s'intercalent sans jamais bloquer la suite.
// Une erreur ici rendrait une leçon inaccessible — le pire défaut possible.

const LESSONS = [
  { id: 1, level: 'A1', unit_order: 1, title: 'Se présenter', xp_reward: 10 },
  { id: 2, level: 'A1', unit_order: 2, title: 'La famille', xp_reward: 10 },
  { id: 3, level: 'A1', unit_order: 3, title: 'Les nombres', xp_reward: 10 },
  { id: 4, level: 'A1', unit_order: 4, title: 'La nourriture', xp_reward: 10 },
  { id: 5, level: 'A1', unit_order: 5, title: 'Les verbes', xp_reward: 15 }
]

const PASSAGES = [
  { id: 101, level: 'A1', title: 'Une question simple', position: 1, xp_reward: 10 },
  { id: 102, level: 'A1', title: 'Au café', position: 2, xp_reward: 15 },
  { id: 103, level: 'A1', title: 'Annonce à la gare', position: 3, xp_reward: 15 }
]

function itemsOf(path, level = 'A1') {
  return path.byLevel.find((g) => g.level === level).items
}

describe('buildPath — déverrouillage des leçons', () => {
  it('ouvre la première leçon et verrouille les suivantes', () => {
    const path = buildPath(LESSONS, {})
    expect(path.decorated[0].unlocked).toBe(true)
    expect(path.decorated[1].unlocked).toBe(false)
  })

  it('ouvre la suivante quand la précédente est terminée', () => {
    const path = buildPath(LESSONS, { 1: { completed: true, score: 80 } })
    expect(path.decorated[1].unlocked).toBe(true)
    expect(path.decorated[2].unlocked).toBe(false)
  })

  it('désigne comme courante la première leçon ouverte non terminée', () => {
    const path = buildPath(LESSONS, { 1: { completed: true } })
    expect(path.current.id).toBe(2)
  })
})

const READINGS = [
  { id: 201, level: 'A1', title: 'Un e-mail de confirmation', position: 1, xp_reward: 15 },
  { id: 202, level: 'A1', title: 'Une annonce de magasin', position: 2, xp_reward: 15 }
]

describe('buildPath — mises en pratique intercalées', () => {
  it('place une mise en pratique après chaque leçon, en alternant écoute et lecture', () => {
    const kinds = itemsOf(buildPath(LESSONS, {}, PASSAGES, {}, READINGS, {})).map((i) => i.kind)
    expect(kinds).toEqual([
      'lesson', 'listening',
      'lesson', 'reading',
      'lesson', 'listening',
      'lesson', 'reading',
      'lesson', 'listening'
    ])
  })

  it('n\'oublie aucun passage, même quand il y en a plus que de leçons', () => {
    const manyReadings = [...READINGS,
      { id: 203, level: 'A1', title: 'Un troisième texte', position: 3, xp_reward: 15 },
      { id: 204, level: 'A1', title: 'Un quatrième texte', position: 4, xp_reward: 15 }
    ]
    const items = itemsOf(buildPath(LESSONS, {}, PASSAGES, {}, manyReadings, {}))
    const ids = items.filter((i) => i.kind !== 'lesson').map((i) => i.id).sort()
    expect(ids).toEqual([101, 102, 103, 201, 202, 203, 204])
  })

  it('répartit les mises en pratique sur toutes les leçons du niveau', () => {
    // Le vrai contenu compte 13 mises en pratique pour les 5 leçons d'un
    // niveau. L'ancienne règle en plaçait UNE par leçon et entassait les 8
    // autres à la fin, ouvertes seulement une fois le niveau terminé : un
    // apprenant ayant fait sa première leçon n'en ouvrait qu'une seule.
    const many = (kind, n, base) => [...Array(n)].map((_, i) => ({
      id: base + i, level: 'A1', title: `${kind} ${i}`, position: i + 1, xp_reward: 15
    }))
    const items = itemsOf(buildPath(LESSONS, { 1: { completed: true } }, many('e', 7, 500), {}, many('l', 6, 600), {}))

    // Aucune mise en pratique ne doit se retrouver après la dernière leçon.
    const lastLesson = items.map((i) => i.kind).lastIndexOf('lesson')
    expect(items.slice(lastLesson + 1).length).toBeLessThanOrEqual(2)

    // La première leçon terminée en ouvre trois, pas une.
    expect(items.filter((i) => i.kind !== 'lesson' && i.unlocked).length).toBe(3)
  })

  it('n\'ouvre jamais une mise en pratique avant sa leçon', () => {
    const items = itemsOf(buildPath(LESSONS, {}, PASSAGES, {}, READINGS, {}))
    expect(items.filter((i) => i.kind !== 'lesson' && i.unlocked).length).toBe(0)
  })

  it('ne saute pas de tour quand une seule file est fournie', () => {
    // Sans lecture, les écoutes doivent se succéder sans laisser de trou.
    const kinds = itemsOf(buildPath(LESSONS, {}, PASSAGES)).map((i) => i.kind)
    expect(kinds).toEqual([
      'lesson', 'listening',
      'lesson', 'listening',
      'lesson', 'listening',
      'lesson', 'lesson'
    ])
  })

  it('verrouille une mise en pratique tant que la leçon qui la précède n\'est pas faite', () => {
    const items = itemsOf(buildPath(LESSONS, {}, PASSAGES, {}, READINGS, {}))
    expect(items[1].kind).toBe('listening')
    expect(items[1].unlocked).toBe(false)
  })

  it('l\'ouvre dès que la leçon qui la précède est terminée', () => {
    const items = itemsOf(buildPath(LESSONS, { 1: { completed: true } }, PASSAGES, {}, READINGS, {}))
    expect(items[1].unlocked).toBe(true)
  })

  it('ne bloque jamais la leçon suivante', () => {
    const items = itemsOf(buildPath(LESSONS, { 1: { completed: true } }, PASSAGES, {}, READINGS, {}))
    expect(items[2].kind).toBe('lesson')
    expect(items[2].unlocked).toBe(true)
  })

  it('marque une écoute terminée avec son score', () => {
    const items = itemsOf(buildPath(LESSONS, { 1: { completed: true } }, PASSAGES, { 101: { score: 67 } }, READINGS, {}))
    expect(items[1].completed).toBe(true)
    expect(items[1].score).toBe(67)
  })

  it('marque une lecture terminée avec son score', () => {
    const progress = { 1: { completed: true }, 2: { completed: true } }
    const items = itemsOf(buildPath(LESSONS, progress, PASSAGES, {}, READINGS, { 201: { score: 100 } }))
    const reading = items.find((i) => i.kind === 'reading')
    expect(reading.completed).toBe(true)
    expect(reading.score).toBe(100)
  })

  it('affiche le parcours normalement quand aucune mise en pratique n\'existe', () => {
    const items = itemsOf(buildPath(LESSONS, {}))
    expect(items).toHaveLength(5)
    expect(items.every((i) => i.kind === 'lesson')).toBe(true)
  })

  it('n\'affecte pas le compte de leçons du niveau', () => {
    const group = buildPath(LESSONS, {}, PASSAGES, {}, READINGS, {}).byLevel.find((g) => g.level === 'A1')
    expect(group.lessons).toHaveLength(5)
  })
})

// ============================================
// Effet du test de placement
//
// Un apprenant place en B1 doit trouver B1 ouvert sans avoir a traverser
// A1 et A2 — c'etait le dernier vrai verrou du parcours. Mais il ne doit
// PAS voir A1 et A2 marques comme termines : il ne les a pas travailles,
// et sa progression affichee doit rester vraie.
// ============================================

const MULTI = [
  { id: 1, level: 'A1', unit_order: 1, title: 'A1.1', xp_reward: 10 },
  { id: 2, level: 'A1', unit_order: 2, title: 'A1.2', xp_reward: 10 },
  { id: 3, level: 'A2', unit_order: 1, title: 'A2.1', xp_reward: 10 },
  { id: 4, level: 'A2', unit_order: 2, title: 'A2.2', xp_reward: 10 },
  { id: 5, level: 'B1', unit_order: 1, title: 'B1.1', xp_reward: 10 },
  { id: 6, level: 'B1', unit_order: 2, title: 'B1.2', xp_reward: 10 }
]

const placed = (level) => buildPath(MULTI, {}, [], {}, [], {}, { placementLevel: level })

describe('buildPath — test de placement', () => {
  it('ouvre la première leçon du niveau de placement', () => {
    const path = placed('B1')
    expect(path.decorated.find((l) => l.id === 5).unlocked).toBe(true)
  })

  it('désigne cette leçon comme courante, et non A1.1', () => {
    // Le cœur du chantier : sans cela, la carte d'accueil afficherait
    // « Reprendre : A1.1 » et le placement ne servirait à rien.
    expect(placed('B1').current.id).toBe(5)
  })

  it('ouvre les niveaux inférieurs pour révision libre', () => {
    const path = placed('B1')
    expect(path.decorated.find((l) => l.id === 2).unlocked).toBe(true)
    expect(path.decorated.find((l) => l.id === 4).unlocked).toBe(true)
  })

  it('ne marque AUCUNE leçon comme terminée', () => {
    // Le placement ouvre, il ne fait pas à la place de l'apprenant.
    // Marquer A1 et A2 « terminés » gonflerait la progression, l'XP et
    // les statistiques avec du travail qui n'a jamais eu lieu.
    expect(placed('B1').decorated.every((l) => l.completed === false)).toBe(true)
  })

  it('garde la chaîne classique DANS le niveau de placement', () => {
    // B1.2 reste fermée tant que B1.1 n'est pas faite : le placement
    // ouvre une porte d'entrée, il ne déverrouille pas tout le niveau.
    expect(placed('B1').decorated.find((l) => l.id === 6).unlocked).toBe(false)
  })

  it('laisse les niveaux supérieurs fermés', () => {
    // Placé en A2 : A1 est ouvert en révision, A2.1 est la porte d'entrée,
    // et B1 reste à mériter. Le placement ne donne pas la suite du parcours.
    const path = buildPath(MULTI, {}, [], {}, [], {}, { placementLevel: 'A2' })
    expect(path.decorated.find((l) => l.id === 1).unlocked).toBe(true)
    expect(path.decorated.find((l) => l.id === 3).unlocked).toBe(true)
    expect(path.decorated.find((l) => l.id === 5).unlocked).toBe(false)
  })

  it('ne change rien sans placement', () => {
    const path = buildPath(MULTI, {})
    expect(path.current.id).toBe(1)
    expect(path.decorated.find((l) => l.id === 5).unlocked).toBe(false)
  })

  it('se comporte comme sans placement quand il vaut A1', () => {
    const path = placed('A1')
    expect(path.current.id).toBe(1)
    expect(path.decorated.find((l) => l.id === 3).unlocked).toBe(false)
  })

  it('ignore un niveau inconnu plutôt que de tout ouvrir', () => {
    const path = buildPath(MULTI, {}, [], {}, [], {}, { placementLevel: 'Z9' })
    expect(path.current.id).toBe(1)
    expect(path.decorated.find((l) => l.id === 3).unlocked).toBe(false)
  })

  it('ouvre aussi les mises en pratique des niveaux inférieurs', () => {
    // Dire « A1 est derrière toi » puis verrouiller ses écoutes serait
    // exactement le défaut corrigé le 17/08 : du contenu hors d'atteinte.
    const path = buildPath(MULTI, {}, PASSAGES, {}, READINGS, {}, { placementLevel: 'B1' })
    const items = path.byLevel.find((g) => g.level === 'A1').items
    const practice = items.filter((i) => i.kind !== 'lesson')
    expect(practice.length).toBeGreaterThan(0)
    expect(practice.every((p) => p.unlocked)).toBe(true)
  })

  it('revient à une leçon inférieure quand tout le haut est terminé', () => {
    const allAbove = { 5: { completed: true }, 6: { completed: true } }
    const path = buildPath(MULTI, allAbove, [], {}, [], {}, { placementLevel: 'B1' })
    expect(path.current.id).toBe(1)
  })
})
