import { NavLink } from 'react-router-dom'
import { IconPath, IconReview, IconUser } from './Icons'

// Coque de l'application : en-tete de marque en haut, barre d'onglets en bas.
//
// Sur telephone, l'ancienne barre affichait quatre pastilles (niveau, serie,
// XP, coeurs) : trop d'information pour une largeur de 390 px. Il ne reste
// que l'XP, la seule valeur du compte qui change pendant une lecon.
//
// Les coeurs ont disparu d'ici : ils appartiennent desormais a la lecon en
// cours, pas au compte. Les afficher en permanence laisserait croire qu'on
// peut en manquer avant meme d'avoir commence. Ils restent visibles dans
// l'ecran d'exercice, la ou ils ont un sens.
//
// L'onglet actif se deduit de la route : aucun etat a maintenir ici.
export default function AppShell({ profile, dueCount = 0, banner = null, children }) {
  const xp = profile?.xp ?? 0

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
            <NavLink to="/reviews" className="tab">
              <span className="tab-icon">
                <IconReview size={20} />
                {/* Pastille de rappel : le seul endroit ou l'app reclame
                    quelque chose. Elle disparait des que la file est vide. */}
                {dueCount > 0 && (
                  <span className="tab-badge" aria-hidden="true">
                    {dueCount > 99 ? '99+' : dueCount}
                  </span>
                )}
              </span>
              <span className="tab-label">Révisions</span>
              {dueCount > 0 && (
                <span className="sr-only">{dueCount} exercices à revoir</span>
              )}
            </NavLink>
            {/* Trois onglets, volontairement. Un quatrieme a ete essaye
                deux fois le 17/08 — un classement, puis un raccourci vers
                l'ecoute et la lecture — et retire les deux fois : une place
                permanente se merite par une visite quotidienne. Le parcours
                et les revisions s'ouvrent tous les jours, le profil porte les
                reglages. Le reste vit dans le parcours. */}
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
          </div>
        </div>
      </header>

      {/* Bandeau hors ligne, fourni par App : il coiffe l'en-tete pour
          etre lu avant le contenu. */}
      {banner}

      <main className="app-main">{children}</main>
    </div>
  )
}
