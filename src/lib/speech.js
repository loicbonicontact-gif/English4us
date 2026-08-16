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

// ============================================
// Choix de la voix — c'est ce qui decide de la qualite d'ecoute.
//
// Prendre la premiere voix anglaise venue est une erreur : les systemes
// embarquent encore des voix « compactes » des annees 2000, hachees et
// metalliques, a cote de voix neuronales tres naturelles. Sur le meme Mac,
// « Daniel (compact) » et « Siri Voice 4 » n'ont rien a voir.
//
// On classe donc les voix par indices de qualite, du plus fiable au moins
// fiable. Aucun de ces indices n'est standardise : ce sont les conventions
// de nommage observees chez Apple, Google et Microsoft.
// ============================================

// Marqueurs de voix neuronales, par ordre de qualite decroissante.
const QUALITY_MARKERS = [
  'siri',       // Apple, la plus naturelle sur iPhone et Mac
  'natural',    // Microsoft Neural (« Microsoft Sonia Online (Natural) »)
  'premium',    // Apple, palier au-dessus de « enhanced »
  'enhanced',   // Apple, voix telechargee de meilleure qualite
  'neural',
  'google'      // Chrome, voix distantes de bonne facture
]

// Voix standard reconnues comme intelligibles, tous systemes confondus.
//
// Pourquoi une liste des BONNES voix et non des mauvaises : les noms des
// voix gadget d'Apple sont traduits dans la langue du systeme (« Bouffon »
// pour « Jester », « Cloches » pour « Bells »). Une liste d'exclusion en
// anglais les laisserait passer sur un Mac configure en francais. Les vrais
// prenoms, eux, ne sont jamais traduits.
const GOOD_VOICE_NAMES = [
  // Apple
  'samantha', 'alex', 'daniel', 'karen', 'moira', 'tessa', 'fiona',
  'serena', 'kate', 'oliver', 'rishi', 'ava', 'allison', 'susan', 'tom',
  'nicky', 'aaron', 'zoe', 'evan', 'nathan', 'matilda', 'jamie',
  // Microsoft
  'sonia', 'ryan', 'libby', 'aria', 'guy', 'jenny', 'zira', 'david',
  // Android / Chrome OS
  'english united kingdom', 'english united states'
]

function scoreVoice(voice) {
  const name = (voice.name || '').toLowerCase()
  let score = 0

  // Qualite de la synthese : c'est le critere qui pese le plus.
  const markerIndex = QUALITY_MARKERS.findIndex((m) => name.includes(m))
  if (markerIndex !== -1) score += (QUALITY_MARKERS.length - markerIndex) * 10

  // Voix standard connue : correcte a defaut d'etre neuronale. Suffit a
  // ecarter les voix gadget, qui ne portent aucun de ces prenoms.
  if (GOOD_VOICE_NAMES.some((good) => name.includes(good))) score += 8

  // Une voix distante est presque toujours neuronale ; une voix locale est
  // souvent l'ancienne generation. Mais elle ne demande pas de reseau : on
  // la valorise un peu, sans que cela renverse le critere precedent.
  if (voice.localService === false) score += 5

  // « compact » est le marqueur explicite d'une voix basse qualite chez Apple.
  if (name.includes('compact')) score -= 20

  // Anglais britannique par defaut : c'est la reference des examens
  // scolaires francais. L'americain reste tres acceptable.
  if (voice.lang === 'en-GB') score += 4
  else if (voice.lang === 'en-US') score += 3
  else if (voice.lang?.startsWith('en')) score += 1

  return score
}

// La liste des voix arrive de facon asynchrone : au premier appel elle est
// souvent vide, et le navigateur lirait alors l'anglais avec la voix par
// defaut du systeme — en francais, ce qui rend la dictee incomprehensible.
// On la met donc en cache des qu'elle est disponible.
let cachedVoice = null
let cachedCount = 0

