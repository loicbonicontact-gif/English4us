import { createClient } from '@supabase/supabase-js'

// Clés publiques Supabase, injectées au build par Vite depuis .env
// (ou depuis les variables d'environnement de l'hébergeur en production).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Sans ces variables, createClient lève une erreur brute et l'application
// affiche une page blanche, impossible à diagnostiquer. On expose donc
// l'information au lieu de laisser planter silencieusement (voir main.jsx).
export const missingConfig = [
  !supabaseUrl && 'VITE_SUPABASE_URL',
  !supabaseAnonKey && 'VITE_SUPABASE_ANON_KEY'
].filter(Boolean)

export const supabase = missingConfig.length
  ? null
  : createClient(supabaseUrl, supabaseAnonKey)
