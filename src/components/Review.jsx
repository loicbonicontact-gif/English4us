import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  completeReviewSession,
  countDueReviews,
  fetchDueReviews,
  recordAnswer
} from '../lib/reviews'
import { isCorrect } from '../lib/answers'
import { speak } from '../lib/speech'
import { soundComplete, soundCorrect, soundTap, soundWrong } from '../lib/sounds'
import Mascot from './Mascot'
import ExerciseView from './ExerciseView'
import ReviewEnd from './ReviewEnd'

// Session de révision : rejoue les exercices dont l'échéance est arrivée.
//
// Mêmes écrans qu'une leçon (ExerciseView est réutilisé tel quel), mais deux
// différences de fond : aucun cœur n'est perdu, et le résultat déplace
// l'exercice dans la file au lieu de marquer une leçon terminée.
export default function Review({ profile, onProfileChange }) {
  const navigate = useNavigate()

  const [items, setItems] = useState([])
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [verdict, setVerdict] = useState(null)
  const [shake, setShake] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)
  const [remaining, setRemaining] = useState(0)
  const [xpEarned, setXpEarned] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const userId = profile?.id

  const load = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError(null)
    try {
      const due = await fetchDueReviews(userId)
      setItems(due)
      setIndex(0)
      setAnswer('')
      setVerdict(null)
      setCorrectCount(0)
      setFinished(false)
    } catch (err) {
      // 42P01 = la table n'existe pas : la migration n'a pas encore été
      // lancée. Message explicite plutôt qu'une erreur Postgres brute.
      setError(err.code === '42P01'
        ? "La file de révision n'existe pas encore en base. Lance supabase/migration-review-queue.sql dans l'éditeur SQL Supabase."
        : err.message)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { load() }, [load])

  const current = items[index]?.exercise
  const isLast = index === items.length - 1

  function handleValidate() {
    if (!current || verdict) return

    const right = current.type === 'qcm'
      ? answer === current.correct_answer
      : isCorrect(answer, current.correct_answer)

    if (right) {
      soundCorrect()
      setVerdict('right')
      setCorrectCount((n) => n + 1)
    } else {
      soundWrong()
      setVerdict('wrong')
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }

    // Déplace l'exercice dans la file : monté d'un palier s'il est su,
    // ramené à demain sinon.
    recordAnswer(userId, current.id, right).catch(() => { /* silencieux */ })
  }

  async function handleNext() {
    if (!isLast) {
      setIndex((i) => i + 1)
      setAnswer('')
      setVerdict(null)
      return
    }

    soundComplete()
    setFinished(true)

    if (!profile) return
    try {
      const result = await completeReviewSession(userId, profile, correctCount)
      setXpEarned(result.xpEarned)
      onProfileChange?.()
    } catch (err) {
      setError(`XP non enregistrés : ${err.message}`)
    }

    // Ce qui reste dû après cette session : la file a pu se recharger si des
    // exercices ratés à l'instant reviennent le jour même — ils ne reviennent
    // qu'à J+1, donc ce compteur descend bien vers zéro.
    try { setRemaining(await countDueReviews(userId)) } catch { setRemaining(0) }
  }

  if (loading) {
    return (
      <div className="lesson-screen lesson-screen-center">
        <Mascot mood="thinking" size={90} />
        <p className="path-status">Préparation de ta révision…</p>
      </div>
    )
  }

  if (error && !finished && items.length === 0) {
    return (
      <div className="lesson-screen lesson-screen-center">
        <p className="alert alert-error" role="alert">{error}</p>
        <button type="button" className="btn-wide is-dark" onClick={() => navigate('/dashboard')}>
          Retour au parcours
        </button>
      </div>
    )
  }

  // File vide : ce n'est pas une erreur, c'est le but à atteindre.
  if (items.length === 0) {
    return (
      <div className="review-empty">
        <Mascot mood="happy" size={96} />
        <h1 className="review-end-title">Rien à revoir</h1>
        <p className="review-end-sub">
          Tes erreurs passées sont à jour. Fais une leçon : ce que tu rateras
          reviendra ici demain, puis de plus en plus rarement.
        </p>
        <button type="button" className="btn-wide is-primary" onClick={() => navigate('/dashboard')}>
          Aller au parcours
        </button>
      </div>
    )
  }

  if (finished) {
    return (
      <>
        {error && <p className="alert alert-error" role="alert">{error}</p>}
        <ReviewEnd
          correctCount={correctCount}
          total={items.length}
          xpEarned={xpEarned}
          remaining={remaining}
          onBack={() => navigate('/dashboard')}
          onAgain={load}
        />
      </>
    )
  }

  return (
    <ExerciseView
      mode="review"
      exercise={current}
      index={index}
      total={items.length}
      answer={answer}
      verdict={verdict}
      shake={shake}
      hearts={profile?.hearts ?? 0}
      breakingIndex={null}
      isLast={isLast}
      onAnswer={(value) => { if (!verdict) { if (current.type === 'qcm') soundTap(); setAnswer(value) } }}
      onValidate={handleValidate}
      onNext={handleNext}
      onQuit={() => navigate('/dashboard')}
      onSpeak={speak}
    />
  )
}
