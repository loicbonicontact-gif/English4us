// ============================================
// RAPPEL QUOTIDIEN — fonction Supabase (Deno)
//
// Appelée une fois par jour à 18 h, heure de Paris, par la tâche planifiée
// de `migration-push-cron.sql`. Elle regarde chaque abonné, décide s'il y a
// quelque chose de vrai à lui dire, et envoie — ou se tait.
//
// LA DÉCISION N'EST PAS ICI
// Le choix du message vit dans `message.js`, à côté, importé aussi par les
// tests. Un seul fichier, donc une seule vérité : dupliquer la règle aurait
// garanti qu'une des deux copies dérive.
//
// CE QU'ELLE NE FAIT PAS
// Elle n'envoie RIEN à quelqu'un qui a déjà travaillé aujourd'hui. C'est la
// première condition de `buildReminder`, et la raison d'être de la requête
// sur `last_activity_date`.
//
// DÉPLOIEMENT — voir README.md, section « Rappel quotidien ».
// ============================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from 'npm:web-push@3.6.7'
import { buildReminder } from './message.js'

// Secrets, posés par `supabase secrets set`. Aucune valeur en dur ici : ce
// fichier est dans le dépôt.
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const VAPID_PUBLIC = Deno.env.get('VAPID_PUBLIC_KEY')!
const VAPID_PRIVATE = Deno.env.get('VAPID_PRIVATE_KEY')!
const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT') ?? 'mailto:contact@example.org'

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE)

// Clé de service : la fonction doit lire les profils de TOUS les abonnés,
// ce qu'aucune session utilisateur ne permet. Elle ne quitte jamais le
// serveur.
const admin = createClient(SUPABASE_URL, SERVICE_ROLE)

// Date du jour à Paris. `toLocaleDateString` en 'sv' donne le format
// AAAA-MM-JJ, le même que la colonne `last_activity_date`.
function todayInParis(): string {
  return new Date().toLocaleDateString('sv', { timeZone: 'Europe/Paris' })
}

function daysBetween(fromISO: string | null, todayISO: string): number {
  if (!fromISO) return 0
  const from = Date.parse(`${fromISO}T00:00:00Z`)
  const to = Date.parse(`${todayISO}T00:00:00Z`)
  if (Number.isNaN(from) || Number.isNaN(to)) return 0
  return Math.max(0, Math.round((to - from) / 86400000))
}

Deno.serve(async () => {
  const today = todayInParis()

  const { data: subscriptions, error } = await admin
    .from('push_subscriptions')
    .select('id, user_id, endpoint, p256dh, auth')

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  // Un compte peut avoir plusieurs appareils : on regroupe pour ne calculer
  // son état qu'une fois, puis on envoie à chacun de ses appareils.
  const byUser = new Map<string, typeof subscriptions>()
  for (const sub of subscriptions ?? []) {
    const list = byUser.get(sub.user_id) ?? []
    list.push(sub)
    byUser.set(sub.user_id, list)
  }

  const totalLessons = (await admin
    .from('lessons')
    .select('id', { count: 'exact', head: true })).count ?? 30

  let envoyees = 0
  let silences = 0
  const morts: number[] = []

  for (const [userId, devices] of byUser) {
    const [profileRes, doneRes, dueRes] = await Promise.all([
      admin.from('profiles').select('streak_count, last_activity_date').eq('id', userId).single(),
      admin.from('user_progress')
        .select('lesson_id', { count: 'exact', head: true })
        .eq('user_id', userId).eq('completed', true),
      admin.from('review_items')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId).lte('due_date', today)
    ])

    const profile = profileRes.data
    if (!profile) continue

    const message = buildReminder({
      practicedToday: profile.last_activity_date === today,
      dueReviews: dueRes.count ?? 0,
      streak: profile.streak_count ?? 0,
      lessonsDone: doneRes.count ?? 0,
      totalLessons,
      daysSinceLast: daysBetween(profile.last_activity_date, today)
    })

    // Se taire est une issue normale, pas une erreur.
    if (!message) { silences++; continue }

    for (const device of devices) {
      try {
        await webpush.sendNotification(
          {
            endpoint: device.endpoint,
            keys: { p256dh: device.p256dh, auth: device.auth }
          },
          JSON.stringify(message)
        )
        envoyees++
        await admin.from('push_subscriptions')
          .update({ last_seen_at: new Date().toISOString() })
          .eq('id', device.id)
      } catch (err) {
        // 404 / 410 : l'abonnement est mort (application desinstallee,
        // telephone reinitialise). On le supprime — le garder ferait
        // echouer un envoi par jour, indefiniment.
        const status = (err as { statusCode?: number }).statusCode
        if (status === 404 || status === 410) morts.push(device.id)
      }
    }
  }

  if (morts.length) {
    await admin.from('push_subscriptions').delete().in('id', morts)
  }

  return new Response(
    JSON.stringify({ date: today, envoyees, silences, abonnements_supprimes: morts.length }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
