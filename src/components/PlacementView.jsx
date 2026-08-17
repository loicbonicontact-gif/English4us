import { IconClose } from './Icons'
import { LEVEL_BLURB } from './PathView'

const LETTERS = ['A', 'B', 'C', 'D']

// Ecran de question du test de placement.
//
// Aucune correction n'est montree pendant le test : dire « faux » a la
// troisieme question apprendrait a l'apprenant a se juger avant d'avoir
// fini, et fausserait la suite. Tout est explique a la fin.
//
// Le test etant adaptatif, on ne peut pas annoncer un nombre total de
// questions : il depend des reponses. La barre suit donc le bloc en cours,
// et le niveau teste est affiche en clair — c'est l'information honnete.
export default function PlacementView({
  question,
  level,
  index,
  blockLength,
  answer,
  onAnswer,
  onNext,
  onQuit
}) {
  const isLastOfBlock = index === blockLength - 1
  const progress = (index / blockLength) * 100

  return (
    <div className="lesson-screen">
      <header className="lesson-top">
        <button
          type="button"
          className="lesson-close"
          onClick={onQuit}
          aria-label="Quitter le test de placement"
        >
          <IconClose size={18} strokeWidth={2.25} />
        </button>

        <div
          className="lesson-progress"
          role="progressbar"
          aria-valuenow={index + 1}
          aria-valuemin={1}
          aria-valuemax={blockLength}
          aria-label={`Question ${index + 1} sur ${blockLength}, niveau ${level}`}
        >
          <span className="lesson-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <p className="exam-section">
        <span className="level-pill">{level}</span>
        {LEVEL_BLURB[level]}
        <span className="exam-count">Question {index + 1} / {blockLength}</span>
      </p>

      <h1 className="exam-question">{question.question}</h1>

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
        {/* « Je ne sais pas » n'est pas de la politesse : sans ce bouton,
            un apprenant coince repond au hasard, et le test le place trop
            haut. Une reponse vide compte comme fausse, ce qui est la
            verite — mais elle est donnee volontairement. */}
        <button type="button" className="btn-wide is-primary" onClick={() => onNext(false)} disabled={!answer}>
          {isLastOfBlock ? 'Valider ce niveau' : 'Question suivante'}
        </button>
        <button type="button" className="placement-skip" onClick={() => onNext(true)}>
          Je ne sais pas
        </button>
      </div>
    </div>
  )
}
