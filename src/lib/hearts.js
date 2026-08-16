import { supabase } from '../supabaseClient'

// ============================================
// Cœurs — recharge automatique
//
// Jusqu'ici, un cœur perdu l'était définitivement : arrivé à zéro,
// l'apprenant ne pouvait plus jamais faire une leçon. Ce n'était pas un
// choix, c'était un oubli.
//
// Principe : un cœur revient toutes les 4 heures. Le calcul ne se fait pas
// avec une minuterie — une minuterie ne tourne pas quand l'application est
// fermée, et c'est justement là que le temps passe. On enregistre l'instant
// où le compte est descendu, et on en déduit à l'ouverture combien de cœurs
// ont eu le temps de revenir.
// ============================================

export const MAX_HEARTS = 5
export const REFILL_MS = 4 * 60 * 60 * 1000   // 4 heures

// Calcule l'état des cœurs à un instant donné. Fonction pure : c'est elle
// qui est testée, pas l'accès à la base.
//
// Renvoie aussi `msUntilNext`, le temps restant avant le prochain cœur,
// pour pouvoir l'afficher plutôt que de laisser l'apprenant deviner.
export function computeRefill(hearts, updatedAtISO, now = Date.now()) {
  const current = Math.max(0, Math.min(MAX_HEARTS, hearts ?? MAX_HEARTS))

  if (current >= MAX_HEARTS) {
    return { hearts: MAX_HEARTS, updatedAt: null, gained: 0, msUntilNext: 0 }
  }

  // Sans date de référence, on ne peut rien déduire : on démarre le compteur
  // maintenant plutôt que d'offrir des cœurs au hasard.
  const since = updatedAtISO ? new Date(updatedAtISO).getTime() : now
  if (Number.isNaN(since)) {
    return { hearts: current, updatedAt: new Date(now).toISOString(), gained: 0, msUntilNext: REFILL_MS }
  }

  const elapsed = Math.max(0, now - since)
  const gained = Math.floor(elapsed / REFILL_MS)
  const hearts_ = Math.min(MAX_HEARTS, current + gained)

  if (hearts_ >= MAX_HEARTS) {
    return { hearts: MAX_HEARTS, updatedAt: null, gained: MAX_HEARTS - current, msUntilNext: 0 }
  }

  // On avance la date de référence du nombre exact de cœurs rendus, sans
  // arrondir à maintenant : sinon les minutes déjà écoulées vers le cœur
  // suivant seraient perdues à chaque ouverture de l'application, et le
  // compteur ne descendrait jamais.
  const updatedAt = new Date(since + gained * REFILL_MS).toISOString()

  return {
    hearts: hearts_,
    updatedAt,
    gained,
    msUntilNext: REFILL_MS - (elapsed - gained * REFILL_MS)
  }
}

// Formate le temps restant pour l'affichage : « 3 h 12 » ou « 47 min ».
export function formatWait(ms) {
  if (ms <= 0) return null

  const totalMinutes = Math.ceil(ms / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours === 0) return `${minutes} min`
  if (minutes === 0) return `${hours} h`
  return `${hours} h ${String(minutes).padStart(2, '0')}`
}

// Applique la recharge en base si des cœurs ont été gagnés.
// Renvoie le profil à jour, ou le profil d'origine si rien n'a changé.
export async function applyRefill(profile) {
  if (!profile) return profile

  const result = computeRefill(profile.hearts, profile.hearts_updated_at)
  if (result.gained === 0) return profile

  const { error } = await supabase
    .from('profiles')
    .update({ hearts: result.hearts, hearts_updated_at: result.updatedAt })
    .eq('id', profile.id)

  if (error) throw error

  return { ...profile, hearts: result.hearts, hearts_updated_at: result.updatedAt }
}
