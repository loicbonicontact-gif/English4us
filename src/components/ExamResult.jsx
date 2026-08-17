import { IconHeadphones, IconRead } from './Icons'
import Mascot from './Mascot'
import { SCORE_MARGIN } from '../lib/exam'

// Résultat de l'examen blanc.
//
// Le score est affiché en FOURCHETTE, pas en nombre unique. Ce n'est pas de
// la prudence excessive : le barème réel du TOEIC n'est pas public et varie
// d'une session à l'autre. Annoncer « 780 » laisserait croire à une
// précision qui n'existe pas, et un apprenant qui obtiendrait 720 le jour J
// se sentirait trahi par l'application.
export default function ExamResult({ result, timedOut, onBack, onRetry }) {
  const { range, level } = result

  return (
    <div className="exam-result">
      <Mascot mood={result.total >= 550 ? 'happy' : 'idle'} size={90} />

      <p className="exam-result-label">Score estimé</p>
      <p className="exam-result-score">
        {range.low}<span className="exam-result-dash">–</span>{range.high}
      </p>
      <p className="exam-result-scale">sur 990</p>

      <p className="exam-result-level">
        Niveau indicatif <b>{level.level}</b> — {level.label}
      </p>

      {timedOut && (
        <p className="alert alert-error" role="alert">
          Le temps s'est écoulé avant la fin. Les questions non traitées
          comptent comme fausses, exactement comme à l'examen.
        </p>
      )}

      <div className="review-tiles">
        <div className="review-tile">
          <IconHeadphones size={20} />
          <span className="review-tile-value">{result.listeningScore}</span>
          <span className="review-tile-label">
            Écoute · {result.listeningCorrect}/{result.listeningTotal}
          </span>
        </div>
        <div className="review-tile">
          <IconRead size={20} />
          <span className="review-tile-value">{result.readingScore}</span>
          <span className="review-tile-label">
            Lecture · {result.readingCorrect}/{result.readingTotal}
          </span>
        </div>
      </div>

      {/* L'honnêteté sur ce que vaut ce chiffre fait partie du produit :
          une école qui le découvrirait après coup perdrait confiance. */}
      <section className="exam-caveat">
        <h2>Ce que ce score vaut</h2>
        <p>
          Ce n'est pas un TOEIC. Le vrai examen compte 200 questions calibrées
          sur des dizaines de milliers de candidats, et son barème n'est pas
          public : la conversion en score varie d'une session à l'autre.
        </p>
        <p>
          Cette estimation reprend le <b>format</b> — deux sections,
          chronomètre, pas de retour en arrière — appliqué au contenu de
          l'application, converti par règle de trois. La fourchette de
          ±{SCORE_MARGIN} points correspond à l'écart courant entre deux
          sessions réelles pour un même candidat.
        </p>
        <p>
          Utilise-la pour mesurer tes <b>progrès d'un essai à l'autre</b>,
          pas pour prédire ton résultat le jour J.
        </p>
      </section>

      <div className="review-end-actions">
        <button type="button" className="btn-wide is-primary" onClick={onRetry}>
          Refaire un examen
        </button>
        <button type="button" className="btn-wide is-dark" onClick={onBack}>
          Retour au parcours
        </button>
      </div>
    </div>
  )
}
