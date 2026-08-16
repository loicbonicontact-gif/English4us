import { normalize } from './answers'

// ============================================
// Comparaison de ce qui a été prononcé avec ce qui était attendu.
//
// CE QUE CETTE MESURE VAUT, ET CE QU'ELLE NE VAUT PAS
//
// La reconnaissance vocale du navigateur renvoie du TEXTE : ce qu'elle a
// cru entendre. On ne peut donc pas noter un phonème — on ne saura jamais
// d'ici que le « th » de « think » a été prononcé « s ».
//
// Ce qu'on mesure est autre chose, et ce n'est pas rien : l'intelligibilité.
// Si une machine entraînée sur de l'anglais natif ne reconnaît pas la
// phrase, un interlocuteur anglophone aura probablement du mal aussi.
//
// L'évaluation fine, phonème par phonème, demanderait une API payante
// (Azure Pronunciation Assessment). Le jour où elle sera branchée, elle
// remplacera cette fonction sans toucher au reste de l'exercice.
// ============================================

// Mots trop courts ou trop faibles pour départager une prononciation : la
// reconnaissance les avale ou les invente selon le contexte. Les compter
// fausserait la note dans les deux sens.
const WEAK_WORDS = new Set(['a', 'an', 'the', 'of', 'to', 'is', 'am', 'are'])

export function words(text) {
  const cleaned = normalize(text)
  return cleaned ? cleaned.split(' ') : []
}

// Plus longue sous-suite commune entre deux listes de mots.
//
// Pourquoi pas une simple comparaison mot à mot : la reconnaissance ajoute
// et retire des mots (« I have » entendu « I've », un « the » fantôme).
// Comparer position par position déclarerait tout faux dès le premier
// décalage. La sous-suite commune tolère ces écarts sans accepter pour
// autant les mots prononcés dans le désordre.
export function longestCommonSubsequence(a, b) {
  const rows = a.length + 1
  const cols = b.length + 1
  const table = Array.from({ length: rows }, () => new Array(cols).fill(0))

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      table[i][j] = a[i - 1] === b[j - 1]
        ? table[i - 1][j - 1] + 1
        : Math.max(table[i - 1][j], table[i][j - 1])
    }
  }

  // Remontée : on marque les mots attendus qui ont bien été retrouvés.
  const matched = new Array(a.length).fill(false)
  let i = a.length
  let j = b.length

  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      matched[i - 1] = true
      i -= 1
      j -= 1
    } else if (table[i - 1][j] >= table[i][j - 1]) {
      i -= 1
    } else {
      j -= 1
    }
  }

  return { length: table[a.length][b.length], matched }
}

// Seuil de réussite. 70 % laisse passer un mot manqué sur quatre : assez
// exigeant pour que l'exercice serve, assez souple pour ne pas punir un
// accent français que la machine transcrit approximativement.
export const PASS_SCORE = 70

// Compare ce qui a été prononcé à ce qui était attendu.
//
// Renvoie la note, et surtout le détail mot par mot : c'est lui qui permet
// de montrer à l'apprenant CE QUI n'est pas passé, au lieu d'un simple
// « raté » qui n'apprend rien.
export function scoreSpeech(transcript, expected) {
  // Une phrase attendue peut proposer plusieurs formulations, séparées par
  // « / », comme pour les réponses écrites. On garde la meilleure note.
  const variants = String(expected).split('/')

  let best = null
  for (const variant of variants) {
    const result = scoreOne(transcript, variant)
    if (!best || result.score > best.score) best = result
  }

  return best
}

function scoreOne(transcript, expected) {
  const expectedWords = words(expected)
  const saidWords = words(transcript)

  if (expectedWords.length === 0) {
    return { score: 0, passed: false, words: [], said: saidWords.join(' '), heard: Boolean(saidWords.length) }
  }

  if (saidWords.length === 0) {
    return {
      score: 0,
      passed: false,
      words: expectedWords.map((word) => ({ word, ok: false })),
      said: '',
      heard: false
    }
  }

  const { matched } = longestCommonSubsequence(expectedWords, saidWords)

  // La note ne porte que sur les mots porteurs de sens. Un « the » manquant
  // ne dit rien de la prononciation ; un « brothers » manquant, si.
  const strongIndexes = expectedWords
    .map((word, i) => (WEAK_WORDS.has(word) ? -1 : i))
    .filter((i) => i !== -1)

  const counted = strongIndexes.length > 0 ? strongIndexes : expectedWords.map((_, i) => i)
  const hits = counted.filter((i) => matched[i]).length
  const score = Math.round((hits / counted.length) * 100)

  return {
    score,
    passed: score >= PASS_SCORE,
    words: expectedWords.map((word, i) => ({ word, ok: matched[i] })),
    said: saidWords.join(' '),
    heard: true
  }
}

// Message adapté au résultat. Un score n'apprend rien tout seul : il faut
// dire quoi faire de ce score.
export function speechFeedback(result) {
  if (!result.heard) {
    return "Rien n'a été entendu. Vérifie que le micro est autorisé, puis parle un peu plus fort."
  }

  const missed = result.words.filter((w) => !w.ok).length

  if (result.score === 100) return 'Toute la phrase est passée. Continue comme ça.'
  if (result.passed) {
    return missed === 1
      ? 'Compris, à un mot près. Réécoute le modèle et refais la phrase entière.'
      : `Compris dans l'ensemble, ${missed} mots sont passés à côté.`
  }

  return 'La phrase n\'a pas été reconnue. Écoute le modèle, puis répète lentement, mot par mot.'
}
