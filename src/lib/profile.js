import { supabase } from '../supabaseClient'

// Récupère le profil d'un utilisateur, ou null s'il n'existe pas encore.
export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

// Génère un pseudo unique à partir de l'email, en cas de collision.
async function buildUniqueUsername(base) {
  const clean = (base || 'learner').toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20) || 'learner'

  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = attempt === 0 ? clean : `${clean}${Math.floor(Math.random() * 10000)}`
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', candidate)
      .maybeSingle()

    if (error) throw error
    if (!data) return candidate
  }
  // Dernier recours : suffixe temporel, collision quasi impossible
  return `${clean}${Date.now().toString().slice(-6)}`
}

// Crée le profil s'il n'existe pas encore.
// Appelé après chaque connexion : couvre le cas où l'inscription
// exige une confirmation par email (pas de session au moment du signUp,
// donc l'insertion serait refusée par la RLS).
export async function ensureProfile(user, preferredUsername) {
  const existing = await fetchProfile(user.id)
  if (existing) return existing

  const username = await buildUniqueUsername(
    preferredUsername || user.email?.split('@')[0]
  )

  const { data, error } = await supabase
    .from('profiles')
    .insert({ id: user.id, username })
    .select()
    .single()

  if (error) throw error
  return data
}
