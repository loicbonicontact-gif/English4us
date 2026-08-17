import { IconCap, IconCheck, IconChevron, IconHeadphones, IconPlay, IconRead, IconRedo } from './Icons'
import Mascot from './Mascot'
import { LEVELS } from '../data/curriculum'

// Description courte de chaque niveau : donne un but, au lieu d'un simple code.
export const LEVEL_BLURB = {
  A1: 'Les premiers mots',
  A2: 'Se débrouiller au quotidien',
  B1: 'Tenir une conversation',
  B2: 'Argumenter et nuancer',
  C1: 'Manier la langue avec aisance',
  C2: 'Maîtrise complète'
}

// Affichage pur du parcours : aucune requete, tout arrive en props.
// Le chargement vit dans LessonPath.jsx — cette separation permet de
// verifier l'ecran avec des donnees de test (voir dev/preview.jsx).
export default function PathView({
  path,
  onOpen,
  onOpenListening = () => {},
  onOpenReading = () => {},
  onOpenExam = () => {},
  needsPlacement = false,
  placementLevel = null,
  onOpenPlacement = () => {}
}) {
  const done = path.decorated.filter((l) => l.completed).length
  const total = path.decorated.length
  const percent = total > 0 ? Math.round((done / total) * 100) : 0
  const current = path.current
  const step = current ? path.decorated.findIndex((l) => l.id === current.id) + 1 : total

  return (
    <div className="path">
      {/* --- Colonne des niveaux, bureau uniquement --- */}
      <nav className="level-rail" aria-label="Niveaux">
        {path.byLevel.map(({ level, lessons }) => {
          const isCurrent = current?.level === level
          return (
            <div key={level} className={`level-rail-item ${isCurrent ? 'is-current' : ''}`}>
              <span className="level-rail-badge">{level}</span>
              <span className="level-rail-label">{LEVEL_BLURB[level]}</span>
              <span className="sr-only">
                {lessons.filter((l) => l.completed).length} sur {lessons.length} terminées
              </span>
            </div>
          )
        })}
      </nav>

      {/* --- Colonne centrale --- */}
      <div className="path-main">
        {/* Invitation au test de placement, avant tout le reste.
            Elle disparait des que la question a ete tranchee — y compris
            si l'apprenant se declare debutant. Une banniere qui revient
            chaque jour se lit comme un reproche. */}
        {needsPlacement && (
          <section className="placement-invite">
            <Mascot mood="thinking" size={64} className="placement-invite-mascot" />
            <div className="placement-invite-text">
              <p className="resume-eyebrow">Avant de commencer</p>
              {/* « savoir un peu d'anglais » est un calque de l'anglais
                  (to know some English). En francais on PARLE une langue,
                  ou on en a des bases. */}
              <h2 className="placement-invite-title">Tu parles déjà un peu anglais ?</h2>
              <p className="placement-invite-sub">
                Cinq minutes pour trouver ton point de départ, au lieu de
                traverser des leçons que tu connais déjà.
              </p>
              <button type="button" className="placement-invite-btn" onClick={onOpenPlacement}>
                Passer le test de placement
              </button>
            </div>
          </section>
        )}

        {current ? (
          <section className="resume-card">
            <div className="resume-text">
              <p className="resume-eyebrow">Étape {step} sur {total}</p>
              <h1 className="resume-title">{current.title}</h1>
              <p className="resume-meta">
                {current.exercise_count ? `${current.exercise_count} questions · ` : ''}
                Niveau {current.level} · +{current.xp_reward} XP
              </p>
              <button type="button" className="resume-btn" onClick={() => onOpen(current.id)}>
                {done === 0 ? 'Commencer' : 'Reprendre'}
              </button>
            </div>
            <Mascot mood={done === 0 ? 'idle' : 'happy'} size={86} className="resume-mascot" />
          </section>
        ) : (
          <section className="resume-card">
            <div className="resume-text">
              <p className="resume-eyebrow">Bravo</p>
              <h1 className="resume-title">Parcours terminé</h1>
              <p className="resume-meta">Tu as terminé les {total} leçons.</p>
            </div>
            <Mascot mood="happy" size={86} className="resume-mascot" />
          </section>
        )}

        {/* Examen blanc. Il ne vit pas dans un niveau : il les traverse
            tous, et se refait autant de fois qu'on veut pour mesurer ses
            progres d'un essai a l'autre. */}
        <button type="button" className="exam-entry" onClick={onOpenExam}>
          <span className="exam-entry-icon"><IconCap size={22} /></span>
          <span className="exam-entry-text">
            <span className="exam-entry-title">Examen blanc TOEIC</span>
            <span className="exam-entry-sub">
              Chronométré, deux sections, score estimé sur 990
            </span>
          </span>
          <IconChevron size={18} className="listen-entry-chevron" />
        </button>

        {/* La progression apparait ici sur telephone, dans la colonne de
            droite sur grand ecran — d'ou le duplicata masque en CSS. */}
        <ProgressCard done={done} total={total} percent={percent} className="progress-card-inline" />

        {path.byLevel.map(({ level, lessons, items = lessons }) => {
          const levelDone = lessons.filter((l) => l.completed).length
          // Un niveau ouvert par le placement affiche « 0 / 5 » tout en
          // etant deverrouille : sans explication, cela ressemble a un bug.
          const openedByPlacement = placementLevel != null
            && LEVELS.indexOf(level) < LEVELS.indexOf(placementLevel)

          return (
            <section key={level} className="level-block">
              <header className="level-head">
                <span className="level-pill">{level}</span>
                <h2 className="level-name">{LEVEL_BLURB[level]}</h2>
                {openedByPlacement && <span className="level-placed">Révision libre</span>}
                <span className="level-count">{levelDone} / {lessons.length}</span>
              </header>

              <ol className="lesson-list">
                {items.map((item) => {
                  // Une ecoute et une lecon partagent la meme ligne : c'est
                  // le meme parcours, pas deux rubriques separees. Seuls
                  // l'icone et le libelle changent.
                  const isListening = item.kind === 'listening'
                  const isReading = item.kind === 'reading'
                  const isPractice = isListening || isReading
                  const isCurrent = !isPractice && current?.id === item.id
                  const state = item.completed ? 'done' : item.unlocked ? 'current' : 'locked'
                  const noun = isListening ? 'Écoute' : isReading ? 'Lecture' : 'Leçon'

                  return (
                    <li
                      key={`${item.kind}-${item.id}`}
                      className={`lesson-row is-${state} ${isCurrent ? 'is-active' : ''} ${isPractice ? 'is-practice' : ''}`}
                    >
                      <button
                        type="button"
                        className="lesson-hit"
                        disabled={!item.unlocked}
                        onClick={() => {
                          if (isListening) return onOpenListening(item.id)
                          if (isReading) return onOpenReading(item.id)
                          return onOpen(item.id)
                        }}
                        aria-label={
                          item.unlocked
                            ? `${noun} ${item.title}${item.completed ? ', terminée' : ', à faire'}`
                            : `${noun} ${item.title}, verrouillée`
                        }
                      >
                        <span className="lesson-badge" aria-hidden="true">
                          {isListening
                            ? <IconHeadphones size={20} />
                            : isReading
                              ? <IconRead size={20} />
                              : item.completed
                              ? <IconCheck size={22} strokeWidth={2.5} />
                              : item.unlocked
                                ? <IconPlay size={20} fill="currentColor" strokeWidth={0} />
                                : <span className="lesson-dot" />}
                        </span>

                        <span className="lesson-text">
                          <span className="lesson-title">{item.title}</span>
                          <span className="lesson-meta">
                            {/* « En cours » serait faux pour une leçon d'un
                                niveau ouvert par le placement : l'apprenant
                                ne l'a pas commencée, elle lui est offerte
                                en révision. */}
                            {item.completed
                              ? `${isPractice ? 'Fait' : 'Réussi'} · ${item.score ?? 0} %`
                              : item.unlocked
                                ? `${isListening ? 'Compréhension orale' : isReading ? 'Compréhension écrite' : openedByPlacement ? 'Révision' : 'En cours'} · +${item.xp_reward} XP`
                                : 'Verrouillé'}
                          </span>
                        </span>

                        {item.unlocked && (
                          <span className="lesson-chevron" aria-hidden="true">
                            {item.completed ? <IconRedo size={18} /> : <IconChevron size={20} />}
                          </span>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ol>
            </section>
          )
        })}
      </div>

      {/* --- Colonne de droite, bureau et tablette --- */}
      <aside className="path-aside">
        <ProgressCard done={done} total={total} percent={percent} />

        <section className="hearts-card">
          <p className="hearts-card-title">Cœurs</p>
          <p className="hearts-card-value">5 par leçon</p>
          <p className="hearts-card-hint">
            Chaque leçon commence avec cinq cœurs. Cinq erreurs et elle
            repart du début, immédiatement — il n'y a jamais rien à
            attendre. Les révisions et les écoutes n'en coûtent aucun.
          </p>
        </section>
      </aside>
    </div>
  )
}

function ProgressCard({ done, total, percent, className = '' }) {
  return (
    <section className={`progress-card ${className}`}>
      <div className="progress-head">
        <span className="progress-label">Progression</span>
        <span className="progress-count">{done} / {total} leçons</span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={done}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label="Leçons terminées"
      >
        {/* Minimum visuel de 5 % : une barre a zero ressemble a un bug */}
        <span className="progress-fill" style={{ width: `${Math.max(percent, 5)}%` }} />
      </div>
    </section>
  )
}