function pickEnglishVoice() {
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null

  // La liste s'enrichit apres coup (voix telechargees, voix distantes) :
  // on recalcule tant que son contenu change.
  if (cachedVoice && voices.length === cachedCount) return cachedVoice

  const english = voices.filter((v) => v.lang?.toLowerCase().startsWith('en'))
  if (!english.length) return null

  const ranked = english
    .map((voice) => ({ voice, score: scoreVoice(voice) }))
    .sort((a, b) => b.score - a.score)

  // Aucune voix identifiee comme correcte : on reprend le comportement
  // d'origine (la premiere voix britannique, sinon americaine) plutot que
  // de ne rien lire du tout.
  const best = ranked[0]?.score > 5
    ? ranked[0].voice
    : english.find((v) => v.lang === 'en-GB') || english[0]

  cachedVoice = best || null
  cachedCount = voices.length
  return cachedVoice
}

// Demande au navigateur de charger la liste des voix, et previent quand
// c'est fait. A appeler au demarrage de l'application : la premiere phrase
// lue est alors deja dans la bonne voix.
export function primeVoices() {
  if (!isSpeechAvailable()) return
  window.speechSynthesis.getVoices()
  window.speechSynthesis.addEventListener?.('voiceschanged', () => {
    cachedVoice = null
    cachedCount = 0
    pickEnglishVoice()
  })
}

// Attend que la liste des voix soit disponible, puis execute `callback`.
//
// C'est la piece indispensable : `getVoices()` renvoie une liste VIDE
// pendant la premiere seconde de vie de la page. Parler a ce moment-la
// signifie parler sans voix choisie — le navigateur prend alors la voix
// par defaut du systeme, en francais, et lit l'anglais avec l'accent et
// les regles francaises. La phrase devient incomprehensible.
//
// On patiente donc, mais jamais indefiniment : passe le delai, mieux vaut
// lire avec la voix par defaut que ne rien lire du tout.
function whenVoicesReady(callback, timeoutMs = 1500) {
  if (!isSpeechAvailable()) return

  if (window.speechSynthesis.getVoices().length > 0) {
    callback()
    return
  }

  let done = false
  const finish = () => {
    if (done) return
    done = true
    clearTimeout(timer)
    window.speechSynthesis.removeEventListener?.('voiceschanged', finish)
    callback()
  }

  const timer = setTimeout(finish, timeoutMs)
  window.speechSynthesis.addEventListener?.('voiceschanged', finish)
  window.speechSynthesis.getVoices()   // declenche le chargement chez Chrome
}

// Nom de la voix retenue : affiche dans le profil, pour que l'apprenant
// sache quelle voix il entend et puisse en installer une meilleure.
export function currentVoiceName() {
  if (!isSpeechAvailable()) return null
  return pickEnglishVoice()?.name || null
}

// ============================================
// Plusieurs voix — pour les dialogues
//
// Un dialogue lu par une seule voix n'entraine pas la comprehension orale :
// dans la vraie vie, c'est le changement de locuteur qui permet de suivre
// qui dit quoi. On attribue donc une voix differente a chaque interlocuteur.
// ============================================

// Renvoie `count` voix anglaises distinctes, les meilleures d'abord.
// Si le systeme n'en propose pas assez, la meme voix est reutilisee : le
// dialogue reste ecoutable, simplement moins facile a suivre.
export function pickVoices(count = 2) {
  if (!isSpeechAvailable()) return []

  const english = window.speechSynthesis.getVoices()
    .filter((v) => v.lang?.toLowerCase().startsWith('en'))
  if (!english.length) return []

  const ranked = english
    .map((voice) => ({ voice, score: scoreVoice(voice) }))
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.voice)

  const chosen = []
  for (const voice of ranked) {
    if (chosen.length >= count) break
    // Deux entrees peuvent porter le meme nom pour deux variantes d'anglais :
    // ce serait la meme voix a l'oreille, donc inutile pour distinguer deux
    // interlocuteurs.
    if (!chosen.some((v) => v.name === voice.name)) chosen.push(voice)
  }

  // Pas assez de voix distinctes : on complete en repetant la meilleure.
  while (chosen.length < count && chosen.length > 0) chosen.push(chosen[0])
  return chosen
}

