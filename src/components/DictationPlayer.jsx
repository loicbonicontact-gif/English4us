import { useEffect, useRef, useState } from 'react'
import { IconHeadphones, IconSlow, IconWave } from './Icons'
import { RATE_NORMAL, RATE_SLOW } from '../lib/speech'

// Lecteur de dictee : le seul endroit ou l'enonce d'un exercice est
// uniquement sonore.
//
// La phrase anglaise n'est JAMAIS ecrite ici — c'est tout l'interet de
// l'exercice. Elle n'apparait qu'apres validation, dans le retour.
//
// L'etat (lecture en cours, nombre d'ecoutes) est local : deux conteneurs
// differents utilisent ce composant (lecon et revision), il serait inutile
// de dupliquer ce suivi dans chacun.
export default function DictationPlayer({ text, onSpeak, disabled }) {
  const [playing, setPlaying] = useState(false)
  const [plays, setPlays] = useState(0)
  // Le navigateur peut refuser la premiere lecture automatique tant que
  // l'utilisateur n'a rien touche (regle iOS). On ne s'en plaint pas : le
  // bouton est la, bien visible, et il suffit d'appuyer.
  const autoPlayed = useRef(false)

  function play(rate) {
    if (disabled) return
    setPlaying(true)
    setPlays((n) => n + 1)
    onSpeak(text, { rate, onEnd: () => setPlaying(false) })
  }

  // Premiere lecture des l'affichage de la question : sans elle, il faudrait
  // un appui de plus a chaque exercice, sur des dizaines d'exercices.
  useEffect(() => {
    if (autoPlayed.current || disabled) return
    autoPlayed.current = true
    play(RATE_NORMAL)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  return (
    <section className="dictation" aria-label="Lecteur de dictée">
      <button
        type="button"
        className={`dictation-play ${playing ? 'is-playing' : ''}`}
        onClick={() => play(RATE_NORMAL)}
        disabled={disabled}
      >
        {playing ? <IconWave size={30} /> : <IconHeadphones size={30} />}
        <span className="dictation-play-label">
          {playing ? 'Lecture…' : plays === 0 ? 'Écouter' : 'Réécouter'}
        </span>
      </button>

      <button
        type="button"
        className="dictation-slow"
        onClick={() => play(RATE_SLOW)}
        disabled={disabled}
      >
        <IconSlow size={17} />
        Plus lentement
      </button>

      {/* Le nombre d'ecoutes est affiche, jamais limite : on n'apprend pas
          une langue en etant prive de reecouter. */}
      <p className="dictation-count" aria-live="polite">
        {plays === 0
          ? 'Appuie pour entendre la phrase.'
          : `${plays} ${plays > 1 ? 'écoutes' : 'écoute'} — réécoute autant que tu veux.`}
      </p>
    </section>
  )
}
