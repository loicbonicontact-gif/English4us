/* ============================================
   SERVICE WORKER — English4us
   Mode hors ligne de l'INTERFACE, et d'elle seule.

   CE QU'IL FAIT
   Il garde en réserve les fichiers de l'interface (HTML, CSS, JavaScript,
   icônes, polices). Sans connexion, l'application s'ouvre quand même :
   l'écran apparaît, la navigation fonctionne, et un bandeau prévient
   honnêtement que les données ne suivent pas.

   CE QU'IL NE FAIT PAS, ET C'EST VOULU
   Il ne met JAMAIS en réserve les réponses de Supabase. Un service worker
   sait garder des fichiers ; il ne sait pas inventer une base de données.
   Servir une progression vieille d'une semaine serait pire que de ne rien
   servir du tout : l'apprenant croirait avoir perdu son travail.

   Comme Supabase est sur un autre domaine, la règle est simple à tenir —
   tout ce qui ne vient pas de notre propre domaine est ignoré, et part au
   réseau comme si ce fichier n'existait pas.

   POURQUOI ÉCRIT À LA MAIN
   Un générateur (vite-plugin-pwa et compagnie) produit un fichier illisible
   et une dépendance de plus. Ici la règle tient en trente lignes, elle est
   commentée, et elle peut se relire.
   ============================================ */

// Nom de la réserve. LE CHANGER À CHAQUE MODIFICATION DE CE FICHIER :
// c'est ce qui déclenche le nettoyage des anciennes réserves à l'activation.
const CACHE = 'english4us-v2'

// Le strict minimum pour que l'application s'ouvre hors ligne.
//
// Les fichiers construits par Vite (/assets/index-a1b2c3.js) ne sont PAS
// listés ici : leur nom change à chaque déploiement, on ne peut donc pas les
// écrire d'avance. Ils entrent dans la réserve à la première visite, par la
// règle « cache-first » ci-dessous — et comme leur nom est unique, une
// version périmée ne peut jamais être servie à la place d'une neuve.
const SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png',
  '/icon.svg'
]

self.addEventListener('install', (event) => {
  // `addAll` échoue en bloc si un seul fichier manque. On passe donc par des
  // requêtes individuelles tolérantes : une icône absente ne doit pas
  // empêcher tout le mode hors ligne de s'installer.
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => Promise.all(
        SHELL.map((url) => cache.add(url).catch(() => { /* fichier optionnel */ }))
      ))
      // Sans `skipWaiting`, la nouvelle version attend que TOUS les onglets
      // soient fermés. Sur un téléphone, cela peut prendre des jours.
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names.filter((name) => name !== CACHE).map((name) => caches.delete(name))
      ))
      // Prend la main sur les onglets déjà ouverts, sans attendre un
      // rechargement.
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  // On ne touche qu'aux lectures. Un POST vers Supabase (une réponse
  // d'exercice, une progression) doit partir au réseau, toujours.
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Tout ce qui n'est pas notre domaine part au réseau sans passer par nous :
  // Supabase en premier lieu. C'est la règle qui protège les données.
  if (url.origin !== self.location.origin) return

  // --- Navigation (ouvrir l'application, changer de page) ---
  //
  // Réseau d'abord : on veut la version la plus fraîche quand elle est
  // joignable. Hors ligne, on retombe sur la page d'accueil en réserve —
  // React reprend la main et affiche la bonne route.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE).then((cache) => cache.put('/index.html', copy))
          return response
        })
        .catch(() => caches.match('/index.html').then((cached) => cached || offlineFallback()))
    )
    return
  }

  // --- Fichiers (JavaScript, CSS, icônes, polices) ---
  //
  // Réserve d'abord : c'est ce qui rend l'ouverture instantanée, connexion ou
  // pas. Sans danger de servir une version périmée, puisque Vite met une
  // empreinte unique dans chaque nom de fichier.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached

      return fetch(request).then((response) => {
        // On ne garde que ce qui a vraiment abouti. Mettre une erreur 404 en
        // réserve la rendrait définitive.
        if (response.ok && response.type === 'basic') {
          const copy = response.clone()
          caches.open(CACHE).then((cache) => cache.put(request, copy))
        }
        return response
      })
    })
  )
})

// Dernier recours : ni réseau, ni réserve. Cela n'arrive qu'avant la toute
// première visite réussie — donc jamais en usage normal. Mieux vaut une
// phrase lisible qu'une page d'erreur du navigateur.
function offlineFallback() {
  return new Response(
    `<!doctype html><html lang="fr"><meta charset="utf-8">
     <meta name="viewport" content="width=device-width,initial-scale=1">
     <title>Hors ligne — English4us</title>
     <body style="font-family:system-ui,sans-serif;background:#f6f7f9;color:#14161a;
                  display:grid;place-items:center;height:100vh;margin:0;padding:24px;text-align:center">
       <div>
         <h1 style="font-size:22px;margin:0 0 8px">Pas de connexion</h1>
         <p style="color:#3f444d;margin:0">Reconnecte-toi à internet, puis rouvre English4us.</p>
       </div>
     </body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  )
}

/* ============================================
   RAPPEL QUOTIDIEN — reception des notifications

   Le service worker est le SEUL endroit qui puisse afficher une
   notification quand l'application est fermee. C'est pour ca que ces deux
   gestionnaires vivent ici et pas dans l'application.
   ============================================ */

self.addEventListener('push', (event) => {
  // Message par defaut : si la charge utile est illisible (version future,
  // envoi malformé), mieux vaut une notification generique qu'aucune.
  let message = { title: 'English4us', body: 'C’est le moment de t’entraîner.' }

  try {
    if (event.data) message = { ...message, ...event.data.json() }
  } catch { /* charge utile illisible : on garde le message par defaut */ }

  event.waitUntil(
    self.registration.showNotification(message.title, {
      body: message.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      lang: 'fr',
      // `tag` : une notification remplace la precedente au lieu de
      // s'empiler. Quelqu'un qui n'ouvre pas l'application pendant une
      // semaine doit trouver UN rappel, pas sept.
      tag: 'rappel-quotidien',
      renotify: false
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  // Si l'application est deja ouverte quelque part, on ramene cet onglet au
  // lieu d'en ouvrir un second — sinon on se retrouve avec deux copies de
  // l'application, dont une avec une progression perimee.
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      for (const client of windows) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate('/dashboard')
          return client.focus()
        }
      }
      return self.clients.openWindow('/dashboard')
    })
  )
})
