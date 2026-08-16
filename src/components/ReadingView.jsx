import { IconCheck, IconClose } from './Icons'
import Mascot from './Mascot'
import { DOCUMENT_LABELS, FORMAT_HINTS, FORMAT_LABELS } from '../lib/reading'

const LETTERS = ['A', 'B', 'C', 'D']

// Ecran d'un texte de comprehension ecrite.
//
// Difference de fond avec l'ecoute : le texte RESTE affiche pendant les
// questions. Au TOEIC on relit autant qu'on veut, et la competence
// travaillee est justement de retrouver l'information dans un document,
// pas de la memoriser.
export default function ReadingView({
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

        <button type="button" className="btn-wide is-primary" onClick={onStart}>
          Lire le document
        </button>
      </div>
    )
  }

  return (
    <div className="lesson-screen">
      <header className="lesson-top">
        <button type="button" className="lesson-close" onClick={onQuit} aria-label="Quitter la lecture">
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

        <span className="lesson-mode-tag">Lecture</span>
      </header>

      {/* Les documents, toujours visibles. Sur telephone ils sont dans un
          cadre qui defile : la question reste accessible sans avoir a
          remonter tout le texte. */}
      <section className="read-docs" aria-label="Documents à lire">
        {passage.documents.map((doc, i) => (
          <article key={i} className={`read-doc read-doc-${doc.kind || 'article'}`}>
            <header className="read-doc-head">
              <span className="read-doc-kind">{DOCUMENT_LABELS[doc.kind] || 'Document'}</span>
              {doc.title && <h2 className="read-doc-title" lang="en">{doc.title}</h2>}
            </header>
            <div className="read-doc-body" lang="en">
              {doc.text.split('\n').filter(Boolean).map((line, j) => (
                <p key={j}>{line}</p>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="question-row">
        <Mascot
          mood={verdict === 'right' ? 'happy' : verdict === 'wrong' ? 'sad' : 'idle'}
          size={64}
          className="question-mascot"
        />
        <div className="question-bubble">
          <p className="question-count">Question {index + 1} / {questions.length}</p>
          <h1 className="question-text" lang="en">{current.question}</h1>
          <p className="question-kind">Cherche la réponse dans le document</p>
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
                className={`answer ${picked ? 'is-picked' : ''} ${isRight ? 'is-right' : ''} ${isWrong ? 'is-wrong' : ''}`}
                onClick={() => onAnswer(option)}
                disabled={Boolean(verdict)}
              >
                <span className="answer-badge" aria-hidden="true">{LETTERS[i] || '·'}</span>
                <span className="answer-label" lang="en">{option}</span>
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
            <h2 className="verdict-title">{verdict === 'right' ? 'Bien vu !' : 'Pas tout à fait…'}</h2>
            {verdict === 'wrong' && (
              <p className="verdict-answer">
                La bonne réponse était <b lang="en">{current.correct_answer}</b>.
              </p>
            )}
            {current.explanation && <p className="verdict-why">{current.explanation}</p>}
          </div>
        </section>
      )}

      <div className="lesson-actions">
        {verdict ? (
          <button
            type="button"
            className={`btn-wide ${verdict === 'right' ? 'is-success' : 'is-dark'}`}
            onClick={onNext}
            autoFocus
          >
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
