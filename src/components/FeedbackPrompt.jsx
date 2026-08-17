import { useEffect, useRef, useState } from 'react'
import { IconClose } from './Icons'
import Mascot from './Mascot'

const STARS = [1, 2, 3, 4, 5]

// Demande de note, affichée une seule fois dans la vie d'un compte.
//
// CE QU'ELLE NE FAIT PAS, ET C'EST L'ESSENTIEL
// Elle ne récompense pas. Aucun XP, aucun cœur, aucun contenu débloqué en
// échange d'une note. L'application s'adresse aussi à des mineurs : offrir
// quelque chose contre un avis, c'est acheter l'avis d'un enfant.
//
// Elle ne bloque pas non plus. « Non merci » ferme, la touche Échap ferme, le
// bouton en croix ferme — et dans les trois cas on ne redemandera jamais.
//
// Pas de champ de commentaire : décision prise avec Loïc. Un champ libre est
// l'endroit exact où l'on écrit son nom ou son école sans y penser. Ne pas
// l'offrir est la seule façon sûre de ne pas récolter ça.
export default function FeedbackPrompt({ onRate, onDismiss }) {
  const [hovered, setHovered] = useState(0)
  const [sent, setSent] = useState(false)
  const closeRef = useRef(null)

  // Le focus entre dans la boîte à l'ouverture, sinon la touche Échap et le
  // clavier ne servent à rien pour qui ne se sert pas de la souris.
  useEffect(() => { closeRef.current?.focus() }, [])

  useEffect(() => {
    function onKey(event) { if (event.key === 'Escape') onDismiss() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onDismiss])

  function pick(rating) {
    if (sent) return
    setSent(true)
    onRate(rating)
  }

  return (
    <div className="feedback-veil">
      <section
        className="feedback-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
      >
        <button
          type="button"
          ref={closeRef}
          className="feedback-close"
          onClick={onDismiss}
          aria-label="Fermer sans noter"
        >
          <IconClose size={18} strokeWidth={2.25} />
        </button>

        {sent ? (
          <>
            <Mascot mood="happy" size={72} />
            <h2 id="feedback-title" className="feedback-title">Merci !</h2>
            <p className="feedback-sub">C'est noté. On ne te le redemandera plus.</p>
          </>
        ) : (
          <>
            <Mascot mood="idle" size={72} />
            <h2 id="feedback-title" className="feedback-title">Tu en penses quoi ?</h2>
            <p className="feedback-sub">
              Cinq leçons, déjà. Une note nous aide à savoir ce qui marche.
            </p>

            {/* `radiogroup` : cinq valeurs qui s'excluent. Les fleches du
                clavier y naviguent naturellement. */}
            <div className="feedback-stars" role="radiogroup" aria-label="Note sur 5">
              {STARS.map((value) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked="false"
                  className={`feedback-star ${value <= hovered ? 'is-lit' : ''}`}
                  onClick={() => pick(value)}
                  onMouseEnter={() => setHovered(value)}
                  onMouseLeave={() => setHovered(0)}
                  onFocus={() => setHovered(value)}
                  onBlur={() => setHovered(0)}
                  aria-label={`${value} sur 5`}
                >
                  <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4 6.2 20.5l1.1-6.5L2.6 9.4l6.5-.9z"
                    />
                  </svg>
                </button>
              ))}
            </div>

            {/* La phrase qui rend la collecte honnête : on dit ce qu'on garde
                et comment le retirer, AVANT que la note soit donnée. */}
            <p className="feedback-legal">
              Seule la note est enregistrée, liée à ton compte. Aucun commentaire,
              aucune autre donnée. Tu peux la retirer à tout moment depuis ton profil.
            </p>

            {/* « Non merci » et non « Plus tard » : on ne redemandera
                jamais, donc « plus tard » serait faux. Un bouton qui ment
                sur ce qu'il fait est un piege, meme quand il arrange. */}
            <button type="button" className="feedback-later" onClick={onDismiss}>
              Non merci
            </button>
          </>
        )}
      </section>
    </div>
  )
}
