import { useEffect, useRef, useState } from 'react'
import { IconHeadphones, IconSlow, IconWave } from './Icons'
import { RATE_NORMAL, RATE_SLOW, speakScript } from '../lib/speech'

// Lecteur d'un passage de comprehension orale.
//
// Regle absolue : le texte anglais n'est JAMAIS affiche pendant l'ecoute.
// Un exercice de comprehension orale ou l'on peut lire n'est plus un
// exercice de comprehension orale. Seul un indicateur de tour de parole
// montre qui parle — c'est ce qu'on percevrait dans la vraie vie.
//
// Deux sources possibles, decidees par le contenu et non par le code :
//   - `audioUrl` renseigne  -> on joue le fichier (voix neuronale enregistree)
//   - `audioUrl` vide       -> la synthese du navigateur lit le script
export default function ListeningPlayer({ script, audioUrl, format, onFirstPlay }) {
  const [playing, setPlaying] = useState(false)
  const [plays, setPlays] = useState(0)
  const [turn, setTurn] = useState(-1)

  // Annulation de la lecture en cours (synthese) et element audio (fichier).
  const cancelRef = useRef(null)
  const audioRef = useRef(null)

  const twoSpeakers = script.some((t) => t.speaker === 'B')

  function stop() {
    cancelRef.current?.()
    cancelRef.current = null
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setPlaying(false)
    setTurn(-1)
  }

  function play(rate) {
    stop()
    setPlaying(true)
    setPlays((n) => {
      if (n === 0) onFirstPlay?.()
      return n + 1
    })

    if (audioUrl) {
      // Fichier enregistre : le debit ralenti passe par playbackRate, que
      // tous les navigateurs modernes savent appliquer sans deformer la voix.
      const audio = audioRef.current || new Audio(audioUrl)
      audioRef.current = audio
      audio.playbackRate = rate
      audio.onended = () => { setPlaying(false); setTurn(-1) }
      audio.onerror = () => { setPlaying(false); setTurn(-1) }
      audio.currentTime = 0
      audio.play().catch(() => { setPlaying(false) })
      return
    }

    cancelRef.current = speakScript(script, {
      rate,
      onTurn: setTurn,
      onEnd: () => { setPlaying(false); setTurn(-1) }
    })
  }

  // Quitter l'ecran coupe le son : sans cela, la conversation continue de se
  // jouer par-dessus l'ecran suivant.
  useEffect(() => stop, [])

  return (
    <section className="listen" aria-label="Lecteur du passage">
      <button
        type="button"
        className={`dictation-play ${playing ? 'is-playing' : ''}`}
        onClick={() => (playing ? stop() : play(RATE_NORMAL))}
      >
        {playing ? <IconWave size={30} /> : <IconHeadphones size={30} />}
        <span className="dictation-play-label">
          {playing ? 'Arrêter' : plays === 0 ? 'Écouter' : 'Réécouter'}
        </span>
      </button>

      {/* Tours de parole : des pastilles, jamais le texte. Elles montrent
          qui parle et ou l'on en est, comme le ferait la voix elle-meme. */}
      {twoSpeakers && (
        <ol className="listen-turns" aria-label="Tours de parole">
          {script.map((t, i) => (
            <li
              key={i}
              className={`listen-turn ${i === turn ? 'is-active' : ''} ${t.speaker === 'B' ? 'is-b' : 'is-a'}`}
            >
              <span aria-hidden="true">{t.speaker}</span>
              <span className="sr-only">
                Réplique {i + 1}, personne {t.speaker}{i === turn ? ', en cours' : ''}
              </span>
            </li>
          ))}
        </ol>
      )}

      <button
        type="button"
        className="dictation-slow"
        onClick={() => play(RATE_SLOW)}
      >
        <IconSlow size={17} />
        Plus lentement
      </button>

      <p className="dictation-count" aria-live="polite">
        {plays === 0
          ? FIRST_HINT[format] || 'Appuie pour lancer l’écoute.'
          : `${plays} ${plays > 1 ? 'écoutes' : 'écoute'} — au TOEIC tu n'entendras qu'une fois.`}
      </p>
    </section>
  )
}

// Le premier message rappelle la consigne de l'examen sans l'imposer :
// on peut reecouter autant qu'on veut pour apprendre, mais l'apprenant doit
// savoir que le jour J il n'aura qu'une seule ecoute.
const FIRST_HINT = {
  question_response: 'Écoute la question, puis choisis la bonne réponse.',
  conversation: 'Écoute la conversation en entier avant de répondre.',
  talk: 'Écoute l’annonce en entier avant de répondre.'
}
