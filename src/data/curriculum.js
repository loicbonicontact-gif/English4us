// Structure du parcours complet A1 -> C2
// Chaque niveau CECRL contient des unités thématiques
export const CURRICULUM = {
  A1: [
    { title: 'Se présenter', theme: 'basics' },
    { title: 'La famille', theme: 'family' },
    { title: 'Les nombres et l\'heure', theme: 'numbers' },
    { title: 'Nourriture et boissons', theme: 'food' },
    { title: 'Verbes essentiels (be, have, do)', theme: 'grammar' }
  ],
  A2: [
    { title: 'Le passé simple', theme: 'grammar' },
    { title: 'Voyages et directions', theme: 'travel' },
    { title: 'Achats et argent', theme: 'shopping' },
    { title: 'Décrire son quotidien', theme: 'routine' },
    { title: 'Le futur (will / going to)', theme: 'grammar' }
  ],
  B1: [
    { title: 'Exprimer une opinion', theme: 'opinion' },
    { title: 'Le monde du travail', theme: 'work' },
    { title: 'Present perfect', theme: 'grammar' },
    { title: 'Santé et bien-être', theme: 'health' },
    { title: 'Comparatifs et superlatifs', theme: 'grammar' }
  ],
  B2: [
    { title: 'Débattre et argumenter', theme: 'debate' },
    { title: 'Conditionnels (1st, 2nd)', theme: 'grammar' },
    { title: 'Environnement et société', theme: 'society' },
    { title: 'Voix passive', theme: 'grammar' },
    { title: 'Anglais professionnel', theme: 'business' }
  ],
  C1: [
    { title: 'Nuances et registres de langue', theme: 'nuance' },
    { title: 'Conditionnels avancés (3rd, mixed)', theme: 'grammar' },
    { title: 'Actualités et médias', theme: 'media' },
    { title: 'Expressions idiomatiques', theme: 'idioms' },
    { title: 'Rédaction argumentative', theme: 'writing' }
  ],
  C2: [
    { title: 'Registres académiques et littéraires', theme: 'academic' },
    { title: 'Subtilités phonétiques et accents', theme: 'phonetics' },
    { title: 'Négociation et diplomatie', theme: 'negotiation' },
    { title: 'Humour, ironie et sous-entendus', theme: 'humor' },
    { title: 'Maîtrise totale : synthèse', theme: 'mastery' }
  ]
}

export const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export const XP_PER_LEVEL = 500 // XP nécessaire pour passer au niveau suivant
