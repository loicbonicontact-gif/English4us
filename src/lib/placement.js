import { supabase } from '../supabaseClient'
import { LEVELS } from '../data/curriculum'

// ============================================
// Test de placement — où l'apprenant commence
//
// LE PROBLÈME
// Sans ce test, tout le monde démarre à A1 leçon 1. Un apprenant de niveau
// B1 devait traverser quinze leçons déjà connues avant d'atteindre la
// première qui lui apprenne quelque chose. C'est la façon la plus sûre de
// perdre quelqu'un dès la première semaine.
//
// LA MÉTHODE : UN ESCALIER
// On pose un bloc de questions d'un niveau. Réussi, on monte d'un niveau et
// on recommence. Raté, on s'arrête : c'est là que l'apprentissage commence.
//
//   A1 réussi → A2 réussi → B1 raté  ⇒ placé en B1
//
// Pourquoi commencer en bas plutôt qu'au milieu : un vrai débutant répond à
// cinq questions et le test est fini en une minute. C'est lui qu'il faut
// ménager — quelqu'un qui vise C1 acceptera trente questions.
//
// CE QUE LE TEST N'EST PAS
// Ce n'est pas une certification. Il puise dans les exercices à choix
// multiple déjà en base, écrits pour enseigner et non pour évaluer. Il
// donne un point de départ, révisable à tout moment, jamais un diplôme.
// ============================================

// Cinq questions par niveau, quatre bonnes réponses pour monter.
//
// Cinq est le plus petit nombre qui laisse une erreur possible sans ouvrir
// la porte au hasard : avec quatre propositions, réussir 4 sur 5 au hasard
// a environ une chance sur 800. À trois questions, il aurait fallu un
// sans-faute — trop sévère, une inattention coûterait un niveau entier.
export const BLOCK_SIZE = 5
export const PASS_RATIO = 0.8

// Nombre de bonnes réponses exigé pour un bloc, y compris incomplet.
// Un niveau qui n'aurait que trois questions en base demande donc 3 sur 3
// arrondi vers le haut de 0,8 × 3 = 2,4.
export function passMark(blockLength) {
  return Math.ceil(blockLength * PASS_RATIO)
}

export function blockPassed(correct, blockLength) {
  return blockLength > 0 && correct >= passMark(blockLength)
}

// Niveau retenu à partir des blocs déjà joués.
//
// `blocks` : [{ level, correct, total }], dans l'ordre où ils ont été posés.
// Le niveau retenu est le premier bloc échoué ; si tout est réussi, le
// dernier niveau du parcours.
export function placementLevelFrom(blocks) {
  for (const block of blocks) {
    if (!blockPassed(block.correct, block.total)) return block.level
  }
  return LEVELS[LEVELS.length - 1]
}

// Niveau suivant à tester, ou null quand le test est terminé.
export function nextLevelToTest(blocks) {
  const last = blocks[blocks.length - 1]
  if (last && !blockPassed(last.correct, last.total)) return null

  const index = blocks.length
  return index < LEVELS.length ? LEVELS[index] : null
}

// Total de bonnes réponses, tous blocs confondus.
export function totalCorrect(blocks) {
  return blocks.reduce((sum, b) => sum + b.correct, 0)
}

export function totalAsked(blocks) {
  return blocks.reduce((sum, b) => sum + b.total, 0)
}

// Combien de leçons le placement fait sauter, pour l'annoncer à l'apprenant.
// « Tu démarres directement en B1 » ne veut rien dire tant qu'on ne dit pas
// ce que cela représente.
export function lessonsSkipped(level, lessonsPerLevel = 5) {
  const index = LEVELS.indexOf(level)
  return index > 0 ? index * lessonsPerLevel : 0
}

// Mélange une liste sans la modifier (Fisher-Yates).
function shuffle(list) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// Une question n'est utilisable que si elle propose un vrai choix.
// Une ligne dont `options` serait vide ou absente afficherait un écran sans
// bouton : l'apprenant serait bloqué au milieu du test.
function usable(row) {
  return Array.isArray(row.options) && row.options.length >= 2
}

// Constitue un bloc par niveau à partir des exercices chargés.
//
// Chaque appel retire des questions différentes : deux passages du test ne
// posent pas les mêmes, ce qui évite d'apprendre les réponses par cœur en
// refaisant le test.
export function buildBlocks(rows, blockSize = BLOCK_SIZE) {
  const byLevel = {}

  for (const row of rows) {
    const level = row.lesson?.level
    if (!level || !usable(row)) continue
    if (!byLevel[level]) byLevel[level] = []
    byLevel[level].push(row)
  }

  const blocks = {}
  for (const level of LEVELS) {
    blocks[level] = shuffle(byLevel[level] || []).slice(0, blockSize)
  }
  return blocks
}

// Charge les questions candidates : uniquement des QCM, avec le niveau de
// leur leçon. La jointure est marquée `!inner` pour écarter tout exercice
// orphelin, qui n'aurait pas de niveau et fausserait le classement.
//
// La limite de 2 000 couvre largement les 840 exercices actuels ; elle
// existe pour qu'un futur ajout massif ne rapatrie pas la base entière.
export async function fetchPlacementQuestions() {
  const { data, error } = await supabase
    .from('exercises')
    .select('id, question, options, correct_answer, explanation, lesson:lessons!inner(id, level)')
    .eq('type', 'qcm')
    .limit(2000)

  if (error) throw error
  return data || []
}

// Enregistre le résultat sur le profil.
//
// `placement_taken_at` est écrit même quand l'apprenant se déclare débutant
// sans passer le test : la question a été posée et tranchée, l'invitation
// ne doit plus revenir.
export async function savePlacement(userId, level, score = null) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      placement_level: level,
      placement_taken_at: new Date().toISOString(),
      placement_score: score
    })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}
