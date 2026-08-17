import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { fetchLessonNote, readExamples } from '../lib/lessonNotes'
import { isSpeechAvailable, speak, stopSpeaking } from '../lib/speech'
import Mascot from './Mascot'
import LessonNotesView from './LessonNotesView'

// Conteneur de la fiche : chargement, puis affichage delegue.
//
// La fiche n'enregistre RIEN. La consulter n'est pas une activite notee :
// pas d'XP, pas de progression, pas d'entree dans la file de revision. Lire
// la regle n'est pas la meme chose que la savoir, et faire croire l'inverse
// gonflerait la progression avec du travail qui n'a pas eu lieu.
export default function LessonNotes() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [lesson, setLesson] = useState(null)
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    setLoading(true)

    Promise.all([
      supabase.from('lessons').select('id, title, level, unit_order').eq('id', id).single(),
      fetchLessonNote(id)
    ])
      .then(([lessonRes, noteData]) => {
        if (!active) return
        if (lessonRes.error) throw lessonRes.error
        setLesson(lessonRes.data)
        setNote(noteData)
      })
      .catch((err) => { if (active) setError(err.message) })
      .finally(() => { if (active) setLoading(false) })

    return () => { active = false }
  }, [id])

  // Quitter la fiche coupe la voix : sans cela, l'exemple continue de se
  // lire sur l'ecran suivant.
  useEffect(() => stopSpeaking, [])

  if (loading) {
    return (
      <div className="notes-screen notes-screen-center">
        <Mascot mood="thinking" size={90} />
        <p className="path-status">Chargement de la fiche…</p>
      </div>
    )
  }

  // Deux absences differentes, et le message doit dire laquelle :
  //   - une erreur de chargement (table absente, reseau) ;
  //   - une lecon qui n'a simplement pas de fiche.
  // Dans les deux cas on propose de commencer la lecon quand meme : la
  // fiche est un confort, jamais un passage oblige.
  if (error || !note) {
    return (
      <div className="notes-screen notes-screen-center">
        <Mascot mood="sad" size={90} />
        <p className="path-status">
          {error
            ? `Fiche indisponible : ${error}`
            : "Cette leçon n'a pas encore de fiche."}
        </p>
        <button type="button" className="btn-wide is-primary" onClick={() => navigate(`/lesson/${id}`)}>
          Commencer la leçon
        </button>
        <button type="button" className="notes-back" onClick={() => navigate('/dashboard')}>
          Retour au parcours
        </button>
      </div>
    )
  }

  return (
    <LessonNotesView
      lesson={lesson}
      note={note}
      examples={readExamples(note.examples)}
      onStart={() => navigate(`/lesson/${id}`)}
      onQuit={() => navigate('/dashboard')}
      // Sans synthese vocale (certains navigateurs), le bouton d'ecoute ne
      // rendrait rien : il vaut mieux qu'il n'existe pas.
      onSpeak={isSpeechAvailable() ? speak : null}
    />
  )
}
