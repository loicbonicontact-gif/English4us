// ============================================
// « Remets les mots dans l'ordre » — préparation des étiquettes
//
// POURQUOI CE FORMAT
// L'ordre des mots est LE point où le français trahit l'anglais. Un
// francophone écrit spontanément « a car red », « I like very much this
// film », « Where you are going? ». Une traduction libre ne cible pas ce
// défaut : elle mélange orthographe, vocabulaire et syntaxe, et l'erreur se
// noie. Ici le vocabulaire est donné — il ne reste QUE l'ordre à trouver.
//
// CE QUE CE FICHIER FAIT, ET NE FAIT PAS
// Il prépare les étiquettes ; il ne juge pas la réponse. La correction
// reste `isCorrect` de lib/answers, commune à tous les exercices écrits :
// une phrase reconstruite est une phrase, elle se corrige comme les autres.
// ============================================

// Générateur pseudo-aléatoire déterministe (mulberry32).
//
// Pourquoi pas Math.random : le mélange est recalculé à chaque rendu de
// React. Avec un vrai hasard, les étiquettes sauteraient de place au
// moindre clic — on ne pourrait plus viser un mot. Semé sur l'identifiant
// de l'exercice, le mélange est fixe pour un exercice donné, et différent
// d'un exercice à l'autre.
function seeded(seed) {
  let a = (seed >>> 0) || 1
  return function next() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Certaines réponses admettent plusieurs formulations, séparées par « / »
// (voir lib/answers). Les étiquettes ne peuvent en construire qu'une : on
// prend la première. La correction, elle, accepte toujours les deux.
export function referenceSentence(correctAnswer = '') {
  return (correctAnswer.split('/')[0] || '').trim()
}

// Les mots de la phrase, ponctuation comprise.
//
// On ne détache pas les virgules ni le point final : `isCorrect` les ignore
// à la comparaison, et une étiquette « , » seule serait un piège gratuit
// (elle ne s'entend pas, elle ne se raisonne pas).
export function sentenceWords(correctAnswer = '') {
  return referenceSentence(correctAnswer).split(/\s+/).filter(Boolean)
}

// Étiquettes en trop, volontairement fausses. Elles sont facultatives et
// se rangent dans `options`, comme les propositions d'un QCM.
//
// Sans elles, un apprenant peut réussir sans rien comprendre : il lui
// suffit de vider la réserve. Un seul intrus suffit à rendre l'exercice
// honnête — il faut alors décider qu'un mot ne sert pas.
// Une entrée = une étiquette = UN mot. Le découpage sur les espaces est un
// garde-fou : une entrée « from where » afficherait une étiquette à deux
// mots, que l'apprenant ne pourrait ni séparer ni placer utilement.
export function decoyWords(options) {
  if (!Array.isArray(options)) return []
  return options.flatMap((word) => String(word).trim().split(/\s+/)).filter(Boolean)
}

function shuffle(list, seed) {
  const next = seeded(seed)
  const out = [...list]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

// La réserve d'étiquettes, mélangée.
//
// Chaque étiquette porte un `id` — l'index dans la réserve — parce que les
// mots se répètent : « the cat on the mat » contient deux « the », et
// l'interface doit savoir laquelle des deux a été posée.
//
// Garde-fou : si le mélange retombe sur l'ordre correct, l'exercice
// s'offrirait tout seul. On décale alors d'un cran. Sur une phrase de deux
// mots, le hasard tombe juste une fois sur deux — ce n'est pas un cas rare.
export function buildTiles(exercise) {
  if (!exercise) return []

  const solution = sentenceWords(exercise.correct_answer)
  if (!solution.length) return []

  const pool = [...solution, ...decoyWords(exercise.options)]
  const seed = Number(exercise.id) || pool.join(' ').length

  let mixed = shuffle(pool, seed)
  if (pool.length > 1 && mixed.join(' ') === solution.join(' ')) {
    mixed = [...mixed.slice(1), mixed[0]]
  }

  return mixed.map((word, id) => ({ id, word }))
}

// La phrase construite par l'apprenant, telle qu'elle part à la correction.
export function joinTiles(tiles = []) {
  return tiles.map((tile) => tile.word).join(' ').trim()
}
