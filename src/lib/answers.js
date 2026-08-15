// Comparaison des réponses libres (textes à trous, traduction).
//
// L'apprenant ne doit pas être puni pour une majuscule, un point final
// ou une apostrophe typographique. On normalise donc les deux côtés
// avant de comparer, sans pour autant tolérer une faute d'orthographe.
export function normalize(text = '') {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // retire les accents
    .replace(/[’‘`]/g, "'")            // apostrophes typographiques -> simple
    .replace(/[.,!?;:"«»]/g, '')       // ponctuation ignorée
    .replace(/\s+/g, ' ')              // espaces multiples -> un seul
    .trim()
}

// Certaines réponses admettent plusieurs formulations correctes.
// On les sépare par « / » dans la base (ex. "I do not like coffee / I don't like coffee").
export function isCorrect(userAnswer, expected) {
  const given = normalize(userAnswer)
  if (!given) return false

  return expected
    .split('/')
    .map(normalize)
    .some((variant) => {
      if (variant === given) return true
      // Tolère la contraction anglaise : "do not" <-> "don't"
      const expanded = variant
        .replace(/\bdon't\b/g, 'do not')
        .replace(/\bdoesn't\b/g, 'does not')
        .replace(/\bdidn't\b/g, 'did not')
        .replace(/\bisn't\b/g, 'is not')
        .replace(/\bit's\b/g, 'it is')
        .replace(/\bi'm\b/g, 'i am')
      const givenExpanded = given
        .replace(/\bdon't\b/g, 'do not')
        .replace(/\bdoesn't\b/g, 'does not')
        .replace(/\bdidn't\b/g, 'did not')
        .replace(/\bisn't\b/g, 'is not')
        .replace(/\bit's\b/g, 'it is')
        .replace(/\bi'm\b/g, 'i am')
      return expanded === givenExpanded
    })
}
