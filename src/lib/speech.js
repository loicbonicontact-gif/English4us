// Lecture a voix haute des phrases anglaises.
//
// Utilise la synthese vocale integree au navigateur (SpeechSynthesis) :
// gratuite, sans compte, sans appel reseau, et deja installee sur tous les
// appareils vises. Aucun fichier audio a heberger, aucun cout a l'usage.
//
// Le support varie : si la voix anglaise manque, le navigateur lit avec la
// voix par defaut plutot que de ne rien faire. Si l'API est absente
// (navigateurs anciens), la fonction ne fait rien — jamais d'erreur visible.

export function isSpeechAvailable() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

// Choisit une voix anglaise si le systeme en propose une.
function pickEnglishVoice() {
  const voices = window.speechSynthesis.getVoices()
  return voices.find((v) => v.lang === 'en-GB')
    || voices.find((v) => v.lang === 'en-US')
    || voices.find((v) => v.lang?.startsWith('en'))
    || null
}

export function speak(text) {
  if (!isSpeechAvailable() || !text) return

  try {
    // Coupe toute lecture en cours : deux appuis rapides ne doivent pas
    // empiler deux phrases qui se parlent dessus.
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-GB'
    utterance.rate = 0.9   // legerement ralenti : on apprend, on n'ecoute pas les infos

    const voice = pickEnglishVoice()
    if (voice) utterance.voice = voice

    window.speechSynthesis.speak(utterance)
  } catch {
    /* une lecture ratee ne doit jamais interrompre la lecon */
  }
}
