import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchLessons, fetchProgress, buildPath } from '../lib/lessons'

// Parcours visuel des leçons, regroupées par niveau CECRL.
// Une leçon ne s'ouvre que si la précédente est terminée.
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

  if (loading) return <p className="path-status">Chargement du parcours…</p>
  if (error) return <p className="alert alert-error" role="alert">{error}</p>
  if (!path) return null

  const doneCount = path.decorated.filter((l) => l.completed).length

  return (
    <div className="path">
      <header className="path-header">
        <h2>Ton parcours</h2>
        <p className="path-progress">
          {doneCount} leçon{doneCount > 1 ? 's' : ''} terminée{doneCount > 1 ? 's' : ''} sur {path.decorated.length}
        </p>
        <div className="path-bar" role="progressbar" aria-valuenow={doneCount} aria-valuemin={0} aria-valuemax={path.decorated.length}>
          <span style={{ width: `${(doneCount / path.decorated.length) * 100}%` }} />
        </div>
      </header>

      {path.byLevel.map(({ level, lessons }) => (
        <section key={level} className="path-level">
          <h3 className="path-level-title">
            <span className="path-level-badge">{level}</span>
            {lessons.every((l) => l.completed) && <span className="path-level-done">terminé ✓</span>}
          </h3>

          <ol className="path-list">
            {lessons.map((lesson) => {
              const isCurrent = path.current?.id === lesson.id
              const state = lesson.completed ? 'done' : lesson.unlocked ? 'open' : 'locked'

              return (
                <li key={lesson.id} className={`path-node is-${state} ${isCurrent ? 'is-current' : ''}`}>
                  <button
                    type="button"
                    className="path-node-btn"
                    disabled={!lesson.unlocked}
                    onClick={() => navigate(`/lesson/${lesson.id}`)}
                    aria-label={
                      lesson.unlocked
                        ? `Leçon ${lesson.title}`
                        : `Leçon ${lesson.title}, verrouillée. Termine la leçon précédente pour l'ouvrir.`
                    }
                  >
                    <span className="path-node-icon" aria-hidden="true">
                      {lesson.completed ? '⭐' : lesson.unlocked ? '▶' : '🔒'}
                    </span>
                  </button>

                  <div className="path-node-text">
                    <span className="path-node-title">{lesson.title}</span>
                    <span className="path-node-meta">
                      {lesson.completed
                        ? `Réussi — ${lesson.score}%`
                        : lesson.unlocked
                          ? `+${lesson.xp_reward} XP`
                          : 'Verrouillé'}
                    </span>
                  </div>
                </li>
              )
            })}
          </ol>
        </section>
      ))}
    </div>
  )
}
