import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import ConfigError from './components/ConfigError.jsx'
import { missingConfig } from './supabaseClient'
import './styles.css'

// Si la configuration est incomplète, on affiche un écran explicite
// plutôt que de laisser createClient planter sur une page blanche.
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    {missingConfig.length > 0 ? (
      <ConfigError missing={missingConfig} />
    ) : (
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )}
  </React.StrictMode>
)

// Mode hors ligne de l'interface (public/sw.js).
//
// UNIQUEMENT EN PRODUCTION. En développement, un service worker sert des
// fichiers en réserve pendant que Vite en envoie de neufs : on modifie un
// fichier, la page ne change pas, et on cherche l'erreur ailleurs pendant
// une heure. `import.meta.env.PROD` vaut faux sous `npm run dev`.
//
// L'enregistrement attend `load` : lancé plus tôt, il entre en concurrence
// avec le premier affichage sur une connexion lente.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Un échec ici n'a aucune conséquence visible : l'application fonctionne
    // exactement comme avant, en ligne. Inutile d'en informer l'apprenant.
    navigator.serviceWorker.register('/sw.js').catch(() => { /* silencieux */ })
  })
}
