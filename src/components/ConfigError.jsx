// Écran affiché quand les variables d'environnement Supabase manquent.
// Sans lui, l'application afficherait une page blanche sans aucune indication.
export default function ConfigError({ missing }) {
  return (
    <div className="screen-center">
      <div className="auth-card config-error">
        <span className="auth-logo" aria-hidden="true">🔌</span>
        <h1>Configuration incomplète</h1>
        <p>
          L'application ne peut pas joindre la base de données : il manque
          {missing.length > 1 ? ' ces variables' : ' cette variable'} d'environnement.
        </p>

        <ul className="config-missing">
          {missing.map((name) => <li key={name}><code>{name}</code></li>)}
        </ul>

        <p className="field-hint">
          En local : ajoute-les dans le fichier <code>.env</code>, puis relance <code>npm run dev</code>.
          <br />
          Sur Vercel : Settings → Environment Variables, puis redéploie
          (les variables ne sont lues qu'au moment de la construction).
        </p>
      </div>
    </div>
  )
}
