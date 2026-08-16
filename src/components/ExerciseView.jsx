import { IconCheck, IconClose, IconSoundOn } from './Icons'
import Mascot from './Mascot'
import Hearts from './Hearts'
import DictationPlayer from './DictationPlayer'
import SpeakingPanel from './SpeakingPanel'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

const LABELS = {
  qcm: 'Choisis la bonne réponse',
  trous: 'Complète la phrase',
  traduction: 'Traduis en anglais',
  ecoute: 'Écoute et écris ce que tu entends',
  oral: 'Lis la phrase à voix haute'
}

// Affichage pur de l'ecran d'exercice : aucune requete, aucun calcul de score.
// Toute la logique reste dans Exercise.jsx — cette separation permet de
// previsualiser chaque etat (question, juste, faux, plus de coeurs) sans base.
export default function ExerciseView({
  exercise,
  index,
  total,
  answer,
  verdict,
  shake,
  hearts,
  breakingIndex,
  onAnswer,
  onValidate,
  onNext,
  onQuit,
  onSpeak,
  onSpeechResult,
  speech = null,
  isLast,
  mode = 'lesson'
}) {
  const progress = ((index + (verdict ? 1 : 0)) / total) * 100
  // En révision, aucun cœur n'est perdu : on revient justement sur ce qu'on
  // avait raté, punir une deuxième fois découragerait la seule activité qui
  // répare l'oubli.
  const isReview = mode === 'review'
  const outOfHearts = !isReview && hearts === 0

  // Dictee : l'enonce est sonore. Le champ `question` ne porte qu'une
  // consigne en francais — la phrase anglaise est dans `correct_answer` et
  // ne doit jamais s'afficher avant validation, sinon il n'y a plus rien a
  // ecouter.
  const isDictation = exercise.type === 'ecoute'

  // Expression orale : la phrase EST affichee. Le travail n'est pas de la
  // retrouver mais de la prononcer — la cacher n'aurait aucun sens.
  const isSpeaking = exercise.type === 'oral'

  // La phrase a lire est en anglais : c'est la reponse attendue pour une
  // traduction et une dictee, la question elle-meme sinon.
  const spoken = (exercise.type === 'traduction' || isDictation)
    ? exercise.correct_answer
    : exercise.question

  return (
    <div className="lesson-screen">
      <header className="lesson-top">
        <button
          type="button"
          className="lesson-close"
          onClick={onQuit}
          aria-label={isReview ? 'Quitter la révision' : 'Quitter la leçon'}
        >
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

        {/* Telephone : un compteur chiffre. Grand ecran : les cinq coeurs.
            En revision, ni l'un ni l'autre : il n'y a rien a perdre. */}
        {isReview ? (
          <span className="lesson-mode-tag">Révision</span>
        ) : (
        <>
        <span className="lesson-hearts-count">
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path fill="currentColor" d="M12 21s-7.5-4.7-9.4-9.2C1 8.4 3 5 6.4 5c2.2 0 3.9 1.3 5.6 3.4C13.7 6.3 15.4 5 17.6 5 21 5 23 8.4 21.4 11.8 19.5 16.3 12 21 12 21z" />
          </svg>
          {hearts}
          <span className="sr-only">cœurs restants</span>
        </span>
        <span className="lesson-hearts-full">
          <Hearts hearts={hearts} breakingIndex={breakingIndex} />
        </span>
        </>
        )}
      </header>

      {/* --- Bulle de question --- */}
      <section className="question-row">
        <Mascot mood={verdict === 'right' ? 'happy' : verdict === 'wrong' ? 'sad' : 'idle'} size={64} className="question-mascot" />
        <div className="question-bubble">
          <p className="question-count">Question {index + 1} / {total}</p>
          <h1 className="question-text">{exercise.question}</h1>
          <p className="question-kind">{LABELS[exercise.type] || 'Exercice'}</p>
        </div>
      </section>

      {/* --- Dictee : le lecteur remplace l'enonce ecrit --- */}
      {isDictation && (
        <DictationPlayer
          text={spoken}
          onSpeak={onSpeak}
          disabled={Boolean(verdict)}
        />
      )}

      {/* --- Expression orale : le micro remplace le clavier --- */}
      {isSpeaking && (
        <>
          <p className="speak-sentence" lang="en">{exercise.correct_answer}</p>
          <SpeakingPanel
            sentence={exercise.correct_answer}
            onSpeak={onSpeak}
            onResult={onSpeechResult}
            disabled={Boolean(verdict)}
          />
        </>
      )}

      {/* --- Reponses --- */}
      {isSpeaking ? null : exercise.type === 'qcm' ? (
        <ul className="answers">
          {exercise.options.map((option, i) => {
            const picked = answer === option
            const isRight = verdict && option === exercise.correct_answer
            const isWrong = verdict === 'wrong' && picked

            return (
              <li key={option}>
                <button
                  type="button"
                  className={`answer ${picked ? 'is-picked' : ''} ${isRight ? 'is-right' : ''} ${isWrong ? 'is-wrong' : ''} ${isWrong && shake ? 'is-shaking' : ''}`}
                  onClick={() => onAnswer(option)}
                  disabled={Boolean(verdict)}
                >
                  <span className="answer-badge" aria-hidden="true">{LETTERS[i] || '·'}</span>
                  <span className="answer-label">{option}</span>
                  {isRight && <IconCheck size={20} strokeWidth={2.5} className="answer-mark" />}
                  {isWrong && <IconClose size={20} strokeWidth={2.5} className="answer-mark" />}
                </button>
              </li>
            )
          })}
        </ul>
      ) : (
        <input
          className={`answer-input ${shake ? 'is-shaking' : ''} ${verdict === 'wrong' ? 'is-wrong' : ''} ${verdict === 'right' ? 'is-right' : ''}`}
          value={answer}
          onChange={(e) => onAnswer(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (verdict ? onNext() : onValidate())}
          placeholder={isDictation ? 'Écris la phrase entendue…' : 'Ta réponse…'}
          disabled={Boolean(verdict)}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          aria-label={isDictation ? 'La phrase que tu as entendue' : 'Ta réponse'}
        />
      )}

      {/* --- Retour apres validation --- */}
      {verdict && (
        <section className={`verdict verdict-${verdict}`} role="status">
          <Mascot mood={verdict === 'right' ? 'happy' : 'sad'} size={52} className="verdict-mascot" />
          <div className="verdict-text">
            <h2 className="verdict-title">
              {verdict === 'right' ? 'Bravo !' : 'Presque…'}
            </h2>

            {/* Expression orale : le detail mot par mot. Un score seul
                n'apprend rien — il faut voir QUELS mots ne sont pas passes
                pour savoir quoi retravailler. */}
            {speech && (
              <>
                <p className="speak-score">
                  <b>{speech.result.score} %</b> de la phrase reconnue
                </p>

                <p className="speak-words" lang="en">
                  {speech.result.words.map((w, i) => (
                    <span key={i} className={w.ok ? 'speak-word is-ok' : 'speak-word is-miss'}>
                      {w.word}
                    </span>
                  ))}
                </p>

                {speech.result.said && (
                  <p className="speak-heard">
                    Entendu : « <span lang="en">{speech.result.said}</span> »
                  </p>
                )}

                <p className="verdict-why">{speech.feedback}</p>
              </>
            )}

            {/* Dictee reussie : on montre quand meme la phrase. L'oreille a
                bien fait son travail, mais voir l'orthographe juste a cote
                de ce qu'on a entendu est la moitie de l'apprentissage. */}
            {verdict === 'right' && isDictation && (
              <p className="verdict-answer">
                Tu as bien entendu : <b>{exercise.correct_answer}</b>
              </p>
            )}
            {verdict === 'wrong' && !speech && (
              <p className="verdict-answer">
                C'était <b>{exercise.correct_answer}</b>.
                {isReview
                  ? ' Pas de cœur perdu : cet exercice te sera reproposé demain.'
                  : outOfHearts
                    ? ' Cinq erreurs : on reprend la leçon depuis le début, tout de suite.'
                    : ` Un cœur en moins, il t'en reste ${hearts}.`}
              </p>
            )}
            {exercise.explanation && <p className="verdict-why">{exercise.explanation}</p>}
          </div>
        </section>
      )}

      {/* --- Actions --- */}
      <div className="lesson-actions">
        {verdict ? (
          <button
            type="button"
            className={`btn-wide ${verdict === 'right' ? 'is-success' : 'is-dark'}`}
            onClick={onNext}
            autoFocus
          >
            {outOfHearts ? 'Reprendre la leçon' : isLast ? 'Terminer' : 'Continuer'}
          </button>
        ) : isSpeaking ? (
          // Pas de bouton « Verifier » : c'est la voix qui valide. En
          // afficher un laisserait croire qu'il faut aussi taper la reponse.
          <p className="speak-hint">Ta prononciation est évaluée dès que tu as fini de parler.</p>
        ) : (
          <button
            type="button"
            className="btn-wide is-primary"
            onClick={onValidate}
            disabled={!answer.trim()}
          >
            Vérifier
          </button>
        )}

        {/* Une dictee a deja son lecteur en haut : ce bouton ferait doublon
            et, avant validation, laisserait croire a une seconde phrase. */}
        {!isDictation && (
          <button type="button" className="listen-btn" onClick={() => onSpeak(spoken)}>
            <IconSoundOn size={16} />
            Écouter la phrase
          </button>
        )}

        {/* Apres validation, on peut reecouter la phrase juste : c'est le
            moment ou on relie enfin le son a l'orthographe. */}
        {isDictation && verdict && (
          <button type="button" className="listen-btn" onClick={() => onSpeak(exercise.correct_answer)}>
            <IconSoundOn size={16} />
            Réécouter la bonne phrase
          </button>
        )}
      </div>
    </div>
  )
}
