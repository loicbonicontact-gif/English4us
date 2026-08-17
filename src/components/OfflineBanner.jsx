import { useEffect, useState } from 'react'
import { isOffline, subscribeToNetwork, OFFLINE_MESSAGE } from '../lib/network'

// Bandeau « pas de connexion ».
//
// POURQUOI IL EXISTE
// Contrepartie honnête du mode hors ligne. Le service worker fait s'ouvrir
// l'application sans réseau ; sans ce bandeau, elle s'ouvrirait donc
// NORMALEMENT, l'apprenant répondrait, rien ne s'enregistrerait, et il ne
// saurait pas pourquoi.
//
// POURQUOI IL EST AU-DESSUS DE TOUT, ET NON DANS AppShell
// Il y était d'abord. Le défaut est apparu en coupant vraiment le serveur :
// hors ligne et déconnecté, on voyait l'écran de connexion sans le moindre
// avertissement, et le bouton « Se connecter » échouait sans explication.
// AppShell n'enveloppe que les écrans d'un compte connecté — or c'est
// précisément avant la connexion que l'absence de réseau est la plus
// déroutante.
export default function OfflineBanner() {
  const offline = useOffline()
  if (!offline) return null

  // `role="status"` : annoncé au lecteur d'écran sans interrompre ce qui est
  // en cours. Un `alert` couperait la lecture d'une question.
  return <p className="offline-banner" role="status">{OFFLINE_MESSAGE}</p>
}

// L'état de départ est lu une seule fois, au montage. `lib/network` renvoie
// « en ligne » quand l'information n'existe pas : dans le doute, pas de
// bandeau — un avertissement affiché à tort trouble plus qu'il n'aide.
function useOffline() {
  const [offline, setOffline] = useState(() => isOffline())
  useEffect(() => subscribeToNetwork(setOffline), [])
  return offline
}
