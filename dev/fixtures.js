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

// Les ecoutes s'intercalent dans le parcours, une toutes les deux lecons.
const RAW_PASSAGES = [
  { id: 101, level: 'A1', format: 'question_response', title: 'Une question simple', position: 1, xp_reward: 10 },
  { id: 102, level: 'A1', format: 'conversation', title: 'Au café', position: 2, xp_reward: 15 },
  { id: 103, level: 'A1', format: 'talk', title: 'Annonce à la gare', position: 3, xp_reward: 15 },
  { id: 104, level: 'A2', format: 'conversation', title: 'Demander son chemin', position: 4, xp_reward: 15 }
]

const RAW_LISTENING_PROGRESS = {}

export const demoPath = buildPath(RAW_LESSONS, RAW_PROGRESS, RAW_PASSAGES, RAW_LISTENING_PROGRESS)

export const demoProfile = {
  id: 'demo',
  username: 'malo',
  xp: 10,
  hearts: 2,
  streak_count: 1,
  level: 'A1',
  created_at: '2026-08-01T09:00:00Z'
}

export const demoLesson = { id: 2, title: 'La famille', level: 'A1', unit_order: 2, xp_reward: 10 }

export const demoExercise = {
  id: 12,
  type: 'qcm',
  question: 'Comment dit-on « ma tante » ?',
  options: ['My uncle', 'My cousin', 'My aunt', 'My niece'],
  correct_answer: 'My aunt',
  explanation: "« Aunt » désigne la sœur de ton père ou de ta mère. À ne pas confondre avec « uncle », son équivalent masculin."
}

export const demoResults = [
  { question: 'ma tante', answer: 'My aunt', right: false },
  { question: 'mon frère', answer: 'My brother', right: true },
  { question: 'ma sœur', answer: 'My sister', right: true },
  { question: 'mes parents', answer: 'My parents', right: false }
]

export const demoBoard = [
  { id: 'a', username: 'clara', xp: 1240 },
  { id: 'b', username: 'yanis', xp: 980 },
  { id: 'c', username: 'ines', xp: 760 },
  { id: 'demo', username: 'malo', xp: 610 },
  { id: 'e', username: 'noah', xp: 430 },
  { id: 'f', username: 'lina', xp: 220 }
]

// --- Comprehension orale ---
export const demoPassage = {
  id: 1,
  level: 'A1',
  format: 'conversation',
  title: 'Au café',
  context: 'Deux personnes commandent au comptoir d\'un café.',
  audio_url: null,
  xp_reward: 15,
  script: [
    { speaker: 'A', text: 'Good morning. What would you like?' },
    { speaker: 'B', text: 'Good morning. A coffee and a chocolate cake, please.' },
    { speaker: 'A', text: 'Of course. Would you like the coffee with milk?' },
    { speaker: 'B', text: 'No, thank you. Just black. How much is that?' },
    { speaker: 'A', text: 'That is five euros fifty.' }
  ]
}

export const demoListeningQuestions = [
  {
    id: 1,
    question: 'What does the customer order?',
    options: ['A coffee and a cake', 'A tea and a sandwich', 'Two coffees', 'A chocolate drink'],
    correct_answer: 'A coffee and a cake',
    explanation: 'Le mot « chocolate » désigne ici le gâteau, pas la boisson.'
  },
  {
    id: 2,
    question: 'How much does it cost?',
    options: ['5.50', '5.15', '15.50', '5.05'],
    correct_answer: '5.50',
    explanation: 'Attention à ne pas entendre « fifteen ».'
  }
]

export const demoDictation = {
  id: 99,
  type: 'ecoute',
  question: 'Quelqu\'un décrit sa famille.',
  options: null,
  correct_answer: 'I have two brothers and one sister',
  explanation: 'Piège d\'écoute : « brothers » porte un « s » sonore, « sister » est au singulier.'
}

export const demoSpeaking = {
  id: 98,
  type: 'oral',
  question: 'Parle de ta famille.',
  options: null,
  correct_answer: 'This is my mother and my father',
  explanation: 'Deux « th » différents : celui de « this » est sonore.'
}
