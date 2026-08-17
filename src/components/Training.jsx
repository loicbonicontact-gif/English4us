import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchLessons, fetchProgress, buildPath } from '../lib/lessons'
import { fetchListeningProgress, fetchPassages } from '../lib/listening'
import { fetchReadingPassages, fetchReadingProgress } from '../lib/reading'
import TrainingView from './TrainingView'
import Mascot from './Mascot'

// Conteneur : charge exactement les memes donnees que le parcours et
// applique `buildPath`, puis met les mises en pratique a plat.
//
// Passer par `buildPath` plutot que d'interroger les passages directement
// n'est pas un detour : c'est lui qui decide ce qui est ouvert. Sans lui,
// cet ecran serait une porte derobee vers du contenu verrouille, et les
// deux ecrans se contrediraient.
function flatten(path, kind) {
  return path.byLevel.flatMap((group) =>
    group.items.filter((item) => item.kind === kind)
  )
}

export default function Training({ userId }) {
  const navigate = useNavigate()
  const [path, setPath] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    let active = true

    // Meme prudence que dans le parcours : un module dont les tables
    // n'existent pas encore rend une liste vide, il ne fait pas tomber
    // l'ecran entier.
    Promise.all([
      fetchLessons(),
      fetchProgress(userId),
      fetchPassages().catch(() => []),
      fetchListeningProgress(userId).catch(() => ({})),
      fetchReadingPassages().catch(() => []),
      fetchReadingProgress(userId).catch(() => ({}))
    ])
      .then(([lessons, progress, passages, listeningDone, readings, readingDone]) => {
        if (!active) return
        setPath(buildPath(lessons, progress, passages, listeningDone, readings, readingDone))
      })
      .catch((err) => { if (active) setError(err.message) })
      .finally(() => { if (active) setLoading(false) })

    return () => { active = false }
  }, [userId])

  if (loading) {
    return (
      <div className="path-loading">
        <Mascot mood="thinking" size={78} />
        <p>Chargement de ton entraînement…</p>
      </div>
    )
  }

  if (error) return <p className="alert alert-error" role="alert">{error}</p>
  if (!path) return null

  return (
    <TrainingView
      listening={flatten(path, 'listening')}
      reading={flatten(path, 'reading')}
      onOpenExam={() => navigate('/exam')}
      onOpenListening={(id) => navigate(`/listening/${id}`)}
      onOpenReading={(id) => navigate(`/reading/${id}`)}
    />
  )
}
