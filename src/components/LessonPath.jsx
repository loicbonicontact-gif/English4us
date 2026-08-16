import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchLessons, fetchProgress, buildPath } from '../lib/lessons'
import { fetchListeningProgress, fetchPassages } from '../lib/listening'
import PathView from './PathView'
import Mascot from './Mascot'

// Conteneur : charge les lecons, les ecoutes et la progression, puis delegue
// l'affichage a PathView. Aucune mise en forme ici — c'est ce qui permet de
// previsualiser l'ecran avec des donnees de test sans toucher a Supabase.
export default function LessonPath({ userId }) {
  const navigate = useNavigate()
  const [path, setPath] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    let active = true

    // Les ecoutes ne doivent jamais empecher le parcours de s'afficher : si
    // leurs tables n'existent pas encore, on montre les lecons seules plutot
    // qu'un ecran d'erreur. D'ou le `catch` qui renvoie une liste vide.
    const passagesOrEmpty = fetchPassages().catch(() => [])
    const listeningDoneOrEmpty = fetchListeningProgress(userId).catch(() => ({}))

    Promise.all([fetchLessons(), fetchProgress(userId), passagesOrEmpty, listeningDoneOrEmpty])
      .then(([lessons, progress, passages, listeningDone]) => {
        if (!active) return
        if (lessons.length === 0) {
          setError("Aucune leçon en base. Le script supabase/seed.sql n'a pas encore été exécuté.")
        } else {
          setPath(buildPath(lessons, progress, passages, listeningDone))
        }
      })
      .catch((err) => { if (active) setError(err.message) })
      .finally(() => { if (active) setLoading(false) })

    return () => { active = false }
  }, [userId])

  if (loading) {
    return (
      <div className="path-loading">
        <Mascot mood="thinking" size={78} />
        <p>Chargement de ton parcours…</p>
      </div>
    )
  }

  if (error) return <p className="alert alert-error" role="alert">{error}</p>
  if (!path) return null

  return (
    <PathView
      path={path}
      onOpen={(id) => navigate(`/lesson/${id}`)}
      onOpenListening={(id) => navigate(`/listening/${id}`)}
    />
  )
}
