import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { levelProgress } from '../lib/gamification'
import { isSoundOn, setSoundOn } from '../lib/sounds'
import { deleteRating, fetchRating } from '../lib/feedback'
import { disablePush, enablePush, isPushEnabled, isPushSupported } from '../lib/push'
import ProfileView from './ProfileView'

// Met en forme la date d'inscription : « août 2026 ».
function formatMonth(iso) {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

// Conteneur du profil : lit la progression pour en deduire le nombre de
// lecons terminees et la precision moyenne, que le profil ne stocke pas.
export default function Profile({ profile, onSignOut }) {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ lessonsDone: 0, accuracy: null })
  const [soundOn, setSound] = useState(isSoundOn())
  // `null` = pas de note, ou table absente (migration pas passee). Dans les
  // deux cas la ligne ne s'affiche pas : rien a retirer.
  const [rating, setRating] = useState(null)
  const [pushOn, setPushOn] = useState(false)

  useEffect(() => {
    if (!profile?.id) return
    let active = true
    fetchRating(profile.id)
      .then((value) => { if (active) setRating(value) })
      .catch(() => { /* table absente : aucune note a montrer */ })

    isPushEnabled()
      .then((on) => { if (active) setPushOn(on) })
      .catch(() => { /* navigateur incapable : l'interrupteur reste masque */ })

    supabase
      .from('user_progress')
      .select('score, completed')
      .eq('user_id', profile.id)
      .eq('completed', true)
      .then(({ data, error }) => {
        if (!active || error) return
        const rows = data || []
        const scores = rows.map((r) => r.score).filter((s) => typeof s === 'number')
        setStats({
          lessonsDone: rows.length,
          accuracy: scores.length
            ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
            : null
        })
      })

    return () => { active = false }
  }, [profile?.id])

  // Le choix est retenu d'une session a l'autre (localStorage)
  function toggleSound() {
    const next = !soundOn
    setSound(next)
    setSoundOn(next)
  }

  return (
    <ProfileView
      username={profile.username}
      memberSince={formatMonth(profile.created_at)}
      level={levelProgress(profile.xp ?? 0)}
      lessonsDone={stats.lessonsDone}
      streak={profile.streak_count ?? 0}
      accuracy={stats.accuracy}
      soundOn={soundOn}
      onToggleSound={toggleSound}
      onSignOut={onSignOut}
      placementLevel={profile.placement_level ?? null}
      // Colonne absente = migration-placement.sql pas encore passe : on
      // masque la ligne plutot que d'offrir un bouton qui echouerait.
      placementAvailable={profile.placement_taken_at !== undefined}
      onOpenPlacement={() => navigate('/placement')}
      rating={rating}
      onDeleteRating={() => {
        // Retire de l'ecran tout de suite, puis en base. L'inverse ferait
        // attendre le reseau pour un geste qui doit paraitre immediat — et
        // en cas d'echec, la note reapparaitra au prochain chargement.
        setRating(null)
        deleteRating(profile.id).catch(() => { /* silencieux */ })
      }}
      onOpenPrivacy={() => navigate('/confidentialite')}
      // Colonne absente = migration-push.sql pas encore passe.
      pushAvailable={isPushSupported() && profile.push_asked_at !== undefined}
      pushOn={pushOn}
      onTogglePush={async () => {
        try {
          if (pushOn) {
            await disablePush(profile.id)
            setPushOn(false)
          } else {
            // `enablePush` renvoie faux si l'apprenant refuse la fenetre du
            // navigateur : l'interrupteur doit alors rester eteint, sinon il
            // afficherait un etat faux.
            setPushOn(await enablePush(profile.id))
          }
        } catch {
          setPushOn(false)
        }
      }}
    />
  )
}
