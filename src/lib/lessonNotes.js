import { supabase } from '../supabaseClient'

// Fiches de leçon : la règle et ses exemples, lisibles AVANT de commencer.
//
// Jusqu'ici la règle n'existait que dans l'`explanation` d'un exercice, donc
// après s'être trompé. Tenable pour du vocabulaire, pas pour une structure :
// personne ne devine le present perfect.

export async function fetchLessonNote(lessonId) {
  const { data, error } = await supabase
    .from('lesson_notes')
    .select('*')
    .eq('lesson_id', lessonId)
    .maybeSingle()

  if (error) throw error
  return data || null
}

// Les identifiants des leçons QUI ONT une fiche.
//
// Le parcours s'en sert pour n'afficher le bouton « Voir la fiche » que là
// où il mène quelque part. Proposer un bouton qui ouvre un écran vide est
// pire que ne rien proposer : l'apprenant croit avoir mal cliqué.
export async function fetchLessonNoteIds() {
  const { data, error } = await supabase
    .from('lesson_notes')
    .select('lesson_id')

  if (error) throw error
  return new Set((data || []).map((row) => row.lesson_id))
}

// Normalise les exemples pour l'affichage.
//
// La colonne est du JSON libre : elle peut arriver déjà décodée (Supabase le
// fait) ou sous forme de chaîne selon la façon dont la ligne a été écrite.
// Une entrée sans anglais n'a rien à montrer et disparaît — mieux vaut une
// fiche plus courte qu'une ligne vide alignée avec les autres.
export function readExamples(examples) {
  let list = examples

  if (typeof list === 'string') {
    try { list = JSON.parse(list) } catch { return [] }
  }

  if (!Array.isArray(list)) return []

  return list
    .map((entry) => ({
      en: String(entry?.en ?? '').trim(),
      fr: String(entry?.fr ?? '').trim()
    }))
    .filter((entry) => entry.en)
}
