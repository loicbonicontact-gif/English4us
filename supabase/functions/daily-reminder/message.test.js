import { describe, expect, it } from 'vitest'
import { buildReminder, SILENCE_APRES_JOURS } from './message.js'

// Ces tests protègent surtout ce que l'application NE DOIT PAS dire.
// Une notification fausse ou inutile se paie très cher : l'apprenant coupe
// les notifications, et il ne les rallume jamais.

describe('le silence — les cas où l’on n’envoie rien', () => {
  it('ne réclame RIEN à quelqu’un qui a déjà travaillé aujourd’hui', () => {
    // Le défaut le plus courant de ce genre de fonction, et le plus cher.
    // Il passe avant tous les autres tests, exprès.
    expect(buildReminder({ practicedToday: true, dueReviews: 12, streak: 40 })).toBeNull()
  })

  it('se tait définitivement après un mois d’absence', () => {
    // Passé ce délai, ce n'est plus un rappel : la personne a arrêté.
    expect(buildReminder({ daysSinceLast: SILENCE_APRES_JOURS + 1, lessonsDone: 10 })).toBeNull()
    expect(buildReminder({ daysSinceLast: SILENCE_APRES_JOURS, lessonsDone: 10 })).not.toBeNull()
  })
})

describe('le message choisi selon la situation', () => {
  it('donne la priorité aux révisions échues', () => {
    const m = buildReminder({ dueReviews: 3, streak: 9, lessonsDone: 12 })
    expect(m.body).toBe('3 exercices t’attendent en révision.')
  })

  it('accorde le singulier', () => {
    expect(buildReminder({ dueReviews: 1 }).body).toBe('1 exercice t’attend en révision.')
  })

  it('rappelle la série quand il y en a une', () => {
    expect(buildReminder({ streak: 12, lessonsDone: 5 }).body)
      .toBe('Ta série de 12 jours tient encore aujourd’hui.')
  })

  it('ne parle pas de série en dessous de deux jours', () => {
    // Un jour d'affilée n'est pas une habitude à protéger.
    const m = buildReminder({ streak: 1, lessonsDone: 5, totalLessons: 30 })
    expect(m.body).not.toMatch(/série/)
  })

  it('relance après plusieurs jours d’absence, en nommant la durée', () => {
    expect(buildReminder({ daysSinceLast: 5, lessonsDone: 4 }).body)
      .toBe('Ça fait 5 jours. Une leçon de 3 minutes suffit pour reprendre.')
  })

  it('montre la progression réelle vers la fin du parcours', () => {
    // Le message qui remplace « tu es à peu de devenir bilingue ».
    expect(buildReminder({ lessonsDone: 12, totalLessons: 30 }).body)
      .toBe('12 leçons sur 30. Plus que 18 avant la fin du parcours.')
  })

  it('ne promet plus de leçons quand le parcours est fini', () => {
    expect(buildReminder({ lessonsDone: 30, totalLessons: 30 }).body)
      .toBe('Parcours terminé. Tes révisions, elles, continuent.')
  })

  it('invite le nouvel inscrit à commencer', () => {
    expect(buildReminder({ lessonsDone: 0 }).body)
      .toBe('Ta première leçon t’attend. Trois minutes suffisent.')
  })

  it('ne plante sur rien', () => {
    expect(buildReminder()).not.toBeNull()
    expect(buildReminder({})).not.toBeNull()
  })
})

describe('ce que le texte ne doit jamais dire', () => {
  // La demande d'origine etait « dis-lui qu'il est a peu de devenir
  // bilingue ». Ecartee : apres cinq lecons, c'est faux, et un
  // etablissement le verra. Ce test empeche que ca revienne par megarde.
  const situations = [
    { lessonsDone: 1 }, { lessonsDone: 12, totalLessons: 30 },
    { dueReviews: 4 }, { streak: 7 }, { daysSinceLast: 6, lessonsDone: 3 },
    { lessonsDone: 30, totalLessons: 30 }, { lessonsDone: 0 }
  ]

  it('ne prétend jamais que l’apprenant est proche du bilinguisme', () => {
    for (const etat of situations) {
      const m = buildReminder(etat)
      if (!m) continue
      expect(m.body.toLowerCase(), JSON.stringify(etat)).not.toMatch(/bilingue|couramment|ma[îi]trise/)
    }
  })

  it('ne culpabilise pas et ne menace pas', () => {
    for (const etat of situations) {
      const m = buildReminder(etat)
      if (!m) continue
      expect(m.body.toLowerCase(), JSON.stringify(etat))
        .not.toMatch(/tu vas perdre|attention|dernier avertissement|ne rate pas|vite/)
    }
  })

  it('reste court — une notification tronquée ne sert à rien', () => {
    for (const etat of situations) {
      const m = buildReminder(etat)
      if (!m) continue
      expect(m.body.length, m.body).toBeLessThanOrEqual(90)
    }
  })
})
