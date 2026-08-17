import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assembleExam, examDuration, formatCountdown, gradeExam } from '../lib/exam'
import { isMissingTable, missingTableMessage } from '../lib/dbErrors'
import { stopSpeaking } from '../lib/speech'
import { soundComplete, soundTap } from '../lib/sounds'
import Mascot from './Mascot'
import ExamView from './ExamView'
import ExamResult from './ExamResult'
import { IconClose, IconHeadphones, IconRead } from './Icons'

// Examen blanc chronometre.
//
// Aucun coeur, aucune correction en cours de route, aucun retour en
// arriere : ce sont les conditions de l'examen, et s'entrainer sans elles
// ne prepare pas a les subir.
//
// Le chronometre est calcule a partir d'un instant de depart, pas d'un
// decompte : un onglet mis en arriere-plan ralentit les minuteries, et un
// simple compteur offrirait du temps supplementaire a qui change d'onglet.
export default function Exam({ profile }) {
  const navigate = useNavigate()

  const [exam, setExam] = useState(null)
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [timedOut, setTimedOut] = useState(false)
  const [remainingMs, setRemainingMs] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const startedAt = useRef(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const built = await assembleExam()
      if (built.listening.length + built.reading.length === 0) {
        throw new Error("Aucun contenu d'examen en base. Lance les scripts de contenu d'abord.")
      }
      setExam(built)
      setIndex(0)
      setAnswers({})
      setResult(null)
      setTimedOut(false)
      setStarted(false)
    } catch (err) {
      setError(isMissingTable(err)
        ? missingTableMessage('migration-listening.sql et migration-reading.sql')
        : err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => stopSpeaking, [])

  const questions = exam ? [...exam.listening, ...exam.reading] : []
  const current = questions[index]

  const finish = useCallback((ranOut = false) => {
    if (!exam) return
    stopSpeaking()
    setTimedOut(ranOut)
    setResult(gradeExam(exam, answers))
    if (!ranOut) soundComplete()
  }, [exam, answers])

  // Chronometre : on compare a l'heure de depart plutot que de decrementer.
  useEffect(() => {
    if (!started || result || !exam) return

    const tick = () => {
      const elapsed = Date.now() - startedAt.current
      const left = exam.durationMs - elapsed
      setRemainingMs(left)
      if (left <= 0) finish(true)
    }

    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [started, result, exam, finish])

  function start() {
    startedAt.current = Date.now()
    setRemainingMs(exam.durationMs)
    setStarted(true)
  }

  function handleNext() {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1)
      return
    }
    finish(false)
  }

  if (loading) {
    return (
      <div className="lesson-screen lesson-screen-center">
        <Mascot mood="thinking" size={90} />
        <p className="path-status">Préparation de l'examen…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="lesson-screen lesson-screen-center">
        <p className="alert alert-error" role="alert">{error}</p>
        <button type="button" className="btn-wide is-dark" onClick={() => navigate('/dashboard')}>
          Retour au parcours
        </button>
      </div>
    )
  }

  if (result) {
    return (
      <ExamResult
        result={result}
        timedOut={timedOut}
        onBack={() => navigate('/dashboard')}
        onRetry={load}
      />
    )
  }

  if (!started) {
    const minutes = Math.round(exam.durationMs / 60000)

    return (
      <div className="listen-intro">
        <button type="button" className="lesson-close" onClick={() => navigate('/dashboard')} aria-label="Quitter">
          <IconClose size={18} strokeWidth={2.25} />
        </button>

        <Mascot mood="idle" size={90} />
        <p className="listen-format">Examen blanc</p>
        <h1 className="listen-title">{questions.length} questions · {minutes} minutes</h1>

        <ul className="exam-brief">
          <li>
            <IconHeadphones size={17} />
            <span><b>{exam.listening.length} questions d'écoute</b> — conversations et annonces</span>
          </li>
          <li>
            <IconRead size={17} />
            <span><b>{exam.reading.length} questions de lecture</b> — phrases à compléter et documents</span>
          </li>
        </ul>

        <div className="listen-warn">
          <p>
            Le chronomètre tourne sans interruption, <b>même si tu quittes
            l'écran</b>. Aucune correction avant la fin, et pas de retour en
            arrière. Prévois {minutes} minutes au calme.
          </p>
        </div>

        <p className="listen-hint">
          Le score obtenu est une estimation, pas une prédiction. L'explication
          complète t'attend à la fin.
        </p>

        <button type="button" className="btn-wide is-primary" onClick={start}>
          Démarrer le chronomètre
        </button>
      </div>
    )
  }

  return (
    <ExamView
      question={current}
      index={index}
      total={questions.length}
      section={current.section}
      answer={answers[current.id]}
      remainingMs={remainingMs}
      onAnswer={(value) => { soundTap(); setAnswers((a) => ({ ...a, [current.id]: value })) }}
      onNext={handleNext}
      onQuit={() => navigate('/dashboard')}
    />
  )
}
