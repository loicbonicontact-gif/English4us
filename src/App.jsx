import { useCallback, useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { supabase } from './supabaseClient'
import { ensureProfile, fetchProfile } from './lib/profile'
import { isSoundOn, setSoundOn } from './lib/sounds'
import Auth from './components/Auth'
import AppShell from './components/AppShell'
import LessonPath from './components/LessonPath'
import Exercise from './components/Exercise'

// Provisoire, remplace par l'ecran de profil complet a l'etape suivante.
function ProfileStub({ onSignOut }) {
  const [sound, setSound] = useState(isSoundOn())

  function toggleSound() {
    const next = !sound
    setSound(next)
    setSoundOn(next)   // le choix est retenu d'une session a l'autre
  }

  return (
    <div className="path">
      <div className="path-main">
        <p className="path-status">L'écran de profil arrive bientôt.</p>
        <button type="button" className="settings-row-btn" onClick={toggleSound} aria-pressed={sound}>
          {sound ? 'Couper les sons' : 'Activer les sons'}
        </button>
        <button type="button" className="signout-btn" onClick={onSignOut}>
          Se déconnecter
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [booting, setBooting] = useState(true)
  const [profileError, setProfileError] = useState(null)

  // Récupère la session au démarrage puis écoute les changements (login/logout).
  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session)
      setBooting(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  // Dès qu'une session existe, on garantit l'existence du profil en base.
  useEffect(() => {
    if (!session?.user) {
      setProfile(null)
      return
    }

    let active = true
    setProfileError(null)

    ensureProfile(session.user, session.user.user_metadata?.username)
      .then((data) => { if (active) setProfile(data) })
      .catch((err) => { if (active) setProfileError(err.message) })

    return () => { active = false }
  }, [session])

  // Écoute en temps réel les modifications du profil (XP, cœurs, série),
  // pour que l'en-tête se mette à jour sans rechargement de page.
  useEffect(() => {
    const userId = session?.user?.id
    if (!userId) return

    const channel = supabase
      .channel(`profile-${userId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` },
        (payload) => setProfile(payload.new)
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [session?.user?.id])

  // Rechargement manuel : filet de sécurité si le temps réel n'est pas actif
  // (la table doit être ajoutée à la publication supabase_realtime).
  const refreshProfile = useCallback(async () => {
    if (!session?.user) return
    try { setProfile(await fetchProfile(session.user.id)) } catch { /* silencieux */ }
  }, [session?.user?.id])

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  if (booting) {
    return <div className="screen-center"><p>Chargement…</p></div>
  }

  if (!session) {
    return <Auth />
  }

  return (
    <AppShell profile={profile}>
      {profileError && (
        <p className="alert alert-error" role="alert">Profil indisponible : {profileError}</p>
      )}

      {!profile && !profileError && <p className="path-status">Préparation de ton profil…</p>}

      {profile && (
        <Routes>
          <Route
            path="/dashboard"
            element={<LessonPath userId={profile.id} hearts={profile.hearts} />}
          />
          <Route
            path="/lesson/:id"
            element={<Exercise profile={profile} onProfileChange={refreshProfile} />}
          />
          <Route path="/leaderboard" element={<p className="path-status">Le classement arrive bientôt.</p>} />
          {/* Ecran de profil provisoire : il porte la deconnexion et le
              reglage du son, le temps que l'ecran complet soit construit. */}
          <Route path="/profile" element={<ProfileStub onSignOut={handleSignOut} />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      )}
    </AppShell>
  )
}
