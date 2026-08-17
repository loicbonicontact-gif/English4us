// ============================================
// Quelle phrase lire à voix haute — et surtout, laquelle ne PAS lire
//
// LE DÉFAUT CORRIGÉ
// Le bouton « Écouter la phrase » lisait `exercise.question` dès que
// l'exercice n'était pas une dictée. Or l'énoncé d'un QCM est en FRANÇAIS :
// « Comment dit-on "ma tante" ? » était donc lu par une voix anglaise, avec
// l'accent et les règles anglaises. Incompréhensible, et trompeur pour qui
// apprend justement à prononcer.
//
// LA RÈGLE
// On ne lit que ce dont on est sûr que c'est de l'anglais.
//
//   traduction / dictée / oral  la réponse attendue EST la phrase anglaise,
//                               par construction. Aucune ambiguïté.
//   QCM / texte à trous         l'anglais se trouve entre guillemets dans
//                               l'énoncé — mais pas toujours : « Comment
//                               dit-on "du pain" ? » cite du français.
//                               D'où le test de langue ci-dessous.
//
// En cas de doute, on ne renvoie RIEN, et l'interface masque le bouton.
// Un bouton absent se remarque à peine ; un bouton qui prononce du français
// avec une voix anglaise enseigne une faute.
// ============================================

// Marqueurs français sans équivalent anglais.
//
// Liste volontairement prudente : « on », « son », « pas », « a », « the »
// (non), « note » existent dans les deux langues et feraient passer une
// phrase anglaise pour du français. On ne garde que l'univoque.
const FRENCH_WORDS = new Set([
  'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles',
  'le', 'la', 'les', 'un', 'une', 'des', 'du', 'au', 'aux',
  'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'ses', 'leur', 'leurs',
  'ce', 'cet', 'cette', 'ces', 'qui', 'que', 'quoi', 'dont',
  'comment', 'pourquoi', 'quand', 'où', 'est', 'sont', 'était',
  'avec', 'sans', 'pour', 'dans', 'chez', 'vers', 'entre',
  'plus', 'moins', 'très', 'trop', 'aussi', 'alors', 'donc',
  'oui', 'non', 'merci', 'bonjour', 'monsieur', 'madame'
])

// Élisions impossibles en anglais : j', l', d', qu', n', c', m', t', s'.
const FRENCH_ELISION = /\b(?:j|l|d|qu|n|c|m|t|s)['’](?=[a-zà-ÿ])/i

// Caractères qui n'apparaissent pas dans un mot anglais courant.
const FRENCH_LETTERS = /[éèêëàâäçùûüôöîïœæ]/i

// Mots grammaticaux anglais sans équivalent français.
const ENGLISH_WORDS = new Set([
  'the', 'is', 'are', 'was', 'were', 'am', 'be', 'been', 'being',
  'do', 'does', 'did', 'have', 'has', 'had', 'will', 'would',
  'can', 'could', 'shall', 'should', 'may', 'might', 'must',
  'you', 'your', 'my', 'his', 'her', 'their', 'our', 'its',
  'and', 'but', 'with', 'from', 'they', 'them', 'this', 'that',
  'these', 'those', 'there', 'here', 'what', 'when', 'where',
  'who', 'how', 'why', 'not', 'for', 'about', 'of', 'to', 'at',
  'i', 'we', 'he', 'she', 'it', 'me', 'him', 'us'
])

function words(text) {
  return (text || '')
    .toLowerCase()
    .match(/[a-zà-ÿ][a-zà-ÿ'’]*/gi) || []
}

// Compte les indices de chaque langue. Un accent ou une élision pèsent
// lourd : ils ne peuvent pas venir d'un texte anglais.
export function languageScores(text) {
  let fr = 0
  let en = 0

  if (FRENCH_LETTERS.test(text || '')) fr += 3
  if (FRENCH_ELISION.test(text || '')) fr += 3

  for (const raw of words(text)) {
    const w = raw.replace(/['’].*$/, '')
    if (FRENCH_WORDS.has(w)) fr += 1
    if (ENGLISH_WORDS.has(w)) en += 1
  }

  return { fr, en }
}

// Anglais ? On exige un indice anglais ET aucun indice français.
//
// Le « aucun » est délibéré. Le coût des deux erreurs n'est pas le même :
// rater une phrase anglaise prive d'un bouton ; lire une phrase française
// avec la voix anglaise apprend une prononciation fausse. On préfère donc
// se taire au moindre doute.
export function isEnglish(text) {
  const { fr, en } = languageScores(text)
  return en > 0 && fr === 0
}

// Segments cités dans l'énoncé : « … » d'abord, "…" en secours.
export function quotedSegments(text) {
  if (!text) return []
  const found = [...text.matchAll(/«\s*([^»]+?)\s*»/g)].map((m) => m[1])
  if (found.length) return found
  return [...text.matchAll(/"\s*([^"]+?)\s*"/g)].map((m) => m[1])
}

// Remplace le trou par la réponse, pour que la phrase entendue soit
// complète. « Hello, ___ are you? » lu tel quel marquerait une hésitation
// au milieu ; une fois corrigé, l'apprenant doit entendre la vraie phrase.
export function fillBlank(sentence, answer) {
  if (!sentence || !answer) return sentence
  return sentence.replace(/_{2,}/, answer)
}

// Types dont la réponse attendue EST la phrase anglaise, par construction.
//
// Deux régimes, et la différence n'est pas cosmétique :
//
//   'ecoute' (dictée)  la phrase est l'énoncé même — sans elle il n'y a pas
//   'oral'             d'exercice. Elle se lit donc à tout moment.
//
//   'traduction'       la phrase est la RÉPONSE. Avant validation, le
//                      bouton la donnait à voix haute : « Traduis : "J'ai
//                      vingt ans" » puis, en un appui, « I am twenty years
//                      old ». L'exercice se résolvait sans être fait.
const ALWAYS_SPOKEN = new Set(['ecoute', 'oral'])
const SPOKEN_ONCE_ANSWERED = new Set(['traduction'])

// Renvoie la phrase anglaise à lire, ou null s'il n'y en a pas de sûre.
//
// `revealed` : vrai une fois l'exercice validé. Avant validation on ne
// complète pas le trou — entendre la réponse donnerait l'exercice.
export function englishToSpeak(exercise, { revealed = false } = {}) {
  if (!exercise) return null

  if (ALWAYS_SPOKEN.has(exercise.type)) {
    return exercise.correct_answer || null
  }

  if (SPOKEN_ONCE_ANSWERED.has(exercise.type)) {
    return revealed ? (exercise.correct_answer || null) : null
  }

  // On cherche l'anglais dans l'énoncé. Plusieurs citations sont possibles
  // (« Since » + point de départ, « for » + durée) : on prend la plus
  // longue, c'est celle qui porte une phrase plutôt qu'un mot isolé.
  const candidates = quotedSegments(exercise.question)
    .filter(isEnglish)
    .sort((a, b) => b.length - a.length)

  const sentence = candidates[0]
  if (!sentence) return null

  // Un trou ne se comble qu'après validation.
  if (/_{2,}/.test(sentence)) {
    if (!revealed) return null
    const filled = fillBlank(sentence, exercise.correct_answer)
    return /_{2,}/.test(filled) ? null : filled
  }

  return sentence
}
