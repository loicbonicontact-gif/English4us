// Previsualisation locale des ecrans, sans Supabase ni connexion.
// Ouvre http://localhost:5173/preview.html
//
// Sert a verifier le rendu et les points de rupture pendant la refonte.
// Ce fichier n'est jamais inclus dans le build de production.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import '../src/styles.css'

import AppShell from '../src/components/AppShell'
import PathView from '../src/components/PathView'
import { demoPath, demoProfile } from './fixtures'

function Preview() {
  return (
    <MemoryRouter initialEntries={['/dashboard']}>
      <AppShell profile={demoProfile}>
        <PathView
          path={demoPath}
          hearts={demoProfile.hearts}
          onOpen={(id) => console.log('ouvrir la leçon', id)}
        />
      </AppShell>
    </MemoryRouter>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode><Preview /></StrictMode>
)
