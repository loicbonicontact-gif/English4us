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
