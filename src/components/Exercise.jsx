import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { completeLesson, loseHeart, MAX_HEARTS } from '../lib/gamification'
import { isCorrect } from '../lib/answers'
import Mascot from './Mascot'
import Hearts from './Hearts'
import XpCounter from './XpCounter'

const LABELS = {
  qcm: 'Choisis la bonne réponse',
  trous: 'Complète la phrase',
  traduction: 'Traduis en anglais',
  ecoute: 'Écoute et réponds',
  oral: 'Prononce la phrase'
}

export default function Exercise({ profile, onProfileChange }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [lesson, setLesson] = useState(null)
  const [exercises, setExercises] = useState([])
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [verdict, setVerdict] = useState(null)   // null | 'right' | 'wrong'
  const [shake, setShake] = useState(false)
  const [hearts, setHearts] = useState(profile?.hearts ?? MAX_HEARTS)
  const [breakingIndex, setBreakingIndex] = useState(null)
  const [correctCount, setCorrectCount] = useState(0)
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
        setExercises(exRes.data)
      })
      .catch((err) => { if (active) setError(err.message) })
      .finally(() => { if (active) setLoading(false) })

    return () => { active = false }
  }, [id])

  const current = exercises[index]
  const isLast = index === exercises.length - 1

  async function handleValidate() {
    if (!current || verdict) return

    const right = current.type === 'qcm'
      ? answer === current.correct_answer
      : isCorrect(answer, current.correct_answer)

    if (right) {
      setVerdict('right')
      setCorrectCount((n) => n + 1)
      return
    }

    // Mauvaise réponse : secousse du champ + cœur qui se brise
    setVerdict('wrong')
    setShake(true)
    setTimeout(() => setShake(false), 500)

    const remaining = Math.max(0, hearts - 1)
    setBreakingIndex(remaining)        // l'index du cœur qui vient de tomber
    setHearts(remaining)
    setTimeout(() => setBreakingIndex(null), 700)

    if (profile) {
      try { await loseHeart(profile.id, hearts) } catch { /* la partie continue même hors ligne */ }
    }
  }

  async function handleNext() {
    // Plus de cœurs : la leçon s'arrête
    if (hearts === 0) { navigate('/dashboard'); return }

    if (!isLast) {
      setIndex((i) => i + 1)
      setAnswer('')
      setVerdict(null)
      return
    }

    // Dernière question : on enregistre le résultat
    const score = Math.round((correctCount / exercises.length) * 100)
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

  if (loading) {
    return (
      <div className="exercise-screen">
        <Mascot mood="thinking" size={90} />
        <p className="path-status">Chargement de la leçon…</p>
      </div>
    )
  }

  if (error && !finished) {
    return (
      <div className="exercise-screen">
        <p className="alert alert-error" role="alert">{error}</p>
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
          Retour au parcours
        </button>
      </div>
    )
  }

  // ---------- Écran de fin ----------
  if (finished) {
    const score = Math.round((correctCount / exercises.length) * 100)
    return (
      <div className="exercise-screen exercise-end">
        <Mascot mood={score >= 60 ? 'happy' : 'sad'} size={130} />
        <h2>{score >= 60 ? 'Leçon terminée !' : 'Presque !'}</h2>
        <p className="end-score">{correctCount} bonne{correctCount > 1 ? 's' : ''} réponse{correctCount > 1 ? 's' : ''} sur {exercises.length}</p>

        {reward && (
          <div className="end-rewards">
            <div className="end-reward">
              <XpCounter value={lesson.xp_reward} className="end-xp" />
              <span className="end-reward-label">XP gagnés</span>
            </div>
            <div className="end-reward">
              <span className="end-streak">🔥 {reward.newStreak}</span>
              <span className="end-reward-label">jour{reward.newStreak > 1 ? 's' : ''} de série</span>
            </div>
          </div>
        )}

        {error && <p className="alert alert-error" role="alert">{error}</p>}

        <button className="btn btn-primary btn-block" onClick={() => navigate('/dashboard')}>
          Continuer
        </button>
      </div>
    )
  }

  // ---------- Écran d'exercice ----------
  const progress = ((index + (verdict ? 1 : 0)) / exercises.length) * 100

  return (
    <div className="exercise-screen">
      <header className="exercise-top">
        <button
          className="exercise-quit"
          onClick={() => navigate('/dashboard')}
          aria-label="Quitter la leçon"
        >
          ✕
        </button>
        <div className="exercise-bar" role="progressbar" aria-valuenow={index + 1} aria-valuemin={1} aria-valuemax={exercises.length}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <Hearts hearts={hearts} breakingIndex={breakingIndex} />
      </header>

      <p className="exercise-kind">{LABELS[current.type] || 'Exercice'}</p>
      <h2 className="exercise-question">{current.question}</h2>

      {current.type === 'qcm' ? (
        <ul className="options">
          {current.options.map((option) => (
            <li key={option}>
              <button
                type="button"
                className={`option ${answer === option ? 'is-picked' : ''} ${
                  verdict && option === current.correct_answer ? 'is-right' : ''
                } ${verdict === 'wrong' && answer === option ? 'is-wrong' : ''}`}
                onClick={() => !verdict && setAnswer(option)}
                disabled={Boolean(verdict)}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <input
          className={`exercise-input ${shake ? 'is-shaking' : ''} ${verdict === 'wrong' ? 'is-wrong' : ''} ${verdict === 'right' ? 'is-right' : ''}`}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (verdict ? handleNext() : handleValidate())}
          placeholder="Ta réponse…"
          disabled={Boolean(verdict)}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          aria-label="Ta réponse"
        />
      )}

      {verdict && (
        <div className={`feedback feedback-${verdict}`} role="status">
          <Mascot mood={verdict === 'right' ? 'happy' : 'sad'} size={64} />
          <div className="feedback-text">
            <strong>{verdict === 'right' ? 'Correct !' : 'Pas tout à fait.'}</strong>
            {verdict === 'wrong' && (
              <p className="feedback-answer">Réponse : <b>{current.correct_answer}</b></p>
            )}
            {current.explanation && <p className="feedback-why">{current.explanation}</p>}
            {hearts === 0 && (
              <p className="feedback-why"><b>Plus de cœurs.</b> La leçon s'arrête ici, mais tu peux la refaire.</p>
            )}
          </div>
        </div>
      )}

      <div className="exercise-actions">
        {verdict ? (
          <button className="btn btn-primary btn-block" onClick={handleNext} autoFocus>
            {hearts === 0 ? 'Retour au parcours' : isLast ? 'Terminer' : 'Continuer'}
          </button>
        ) : (
          <button className="btn btn-primary btn-block" onClick={handleValidate} disabled={!answer.trim()}>
            Vérifier
          </button>
        )}
      </div>
    </div>
  )
}
