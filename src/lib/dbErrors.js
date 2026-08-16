// Messages d'erreur de base de données, traduits en français utile.
//
// Une table absente ne remonte pas avec un seul code : Postgres répond
// « 42P01 » quand la requête l'atteint, mais Supabase passe par PostgREST,
// qui garde en mémoire la liste des tables et répond « PGRST205 » avant même
// d'interroger la base. Ne guetter que le premier laisse passer le cas le
// plus fréquent — celui d'une migration oubliée.
const MISSING_TABLE_CODES = ['42P01', 'PGRST205']

export function isMissingTable(error) {
  if (!error) return false
  if (MISSING_TABLE_CODES.includes(error.code)) return true

  // Filet de sécurité : certaines versions ne renseignent pas `code`.
  const message = (error.message || '').toLowerCase()
  return message.includes('does not exist') || message.includes('schema cache')
}

// Message affiché quand une table manque : il doit dire quoi faire, pas
// seulement ce qui ne va pas.
export function missingTableMessage(files) {
  return `Cette partie de l'application n'existe pas encore en base de données. `
    + `Lance ${files} dans l'éditeur SQL de Supabase, puis recharge la page.`
}
