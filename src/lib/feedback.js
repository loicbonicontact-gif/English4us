import { supabase } from '../supabaseClient'

// Note de l'application : quand demander, et comment enregistrer.
//
// LA RÈGLE, EN UNE PHRASE
// On demande une seule fois, après un nombre de leçons qui prouve que la
// personne s'est fait un avis — et jamais plus, quelle que soit sa réponse.

// Cinq leçons. Le choix se justifie dans les deux sens :
//   - moins, et on demande son avis à quelqu'un qui n'en a pas encore ;
//   - plus, et on ne demande jamais rien à la majorité, qui s'arrête avant.
export const LESSONS_BEFORE_ASKING = 5

// Faut-il poser la question maintenant ?
//
// `feedbackAskedAt === undefined` signifie que la colonne n'existe pas
// encore : la migration n'est pas passée. On ne demande alors RIEN, plutôt
// que d'afficher un formulaire dont l'envoi échouerait. Même prudence que
// pour le test de placement.
export function shouldAskFeedback({ lessonsDone, feedbackAskedAt } = {}) {
  if (feedbackAskedAt === undefined) return false   // migration absente
  if (feedbackAskedAt !== null) return false        // déjà demandé, une fois suffit
  return Number(lessonsDone) >= LESSONS_BEFORE_ASKING
}

// Marque la question comme posée. Appelé DANS LES DEUX CAS — note donnée ou
// refus. C'est ce qui garantit qu'on ne redemande jamais.
//
// Un refus ne laisse aucune trace ailleurs : pas de ligne d'avis, pas de
// champ « a dit non ». Refuser, c'est ne rien donner.
export async function markFeedbackAsked(userId) {
  const { error } = await supabase
    .from('profiles')
    .update({ feedback_asked_at: new Date().toISOString() })
    .eq('id', userId)

  if (error) throw error
}

// Enregistre la note. `upsert` : si la personne revient changer d'avis
// depuis son profil, on remplace au lieu d'empiler.
export async function saveRating(userId, rating) {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error('La note doit être un entier de 1 à 5.')
  }

  const { error } = await supabase
    .from('app_feedback')
    .upsert({
      user_id: userId,
      rating,
      updated_at: new Date().toISOString()
    })

  if (error) throw error
}

// Supprime son avis. Le droit à l'effacement n'a de valeur que s'il tient en
// un bouton : demander d'écrire un e-mail pour retirer une note sur 5 est un
// refus déguisé.
export async function deleteRating(userId) {
  const { error } = await supabase.from('app_feedback').delete().eq('user_id', userId)
  if (error) throw error
}

export async function fetchRating(userId) {
  const { data, error } = await supabase
    .from('app_feedback')
    .select('rating')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return data?.rating ?? null
}
