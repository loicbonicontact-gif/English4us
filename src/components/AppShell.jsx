import { NavLink } from 'react-router-dom'
import { IconHeart, IconPath, IconTrophy, IconUser } from './Icons'

// Coque de l'application : en-tete de marque en haut, barre d'onglets en bas.
//
// Sur telephone, l'ancienne barre affichait quatre pastilles (niveau, serie,
// XP, coeurs) : trop d'information pour une largeur de 390 px. Il n'en reste
// que deux — XP et coeurs, les seules qui changent pendant une lecon. Le
// niveau et la serie ont rejoint l'ecran de profil et la carte de progression.
//
// L'onglet actif se deduit de la route : aucun etat a maintenir ici.
export default function AppShell({ profile, children }) {
  const xp = profile?.xp ?? 0
  const hearts = profile?.hearts ?? 0

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <NavLink to="/dashboard" className="brand">
            <span className="brand-mark" aria-hidden="true">E4</span>
            <span className="brand-name">English4us</span>
          </NavLink>

          {/* La navigation vit dans l'en-tete pour l'ordre de lecture et le
              clavier. Sur telephone, le CSS la detache en bas de l'ecran :
              c'est la seule zone atteignable au pouce. */}
          <nav className="tabbar" aria-label="Navigation principale">
            <NavLink to="/dashboard" className="tab">
              <IconPath size={20} />
              <span className="tab-label">Parcours</span>
            </NavLink>
            <NavLink to="/leaderboard" className="tab">
              <IconTrophy size={20} />
              <span className="tab-label">Classement</span>
            </NavLink>
            <NavLink to="/profile" className="tab">
              <IconUser size={20} />
              <span className="tab-label">Profil</span>
            </NavLink>
          </nav>

          <div className="stat-pills">
            <span className="stat-pill">
              <span className="stat-pill-value">{xp}</span>
              <span className="stat-pill-unit">XP</span>
              <span className="sr-only">points d'expérience</span>
            </span>
            <span className="stat-pill stat-pill-hearts">
              <IconHeart size={15} fill="currentColor" strokeWidth={0} />
              <span className="stat-pill-value">{hearts}</span>
              <span className="sr-only">cœurs restants</span>
            </span>
          </div>
        </div>
      </header>

      <main className="app-main">{children}</main>
    </div>
  )
}
