// État de la connexion, et rien d'autre.
//
// POURQUOI CE FICHIER EXISTE
// Le service worker rend l'interface disponible hors ligne. Mais une
// application qui s'ouvre normalement sans connexion MENT par omission :
// l'apprenant tape sa réponse, rien ne s'enregistre, et il ne comprend pas
// pourquoi. Le bandeau qui s'appuie sur ces fonctions est la contrepartie
// honnête du mode hors ligne.
//
// Tout est injectable (`nav`, `target`) pour rester testable sans navigateur.

// `navigator.onLine` répond faux positif : il dit « connecté » dès qu'une
// interface réseau existe, même derrière un portail wifi qui ne mène nulle
// part. Il est en revanche FIABLE dans l'autre sens — quand il dit « hors
// ligne », il l'est. On ne s'en sert donc que pour détecter l'absence.
export function isOffline(nav = typeof navigator === 'undefined' ? null : navigator) {
  if (!nav || typeof nav.onLine !== 'boolean') return false
  return nav.onLine === false
}

// Prévient à chaque changement d'état. Renvoie la fonction de désinscription
// — sans elle, un composant démonté continuerait de réagir.
export function subscribeToNetwork(handler, target = typeof window === 'undefined' ? null : window) {
  if (!target?.addEventListener) return () => {}

  const online = () => handler(false)
  const offline = () => handler(true)

  target.addEventListener('online', online)
  target.addEventListener('offline', offline)

  return () => {
    target.removeEventListener('online', online)
    target.removeEventListener('offline', offline)
  }
}

// Ce que le bandeau annonce.
//
// Le texte évite deux fautes :
//   - promettre ce qu'on ne tient pas (« tes réponses seront enregistrées ») ;
//   - alarmer (« erreur », « échec »). Perdre le réseau dans un train n'est
//     pas une panne de l'application.
export const OFFLINE_MESSAGE =
  'Pas de connexion. Tu peux lire ce qui est déjà ouvert ; ta progression reprendra dès le retour du réseau.'
