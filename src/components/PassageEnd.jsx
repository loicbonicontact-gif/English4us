import { IconBolt, IconCheck, IconHeadphones, IconRead } from './Icons'
import Mascot from './Mascot'
import { PASS_SCORE } from '../lib/passageProgress'

// Fin d'un passage, d'ecoute ou de lecture. Meme comptabilite, meme ecran :
// seuls le mot et l'icone changent.
//
// Le message est calibre sur le score. En comprehension, un debutant qui
// obtient 2 sur 3 a bien travaille : feliciter le sans-faute et ne rien
// dire en dessous ferait abandonner ceux qui progressent le plus.
const COPY = {
  listening: {
    icon: IconHeadphones,
    parfait: 'Tu as suivi l’échange du premier coup. C’est exactement ce que demande l’examen.',
    bien: 'Tu as saisi l’essentiel. Réécoute le passage en lisant la transcription : les détails manquants vont apparaître.',
    insuffisant: 'Le passage t’a échappé, et c’est normal à ce stade. Réécoute-le en suivant la transcription, puis refais-le sans lire.',
    titreParfait: 'Tout compris !',
    titreBien: 'Bien saisi',
    titreFaible: 'À réécouter'
  },
  reading: {
    icon: IconRead,
    parfait: 'Tu as trouvé toutes les informations. C’est la compétence centrale de la partie 7 du TOEIC.',
    bien: 'Tu as trouvé l’essentiel. Relis le document en cherchant précisément ce qui t’a manqué.',
    insuffisant: 'Le document t’a résisté. Relis-le lentement, phrase par phrase, puis refais les questions.',
    titreParfait: 'Tout trouvé !',
    titreBien: 'Bien lu',
    titreFaible: 'À relire'
  }
}

export default function PassageEnd({ kind = 'listening', score, correctCount, total, earned, onBack }) {
  const copy = COPY[kind]
  const Icon = copy.icon

  const level = score === 100 ? 'parfait' : score >= PASS_SCORE ? 'bien' : 'insuffisant'
  const title = level === 'parfait' ? copy.titreParfait
    : level === 'bien' ? copy.titreBien
      : copy.titreFaible

  return (
    <div className="review-end">
      <Mascot mood={score >= PASS_SCORE ? 'happy' : 'idle'} size={96} />

      <h1 className="review-end-title">{title}</h1>
      <p className="review-end-sub">{copy[level]}</p>

      <div className="review-tiles">
        <div className="review-tile">
          <IconCheck size={20} />
          <span className="review-tile-value">{correctCount}/{total}</span>
          <span className="review-tile-label">Justes</span>
        </div>
        <div className="review-tile">
          <Icon size={20} />
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
          L'XP s'obtient à partir de {PASS_SCORE} % de bonnes réponses. Refais
          le passage quand tu veux, tout de suite : le score le plus récent
          remplace l'ancien.
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
