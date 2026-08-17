import { useEffect, useMemo, useRef, useState } from 'react'
import { buildTiles, joinTiles } from '../lib/wordOrder'

// « Remets les mots dans l'ordre » : des étiquettes à cliquer.
//
// POURQUOI CLIQUER ET NON GLISSER
// Le glisser-déposer est le réflexe pour ce format. Il a été écarté : sur
// téléphone il entre en conflit avec le défilement de la page, et il est
// inutilisable au clavier comme au lecteur d'écran. Deux clics — un pour
// poser, un pour reprendre — font le même travail et fonctionnent partout.
//
// L'ÉTAT VIT ICI, LA RÉPONSE REMONTE
// Le parent ne connaît qu'une chaîne de caractères, comme pour une
// traduction tapée au clavier : la correction reste la même pour tous les
// exercices écrits. Ce composant garde seulement la trace de QUELLES
// étiquettes sont posées, information que la phrase seule perdrait quand un
// mot se répète.

// Retrouve quelles étiquettes composent une phrase déjà écrite. Utile pour
// afficher un état de départ ; on prend chaque fois la première étiquette
// encore libre, ce qui gère les mots répétés (« the … the »).
function tilesFor(sentence, tiles) {
  if (!sentence) return []
  const rest = [...tiles]

  return sentence.split(/\s+/).filter(Boolean).reduce((ids, word) => {
    const at = rest.findIndex((tile) => tile.word.toLowerCase() === word.toLowerCase())
    if (at === -1) return ids
    return [...ids, rest.splice(at, 1)[0].id]
  }, [])
}

export default function WordBank({ exercise, answer, onAnswer, disabled = false, verdict = null }) {
  const tiles = useMemo(() => buildTiles(exercise), [exercise])

  // Étiquettes posées, dans l'ordre. On part de la réponse déjà connue s'il
  // y en a une : le composant peut ainsi s'afficher déjà rempli — c'est ce
  // qui permet de prévisualiser l'écran corrigé sans base de données.
  const [placed, setPlaced] = useState(() => tilesFor(answer, tiles))

  // Miroir de `placed`, toujours à jour. React regroupe les mises à jour
  // d'état : deux clics très rapprochés liraient tous les deux la MÊME
  // valeur de `placed`, et le second effacerait le premier. Le mot posé
  // disparaîtrait sans explication. La référence, elle, est écrite
  // immédiatement.
  const placedRef = useRef(placed)

  // Le parent remet la réponse à vide en passant à la question suivante et
  // quand la leçon recommence après cinq erreurs. Sans cette remise à zéro,
  // la phrase précédente resterait affichée sur l'exercice suivant.
  useEffect(() => {
    if (!answer) { placedRef.current = []; setPlaced([]) }
  }, [answer])

  const placedSet = new Set(placed)
  const placedTiles = placed.map((id) => tiles.find((tile) => tile.id === id)).filter(Boolean)
  const bank = tiles.filter((tile) => !placedSet.has(tile.id))

  function update(next) {
    placedRef.current = next
    setPlaced(next)
    onAnswer(joinTiles(next.map((id) => tiles.find((tile) => tile.id === id)).filter(Boolean)))
  }

  function place(id) {
    if (disabled) return
    update([...placedRef.current, id])
  }

  function remove(id) {
    if (disabled) return
    update(placedRef.current.filter((entry) => entry !== id))
  }

  return (
    <div className="wordbank">
      {/* La phrase en construction. Elle garde sa hauteur même vide : sans
          cela, poser la première étiquette ferait sauter toute la page. */}
      <ol
        className={`wordbank-line ${verdict === 'right' ? 'is-right' : ''} ${verdict === 'wrong' ? 'is-wrong' : ''}`}
        aria-label="Ta phrase"
      >
        {placedTiles.map((tile) => (
          <li key={tile.id}>
            <button
              type="button"
              className="word-tile is-placed"
              onClick={() => remove(tile.id)}
              disabled={disabled}
              lang="en"
              aria-label={`Retirer « ${tile.word} » de ta phrase`}
            >
              {tile.word}
            </button>
          </li>
        ))}
        {placedTiles.length === 0 && (
          <li className="wordbank-empty" aria-hidden="true">Clique les mots dans le bon ordre…</li>
        )}
      </ol>

      {/* La réserve. Les étiquettes posées y laissent un vide plutôt que de
          disparaître : la réserve ne se réorganise pas sous le doigt, et
          l'apprenant retrouve un mot là où il l'avait vu. */}
      <ul className="wordbank-pool" aria-label="Mots disponibles">
        {tiles.map((tile) => {
          const used = placedSet.has(tile.id)
          return (
            <li key={tile.id} className={used ? 'is-used' : ''}>
              {used ? (
                <span className="word-tile is-ghost" aria-hidden="true">{tile.word}</span>
              ) : (
                <button
                  type="button"
                  className="word-tile"
                  onClick={() => place(tile.id)}
                  disabled={disabled}
                  lang="en"
                  aria-label={`Ajouter « ${tile.word} » à ta phrase`}
                >
                  {tile.word}
                </button>
              )}
            </li>
          )
        })}
        {bank.length === 0 && (
          <li className="wordbank-note">Tous les mots sont posés.</li>
        )}
      </ul>
    </div>
  )
}
