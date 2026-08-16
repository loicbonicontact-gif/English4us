import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchListeningProgress, fetchPassages, FORMAT_LABELS } from '../lib/listening'
import { isSpeechAvailable } from '../lib/speech'
import { isMissingTable, missingTableMessage } from '../lib/dbErrors'
import { LEVELS } from '../data/curriculum'
import { IconChevron, IconHeadphones } from './Icons'
import Mascot from './Mascot'
import { LEVEL_BLURB } from './PathView'

// Liste des passages d'ecoute, groupes par niveau CECRL.
//
// Contrairement au parcours, rien n'est verrouille : la comprehension orale
// se travaille en ecoutant plus difficile que son niveau, pas en attendant
// d'avoir termine le niveau precedent.
export default function ListeningList({ profile }) {
  const navigate = useNavigate()
  const [passages, setPassages] = useState([])
  const [progress, setProgress] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    Promise.all([fetchPassages(), fetchListeningProgress(profile?.id)])
      .then(([list, done]) => {
        if (!active) return
        setPassages(list)
        setProgress(done)
      })
      .catch((err) => {
        if (!active) return
        setError(isMissingTable(err)
          ? missingTableMessage('migration-listening.sql puis seed-listening.sql')
          : err.message)
      })
      .finally(() => { if (active) setLoading(false) })

    return () => { active = false }
  }, [profile?.id])

  if (loading) {
    return (
      <div className="path-loading">
        <Mascot mood="thinking" size={78} />
        <p>Chargement des écoutes…</p>
      </div>
    )
  }

  if (error) return <p className="alert alert-error" role="alert">{error}</p>

  if (passages.length === 0) {
    return <p className="path-status">Aucun passage d'écoute en base pour l'instant.</p>
  }

  const byLevel = LEVELS
    .map((level) => ({ level, items: passages.filter((p) => p.level === level) }))
    .filter((group) => group.items.length > 0)

  return (
    <div className="listen-list">
      <header className="listen-list-head">
        <h1>Compréhension orale</h1>
        <p>
          Écoute des conversations et des annonces, puis réponds aux questions.
          Le texte n'est jamais affiché avant que tu aies répondu — c'est ainsi
          que se travaille l'oreille, et c'est le format des parties 2, 3 et 4
          du TOEIC.
        </p>
      </header>

      {/* Sans synthese vocale et sans fichier audio, aucun passage n'est
          ecoutable : mieux vaut le dire franchement que laisser l'apprenant
          appuyer sur un bouton muet. */}
      {!isSpeechAvailable() && !passages.some((p) => p.audio_url) && (
        <p className="alert alert-error" role="alert">
          Ce navigateur ne sait pas lire de texte à voix haute. Essaie avec
          Chrome, Safari ou Edge pour utiliser ce module.
        </p>
      )}

      {byLevel.map((group) => (
        <section key={group.level} className="listen-group">
          {/* Meme en-tete de niveau que le parcours : l'apprenant reconnait
              immediatement le reperage A1 -> C2 d'un ecran a l'autre. */}
          <header className="level-head">
            <span className="level-pill">{group.level}</span>
            <h2 className="level-name">{LEVEL_BLURB[group.level]}</h2>
            <span className="level-count">{group.items.length}</span>
          </header>

          <ul className="listen-items">
            {group.items.map((passage) => {
              const done = progress[passage.id]

              return (
                <li key={passage.id}>
                  <button
                    type="button"
                    className={`listen-item ${done ? 'is-done' : ''}`}
                    onClick={() => navigate(`/listening/${passage.id}`)}
                  >
                    <span className="listen-item-icon">
                      <IconHeadphones size={20} />
                    </span>

                    <span className="listen-item-text">
                      <span className="listen-item-title">{passage.title}</span>
                      <span className="listen-item-meta">
                        {FORMAT_LABELS[passage.format]}
                        {done ? ` · déjà fait, ${done.score} %` : ''}
                      </span>
                    </span>

                    <IconChevron size={18} className="listen-item-chevron" />
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
