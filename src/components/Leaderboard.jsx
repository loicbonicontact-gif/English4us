import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import LeaderboardView from './LeaderboardView'
import Mascot from './Mascot'

const TOP_SIZE = 20

// Conteneur du classement. Les profils sont lisibles par tous (policy
// « Utilisateurs lisent tous les profils »), le tri se fait donc en base.
export default function Leaderboard({ profile }) {
  const [rows, setRows] = useState(null)
  const [total, setTotal] = useState(0)
  const [myRank, setMyRank] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const { data, error: topError } = await supabase
          .from('profiles')
          .select('id, username, xp')
          .order('xp', { ascending: false })
          .limit(TOP_SIZE)
        if (topError) throw topError

        // Nombre total d'apprenants, sans rapatrier toutes les lignes.
        const { count, error: countError } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
        if (countError) throw countError

        // Rang = nombre de profils strictement au-dessus, + 1.
        const { count: above, error: rankError } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .gt('xp', profile?.xp ?? 0)
        if (rankError) throw rankError

        if (!active) return
        setRows(data || [])
        setTotal(count ?? 0)
        setMyRank((above ?? 0) + 1)
      } catch (err) {
        if (active) setError(err.message)
      }
    }

    load()
    return () => { active = false }
  }, [profile?.id, profile?.xp])

  if (error) return <p className="alert alert-error" role="alert">Classement indisponible : {error}</p>

  if (!rows) {
    return (
      <div className="path-loading">
        <Mascot mood="thinking" size={78} />
        <p>Chargement du classement…</p>
      </div>
    )
  }

  return (
    <LeaderboardView
      rows={rows}
      me={profile}
      myRank={myRank}
      total={total}
    />
  )
}
