import { IconCheck, IconClose } from './Icons'
import Mascot from './Mascot'
import ListeningPlayer from './ListeningPlayer'
import { FORMAT_HINTS, FORMAT_LABELS } from '../lib/listening'

const LETTERS = ['A', 'B', 'C', 'D']

// Ecran d'un passage de comprehension orale. Affichage pur : aucune requete.
//
// Deux etats bien distincts :
//   - avant lancement : la mise en situation, en francais, et le bouton
//   - pendant l'exercice : le lecteur en haut, les questions dessous
//
// Le script anglais n'apparait qu'apres avoir repondu, dans la transcription.
export default function ListeningView({
  passage,
  questions,
  started,
  index,
  answer,
  verdict,
  onStart,
  onAnswer,
  onValidate,
  onNext,
  onQuit
}) {
  const current = questions[index]
  const isLast = index === questions.length - 1
  const progress = ((index + (verdict ? 1 : 0)) / questions.length) * 100

  // Partie 2 du TOEIC : les reponses sont lues, jamais ecrites. Les boutons
  // ne portent donc qu'une lettre — c'est l'oreille qui doit trancher.
  const audioOnlyOptions = passage.format === 'question_response'

  if (!started) {
    return (
      <div className="listen-intro">
        <button type="button" className="lesson-close" onClick={onQuit} aria-label="Quitter">
          <IconClose size={18} strokeWidth={2.25} />
        </button>

        <Mascot mood="idle" size={90} />
        <p className="listen-format">{FORMAT_LABELS[passage.format]} · {passage.level}</p>
        <h1 className="listen-title">{passage.title}</h1>

        {passage.context && <p className="listen-context">{passage.context}</p>}

        <p className="listen-hint">{FORMAT_HINTS[passage.format]}</p>

        <div className="listen-warn">
          <p>
            Le texte anglais ne sera pas affiché. Tu pourras réécouter autant
            que tu veux, et lire la transcription après avoir répondu.
          </p>
        </div>

        <button type="button" className="btn-wide is-primary" onClick={onStart}>
          Commencer l'écoute
        </button>
      </div>
    )
  }

  return (
    <div className="lesson-screen">
      <header className="lesson-top">
        <button type="button" className="lesson-close" onClick={onQuit} aria-label="Quitter l'écoute">
          <IconClose size={18} strokeWidth={2.25} />
        </button>

        <div
          className="lesson-progress"
          role="progressbar"
          aria-valuenow={index + 1}
          aria-valuemin={1}
          aria-valuemax={questions.length}
          aria-label={`Question ${index + 1} sur ${questions.length}`}
        >
          <span className="lesson-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <span className="lesson-mode-tag">Écoute</span>
      </header>

      <ListeningPlayer
        script={passage.script}
        audioUrl={passage.audio_url}
        format={passage.format}
      />

      <section className="question-row">
        <Mascot
          mood={verdict === 'right' ? 'happy' : verdict === 'wrong' ? 'sad' : 'idle'}
          size={64}
          className="question-mascot"
        />
        <div className="question-bubble">
          <p className="question-count">Question {index + 1} / {questions.length}</p>
          <h1 className="question-text">
            {audioOnlyOptions ? 'Quelle réponse convient ?' : current.question}
          </h1>
          <p className="question-kind">
            {audioOnlyOptions
              ? 'Les trois réponses sont dans l\'enregistrement'
              : 'D\'après ce que tu viens d\'entendre'}
          </p>
        </div>
      </section>

      <ul className="answers">
        {current.options.map((option, i) => {
          const picked = answer === option
          const isRight = verdict && option === current.correct_answer
          const isWrong = verdict === 'wrong' && picked

          return (
            <li key={option}>
              <button
                type="button"
                className={`answer ${picked ? 'is-picked' : ''} ${isRight ? 'is-right' : ''} ${isWrong ? 'is-wrong' : ''} ${audioOnlyOptions ? 'is-letter-only' : ''}`}
                onClick={() => onAnswer(option)}
                disabled={Boolean(verdict)}
              >
                <span className="answer-badge" aria-hidden="true">{LETTERS[i] || '·'}</span>
                {!audioOnlyOptions && <span className="answer-label">{option}</span>}
                {audioOnlyOptions && (
                  <span className="answer-label">Réponse {LETTERS[i]}</span>
                )}
                {isRight && <IconCheck size={20} strokeWidth={2.5} className="answer-mark" />}
                {isWrong && <IconClose size={20} strokeWidth={2.5} className="answer-mark" />}
              </button>
            </li>
          )
        })}
      </ul>

      {verdict && (
        <section className={`verdict verdict-${verdict}`} role="status">
          <Mascot mood={verdict === 'right' ? 'happy' : 'sad'} size={52} className="verdict-mascot" />
          <div className="verdict-text">
            <h2 className="verdict-title">{verdict === 'right' ? 'Bien entendu !' : 'Pas tout à fait…'}</h2>
            {verdict === 'wrong' && (
              <p className="verdict-answer">
                La bonne réponse était{' '}
                <b>
                  {audioOnlyOptions
                    ? `la ${LETTERS[current.options.indexOf(current.correct_answer)] || '?'}`
                    : current.correct_answer}
                </b>.
              </p>
            )}
            {current.explanation && <p className="verdict-why">{current.explanation}</p>}

            {/* La transcription n'apparait qu'ici : avant, elle transformerait
                l'exercice d'ecoute en exercice de lecture. */}
            <details className="listen-script">
              <summary>Lire la transcription</summary>
              <ol>
                {passage.script.map((t, i) => (
                  <li key={i}>
                    <b>{t.speaker}</b> — {t.text}
                  </li>
                ))}
              </ol>
            </details>
          </div>
        </section>
      )}

      <div className="lesson-actions">
        {verdict ? (
          <button type="button" className={`btn-wide ${verdict === 'right' ? 'is-success' : 'is-dark'}`} onClick={onNext} autoFocus>
            {isLast ? 'Terminer' : 'Question suivante'}
          </button>
        ) : (
          <button type="button" className="btn-wide is-primary" onClick={onValidate} disabled={!answer}>
            Vérifier
          </button>
        )}
      </div>
    </div>
  )
}
