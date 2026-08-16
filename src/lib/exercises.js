import { isSpeechAvailable } from './speech'
import { isRecognitionAvailable } from './recognition'

// Deux types d'exercices dépendent d'une capacité du navigateur :
//
//   ecoute  (dictée)          → synthèse vocale. Sans elle, la phrase
//                               n'existe nulle part : question muette.
//   oral    (prononciation)   → reconnaissance vocale. Sans elle, le micro
//                               ne rend rien : bouton mort.
//
// Firefox, par exemple, n'a pas de reconnaissance vocale du tout. Plutôt
// que d'afficher un exercice infaisable, on le retire de la série.
//
// Exception : si la série ne contenait QUE des exercices impossibles, on la
// laisse entière — mieux vaut un exercice dégradé qu'un écran vide.

function capabilityFor(type, { speechOk, recognitionOk }) {
  if (type === 'ecoute') return speechOk
  if (type === 'oral') return recognitionOk
  return true
}

function keepUsable(list, getType, caps) {
  const usable = list.filter((entry) => capabilityFor(getType(entry), caps))
  return usable.length > 0 ? usable : list
}

export function usableExercises(
  list,
  speechOk = isSpeechAvailable(),
  recognitionOk = isRecognitionAvailable()
) {
  if (speechOk && recognitionOk) return list
  return keepUsable(list, (ex) => ex?.type, { speechOk, recognitionOk })
}

// Même règle, pour les lignes de la file de révision : chacune enveloppe son
// exercice dans un champ `exercise`.
export function usableReviewRows(
  rows,
  speechOk = isSpeechAvailable(),
  recognitionOk = isRecognitionAvailable()
) {
  if (speechOk && recognitionOk) return rows
  return keepUsable(rows, (row) => row?.exercise?.type, { speechOk, recognitionOk })
}
