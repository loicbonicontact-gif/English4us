import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { completeLesson, MAX_HEARTS } from '../lib/gamification'
import { isCorrect } from '../lib/answers'
import { recordAnswer } from '../lib/reviews'
import { speak, stopSpeaking } from '../lib/speech'
import { usableExercises } from '../lib/exercises'
import Mascot from './Mascot'
import ExerciseView from './ExerciseView'
import LessonEnd from './LessonEnd'
import { soundComplete, soundCorrect, soundHeart, soundTap, soundWrong } from '../lib/sounds'

// Conteneur de la lecon : chargement, score, coeurs, enregistrement.
// L'affichage est delegue a ExerciseView et LessonEnd.
export default function Exercise({ profile, onProfileChange }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [lesson, setLesson] = useState(null)
  const [exercises, setExercises] = useState([])
  const [nextLesson, setNextLesson] = useState(null)
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [verdict, setVerdict] = useState(null)   // null | 'right' | 'wrong'
  const [shake, setShake] = useState(false)
  // Vies de CETTE lecon, remises a plein a chaque debut. Elles ne sont ni
  // lues ni enregistrees en base : rien ne doit survivre a l'ecran, sinon
  // l'apprenant se retrouverait bloque en arrivant.
  const [hearts, setHearts] = useState(MAX_HEARTS)
  const [breakingIndex, setBreakingIndex] = useState(null)
  const [speech, setSpeech] = useState(null)   // resultat du dernier essai oral
  const [correctCount, setCorrectCount] = useState(0)
  const [results, setResults] = useState([])     // une entree par question, pour « A revoir »
  const [finished, setFinished] = useState(false)
  const [reward, setReward] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Chargement de la leçon et de ses exercices
  useEffect(() => {
    let active = true
    setLoading(true)

    Promise.all([
      supabase.from('lessons').select('*').eq('id', id).single(),
      supabase.from('exercises').select('*').eq('lesson_id', id).order('id')
    ])
      .then(([lessonRes, exRes]) => {
        if (!active) return
        if (lessonRes.error) throw lessonRes.error
        if (exRes.error) throw exRes.error
        if (!exRes.data?.length) throw new Error("Cette leçon ne contient aucun exercice.")
        setLesson(lessonRes.data)
        setExercises(usableExercises(exRes.data))
      })
      .catch((err) => { if (active) setError(err.message) })
      .finally(() => { if (active) setLoading(false) })

    return () => { active = false }
  }, [id])

  // Quitter la lecon coupe la voix : sans cela, la phrase continue de se lire
  // sur l'ecran du parcours.
  useEffect(() => stopSpeaking, [])

  // Leçon suivante du même niveau : sert la carte « Débloqué » de l'écran de fin.
  // Chargée à part pour ne pas retarder l'affichage de la première question.
  useEffect(() => {
    if (!lesson) return
    let active = true

    supabase
      .from('lessons')
      .select('id, title, level, unit_order')
      .eq('level', lesson.level)
      .gt('unit_order', lesson.unit_order)
      .order('unit_order', { ascending: true })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => { if (active) setNextLesson(data) })

    return () => { active = false }
  }, [lesson])

  const current = exercises[index]
  const isLast = index === exercises.length - 1

  // Expression orale : c'est la voix qui valide, il n'y a pas de bouton
  // « Verifier ». Le resultat arrive du panneau micro, deja note.
  function handleSpeechResult(result, feedback) {
    if (verdict) return
    setSpeech({ result, feedback })
    applyVerdict(result.passed)
  }

  // Suite commune a toutes les validations : son, verdict, coeur, revision.
  function applyVerdict(right) {
    const exercise = exercises[index]

    setResults((list) => [...list, {
      question: exercise.question,
      answer: exercise.correct_answer,
      right
    }])

    if (profile) {
      recordAnswer(profile.id, exercise.id, right).catch(() => { /* silencieux */ })
    }

    if (right) {
      soundCorrect()
      setVerdict('right')
      setCorrectCount((n) => n + 1)
      return
    }

    soundWrong()
    setTimeout(soundHeart, 180)
    setVerdict('wrong')
    setShake(true)
    setTimeout(() => setShake(false), 500)

    const remaining = Math.max(0, hearts - 1)
    setBreakingIndex(remaining)
    setHearts(remaining)
    setTimeout(() => setBreakingIndex(null), 700)
  }

  async function handleValidate() {
    if (!current || verdict) return

    const right = current.type === 'qcm'
      ? answer === current.correct_answer
      : isCorrect(answer, current.correct_answer)

    applyVerdict(right)
  }

  async function handleNext() {
    // Cinq erreurs : la lecon recommence TOUT DE SUITE, au meme endroit.
    // Aucune attente, aucun retour force au parcours : l'apprenant decide
    // quand il arrete, jamais l'application.
    if (hearts === 0) { handleRetry(); return }

    if (!isLast) {
      setIndex((i) => i + 1)
      setAnswer('')
      setVerdict(null)
      setSpeech(null)
      return
    }

    // Dernière question : on enregistre le résultat
    const score = Math.round((correctCount / exercises.length) * 100)
    if (score >= 60) soundComplete()
    setFinished(true)

    if (!profile) return
    try {
      const result = await completeLesson(profile.id, lesson.id, score, lesson.xp_reward, profile)
      setReward({ ...result, score })
      onProfileChange?.()
    } catch (err) {
      setError(`Progression non enregistrée : ${err.message}`)
    }
  }

  // Reprend la leçon depuis le début, cœurs remis à plein.
  //
  // C'est aussi ce qui se passe après cinq erreurs : la leçon repart,
  // immédiatement. Sans la remise à plein, on repartirait à zéro cœur et la
  // première erreur relancerait tout — une boucle sans issue.
  function handleRetry() {
    setIndex(0)
    setAnswer('')
    setVerdict(null)
    setCorrectCount(0)
    setResults([])
    setFinished(false)
    setReward(null)
    setHearts(MAX_HEARTS)
    setBreakingIndex(null)
    setSpeech(null)
  }

  if (loading) {
    return (
      <div className="lesson-screen lesson-screen-center">
        <Mascot mood="thinking" size={90} />
        <p className="path-status">Chargement de la leçon…</p>
      </div>
    )
  }

  if (error && !finished) {
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
    const score = Math.round((correctCount / exercises.length) * 100)
    return (
      <>
        {error && <p className="alert alert-error" role="alert">{error}</p>}
        <LessonEnd
          lesson={lesson}
          score={score}
          correctCount={correctCount}
          total={exercises.length}
          xpReward={lesson.xp_reward}
          streak={reward?.newStreak}
          results={results}
          nextLesson={nextLesson}
          onNext={() => navigate(nextLesson ? `/lesson/${nextLesson.id}` : '/dashboard')}
          onRetryMissed={handleRetry}
        />
      </>
    )
  }

  return (
    <ExerciseView
      exercise={current}
      index={index}
      total={exercises.length}
      answer={answer}
      verdict={verdict}
      shake={shake}
      hearts={hearts}
      breakingIndex={breakingIndex}
      isLast={isLast}
      onAnswer={(value) => { if (!verdict) { if (current.type === 'qcm') soundTap(); setAnswer(value) } }}
      onValidate={handleValidate}
      onNext={handleNext}
      onQuit={() => navigate('/dashboard')}
      onSpeak={speak}
      onSpeechResult={handleSpeechResult}
      speech={speech}
    />
  )
}