// Lit une suite de repliques, chacune avec sa voix, dans l'ordre.
//
// Pourquoi ne pas tout concatener en une seule phrase : on perdrait le
// changement de voix, et la synthese enchainerait les repliques sans la
// respiration qui separe deux tours de parole.
//
// Renvoie une fonction d'annulation, a appeler si l'apprenant quitte
// l'ecran ou relance la lecture.
export function speakScript(turns, { rate = RATE_NORMAL, gapMs = 380, onTurn, onEnd } = {}) {
  if (!isSpeechAvailable() || !turns?.length) {
    onEnd?.()
    return () => {}
  }

  let voices = []
  let cancelled = false
  let timer = null

  function playTurn(index) {
    if (cancelled) return

    if (index >= turns.length) {
      onEnd?.()
      return
    }

    const turn = turns[index]
    onTurn?.(index)

    try {
      const utterance = new SpeechSynthesisUtterance(turn.text)
      utterance.lang = 'en-GB'
      utterance.rate = rate

      // Le locuteur « B » prend la seconde voix. Tout autre nom retombe sur
      // la premiere : un exposé n'a qu'un locuteur.
      const voice = turn.speaker === 'B' ? voices[1] : voices[0]
      if (voice) utterance.voice = voice

      const next = () => {
        if (cancelled) return
        // Silence entre deux repliques : sans lui, les voix se chevauchent
        // et le dialogue devient un bloc continu, impossible a suivre.
        timer = setTimeout(() => playTurn(index + 1), gapMs)
      }

      utterance.onend = next
      utterance.onerror = next

      window.speechSynthesis.speak(utterance)
    } catch {
      playTurn(index + 1)
    }
  }

  window.speechSynthesis.cancel()

  // Les voix ne sont choisies qu'une fois la liste chargee : sinon les deux
  // interlocuteurs seraient lus par la voix francaise par defaut.
  whenVoicesReady(() => {
    if (cancelled) return
    voices = pickVoices(2)
    playTurn(0)
  })

  return () => {
    cancelled = true
    if (timer) clearTimeout(timer)
    stopSpeaking()
  }
}

// Debits de lecture.
//   NORMAL : legerement ralenti — on apprend, on n'ecoute pas les infos.
//   SLOW   : pour une dictee qu'on n'arrive pas a decouper. En dessous de
//            0,6 la synthese hache les mots et devient moins comprehensible,
//            pas plus : ne pas descendre plus bas.
export const RATE_NORMAL = 0.9
export const RATE_SLOW = 0.65

// Le reglage « son » du profil coupe les effets (bips de reussite, d'erreur).
// Il ne coupe PAS cette lecture : dans une dictee, la voix n'est pas un
// habillage, c'est l'enonce de l'exercice. La couper rendrait la question
// impossible a lire.
export function speak(text, { rate = RATE_NORMAL, onEnd } = {}) {
  if (!isSpeechAvailable() || !text) return

  // Coupe toute lecture en cours : deux appuis rapides ne doivent pas
  // empiler deux phrases qui se parlent dessus.
  window.speechSynthesis.cancel()

  whenVoicesReady(() => {
    try {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-GB'
      utterance.rate = rate

      const voice = pickEnglishVoice()
      if (voice) utterance.voice = voice

      // Sert a rallumer le bouton une fois la phrase terminee. `onerror` est
      // traite comme une fin : sans cela, un echec laisserait le bouton
      // bloque sur « lecture en cours » indefiniment.
      if (onEnd) {
        utterance.onend = onEnd
        utterance.onerror = onEnd
      }

      window.speechSynthesis.speak(utterance)
    } catch {
      /* une lecture ratee ne doit jamais interrompre la lecon */
      onEnd?.()
    }
  })
}

// Arrete toute lecture en cours (quand on quitte l'ecran d'exercice).
export function stopSpeaking() {
  if (!isSpeechAvailable()) return
  try { window.speechSynthesis.cancel() } catch { /* sans effet */ }
}
