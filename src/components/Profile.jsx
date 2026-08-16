import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { levelProgress } from '../lib/gamification'
import { isSoundOn, setSoundOn } from '../lib/sounds'
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
  const [stats, setStats] = useState({ lessonsDone: 0, accuracy: null })
  const [soundOn, setSound] = useState(isSoundOn())

  useEffect(() => {
    if (!profile?.id) return
    let active = true

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
    />
  )
}
