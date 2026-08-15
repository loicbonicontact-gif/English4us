import { NavLink } from 'react-router-dom'
import { MAX_HEARTS } from '../lib/gamification'

// Barre supérieure : identité du produit, statistiques de jeu, navigation.
// Les statistiques viennent du profil remonté par App.jsx, qui écoute
// les changements Postgres en temps réel — pas besoin de recharger la page.
export default function Navbar({ profile, onSignOut }) {
  const hearts = profile?.hearts ?? 0
  const xp = profile?.xp ?? 0
  const streak = profile?.streak_count ?? 0
  const level = profile?.level ?? 'A1'

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/dashboard" className="navbar-brand">
          <span aria-hidden="true">🦉</span>
          <span className="navbar-brand-name">LinguaFree</span>
        </NavLink>

        <ul className="navbar-stats" aria-label="Tes statistiques">
          <li className="stat stat-level" title={`Niveau ${level}`}>
            <span className="stat-icon" aria-hidden="true">🎓</span>
            <span className="stat-value">{level}</span>
            <span className="sr-only">niveau</span>
          </li>

          <li className="stat stat-streak" title={`${streak} jour(s) d'affilée`}>
            <span className="stat-icon" aria-hidden="true">🔥</span>
            <span className="stat-value">{streak}</span>
            <span className="sr-only">jours de série</span>
          </li>

          <li className="stat stat-xp" title={`${xp} points d'expérience`}>
            <span className="stat-icon" aria-hidden="true">⚡</span>
            <span className="stat-value">{xp}</span>
            <span className="sr-only">XP</span>
          </li>

          <li
            className={`stat stat-hearts ${hearts === 0 ? 'is-empty' : ''}`}
            title={`${hearts} cœur(s) sur ${MAX_HEARTS}`}
          >
            <span className="stat-icon" aria-hidden="true">{hearts > 0 ? '❤️' : '💔'}</span>
            <span className="stat-value">{hearts}</span>
            <span className="sr-only">cœurs restants</span>
          </li>
        </ul>

        <nav className="navbar-links" aria-label="Navigation principale">
          <NavLink to="/dashboard" className="navbar-link">Parcours</NavLink>
          <NavLink to="/leaderboard" className="navbar-link">Classement</NavLink>
          <button type="button" className="navbar-link navbar-signout" onClick={onSignOut}>
            Quitter
          </button>
        </nav>
      </div>
    </header>
  )
}
