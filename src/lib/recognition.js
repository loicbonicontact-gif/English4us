// ============================================
// Reconnaissance vocale du navigateur (Web Speech API).
//
// Gratuite, sans compte, sans fichier à héberger. Trois limites à connaître,
// que l'interface doit annoncer plutôt que subir :
//
//   1. Firefox ne l'implémente pas. Sur ce navigateur, les exercices oraux
//      sont retirés plutôt qu'affichés et inutilisables.
//   2. Sur Chrome, l'audio est envoyé aux serveurs de Google pour être
//      transcrit. À signaler dans une application destinée aux écoles.
//   3. Elle transcrit, elle ne note pas la prononciation. Voir le long
//      commentaire de pronunciation.js.
//
// La reconnaissance ne peut démarrer qu'après un geste de l'utilisateur
// (règle des navigateurs) : le bouton micro est donc obligatoire, on ne
// peut pas lancer l'écoute automatiquement comme pour une dictée.
// ============================================

function getRecognitionClass() {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition || window.webkitSpeechRecognition || null
}

export function isRecognitionAvailable() {
  return getRecognitionClass() !== null
}

// Messages d'erreur en français. Les codes bruts de l'API ne veulent rien
// dire pour un apprenant, et « not-allowed » demande une action précise.
const ERRORS = {
  'not-allowed': "L'accès au micro a été refusé. Autorise-le dans les réglages du navigateur, puis réessaie.",
  'service-not-allowed': "L'accès au micro a été refusé. Autorise-le dans les réglages du navigateur, puis réessaie.",
  'audio-capture': "Aucun micro n'a été trouvé sur cet appareil.",
  'no-speech': "Rien n'a été entendu. Approche-toi du micro et parle un peu plus fort.",
  network: "La reconnaissance a besoin d'Internet et la connexion a échoué.",
  aborted: null   // l'utilisateur a arrete lui-meme : ce n'est pas une erreur
}

// Démarre une écoute. Renvoie une fonction pour l'arrêter.
//
// `onPartial` reçoit la transcription au fil de la parole : sans ce retour
// immédiat, l'apprenant ne sait pas si le micro l'entend, et parle dans le
// vide pendant plusieurs secondes.
export function listen({ onPartial, onResult, onError, onEnd, lang = 'en-GB' } = {}) {
  const Recognition = getRecognitionClass()
  if (!Recognition) {
    onError?.("Ce navigateur ne sait pas écouter le micro. Essaie avec Chrome, Edge ou Safari.")
    onEnd?.()
    return () => {}
  }

  let finished = false
  let best = ''

  const recognition = new Recognition()
  recognition.lang = lang
  recognition.interimResults = true
  recognition.maxAlternatives = 1
  recognition.continuous = false

  recognition.onresult = (event) => {
    let text = ''
    for (let i = 0; i < event.results.length; i += 1) {
      text += `${event.results[i][0].transcript} `
    }
    best = text.trim()

    const isFinal = event.results[event.results.length - 1].isFinal
    if (isFinal) {
      finished = true
      onResult?.(best)
    } else {
      onPartial?.(best)
    }
  }

  recognition.onerror = (event) => {
    // « no-speech » avec du texte deja capte n'est pas un echec : la
    // personne a parle puis s'est tue, ce qui est le deroulement normal.
    if (event.error === 'no-speech' && best) return

    const message = ERRORS[event.error]
    if (message) onError?.(message)
  }

  recognition.onend = () => {
    // Le navigateur coupe l'ecoute apres un silence. Si une transcription
    // existe sans avoir ete marquee « finale », on la remonte quand meme :
    // sinon la tentative serait perdue alors que la phrase a bien ete dite.
    if (!finished && best) onResult?.(best)
    else if (!finished) onResult?.('')
    onEnd?.()
  }

  try {
    recognition.start()
  } catch {
    // start() leve une exception si une ecoute est deja en cours.
    onEnd?.()
  }

  return () => {
    try { recognition.abort() } catch { /* deja arretee */ }
  }
}
