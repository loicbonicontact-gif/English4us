import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchLessons, fetchProgress, buildPath } from '../lib/lessons'
import PathView from './PathView'
import Mascot from './Mascot'

// Conteneur : charge les lecons et la progression, puis delegue l'affichage
// a PathView. Aucune mise en forme ici — c'est ce qui permet de previsualiser
// l'ecran avec des donnees de test sans toucher a Supabase.
export default function LessonPath({ userId, hearts }) {
  const navigate = useNavigate()
  const [path, setPath] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    let active = true

    Promise.all([fetchLessons(), fetchProgress(userId)])
      .then(([lessons, progress]) => {
        if (!active) return
        if (lessons.length === 0) {
          setError("Aucune leçon en base. Le script supabase/seed.sql n'a pas encore été exécuté.")
        } else {
          setPath(buildPath(lessons, progress))
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

  return <PathView path={path} hearts={hearts} onOpen={(id) => navigate(`/lesson/${id}`)} />
}
