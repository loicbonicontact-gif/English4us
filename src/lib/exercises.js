import { isSpeechAvailable } from './speech'

// Une dictée (type « ecoute ») n'a pas d'énoncé écrit : la phrase n'existe
// que sous forme sonore. Sur un navigateur sans synthèse vocale, elle
// deviendrait une question muette et infaisable.
//
// On retire donc ces exercices plutôt que d'afficher un mur. Exception :
// si la série n'était composée que de dictées, on la laisse entière —
// mieux vaut un exercice dégradé que zéro exercice et un écran vide.
export function usableExercises(list, speechOk = isSpeechAvailable()) {
  if (speechOk) return list

  const withoutDictation = list.filter((ex) => ex?.type !== 'ecoute')
  return withoutDictation.length > 0 ? withoutDictation : list
}

// Même règle, pour les lignes de la file de révision : chacune enveloppe son
// exercice dans un champ `exercise`.
export function usableReviewRows(rows, speechOk = isSpeechAvailable()) {
  if (speechOk) return rows

  const withoutDictation = rows.filter((row) => row?.exercise?.type !== 'ecoute')
  return withoutDictation.length > 0 ? withoutDictation : rows
}
