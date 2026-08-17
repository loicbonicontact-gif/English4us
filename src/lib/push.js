import { supabase } from '../supabaseClient'

// Rappel quotidien : abonnement de l'appareil, et rien d'autre.
//
// CE QUI EST STOCKÉ
// Une adresse d'abonnement fournie par le navigateur, et deux clés de
// chiffrement. Rien d'identifiant en soi — mais c'est ce qui permet
// d'écrire sur l'écran de quelqu'un, donc c'est protégé comme tel.
//
// UN ABONNEMENT PAR APPAREIL
// Un téléphone et un ordinateur donnent deux abonnements différents. Les
// confondre reviendrait à ne notifier qu'un des deux.

// Clé publique de signature. Publique par nature : elle voyage dans le code
// envoyé au navigateur. La clé PRIVÉE, elle, ne vit que dans les secrets
// Supabase et n'apparaît nulle part ici.
const VAPID_PUBLIC_KEY =
  import.meta.env.VITE_VAPID_PUBLIC_KEY || import.meta.env.E4U_VITE_VAPID_PUBLIC_KEY || ''

// Après trois leçons. Assez pour que l'application ait fait ses preuves —
// on demande APRÈS avoir rendu service, jamais avant.
export const LESSONS_BEFORE_ASKING_PUSH = 3

// Le navigateur sait-il faire ?
//
// Sur iPhone, `PushManager` n'existe QUE si l'application a été installée
// sur l'écran d'accueil. Dans un onglet Safari ordinaire, la fonction est
// absente — et il vaut mieux ne rien proposer que proposer un bouton mort.
export function isPushSupported(win = typeof window === 'undefined' ? null : window) {
  if (!win) return false
  return Boolean(
    win.Notification &&
    win.PushManager &&
    win.navigator?.serviceWorker
  )
}

// Faut-il proposer les rappels ?
//
// Quatre raisons de se taire, et elles comptent toutes :
//   - la migration n'est pas passée (`pushAskedAt === undefined`) ;
//   - on a déjà demandé — un refus navigateur est DÉFINITIF, réinsister ne
//     sert à rien et agace ;
//   - le navigateur ne sait pas faire ;
//   - l'application n'a pas encore fait ses preuves.
export function shouldAskPush({ lessonsDone, pushAskedAt, supported = true } = {}) {
  if (!supported) return false
  if (pushAskedAt === undefined) return false
  if (pushAskedAt !== null) return false
  return Number(lessonsDone) >= LESSONS_BEFORE_ASKING_PUSH
}

// La clé publique voyage en base64url ; l'API `subscribe` veut des octets.
export function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const output = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i)
  return output
}

export async function markPushAsked(userId) {
  const { error } = await supabase
    .from('profiles')
    .update({ push_asked_at: new Date().toISOString() })
    .eq('id', userId)
  if (error) throw error
}

// Demande l'autorisation, puis enregistre l'abonnement.
//
// L'appel DOIT partir d'un geste de l'apprenant : les navigateurs refusent
// une demande d'autorisation qui n'en vient pas. D'où le bouton dédié.
export async function enablePush(userId) {
  if (!VAPID_PUBLIC_KEY) {
    throw new Error("Les rappels ne sont pas configurés (clé publique absente).")
  }

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return false

  const registration = await navigator.serviceWorker.ready

  // Un abonnement peut déjà exister (réinstallation, changement de compte
  // sur le même appareil) : on le réutilise plutôt que d'en créer un second.
  const existing = await registration.pushManager.getSubscription()
  const subscription = existing || await registration.pushManager.subscribe({
    // Obligatoire : le navigateur refuse un abonnement qui pourrait servir à
    // autre chose qu'une notification visible.
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
  })

  const raw = subscription.toJSON()

  // `onConflict` sur l'adresse : le même appareil qui se réabonne remplace
  // sa ligne au lieu d'en ajouter une — sinon il recevrait deux fois chaque
  // notification.
  const { error } = await supabase.from('push_subscriptions').upsert({
    user_id: userId,
    endpoint: raw.endpoint,
    p256dh: raw.keys?.p256dh,
    auth: raw.keys?.auth
  }, { onConflict: 'endpoint' })

  if (error) throw error
  return true
}

// Coupe les rappels sur CET appareil.
//
// On désabonne le navigateur ET on supprime la ligne. Ne faire que l'un des
// deux laisserait soit une ligne morte qui fait échouer un envoi par jour,
// soit un abonnement fantôme qui continuerait de recevoir.
export async function disablePush(userId) {
  const registration = await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.getSubscription()

  if (subscription) {
    await supabase.from('push_subscriptions').delete().eq('endpoint', subscription.endpoint)
    await subscription.unsubscribe()
    return
  }

  // Pas d'abonnement local : on nettoie quand même côté base, au cas où la
  // ligne aurait survécu à une réinstallation.
  await supabase.from('push_subscriptions').delete().eq('user_id', userId)
}

// Les rappels sont-ils actifs sur cet appareil ?
export async function isPushEnabled() {
  if (!isPushSupported()) return false
  if (Notification.permission !== 'granted') return false
  const registration = await navigator.serviceWorker.ready
  return Boolean(await registration.pushManager.getSubscription())
}
