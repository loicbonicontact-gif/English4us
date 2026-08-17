import { useEffect, useRef } from 'react'
import { IconClose } from './Icons'
import Mascot from './Mascot'

// Invitation aux rappels quotidiens.
//
// POURQUOI CET ÉCRAN EXISTE, AU LIEU D'APPELER DIRECTEMENT LE NAVIGATEUR
// La fenêtre d'autorisation du navigateur ne dit rien : « Ce site souhaite
// vous envoyer des notifications », et deux boutons. Présentée sans
// contexte, elle se refuse par réflexe — et **un refus est définitif** :
// on ne peut plus jamais reposer la question sans passer par les réglages
// du téléphone.
//
// Cet écran explique donc AVANT, et ne déclenche la vraie demande que si
// l'apprenant dit oui ici. Celui qui dit non ici garde la possibilité
// d'activer les rappels plus tard depuis son profil ; s'il avait refusé au
// navigateur, cette porte serait fermée.
export default function PushPrompt({ onAccept, onDecline }) {
  const closeRef = useRef(null)

  useEffect(() => { closeRef.current?.focus() }, [])

  useEffect(() => {
    function onKey(event) { if (event.key === 'Escape') onDecline() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onDecline])

  return (
    <div className="feedback-veil">
      <section
        className="feedback-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="push-title"
      >
        <button
          type="button"
          ref={closeRef}
          className="feedback-close"
          onClick={onDecline}
          aria-label="Fermer sans activer les rappels"
        >
          <IconClose size={18} strokeWidth={2.25} />
        </button>

        <Mascot mood="idle" size={72} />
        <h2 id="push-title" className="feedback-title">Un rappel par jour ?</h2>
        <p className="feedback-sub">
          Un seul message, à 18 h, et seulement s'il y a quelque chose à te dire —
          des révisions en attente, ou une série à ne pas laisser tomber.
        </p>

        {/* La promesse la plus utile, et celle qui distingue ce rappel de la
            plupart : le silence les jours où l'on a deja travaille. */}
        <p className="feedback-legal">
          Si tu t'es déjà entraîné dans la journée, tu ne reçois rien.
          Tu peux couper les rappels à tout moment depuis ton profil.
        </p>

        <button type="button" className="btn-wide is-primary" onClick={onAccept}>
          Activer les rappels
        </button>

        <button type="button" className="feedback-later" onClick={onDecline}>
          Non merci
        </button>
      </section>
    </div>
  )
}
