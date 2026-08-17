import { IconCap, IconCheck, IconChevron, IconHeadphones, IconRead, IconRedo } from './Icons'
import { FORMAT_LABELS as LISTENING_LABELS } from '../lib/listening'
import { FORMAT_LABELS as READING_LABELS } from '../lib/reading'

// Affichage seul : aucune requete ici, ce qui permet de previsualiser
// l'ecran avec des donnees de test (dev/preview.jsx).
//
// POURQUOI CET ECRAN EXISTE
// Le parcours melange les lecons et leurs mises en pratique, dans l'ordre
// pedagogique. C'est le bon ordre pour apprendre, et le mauvais pour
// reviser avant un examen : retrouver la conversation de niveau B2 demande
// de faire defiler trente lecons. Cet ecran donne la meme chose a plat,
// par module, et n'ajoute aucun contenu — ce sont les memes passages.
export default function TrainingView({
  listening = [],
  reading = [],
  onOpenExam = () => {},
  onOpenListening = () => {},
  onOpenReading = () => {}
}) {
  return (
    <div className="path-main">
      <section className="resume-card">
        <div className="resume-text">
          <p className="resume-eyebrow">Entraînement</p>
          <h1 className="resume-title">Format TOEIC</h1>
          <p className="resume-meta">
            Les deux compétences notées à l'examen, plus l'épreuve complète.
          </p>
        </div>
      </section>

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

      <Module
        title="Compréhension orale"
        subtitle="Conversations, annonces et questions-réponses"
        items={listening}
        labels={LISTENING_LABELS}
        icon={IconHeadphones}
        onOpen={onOpenListening}
      />

      <Module
        title="Compréhension écrite"
        subtitle="Textes à trous, courriels, documents multiples"
        items={reading}
        labels={READING_LABELS}
        icon={IconRead}
        onOpen={onOpenReading}
      />
    </div>
  )
}

function Module({ title, subtitle, items, labels, icon: Icon, onOpen }) {
  // Un module vide veut dire que son script SQL n'a pas encore ete passe.
  // On le dit, plutot que d'afficher une rubrique vide sans explication.
  const done = items.filter((item) => item.completed).length

  return (
    <section className="level-block">
      <header className="level-head">
        <span className="level-pill">{items.length}</span>
        <h2 className="level-name">{title}</h2>
        <span className="level-count">{done} / {items.length}</span>
      </header>

      {items.length === 0 ? (
        <p className="alert">
          Aucun contenu en base pour ce module — son script n'a pas encore été
          exécuté.
        </p>
      ) : (
        <>
          <p className="level-sub">{subtitle}</p>
          <ol className="lesson-list">
            {items.map((item) => {
              const state = item.completed ? 'done' : item.unlocked ? 'current' : 'locked'

              return (
                <li key={item.id} className={`lesson-row is-${state} is-practice`}>
                  <button
                    type="button"
                    className="lesson-hit"
                    disabled={!item.unlocked}
                    onClick={() => onOpen(item.id)}
                    aria-label={
                      item.unlocked
                        ? `${item.title}${item.completed ? ', terminé' : ', à faire'}`
                        : `${item.title}, verrouillé`
                    }
                  >
                    <span className="lesson-badge" aria-hidden="true">
                      {item.completed ? <IconCheck size={22} strokeWidth={2.5} /> : <Icon size={20} />}
                    </span>

                    <span className="lesson-text">
                      <span className="lesson-title">{item.title}</span>
                      <span className="lesson-meta">
                        {item.level} · {labels[item.format] || item.format}
                        {item.completed
                          ? ` · Fait ${item.score ?? 0} %`
                          : item.unlocked
                            ? ` · +${item.xp_reward} XP`
                            : ' · Verrouillé'}
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
        </>
      )}
    </section>
  )
}
