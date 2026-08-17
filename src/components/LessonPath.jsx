import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchLessons, fetchProgress, buildPath } from '../lib/lessons'
import { fetchListeningProgress, fetchPassages } from '../lib/listening'
import { fetchReadingPassages, fetchReadingProgress } from '../lib/reading'
import { fetchLessonNoteIds } from '../lib/lessonNotes'
import PathView from './PathView'
import Mascot from './Mascot'

// Conteneur : charge les lecons, les ecoutes et la progression, puis delegue
// l'affichage a PathView. Aucune mise en forme ici — c'est ce qui permet de
// previsualiser l'ecran avec des donnees de test sans toucher a Supabase.
export default function LessonPath({ profile }) {
  const userId = profile?.id
  const navigate = useNavigate()
  const [path, setPath] = useState(null)
  // Lecons ayant une fiche. Un Set vide fait disparaitre les boutons.
  const [noteIds, setNoteIds] = useState(() => new Set())
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    let active = true

    // Les ecoutes ne doivent jamais empecher le parcours de s'afficher : si
    // leurs tables n'existent pas encore, on montre les lecons seules plutot
    // qu'un ecran d'erreur. D'ou le `catch` qui renvoie une liste vide.
    const listeningOrEmpty = fetchPassages().catch(() => [])
    const listeningDoneOrEmpty = fetchListeningProgress(userId).catch(() => ({}))
    const readingOrEmpty = fetchReadingPassages().catch(() => [])
    const readingDoneOrEmpty = fetchReadingProgress(userId).catch(() => ({}))
    // Meme prudence que pour les ecoutes : tant que migration-lesson-notes
    // n'est pas passee, la table n'existe pas. On repart d'un ensemble vide,
    // donc sans aucun bouton « fiche » — plutot qu'un ecran d'erreur, ou un
    // bouton qui menerait nulle part.
    const notesOrEmpty = fetchLessonNoteIds().catch(() => new Set())

    Promise.all([
      fetchLessons(),
      fetchProgress(userId),
      listeningOrEmpty,
      listeningDoneOrEmpty,
      readingOrEmpty,
      readingDoneOrEmpty,
      notesOrEmpty
    ])
      .then(([lessons, progress, passages, listeningDone, readings, readingDone, notes]) => {
        if (!active) return
        setNoteIds(notes)
        if (lessons.length === 0) {
          setError("Aucune leçon en base. Le script supabase/seed.sql n'a pas encore été exécuté.")
        } else {
          setPath(buildPath(lessons, progress, passages, listeningDone, readings, readingDone, {
            placementLevel: profile?.placement_level ?? null
          }))
        }
      })
      .catch((err) => { if (active) setError(err.message) })
      .finally(() => { if (active) setLoading(false) })

    return () => { active = false }
  }, [userId, profile?.placement_level])

  // Faut-il proposer le test ? Seulement si la question n'a jamais été
  // tranchée. La colonne ABSENTE (`undefined`) signifie que la migration
  // n'est pas encore passée : on n'affiche alors rien, plutôt qu'un bouton
  // qui échouerait à l'enregistrement.
  const needsPlacement = profile?.placement_taken_at === null

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
      needsPlacement={needsPlacement}
      placementLevel={profile?.placement_level ?? null}
      onOpenPlacement={() => navigate('/placement')}
      noteIds={noteIds}
      onOpenNotes={(id) => navigate(`/lesson/${id}/notes`)}
      onOpen={(id) => navigate(`/lesson/${id}`)}
      onOpenListening={(id) => navigate(`/listening/${id}`)}
      onOpenReading={(id) => navigate(`/reading/${id}`)}
      onOpenExam={() => navigate('/exam')}
    />
  )
}
