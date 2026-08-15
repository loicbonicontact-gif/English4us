import { createClient } from '@supabase/supabase-js'

// Clés publiques Supabase, injectées au build par Vite.
// Deux préfixes sont acceptés (voir envPrefix dans vite.config.js) :
//   - VITE_…      : convention standard, utilisée par le fichier .env local
//   - E4U_VITE_…  : préfixe des variables configurées sur Vercel
const env = import.meta.env

const supabaseUrl = env.VITE_SUPABASE_URL || env.E4U_VITE_SUPABASE_URL
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || env.E4U_VITE_SUPABASE_ANON_KEY

// Sans ces variables, createClient lève une erreur brute et l'application
// affiche une page blanche, impossible à diagnostiquer. On expose donc
// l'information au lieu de laisser planter silencieusement (voir main.jsx).
export const missingConfig = [
  !supabaseUrl && 'VITE_SUPABASE_URL (ou E4U_VITE_SUPABASE_URL)',
  !supabaseAnonKey && 'VITE_SUPABASE_ANON_KEY (ou E4U_VITE_SUPABASE_ANON_KEY)'
].filter(Boolean)

export const supabase = missingConfig.length
  ? null
  : createClient(supabaseUrl, supabaseAnonKey)
