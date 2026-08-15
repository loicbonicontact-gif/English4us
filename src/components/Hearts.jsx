import { MAX_HEARTS } from '../lib/gamification'

// Rangée de cœurs. Celui qui vient d'être perdu se brise :
// il tremble, se fissure, puis s'éteint. L'information passe
// sans qu'on ait besoin de lire quoi que ce soit.
export default function Hearts({ hearts, breakingIndex = null }) {
  return (
    <ul className="hearts" aria-label={`${hearts} cœurs restants sur ${MAX_HEARTS}`}>
      {Array.from({ length: MAX_HEARTS }, (_, i) => {
        const isAlive = i < hearts
        const isBreaking = i === breakingIndex

        return (
          <li
            key={i}
            className={`heart ${isAlive ? 'is-alive' : 'is-lost'} ${isBreaking ? 'is-breaking' : ''}`}
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" width="26" height="26">
              {/* Moitié gauche et moitié droite séparées : elles s'écartent
                  l'une de l'autre quand le cœur se brise. */}
              <path
                className="heart-half heart-left"
                d="M12 21s-7.5-4.7-9.4-9.2C1 8.4 3 5 6.4 5c2 0 3.5 1.1 4.4 2.3l1.2 1.5V21z"
              />
              <path
                className="heart-half heart-right"
                d="M12 21s7.5-4.7 9.4-9.2C23 8.4 21 5 17.6 5c-2 0-3.5 1.1-4.4 2.3L12 8.8V21z"
              />
            </svg>
          </li>
        )
      })}
    </ul>
  )
}
