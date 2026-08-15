import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { MAX_HEARTS } from '../lib/gamification'
import Mascot from './Mascot'
import { IconBolt, IconCap, IconFlame, IconHeart, IconLogout, IconPath, IconSoundOff, IconSoundOn, IconTrophy } from './Icons'
import { isSoundOn, setSoundOn } from '../lib/sounds'

// Barre supérieure. Les statistiques viennent du profil remonté par App.jsx,
// qui écoute les changements Postgres en temps réel.
export default function Navbar({ profile, onSignOut }) {
  const hearts = profile?.hearts ?? 0
  const xp = profile?.xp ?? 0
  const streak = profile?.streak_count ?? 0
  const level = profile?.level ?? 'A1'
  const [sound, setSound] = useState(isSoundOn())

  // Le choix est retenu d'une session a l'autre (localStorage)
  function toggleSound() {
    const next = !sound
    setSound(next)
    setSoundOn(next)
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/dashboard" className="navbar-brand">
          <Mascot size={36} />
          <span className="navbar-brand-name">English4us</span>
        </NavLink>

        <ul className="stats" aria-label="Tes statistiques">
          <li className="stat stat-level">
            <IconCap size={18} />
            <span className="stat-value">{level}</span>
            <span className="sr-only">niveau actuel</span>
          </li>
          <li className="stat stat-streak">
            <IconFlame size={18} />
            <span className="stat-value">{streak}</span>
            <span className="sr-only">jours de série</span>
          </li>
          <li className="stat stat-xp">
            <IconBolt size={18} />
            <span className="stat-value">{xp}</span>
            <span className="sr-only">points d'expérience</span>
          </li>
          <li className={`stat stat-hearts ${hearts === 0 ? 'is-empty' : ''}`}>
            <IconHeart size={18} />
            <span className="stat-value">{hearts}<span className="stat-max">/{MAX_HEARTS}</span></span>
            <span className="sr-only">cœurs restants</span>
          </li>
        </ul>

        <nav className="navbar-nav" aria-label="Navigation principale">
          <NavLink to="/dashboard" className="nav-tab">
            <IconPath size={19} />
            <span>Parcours</span>
          </NavLink>
          <NavLink to="/leaderboard" className="nav-tab">
            <IconTrophy size={19} />
            <span>Classement</span>
          </NavLink>
        </nav>

        <button
          type="button"
          className="navbar-icon-btn"
          onClick={toggleSound}
          title={sound ? 'Couper le son' : 'Activer le son'}
          aria-pressed={sound}
        >
          {sound ? <IconSoundOn size={20} /> : <IconSoundOff size={20} />}
          <span className="sr-only">{sound ? 'Couper le son' : 'Activer le son'}</span>
        </button>

        {/* Sortie : séparée de la navigation, sans couleur d'alerte —
            se déconnecter n'est pas une action dangereuse. */}
        <button type="button" className="navbar-icon-btn navbar-signout" onClick={onSignOut} title="Se déconnecter">
          <IconLogout size={20} />
          <span className="sr-only">Se déconnecter</span>
        </button>
      </div>
    </header>
  )
}
