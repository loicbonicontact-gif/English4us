// ============================================
// QUE DIRE, ET QUAND NE RIEN DIRE
//
// Ce fichier est le cerveau du rappel quotidien. Il est volontairement PUR :
// aucun appel réseau, aucune base, aucune date implicite. On lui donne
// l'état d'un apprenant, il renvoie une notification ou `null`.
//
// POURQUOI IL VIT ICI ET PAS DANS src/
// Il est importé par DEUX mondes : la fonction Supabase qui tourne sous Deno
// (index.ts, à côté) et les tests qui tournent sous Node. Un seul fichier,
// donc une seule vérité. Le dupliquer aurait garanti qu'une des deux copies
// dérive.
//
// LA RÈGLE QUI COMMANDE TOUT
// Ne jamais envoyer une notification fausse ou inutile. Réclamer une leçon à
// quelqu'un qui vient de la faire est le défaut le plus courant de ce genre
// de fonction — et une seule occurrence suffit à faire couper les
// notifications pour toujours.
//
// LA PHRASE ÉCARTÉE
// La demande d'origine était « dis-lui qu'il est à peu de devenir bilingue ».
// Elle n'est pas reprise : après cinq leçons, c'est faux. Un élève le sait,
// et un établissement le verra. Le message « 12 leçons sur 30 » vise le même
// sentiment — tu approches du but — avec un chiffre exact.
// ============================================

// Au-delà, on se tait définitivement. Quelqu'un qui n'est pas revenu depuis
// un mois n'a pas oublié l'application : il a arrêté. Continuer à le
// relancer tous les jours n'est plus un rappel, c'est du harcèlement.
export const SILENCE_APRES_JOURS = 30

// En dessous, on ne parle pas de « série » : deux jours d'affilée n'est pas
// encore une habitude à protéger.
const SERIE_MINIMALE = 2

// Nombre de jours d'absence à partir duquel on relance explicitement.
const RELANCE_APRES_JOURS = 3

/**
 * Choisit la notification du jour pour un apprenant.
 *
 * @param {object} etat
 * @param {boolean} etat.practicedToday   a-t-il déjà travaillé aujourd'hui ?
 * @param {number}  etat.dueReviews       exercices à revoir, échus
 * @param {number}  etat.streak           jours consécutifs
 * @param {number}  etat.lessonsDone      leçons terminées
 * @param {number}  etat.totalLessons     leçons du parcours
 * @param {number}  etat.daysSinceLast    jours depuis la dernière activité
 * @returns {{title: string, body: string} | null}  `null` = on n'envoie rien
 */
export function buildReminder(etat = {}) {
  const {
    practicedToday = false,
    dueReviews = 0,
    streak = 0,
    lessonsDone = 0,
    totalLessons = 30,
    daysSinceLast = 0
  } = etat

  // 1. Il a déjà travaillé aujourd'hui. Rien à dire — c'est la règle la plus
  //    importante du fichier, et c'est pour ça qu'elle est la première.
  if (practicedToday) return null

  // 2. Il a décroché depuis longtemps. On s'arrête, définitivement.
  if (daysSinceLast > SILENCE_APRES_JOURS) return null

  // 3. Des révisions échues : le message le plus actionnable, parce qu'il
  //    désigne un travail précis et court.
  if (dueReviews > 0) {
    return {
      title: 'English4us',
      body: dueReviews === 1
        ? '1 exercice t’attend en révision.'
        : `${dueReviews} exercices t’attendent en révision.`
    }
  }

  // 4. Une série en cours. L'urgence est réelle : elle s'arrête vraiment ce
  //    soir. On ne l'invente pas pour faire pression.
  if (streak >= SERIE_MINIMALE) {
    return {
      title: 'English4us',
      body: `Ta série de ${streak} jours tient encore aujourd’hui.`
    }
  }

  // 5. Absent depuis quelques jours. On nomme la durée — la cacher serait
  //    condescendant — et on rappelle que reprendre est court.
  if (daysSinceLast >= RELANCE_APRES_JOURS && lessonsDone > 0) {
    return {
      title: 'English4us',
      body: `Ça fait ${daysSinceLast} jours. Une leçon de 3 minutes suffit pour reprendre.`
    }
  }

  // 6. Il progresse : on lui montre où il en est. C'est le message qui
  //    remplace « tu es à peu de devenir bilingue » — même ambition, chiffre
  //    exact.
  if (lessonsDone > 0) {
    const restantes = Math.max(0, totalLessons - lessonsDone)
    if (restantes === 0) {
      return {
        title: 'English4us',
        body: 'Parcours terminé. Tes révisions, elles, continuent.'
      }
    }
    return {
      title: 'English4us',
      body: `${lessonsDone} leçons sur ${totalLessons}. Plus que ${restantes} avant la fin du parcours.`
    }
  }

  // 7. Inscrit, jamais commencé.
  return {
    title: 'English4us',
    body: 'Ta première leçon t’attend. Trois minutes suffisent.'
  }
}
