import { IconClose, IconHeadphones, IconRead } from './Icons'
import ListeningPlayer from './ListeningPlayer'
import { DOCUMENT_LABELS } from '../lib/reading'
import { formatCountdown } from '../lib/exam'

const LETTERS = ['A', 'B', 'C', 'D']

// Ecran de l'examen blanc.
//
// Trois differences de fond avec un exercice ordinaire, qui sont exactement
// les conditions de l'examen :
//   - aucune correction n'est montree avant la fin
//   - aucun retour en arriere : une question repondue est derriere soi
//   - le chronometre tourne pour toute l'epreuve, pas par question
//
// Ces contraintes ne sont pas de la severite gratuite : s'entrainer sans
// elles ne prepare pas a les subir le jour J.
export default function ExamView({
  question,
  index,
  total,
  section,
  answer,
  remainingMs,
  onAnswer,
  onNext,
  onQuit
}) {
  const isLast = index === total - 1
  const progress = (index / total) * 100
  const passage = question.passage
  const isListening = section === 'listening'

  // Dernieres cinq minutes : le chronometre passe au rouge. C'est le seul
  // moment ou l'urgence doit se voir, sinon elle stresse pour rien.
  const urgent = remainingMs <= 5 * 60 * 1000

  return (
    <div className="lesson-screen exam">
      <header className="lesson-top">
        <button type="button" className="lesson-close" onClick={onQuit} aria-label="Abandonner l'examen">
          <IconClose size={18} strokeWidth={2.25} />
        </button>

        <div
          className="lesson-progress"
          role="progressbar"
          aria-valuenow={index + 1}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-label={`Question ${index + 1} sur ${total}`}
        >
          <span className="lesson-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <span className={`exam-clock ${urgent ? 'is-urgent' : ''}`} role="timer" aria-live="off">
          {formatCountdown(remainingMs)}
          <span className="sr-only">temps restant</span>
        </span>
      </header>

      <p className="exam-section">
        {isListening ? <IconHeadphones size={15} /> : <IconRead size={15} />}
        {isListening ? 'Section écoute' : 'Section lecture'}
        <span className="exam-count">Question {index + 1} / {total}</span>
      </p>

      {/* Ecoute : le lecteur, sans transcription ni correction. */}
      {isListening && passage && (
        <ListeningPlayer
          key={passage.id}
          script={passage.script}
          audioUrl={passage.audio_url}
          format={passage.format}
        />
      )}

      {/* Lecture : les documents restent affiches, comme a l'examen. */}
      {!isListening && passage && (
        <section className="read-docs" aria-label="Documents à lire">
          {passage.documents.map((doc, i) => (
            <article key={i} className={`read-doc read-doc-${doc.kind || 'article'}`}>
              <header className="read-doc-head">
                <span className="read-doc-kind">{DOCUMENT_LABELS[doc.kind] || 'Document'}</span>
                {doc.title && <h2 className="read-doc-title" lang="en">{doc.title}</h2>}
              </header>
              <div className="read-doc-body" lang="en">
                {doc.text.split('\n').filter(Boolean).map((line, j) => <p key={j}>{line}</p>)}
              </div>
            </article>
          ))}
        </section>
      )}

      <h1 className="exam-question" lang={isListening && !passage ? undefined : 'en'}>
        {question.question}
      </h1>

      <ul className="answers">
        {question.options.map((option, i) => (
          <li key={option}>
            <button
              type="button"
              className={`answer ${answer === option ? 'is-picked' : ''}`}
              onClick={() => onAnswer(option)}
            >
              <span className="answer-badge" aria-hidden="true">{LETTERS[i] || '·'}</span>
              <span className="answer-label" lang="en">{option}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="lesson-actions">
        <button type="button" className="btn-wide is-primary" onClick={onNext} disabled={!answer}>
          {isLast ? 'Terminer l\'examen' : 'Question suivante'}
        </button>
        <p className="exam-warning">
          Aucune correction avant la fin, et pas de retour en arrière —
          comme le jour de l'examen.
        </p>
      </div>
    </div>
  )
}
