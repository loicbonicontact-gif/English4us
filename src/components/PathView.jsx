import { IconCheck, IconPlay } from './Icons'
import Mascot from './Mascot'

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
export default function PathView({ path, hearts = 0, onOpen }) {
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

        {/* La progression apparait ici sur telephone, dans la colonne de
            droite sur grand ecran — d'ou le duplicata masque en CSS. */}
        <ProgressCard done={done} total={total} percent={percent} className="progress-card-inline" />

        {path.byLevel.map(({ level, lessons }) => {
          const levelDone = lessons.filter((l) => l.completed).length

          return (
            <section key={level} className="level-block">
              <header className="level-head">
                <span className="level-pill">{level}</span>
                <h2 className="level-name">{LEVEL_BLURB[level]}</h2>
                <span className="level-count">{levelDone} / {lessons.length}</span>
              </header>

              <ol className="lesson-list">
                {lessons.map((lesson) => {
                  const isCurrent = current?.id === lesson.id
                  const state = lesson.completed ? 'done' : lesson.unlocked ? 'current' : 'locked'

                  return (
                    <li key={lesson.id} className={`lesson-row is-${state} ${isCurrent ? 'is-active' : ''}`}>
                      <button
                        type="button"
                        className="lesson-hit"
                        disabled={!lesson.unlocked}
                        onClick={() => onOpen(lesson.id)}
                        aria-label={
                          lesson.unlocked
                            ? `Leçon ${lesson.title}${lesson.completed ? ', terminée' : ', à faire'}`
                            : `Leçon ${lesson.title}, verrouillée`
                        }
                      >
                        <span className="lesson-badge" aria-hidden="true">
                          {lesson.completed
                            ? <IconCheck size={22} strokeWidth={2.5} />
                            : lesson.unlocked
                              ? <IconPlay size={20} fill="currentColor" strokeWidth={0} />
                              : <span className="lesson-dot" />}
                        </span>

                        <span className="lesson-text">
                          <span className="lesson-title">{lesson.title}</span>
                          <span className="lesson-meta">
                            {lesson.completed
                              ? `Réussi · ${lesson.score ?? 0} %`
                              : lesson.unlocked
                                ? `En cours · +${lesson.xp_reward} XP`
                                : 'Verrouillé'}
                          </span>
                        </span>

                        {lesson.unlocked && (
                          <span className="lesson-chevron" aria-hidden="true">
                            {lesson.completed ? '↻' : '›'}
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
          <p className="hearts-card-value">{hearts} restants</p>
          <p className="hearts-card-hint">
            Chaque erreur coûte un cœur. Refais une leçon terminée pour t'entraîner sans risque.
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
