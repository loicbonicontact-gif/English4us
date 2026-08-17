import { useCallback, useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { supabase } from './supabaseClient'
import { ensureProfile, fetchProfile } from './lib/profile'
import { countDueReviews } from './lib/reviews'
import { primeVoices } from './lib/speech'
import Auth from './components/Auth'
import AppShell from './components/AppShell'
import OfflineBanner from './components/OfflineBanner'
import LessonPath from './components/LessonPath'
import Exercise from './components/Exercise'
import LessonNotes from './components/LessonNotes'
import Profile from './components/Profile'
import Review from './components/Review'
import Listening from './components/Listening'
import Reading from './components/Reading'
import Exam from './components/Exam'
import Placement from './components/Placement'
import Privacy from './components/Privacy'

export default function App() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [booting, setBooting] = useState(true)
  const [profileError, setProfileError] = useState(null)
  const [dueCount, setDueCount] = useState(0)

  // Charge la liste des voix dès le démarrage. Sans cela, la première phrase
  // anglaise de la session serait lue par la voix par défaut du système —
  // souvent une voix française, qui rend l'anglais incompréhensible.
  useEffect(() => { primeVoices() }, [])

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
    // Une leçon ou une révision terminée change la file : le compteur de
    // l'onglet doit suivre, sinon la pastille ment jusqu'au rechargement.
    try { setDueCount(await countDueReviews(session.user.id)) } catch { /* silencieux */ }
  }, [session?.user?.id])

  // Compte des révisions dues au démarrage.
  useEffect(() => {
    const userId = session?.user?.id
    if (!userId) { setDueCount(0); return }

    let active = true
    countDueReviews(userId)
      .then((count) => { if (active) setDueCount(count) })
      .catch(() => { /* la table peut ne pas encore exister : pas de pastille */ })

    return () => { active = false }
  }, [session?.user?.id])

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  if (booting) {
    return <div className="screen-center"><p>Chargement…</p></div>
  }

  // Le bandeau hors ligne coiffe TOUT, y compris l'ecran de connexion :
  // c'est la, avant d'etre connecte, que l'absence de reseau est la plus
  // deroutante — le formulaire s'affiche mais ne peut pas aboutir.
  if (!session) {
    return (
      <>
        <OfflineBanner />
        <Routes>
          <Route path="/confidentialite" element={<Privacy />} />
          <Route path="*" element={<Auth />} />
        </Routes>
      </>
    )
  }

  return (
    <AppShell profile={profile} dueCount={dueCount} banner={<OfflineBanner />}>
      {profileError && (
        <p className="alert alert-error" role="alert">Profil indisponible : {profileError}</p>
      )}

      {!profile && !profileError && <p className="path-status">Préparation de ton profil…</p>}

      {profile && (
        <Routes>
          <Route
            path="/dashboard"
            element={<LessonPath profile={profile} />}
          />
          <Route
            path="/placement"
            element={<Placement profile={profile} onProfileChange={refreshProfile} />}
          />
          {/* La fiche AVANT la leçon. Elle est déclarée avant `/lesson/:id`
              pour la lisibilité ; react-router compare les segments, l'ordre
              ne change rien ici. */}
          <Route path="/lesson/:id/notes" element={<LessonNotes />} />
          <Route
            path="/lesson/:id"
            element={<Exercise profile={profile} onProfileChange={refreshProfile} />}
          />
          <Route
            path="/reviews"
            element={<Review profile={profile} onProfileChange={refreshProfile} />}
          />
          <Route
            path="/listening/:id"
            element={<Listening profile={profile} onProfileChange={refreshProfile} />}
          />
          <Route
            path="/reading/:id"
            element={<Reading profile={profile} onProfileChange={refreshProfile} />}
          />
          <Route path="/exam" element={<Exam profile={profile} />} />
          <Route path="/confidentialite" element={<Privacy />} />
          <Route path="/profile" element={<Profile profile={profile} onSignOut={handleSignOut} />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      )}
    </AppShell>
  )
}
