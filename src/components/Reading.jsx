import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { completeReading, fetchReadingPassage } from '../lib/reading'
import { recordAnswer } from '../lib/reviews'
import { isMissingTable, missingTableMessage } from '../lib/dbErrors'
import { PASS_SCORE } from '../lib/passageProgress'
import { soundComplete, soundCorrect, soundTap, soundWrong } from '../lib/sounds'
import Mascot from './Mascot'
import ReadingView from './ReadingView'
import PassageEnd from './PassageEnd'

// Conteneur d'un texte de comprehension ecrite.
//
// Aucun coeur n'est perdu : comme pour l'ecoute, se tromper en cherchant
// une information dans un document est le cas normal quand on apprend.
export default function Reading({ profile, onProfileChange }) {
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

    fetchReadingPassage(id)
      .then(({ passage: p, questions: q }) => {
        if (!active) return
        if (!q.length) throw new Error('Ce document ne contient aucune question.')
        setPassage(p)
        setQuestions(q)
      })
      .catch((err) => {
        if (!active) return
        setError(isMissingTable(err)
          ? missingTableMessage('migration-reading.sql puis seed-reading.sql')
          : err.message)
      })
      .finally(() => { if (active) setLoading(false) })

    return () => { active = false }
  }, [id])

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
    if (score >= PASS_SCORE) soundComplete()
    setFinished(true)

    if (!profile) return
    try {
      const result = await completeReading(profile.id, passage, score, profile)
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
        <p className="path-status">Chargement du document…</p>
      </div>
    )
  }

  if (error && !passage) {
    return (
      <div className="lesson-screen lesson-screen-center">
        <p className="alert alert-error" role="alert">{error}</p>
        <button type="button" className="btn-wide is-dark" onClick={() => navigate('/dashboard')}>
          Retour au parcours
        </button>
      </div>
    )
  }

  if (finished) {
    const score = Math.round((correctCount / questions.length) * 100)
    return (
      <>
        {error && <p className="alert alert-error" role="alert">{error}</p>}
        <PassageEnd
          kind="reading"
          score={score}
          correctCount={correctCount}
          total={questions.length}
          earned={earned}
          onBack={() => navigate('/dashboard')}
        />
      </>
    )
  }

  return (
    <ReadingView
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
      onQuit={() => navigate('/dashboard')}
    />
  )
}
