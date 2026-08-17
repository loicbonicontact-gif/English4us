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

// Les lectures s'intercalent de la meme facon. Sans elles, l'ecran
// « Entrainement » n'affichait qu'un module sur deux en previsualisation.
const RAW_READINGS = [
  { id: 201, level: 'A1', format: 'text_completion', title: 'Une liste de courses', position: 1, xp_reward: 10 },
  { id: 202, level: 'A1', format: 'passage', title: 'Un horaire de bus', position: 2, xp_reward: 15 },
  { id: 203, level: 'A2', format: 'passage', title: 'Un message au propriétaire', position: 3, xp_reward: 15 }
]

const RAW_READING_PROGRESS = { 201: { passage_id: 201, score: 100 } }

export const demoPath = buildPath(
  RAW_LESSONS,
  RAW_PROGRESS,
  RAW_PASSAGES,
  RAW_LISTENING_PROGRESS,
  RAW_READINGS,
  RAW_READING_PROGRESS
)

// Le meme parcours vu par un apprenant place en B1 : A1 et A2 ouverts en
// revision, B1.1 comme point de depart, et aucune lecon marquee terminee.
export const demoPathPlaced = buildPath(
  RAW_LESSONS,
  {},
  RAW_PASSAGES,
  RAW_LISTENING_PROGRESS,
  RAW_READINGS,
  RAW_READING_PROGRESS,
  { placementLevel: 'B1' }
)

// Le parcours d'un nouvel arrivant : rien de fait, l'invitation au test
// s'affiche au-dessus de tout.
export const demoPathFresh = buildPath(
  RAW_LESSONS,
  {},
  RAW_PASSAGES,
  RAW_LISTENING_PROGRESS,
  RAW_READINGS,
  RAW_READING_PROGRESS
)

// Texte à trous : la phrase entre guillemets est anglaise, donc lisible.
// Avant validation le trou reste béant (lire la phrase donnerait la
// réponse) ; après, il est comblé et la phrase s'entend en entier.
export const demoGapExercise = {
  id: 13,
  type: 'trous',
  question: 'Complète : « My ___ are John and Mary. » (Mes parents s\'appellent John et Mary.)',
  options: null,
  correct_answer: 'parents',
  explanation: '« Parents » en anglais désigne uniquement le père et la mère, jamais la famille élargie.'
}

// Traduction : la réponse EST la phrase anglaise. Le bouton ne doit
// apparaître qu'une fois l'exercice validé.
export const demoTranslationExercise = {
  id: 14,
  type: 'traduction',
  question: 'Traduis en anglais : « J\'ai vingt ans. »',
  options: null,
  correct_answer: 'I am twenty years old',
  explanation: 'Piège classique : en anglais on **est** un âge (I am), on ne l\'**a** pas comme en français.'
}

export const demoPlacementQuestion = {
  id: 501,
  question: 'Choisis la forme correcte : « She ___ to work every day. »',
  options: ['goes', 'go', 'going', 'gone'],
  correct_answer: 'goes'
}

// Un apprenant qui reussit A1 et A2 puis bute sur B1 : le cas le plus
// courant, et celui qui justifie tout le chantier.
export const demoPlacementBlocks = [
  { level: 'A1', correct: 5, total: 5 },
  { level: 'A2', correct: 4, total: 5 },
  { level: 'B1', correct: 2, total: 5 }
]

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

// --- Comprehension ecrite ---
export const demoReading = {
  id: 6,
  level: 'B1',
  format: 'passage',
  title: 'Une candidature',
  context: 'Une candidate écrit à une entreprise, qui lui répond.',
  xp_reward: 20,
  documents: [
    {
      kind: 'email',
      title: 'From: Sarah Klein — Subject: Application for Sales Assistant',
      text: 'Dear Mr Owens,\nI am writing to apply for the position of Sales Assistant advertised on your website.\nI have worked in retail for four years, and for the last two years I have managed a small team.\nI am available from the first of October.\nYours sincerely,\nSarah Klein'
    },
    {
      kind: 'email',
      title: 'From: James Owens — Subject: Re: Application',
      text: 'Dear Ms Klein,\nThank you for your application. We were impressed by your experience.\nWe would like to invite you to an interview on 12 September at 10 am.\nPlease confirm by Friday.'
    }
  ]
}

export const demoReadingQuestions = [
  {
    id: 1,
    question: 'How long has Sarah managed a team?',
    options: ['Two years', 'Four years', 'Six years', 'She has not'],
    correct_answer: 'Two years',
    explanation: 'Le texte donne deux durées : quatre ans dans le commerce, deux ans à diriger une équipe.'
  }
]

// « Remets les mots dans l'ordre » : les etiquettes viennent de
// correct_answer, et `options` porte les mots INTRUS (ici « to », que le
// francophone ajoute apres « should »).
export const demoWordOrderExercise = {
  id: 21,
  type: 'ordre',
  question: 'Construis la phrase anglaise : \u00ab Tu devrais voir un m\u00e9decin. \u00bb',
  options: ['to'],
  correct_answer: 'You should see a doctor',
  explanation: 'Apres un modal (should, must, can, will), le verbe suit nu, sans \u00ab to \u00bb.'
}
