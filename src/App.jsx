import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { ensureProfile } from './lib/profile'
import Auth from './components/Auth'
import Navbar from './components/Navbar'
import LessonPath from './components/LessonPath'

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

  // Écoute en temps réel les modifications du profil (XP, cœurs, série).
  // Ainsi la Navbar se met à jour toute seule après une leçon terminée,
  // sans rechargement de page.
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
    <>
      <Navbar profile={profile} onSignOut={handleSignOut} />
      <main>
        {profileError && (
          <p className="alert alert-error" role="alert">
            Profil indisponible : {profileError}
          </p>
        )}
        {profile
          ? <LessonPath userId={profile.id} />
          : !profileError && <p className="path-status">Préparation de ton profil…</p>}
      </main>
    </>
  )
}
