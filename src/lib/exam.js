import { supabase } from '../supabaseClient'

// ============================================
// Examen blanc — assemblage et notation
//
// CE QUE CET EXAMEN EST, ET CE QU'IL N'EST PAS
//
// Ce n'est PAS un TOEIC. Le vrai examen compte 200 questions calibrées sur
// des dizaines de milliers de candidats, et son barème n'est pas public :
// la conversion des réponses justes en score 10-990 varie d'une session à
// l'autre pour compenser la difficulté.
//
// Ce que cet examen fait : reprendre le FORMAT (deux sections, chronomètre,
// pas de retour en arrière) sur le contenu déjà présent dans l'application,
// et en tirer une ESTIMATION par règle de trois. C'est un entraînement et
// un ordre de grandeur, jamais une prédiction.
//
// L'estimation est volontairement affichée comme une fourchette : donner un
// nombre unique laisserait croire à une précision qui n'existe pas.
// ============================================

// Barème officiel : chaque section vaut de 5 à 495, le total de 10 à 990.
export const SECTION_MIN = 5
export const SECTION_MAX = 495

// Temps accordé par question, calqué sur les cadences réelles de l'examen :
// 45 minutes pour 100 questions d'écoute, 75 minutes pour 100 de lecture.
export const SECONDS_PER_LISTENING = 27
export const SECONDS_PER_READING = 45

// Convertit un nombre de bonnes réponses en score de section.
//
// Le vrai barème n'est ni public ni linéaire. On applique donc une règle de
// trois sur la plage officielle, et on arrondit au multiple de 5 — comme le
// fait l'examen, dont les scores ne prennent que ces valeurs.
export function scaleSection(correct, total) {
  if (!total) return SECTION_MIN

  const ratio = Math.max(0, Math.min(1, correct / total))
  const raw = SECTION_MIN + ratio * (SECTION_MAX - SECTION_MIN)
  return Math.round(raw / 5) * 5
}

export function totalScore(listeningScore, readingScore) {
  return listeningScore + readingScore
}

// Marge d'incertitude affichée autour de l'estimation.
//
// 50 points de part et d'autre : c'est l'ordre de grandeur de l'écart
// constaté entre deux sessions réelles pour un même candidat. Annoncer un
// score unique serait plus flatteur et moins honnête.
export const SCORE_MARGIN = 50

export function scoreRange(score) {
  return {
    low: Math.max(10, Math.round((score - SCORE_MARGIN) / 5) * 5),
    high: Math.min(990, Math.round((score + SCORE_MARGIN) / 5) * 5)
  }
}

// Équivalence indicative avec le cadre européen.
//
// Les seuils suivent la table de correspondance publiée par ETS. Ils
// restent indicatifs : le TOEIC mesure l'anglais professionnel, le CECRL
// une compétence générale. Les deux se recouvrent sans se confondre.
const LEVEL_THRESHOLDS = [
  { min: 945, level: 'C1', label: 'Maîtrise opérationnelle avancée' },
  { min: 785, level: 'B2', label: 'Autonomie professionnelle' },
  { min: 550, level: 'B1', label: 'Capacité pratique limitée' },
  { min: 225, level: 'A2', label: 'Compétence élémentaire' },
  { min: 10, level: 'A1', label: 'Premiers acquis' }
]

export function levelForScore(score) {
  return LEVEL_THRESHOLDS.find((t) => score >= t.min) || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
}

// Durée totale accordée, en millisecondes.
export function examDuration(listeningCount, readingCount) {
  const seconds = listeningCount * SECONDS_PER_LISTENING + readingCount * SECONDS_PER_READING
  return seconds * 1000
}

// Chronomètre au format mm:ss, ou h:mm:ss au-delà d'une heure.
export function formatCountdown(ms) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60

  const mm = String(minutes).padStart(2, '0')
  const ss = String(seconds).padStart(2, '0')

  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`
}

// Mélange une liste sans la modifier (Fisher-Yates).
export function shuffle(list) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// ============================================
// Assemblage depuis le contenu existant
//
// Aucun contenu n'est écrit spécialement pour l'examen : il puise dans les
// leçons, les écoutes et les lectures déjà en base. C'est ce qui le rend
// possible sans rédiger 200 questions supplémentaires — et c'est aussi
// pourquoi il faut le présenter comme un entraînement, pas un test blanc
// officiel.
// ============================================

// Nombre de questions de « phrases à compléter » (partie 5 du TOEIC),
// puisées dans les exercices de leçon à choix multiple.
export const PART5_COUNT = 30

export async function assembleExam() {
  const [listeningRes, readingRes, part5Res] = await Promise.all([
    supabase
      .from('listening_questions')
      .select('id, question, options, correct_answer, explanation, passage:listening_passages(id, title, format, script, audio_url, level)')
      .order('passage_id', { ascending: true }),
    supabase
      .from('reading_questions')
      .select('id, question, options, correct_answer, explanation, passage:reading_passages(id, title, format, documents, level)')
      .order('passage_id', { ascending: true }),
    supabase
      .from('exercises')
      .select('id, question, options, correct_answer, explanation')
      .eq('type', 'qcm')
      .limit(200)
  ])

  if (listeningRes.error) throw listeningRes.error
  if (readingRes.error) throw readingRes.error
  if (part5Res.error) throw part5Res.error

  const listening = (listeningRes.data || [])
    .filter((q) => q.passage)
    .map((q) => ({ ...q, section: 'listening' }))

  // Partie 5 : des phrases isolées, sans document. On en tire un
  // échantillon au hasard pour que deux examens ne soient pas identiques.
  const part5 = shuffle(part5Res.data || [])
    .slice(0, PART5_COUNT)
    .map((q) => ({ ...q, section: 'reading', passage: null }))

  const passages = (readingRes.data || [])
    .filter((q) => q.passage)
    .map((q) => ({ ...q, section: 'reading' }))

  const reading = [...part5, ...passages]

  return {
    listening,
    reading,
    durationMs: examDuration(listening.length, reading.length)
  }
}

// Calcule le résultat final à partir des réponses données.
export function gradeExam(exam, answers) {
  // Une question sans réponse ne rapporte rien. Comparer directement
  // `answers[q.id] === q.correct_answer` offrirait le point quand les deux
  // valent `undefined` — une question laissée blanche serait comptée juste.
  const isRight = (q) => {
    const given = answers[q.id]
    return given != null && given === q.correct_answer
  }

  const count = (questions) => questions.reduce((n, q) => n + (isRight(q) ? 1 : 0), 0)

  const listeningCorrect = count(exam.listening)
  const readingCorrect = count(exam.reading)

  const listeningScore = scaleSection(listeningCorrect, exam.listening.length)
  const readingScore = scaleSection(readingCorrect, exam.reading.length)
  const total = totalScore(listeningScore, readingScore)

  return {
    listeningCorrect,
    listeningTotal: exam.listening.length,
    listeningScore,
    readingCorrect,
    readingTotal: exam.reading.length,
    readingScore,
    total,
    range: scoreRange(total),
    level: levelForScore(total)
  }
}
