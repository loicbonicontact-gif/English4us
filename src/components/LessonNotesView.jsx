import { IconClose, IconSoundOn } from './Icons'
import Mascot from './Mascot'

// Fiche de leçon : la règle, ses exemples, et le piège du francophone.
// Affichage pur — aucune requête, aucun calcul. Le chargement vit dans
// LessonNotes.jsx, ce qui permet de prévisualiser l'écran sans base.
//
// CE QUE CET ÉCRAN N'EST PAS
// Ce n'est pas un exercice : rien n'est caché, rien n'est noté, aucun cœur
// n'est en jeu. On vient y lire, puis on décide de commencer ou pas. C'est
// pourquoi le bouton « Commencer la leçon » est bien là, en bas : envoyer
// l'apprenant rechercher la leçon dans le parcours après avoir lu la règle
// serait lui faire perdre le fil.
export default function LessonNotesView({
  lesson,
  note,
  examples = [],
  onStart,
  onQuit,
  onSpeak = null
}) {
  return (
    <div className="notes-screen">
      <header className="notes-top">
        <button
          type="button"
          className="lesson-close"
          onClick={onQuit}
          aria-label="Fermer la fiche"
        >
          <IconClose size={18} strokeWidth={2.25} />
        </button>
        <p className="notes-eyebrow">
          Fiche · {lesson?.level}{lesson?.title ? ` · ${lesson.title}` : ''}
        </p>
      </header>

      <section className="notes-head">
        <Mascot mood="thinking" size={72} className="notes-mascot" />
        <div>
          <h1 className="notes-title">{note.title}</h1>
          <p className="notes-rule">{note.rule}</p>
        </div>
      </section>

      {examples.length > 0 && (
        <section className="notes-block">
          <h2 className="notes-block-title">Exemples</h2>
          {/* L'anglais et le français côte à côte : c'est la comparaison qui
              enseigne, pas la phrase anglaise seule. `lang` sur chaque
              moitié, sinon un lecteur d'écran lit l'anglais en français. */}
          <ul className="notes-examples">
            {examples.map((example, i) => (
              <li key={i} className="notes-example">
                <p className="notes-example-en" lang="en">{example.en}</p>
                {example.fr && <p className="notes-example-fr">{example.fr}</p>}

                {/* Ici la phrase anglaise peut être lue sans réserve : il n'y
                    a rien à deviner sur une fiche. C'est l'inverse d'un
                    exercice, où entendre la réponse la donnerait. */}
                {onSpeak && (
                  <button
                    type="button"
                    className="notes-example-listen"
                    onClick={() => onSpeak(example.en)}
                    aria-label={`Écouter : ${example.en}`}
                  >
                    <IconSoundOn size={16} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {note.pitfall && (
        <section className="notes-pitfall">
          <h2 className="notes-block-title">Le piège</h2>
          <p>{note.pitfall}</p>
        </section>
      )}

      <div className="notes-actions">
        <button type="button" className="btn-wide is-primary" onClick={onStart}>
          Commencer la leçon
        </button>
        <button type="button" className="notes-back" onClick={onQuit}>
          Retour au parcours
        </button>
      </div>
    </div>
  )
}
