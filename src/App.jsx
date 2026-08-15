import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { ensureProfile } from './lib/profile'
import Auth from './components/Auth'

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
    <div className="screen-center">
      <div className="auth-card">
        <h1>Connecté 🎉</h1>
        {profileError && (
          <p className="alert alert-error" role="alert">
            Profil indisponible : {profileError}
          </p>
        )}
        {profile ? (
          <ul className="profile-summary">
            <li><strong>Pseudo</strong><span>{profile.username}</span></li>
            <li><strong>Niveau</strong><span>{profile.level}</span></li>
            <li><strong>XP</strong><span>{profile.xp}</span></li>
            <li><strong>Cœurs</strong><span>{'❤️'.repeat(profile.hearts)}</span></li>
            <li><strong>Série</strong><span>{profile.streak_count} jour(s)</span></li>
          </ul>
        ) : (
          !profileError && <p>Préparation de ton profil…</p>
        )}
        <p className="field-hint">Le parcours de leçons arrive à la prochaine étape.</p>
        <button className="btn btn-secondary btn-block" onClick={handleSignOut}>
          Se déconnecter
        </button>
      </div>
    </div>
  )
}
