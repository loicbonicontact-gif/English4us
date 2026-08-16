// Dates de calendrier — un seul calcul pour toute l'application.
//
// Toutes les dates manipulées ici sont des *jours*, pas des instants :
// la date d'une série, l'échéance d'une révision. Le piège classique est
// `new Date().toISOString()`, qui rend la date UTC : pour quelqu'un en
// France (UTC+2 l'été), il est déjà le 17 à 00 h 30 alors qu'UTC affiche
// encore le 16. La série se casserait un soir sur deux.
//
// Règle appliquée : « aujourd'hui » se lit dans le fuseau de l'apprenant,
// les décalages se calculent en UTC pour que ni le fuseau ni les
// changements d'heure ne fassent perdre ou gagner un jour.

export function todayISO() {
  const now = new Date()
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0')
  ].join('-')
}

export function addDays(isoDate, days) {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().split('T')[0]
}
