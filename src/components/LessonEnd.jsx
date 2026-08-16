import { IconPlay } from './Icons'
import Mascot from './Mascot'
import XpCounter from './XpCounter'

// Ecran de fin de lecon. Affichage pur : le score et la recompense sont
// calcules et enregistres par Exercise.jsx.
export default function LessonEnd({
  lesson,
  score,
  correctCount,
  total,
  xpReward,
  streak,
  results,
  nextLesson,
  onNext,
  onRetryMissed
}) {
  const passed = score >= 60
  const missed = results.filter((r) => !r.right)

  return (
    <div className="end-screen">
      <header className="end-head">
        <p className="end-eyebrow">
          Leçon {lesson.unit_order} · {lesson.title}
        </p>
        <Mascot mood={passed ? 'happy' : 'sad'} size={92} className="end-mascot" />
        <h1 className="end-title">{passed ? <>Leçon<br />terminée</> : 'Presque !'}</h1>
        <p className="end-sub">
          {correctCount} réponse{correctCount > 1 ? 's' : ''} juste{correctCount > 1 ? 's' : ''} sur {total}
        </p>
      </header>

      <div className="end-body">
        <div className="end-tiles">
          <div className="end-tile">
            <XpCounter value={xpReward} className="end-tile-value end-tile-xp" />
            <span className="end-tile-label">XP gagnés</span>
          </div>
          <div className="end-tile">
            <span className="end-tile-value end-tile-score">{score} %</span>
            <span className="end-tile-label">Précision</span>
          </div>
          <div className="end-tile">
            <span className="end-tile-value">{streak ?? '—'}</span>
            <span className="end-tile-label">jour{streak > 1 ? 's' : ''} de série</span>
          </div>
        </div>

        {results.length > 0 && (
          <section className="review-card">
            <h2 className="review-title">À revoir</h2>
            <ul className="review-list">
              {results.map((r, i) => (
                <li key={i} className="review-row">
                  <span className={`review-dot ${r.right ? 'is-right' : 'is-wrong'}`} aria-hidden="true" />
                  <span className="review-word">{r.answer || r.question}</span>
                  <span className="review-state">{r.right ? 'Juste' : 'À revoir'}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {nextLesson && (
          <section className="unlocked-card">
            <span className="unlocked-badge" aria-hidden="true">
              <IconPlay size={20} fill="currentColor" strokeWidth={0} />
            </span>
            <div>
              <p className="unlocked-eyebrow">Débloqué</p>
              <p className="unlocked-title">{nextLesson.title}</p>
            </div>
          </section>
        )}

        <div className="end-actions">
          <button type="button" className="btn-wide is-primary" onClick={onNext}>
            {nextLesson ? 'Leçon suivante' : 'Retour au parcours'}
          </button>
          {missed.length > 0 && (
            <button type="button" className="end-link" onClick={onRetryMissed}>
              Revoir {missed.length === 1 ? 'le mot raté' : `les ${missed.length} mots ratés`}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
