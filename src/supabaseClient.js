import { createClient } from '@supabase/supabase-js'

// Remplacer par tes clés Supabase (Project Settings > API)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
