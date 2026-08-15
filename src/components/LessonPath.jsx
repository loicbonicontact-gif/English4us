import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchLessons, fetchProgress, buildPath } from '../lib/lessons'
import { IconCheck, IconLock, IconPlay } from './Icons'
import Mascot from './Mascot'

// Description courte de chaque niveau : donne un but, au lieu d'un simple code.
const LEVEL_BLURB = {
  A1: 'Les premiers mots',
  A2: 'Se débrouiller au quotidien',
  B1: 'Tenir une conversation',
  B2: 'Argumenter et nuancer',
  C1: 'Manier la langue avec aisance',
  C2: 'Maîtrise complète'
}

export default function LessonPath({ userId }) {
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

  const done = path.decorated.filter((l) => l.completed).length
  const total = path.decorated.length
  const percent = Math.round((done / total) * 100)

  return (
    <div className="path">
      {/* En-tête : la prochaine leçon d'abord — c'est ce qu'on vient faire */}
      <section className="path-hero">
        <div className="path-hero-text">
          <p className="path-hero-eyebrow">
            {done === 0 ? 'Prêt à commencer ?' : 'Reprends où tu en étais'}
          </p>
          <h1 className="path-hero-title">{path.current ? path.current.title : 'Parcours terminé !'}</h1>
          {path.current && (
            <p className="path-hero-meta">
              Niveau {path.current.level} · +{path.current.xp_reward} XP
            </p>
          )}
          {path.current && (
            <button className="btn btn-primary" onClick={() => navigate(`/lesson/${path.current.id}`)}>
              {done === 0 ? 'Commencer' : 'Continuer'}
            </button>
          )}
        </div>
        <Mascot mood={done === 0 ? 'idle' : 'happy'} size={104} className="path-hero-mascot" />
      </section>

      {/* Progression globale, avec le chiffre : une barre vide seule ressemble à un bug */}
      <section className="progress-card">
        <div className="progress-head">
          <span className="progress-label">Progression</span>
          <span className="progress-count">{done} / {total} leçons</span>
        </div>
        <div className="progress-track" role="progressbar" aria-valuenow={done} aria-valuemin={0} aria-valuemax={total}>
          <span className="progress-fill" style={{ width: `${Math.max(percent, 2)}%` }} />
        </div>
      </section>

      {path.byLevel.map(({ level, lessons }) => {
        const levelDone = lessons.filter((l) => l.completed).length
        const isLocked = lessons.every((l) => !l.unlocked)

        return (
          <section key={level} className={`level level-${level} ${isLocked ? 'is-locked' : ''}`}>
            <header className="level-head">
              <span className="level-badge">{level}</span>
              <div className="level-titles">
                <h2 className="level-name">{LEVEL_BLURB[level]}</h2>
                <p className="level-count">{levelDone} / {lessons.length}</p>
              </div>
            </header>

            <ol className="lessons">
              {lessons.map((lesson, i) => {
                const isCurrent = path.current?.id === lesson.id
                const state = lesson.completed ? 'done' : lesson.unlocked ? 'open' : 'locked'

                return (
                  <li
                    key={lesson.id}
                    /* Décalage alterné : donne l'impression d'un chemin qui serpente,
                       plutôt que d'une liste administrative */
                    className={`lesson is-${state} ${isCurrent ? 'is-current' : ''} offset-${i % 4}`}
                  >
                    <button
                      type="button"
                      className="lesson-btn"
                      disabled={!lesson.unlocked}
                      onClick={() => navigate(`/lesson/${lesson.id}`)}
                      aria-label={
                        lesson.unlocked
                          ? `Leçon ${lesson.title}${lesson.completed ? ', terminée' : ''}`
                          : `Leçon ${lesson.title}, verrouillée`
                      }
                    >
                      {lesson.completed ? <IconCheck size={26} />
                        : lesson.unlocked ? <IconPlay size={24} />
                        : <IconLock size={22} />}
                    </button>

                    <div className="lesson-text">
                      <span className="lesson-title">{lesson.title}</span>
                      {lesson.completed && <span className="lesson-meta">Réussi · {lesson.score}%</span>}
                      {!lesson.completed && lesson.unlocked && (
                        <span className="lesson-meta">+{lesson.xp_reward} XP</span>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          </section>
        )
      })}
    </div>
  )
}
