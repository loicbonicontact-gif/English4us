import { IconBolt, IconCheck, IconRedo } from './Icons'
import Mascot from './Mascot'

// Fin de session de révision. Volontairement plus sobre que la fin de leçon :
// une révision est une routine quotidienne, pas un accomplissement — la
// célébrer autant que la découverte d'une leçon userait l'effet.
export default function ReviewEnd({ correctCount, total, xpEarned, remaining, onBack, onAgain }) {
  const allRight = correctCount === total

  return (
    <div className="review-end">
      <Mascot mood={allRight ? 'happy' : 'idle'} size={96} />

      <h1 className="review-end-title">
        {allRight ? 'Tout est revenu !' : 'Révision terminée'}
      </h1>
      <p className="review-end-sub">
        {correctCount} sur {total} {correctCount > 1 ? 'retrouvés' : 'retrouvé'} de mémoire.
      </p>

      <div className="review-tiles">
        <div className="review-tile">
          <IconCheck size={20} />
          <span className="review-tile-value">{correctCount}/{total}</span>
          <span className="review-tile-label">Justes</span>
        </div>
        <div className="review-tile">
          <IconBolt size={20} />
          <span className="review-tile-value">+{xpEarned}</span>
          <span className="review-tile-label">XP</span>
        </div>
        <div className="review-tile">
          <IconRedo size={20} />
          <span className="review-tile-value">{remaining}</span>
          <span className="review-tile-label">Restants</span>
        </div>
      </div>

      {remaining > 0 ? (
        <p className="review-end-note">
          Il reste {remaining} {remaining > 1 ? 'exercices' : 'exercice'} à revoir aujourd'hui.
        </p>
      ) : (
        <p className="review-end-note">
          Plus rien à revoir aujourd'hui. Les prochains reviendront d'eux-mêmes,
          à intervalle de plus en plus long.
        </p>
      )}

      <div className="review-end-actions">
        {remaining > 0 && (
          <button type="button" className="btn-wide is-primary" onClick={onAgain}>
            Continuer la révision
          </button>
        )}
        <button
          type="button"
          className={`btn-wide ${remaining > 0 ? 'is-dark' : 'is-primary'}`}
          onClick={onBack}
        >
          Retour au parcours
        </button>
      </div>
    </div>
  )
}
