import { useEffect, useRef, useState } from 'react'
import { IconMic, IconSoundOn, IconWave } from './Icons'
import { listen } from '../lib/recognition'
import { scoreSpeech, speechFeedback } from '../lib/pronunciation'

// Exercice d'expression orale : l'apprenant lit une phrase a voix haute,
// le micro l'ecoute, l'application compare a ce qui etait attendu.
//
// Ici la phrase EST affichee, contrairement a la dictee : le travail n'est
// pas de la retrouver mais de la prononcer. On peut aussi ecouter le modele
// autant qu'on veut avant de se lancer — s'entrainer a prononcer sans
// jamais entendre le modele n'aurait aucun sens.
export default function SpeakingPanel({ sentence, onSpeak, onResult, disabled }) {
  const [listening, setListening] = useState(false)
  const [partial, setPartial] = useState('')
  const [error, setError] = useState(null)
  const [attempts, setAttempts] = useState(0)
  const stopRef = useRef(null)

  // Quitter l'ecran coupe le micro : un micro qui reste ouvert apres le
  // depart de l'utilisateur est un probleme de confiance, pas un detail.
  useEffect(() => () => stopRef.current?.(), [])

  // Le modele se joue tout seul a l'arrivee. L'ordre est celui de
  // l'apprentissage reel : on entend d'abord, on repete ensuite. Attendre
  // que l'apprenant pense a appuyer sur « Ecouter » le ferait prononcer de
  // memoire, ce qui n'est pas l'exercice.
  const modelPlayed = useRef(false)
  useEffect(() => {
    if (modelPlayed.current || disabled) return
    modelPlayed.current = true
    onSpeak(sentence)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentence])

  function start() {
    if (disabled || listening) return

    setError(null)
    setPartial('')
    setListening(true)
    setAttempts((n) => n + 1)

    stopRef.current = listen({
      onPartial: setPartial,
      onResult: (transcript) => {
        const result = scoreSpeech(transcript, sentence)
        onResult(result, speechFeedback(result))
      },
      onError: setError,
      onEnd: () => { setListening(false); stopRef.current = null }
    })
  }

  function stop() {
    stopRef.current?.()
    stopRef.current = null
    setListening(false)
  }

  return (
    <section className="speak" aria-label="Enregistrement de ta phrase">
      {/* Le modele avant l'effort : on ecoute, puis on imite. */}
      <button type="button" className="speak-model" onClick={() => onSpeak(sentence)}>
        <IconSoundOn size={16} />
        Écouter le modèle
      </button>

      <button
        type="button"
        className={`speak-mic ${listening ? 'is-listening' : ''}`}
        onClick={() => (listening ? stop() : start())}
        disabled={disabled}
      >
        {listening ? <IconWave size={32} /> : <IconMic size={32} />}
        <span className="speak-mic-label">
          {listening ? 'J’écoute… appuie pour arrêter' : attempts === 0 ? 'Parler' : 'Réessayer'}
        </span>
      </button>

      {/* Retour immediat pendant la parole : sans lui, on parle dans le vide
          sans savoir si le micro capte quoi que ce soit. */}
      <p className="speak-partial" aria-live="polite">
        {listening
          ? (partial || 'Prononce la phrase à voix haute…')
          : 'Appuie sur le micro, puis lis la phrase.'}
      </p>

      {error && <p className="alert alert-error speak-error" role="alert">{error}</p>}
    </section>
  )
}
