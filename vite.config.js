import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },

  // Par défaut, Vite n'expose au navigateur que les variables préfixées
  // "VITE_" (sécurité : évite d'envoyer une clé serveur dans le bundle).
  // On autorise en plus "E4U_VITE_", le préfixe utilisé sur Vercel.
  // Ne JAMAIS ajouter ici un préfixe couvrant des secrets serveur.
  envPrefix: ['VITE_', 'E4U_VITE_']
})
