import { IconBolt, IconCheck, IconHeadphones } from './Icons'
import Mascot from './Mascot'

// Fin d'un passage d'ecoute.
//
// Le message est calibre sur le score : en comprehension orale, un debutant
// qui obtient 2 sur 3 a bien travaille. Feliciter un 3 sur 3 et rien dire
// en dessous ferait abandonner ceux qui progressent le plus.
export default function ListeningEnd({ passage, score, correctCount, total, earned, onBack }) {
  const verdict = score === 100 ? 'parfait' : score >= 60 ? 'bien' : 'insuffisant'

  const TITLES = {
    parfait: 'Tout compris !',
    bien: 'Bien saisi',
    insuffisant: 'À réécouter'
  }

  const MESSAGES = {
    parfait: 'Tu as suivi l’échange du premier coup. C’est exactement ce que demande l’examen.',
    bien: 'Tu as saisi l’essentiel. Réécoute le passage en lisant la transcription : les détails manquants vont apparaître.',
    insuffisant: 'Le passage t’a échappé, et c’est normal à ce stade. Réécoute-le en suivant la transcription, puis refais-le demain sans lire.'
  }

  return (
    <div className="review-end">
      <Mascot mood={score >= 60 ? 'happy' : 'idle'} size={96} />

      <h1 className="review-end-title">{TITLES[verdict]}</h1>
      <p className="review-end-sub">{MESSAGES[verdict]}</p>

      <div className="review-tiles">
        <div className="review-tile">
          <IconCheck size={20} />
          <span className="review-tile-value">{correctCount}/{total}</span>
          <span className="review-tile-label">Justes</span>
        </div>
        <div className="review-tile">
          <IconHeadphones size={20} />
          <span className="review-tile-value">{score}%</span>
          <span className="review-tile-label">Score</span>
        </div>
        <div className="review-tile">
          <IconBolt size={20} />
          <span className="review-tile-value">+{earned}</span>
          <span className="review-tile-label">XP</span>
        </div>
      </div>

      {earned === 0 && (
        <p className="review-end-note">
          L'XP s'obtient à partir de 60 % de bonnes réponses. Refais le passage
          quand tu veux : le score le plus récent remplace l'ancien.
        </p>
      )}

      <div className="review-end-actions">
        <button type="button" className="btn-wide is-primary" onClick={onBack}>
          Retour au parcours
        </button>
      </div>

      <p className="review-end-note">
        Les questions ratées rejoignent tes révisions et te reviendront demain.
      </p>
    </div>
  )
}
