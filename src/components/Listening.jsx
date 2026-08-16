import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { completeListening, fetchPassage } from '../lib/listening'
import { recordAnswer } from '../lib/reviews'
import { stopSpeaking } from '../lib/speech'
import { isMissingTable, missingTableMessage } from '../lib/dbErrors'
import { soundComplete, soundCorrect, soundTap, soundWrong } from '../lib/sounds'
import Mascot from './Mascot'
import ListeningView from './ListeningView'
import ListeningEnd from './ListeningEnd'

// Conteneur d'un passage de comprehension orale : chargement, score,
// enregistrement. L'affichage est delegue a ListeningView.
//
// Aucun coeur n'est perdu ici. Rater une question de comprehension orale
// est le cas normal quand on progresse : la sanction ferait fuir avant que
// l'oreille ait eu le temps de se faire.
export default function Listening({ profile, onProfileChange }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [passage, setPassage] = useState(null)
  const [questions, setQuestions] = useState([])
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [verdict, setVerdict] = useState(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)
  const [earned, setEarned] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    setLoading(true)

    fetchPassage(id)
      .then(({ passage: p, questions: q }) => {
        if (!active) return
        if (!q.length) throw new Error('Ce passage ne contient aucune question.')
        setPassage(p)
        setQuestions(q)
      })
      .catch((err) => {
        if (!active) return
        setError(isMissingTable(err)
          ? missingTableMessage('migration-listening.sql puis seed-listening.sql')
          : err.message)
      })
      .finally(() => { if (active) setLoading(false) })

    return () => { active = false }
  }, [id])

  // Quitter l'ecran coupe toute lecture en cours.
  useEffect(() => stopSpeaking, [])

  const current = questions[index]

  function handleValidate() {
    if (!current || verdict) return

    const right = answer === current.correct_answer

    if (right) {
      soundCorrect()
      setVerdict('right')
      setCorrectCount((n) => n + 1)
    } else {
      soundWrong()
      setVerdict('wrong')
    }

    // Une question d'ecoute ratee rejoint la file de revision, au meme titre
    // qu'un exercice de lecon : c'est le meme oubli qui la guette.
    if (profile) {
      recordAnswer(profile.id, current.id, right).catch(() => { /* silencieux */ })
    }
  }

  async function handleNext() {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1)
      setAnswer('')
      setVerdict(null)
      return
    }

    const score = Math.round((correctCount / questions.length) * 100)
    if (score >= 60) soundComplete()
    setFinished(true)

    if (!profile) return
    try {
      const result = await completeListening(profile.id, passage, score, profile)
      setEarned(result.earned)
      onProfileChange?.()
    } catch (err) {
      setError(`Progression non enregistrée : ${err.message}`)
    }
  }

  if (loading) {
    return (
      <div className="lesson-screen lesson-screen-center">
        <Mascot mood="thinking" size={90} />
        <p className="path-status">Chargement du passage…</p>
      </div>
    )
  }

  if (error && !passage) {
    return (
      <div className="lesson-screen lesson-screen-center">
        <p className="alert alert-error" role="alert">{error}</p>
        <button type="button" className="btn-wide is-dark" onClick={() => navigate('/listening')}>
          Retour aux écoutes
        </button>
      </div>
    )
  }

  if (finished) {
    const score = Math.round((correctCount / questions.length) * 100)
    return (
      <>
        {error && <p className="alert alert-error" role="alert">{error}</p>}
        <ListeningEnd
          passage={passage}
          score={score}
          correctCount={correctCount}
          total={questions.length}
          earned={earned}
          onBack={() => navigate('/listening')}
        />
      </>
    )
  }

  return (
    <ListeningView
      passage={passage}
      questions={questions}
      started={started}
      index={index}
      answer={answer}
      verdict={verdict}
      onStart={() => setStarted(true)}
      onAnswer={(value) => { if (!verdict) { soundTap(); setAnswer(value) } }}
      onValidate={handleValidate}
      onNext={handleNext}
      onQuit={() => navigate('/listening')}
    />
  )
}
