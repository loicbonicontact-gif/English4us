import Mascot from './Mascot'

// Affichage pur de l'ecran de profil.
// Les statistiques sont calculees par Profile.jsx.
export default function ProfileView({
  username,
  memberSince,
  level,
  lessonsDone,
  streak,
  accuracy,
  soundOn,
  onToggleSound,
  onSignOut,
  placementLevel = null,
  placementAvailable = false,
  onOpenPlacement = () => {},
  rating = null,
  onDeleteRating = () => {},
  onOpenPrivacy = () => {}
}) {
  const initial = (username || '?').charAt(0).toUpperCase()

  return (
    <div className="profile-screen">
      <header className="profile-head">
        <span className="profile-avatar" aria-hidden="true">{initial}</span>
        <h1 className="profile-name">{username}</h1>
        {memberSince && <p className="profile-since">Membre depuis {memberSince}</p>}
      </header>

      <section className="level-card">
        <div className="level-card-head">
          <span className="level-card-title">
            Niveau {level.current}{level.next ? ` → ${level.next}` : ''}
          </span>
          <span className="level-card-count">
            {level.next ? `${level.inLevel} / ${level.needed} XP` : 'Niveau maximum'}
          </span>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-valuenow={level.inLevel}
          aria-valuemin={0}
          aria-valuemax={level.needed}
          aria-label="Progression vers le niveau suivant"
        >
          <span className="progress-fill" style={{ width: `${Math.max(level.percent, 5)}%` }} />
        </div>
      </section>

      <div className="end-tiles">
        <div className="end-tile">
          <span className="end-tile-value">{lessonsDone}</span>
          <span className="end-tile-label">
            leçon{lessonsDone > 1 ? 's' : ''} terminée{lessonsDone > 1 ? 's' : ''}
          </span>
        </div>
        <div className="end-tile">
          <span className="end-tile-value">{streak}</span>
          <span className="end-tile-label">jour{streak > 1 ? 's' : ''} de série</span>
        </div>
        <div className="end-tile">
          {/* Tiret tant qu'aucune leçon n'est finie : « 0 % » se lirait
              comme un mauvais résultat, alors qu'il n'y a rien à mesurer. */}
          <span className="end-tile-value end-tile-score">
            {accuracy === null ? '—' : `${accuracy} %`}
          </span>
          <span className="end-tile-label">Précision</span>
        </div>
      </div>

      {/* Le placement se refait : quelqu'un qui progresse vite hors de
          l'application, ou qui s'est place trop haut par optimisme, doit
          pouvoir se recorriger sans passer par le support. */}
      {placementAvailable && (
        <section className="settings-card">
          <div className="settings-row">
            <span className="settings-label">
              Point de départ
              <span className="settings-hint">
                {placementLevel
                  ? `Tu démarres en ${placementLevel}`
                  : 'Jamais testé — tu démarres en A1'}
              </span>
            </span>
            <button type="button" className="settings-action" onClick={onOpenPlacement}>
              {placementLevel ? 'Refaire le test' : 'Passer le test'}
            </button>
          </div>
        </section>
      )}

      <section className="settings-card">
        <div className="settings-row">
          <span className="settings-label">Sons de l'application</span>
          <button
            type="button"
            className={`toggle ${soundOn ? 'is-on' : ''}`}
            onClick={onToggleSound}
            role="switch"
            aria-checked={soundOn}
            aria-label="Sons de l'application"
          >
            <span className="toggle-knob" />
          </button>
        </div>
      </section>

      {/* Le droit a l'effacement n'a de valeur que s'il tient en un bouton.
          Demander d'ecrire un e-mail pour retirer une note sur 5 serait un
          refus deguise. La ligne n'apparait que s'il y a une note. */}
      {rating !== null && (
        <section className="settings-card">
          <div className="settings-row">
            <span className="settings-label">
              Ta note
              <span className="settings-hint">Tu as mis {rating} sur 5</span>
            </span>
            <button type="button" className="settings-action" onClick={onDeleteRating}>
              Retirer
            </button>
          </div>
        </section>
      )}

      <section className="settings-card">
        <div className="settings-row">
          <span className="settings-label">
            Confidentialité
            <span className="settings-hint">Ce qu'on enregistre, et tes droits</span>
          </span>
          <button type="button" className="settings-action" onClick={onOpenPrivacy}>
            Lire
          </button>
        </div>
      </section>

      <button type="button" className="signout-btn" onClick={onSignOut}>
        Se déconnecter
      </button>

      <Mascot mood="idle" size={72} className="profile-mascot" />
    </div>
  )
}
