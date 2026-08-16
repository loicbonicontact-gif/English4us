// Donnees de test pour la previsualisation locale des ecrans.
// Aucun rapport avec la base : ce fichier ne part jamais en production
// (Vite ne construit que index.html, preview.html est ignore au build).

import { buildPath } from '../src/lib/lessons'

const RAW_LESSONS = [
  { id: 1, level: 'A1', unit_order: 1, title: 'Se présenter', xp_reward: 10, exercise_count: 9 },
  { id: 2, level: 'A1', unit_order: 2, title: 'La famille', xp_reward: 10, exercise_count: 8 },
  { id: 3, level: 'A1', unit_order: 3, title: 'Les nombres', xp_reward: 10, exercise_count: 9 },
  { id: 4, level: 'A1', unit_order: 4, title: 'Les couleurs', xp_reward: 10, exercise_count: 9 },
  { id: 5, level: 'A1', unit_order: 5, title: 'Au restaurant', xp_reward: 10, exercise_count: 9 },
  { id: 6, level: 'A2', unit_order: 1, title: 'Raconter sa journée', xp_reward: 15, exercise_count: 9 },
  { id: 7, level: 'A2', unit_order: 2, title: 'Demander son chemin', xp_reward: 15, exercise_count: 9 },
  { id: 8, level: 'B1', unit_order: 1, title: 'Donner son avis', xp_reward: 20, exercise_count: 9 }
]

// Une leçon terminée, la deuxième en cours, le reste verrouillé.
const RAW_PROGRESS = {
  1: { lesson_id: 1, completed: true, score: 89 }
}

export const demoPath = buildPath(RAW_LESSONS, RAW_PROGRESS)

export const demoProfile = {
  id: 'demo',
  username: 'malo',
  xp: 10,
  hearts: 2,
  streak_count: 1,
  level: 'A1',
  created_at: '2026-08-01T09:00:00Z'
}
