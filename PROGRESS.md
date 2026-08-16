# Où on en est — English4us

Dernière mise à jour : 16 août 2026

## Fait dans cette session (2/2) — écoute et compréhension orale

### Dictée audio
Nouveau type d'exercice `ecoute` : la phrase anglaise n'existe que sous
forme sonore, l'apprenant la réécrit. 60 dictées, 2 par leçon, A1 → C2
(`supabase/seed-dictation.sql`). Le champ `question` ne porte qu'une
consigne en français — la phrase attendue est dans `correct_answer` et ne
s'affiche jamais avant validation.

### Module de compréhension orale (`/listening`)
Trois formats calqués sur le TOEIC, 18 passages et 48 questions
(`migration-listening.sql` + `seed-listening.sql`) :

- **question-réponse** (partie 2) — question orale, 3 réponses lues, rien
  d'écrit à l'écran
- **conversation** (partie 3) — deux interlocuteurs, deux voix distinctes
- **annonce / exposé** (partie 4) — un seul locuteur

Le texte anglais n'apparaît qu'après avoir répondu, dans une transcription
repliée. Aucun cœur n'est perdu. Les questions ratées rejoignent la file
de révision.

### Qualité des voix — trois défauts corrigés
1. **Aucune voix anglaise n'était choisie** au démarrage : `getVoices()`
   renvoie une liste vide pendant la première seconde, et le navigateur
   lisait donc l'anglais avec la voix française du système. Mesuré à 0 voix
   au moment du lancement. La lecture attend maintenant que la liste soit
   prête (1,5 s au maximum).
2. **La pire voix était retenue.** L'ancien code prenait la première voix
   anglaise venue, soit « Albert », une voix gadget d'Apple. Un classement
   par indices de qualité choisit désormais Daniel (en-GB) sur ce Mac.
3. **La liste d'exclusion ne marchait pas** : macOS traduit les noms des
   voix gadget (« Bouffon », « Cloches »). Remplacée par une liste des
   bonnes voix, dont les prénoms ne sont jamais traduits.

Vérifié en conditions réelles : dialogue lu en alternance Daniel (A) /
Samantha (B), à partir d'une page fraîchement rechargée.

### Décision d'architecture — `audio_url`
Chaque passage porte un champ `audio_url` laissé vide. Vide, la synthèse du
navigateur lit le script ; rempli, l'application joue le fichier. Le module
fonctionne donc aujourd'hui sans rien payer, et pourra passer à une voix
neuronale enregistrée **sans qu'une ligne de code d'exercice change**.

Coût constaté pour ce passage : les 45 000 caractères de contenu tiennent
dans le quota gratuit mensuel de Google Cloud (1 M) ou d'Azure (500 k).
Le frein n'est pas l'argent mais l'ouverture d'un compte avec carte
bancaire — non fait, en attente de décision.

## Fait dans cette session (1/2) — révision espacée

La plus grosse lacune pédagogique de l'app est comblée : une leçon terminée
n'était plus jamais revue, donc ce qui était appris s'oubliait.

- **Table `review_items`** (`supabase/migration-review-queue.sql`, déjà
  exécutée en base). Un exercice raté y entre et revient à J+1, J+3, J+7,
  J+14, J+30. Réussi au dernier palier, il sort de la file : il est acquis.
- **`src/lib/reviews.js`** — l'algorithme (paliers de Leitner) et les accès
  base. `src/lib/dates.js` — les calculs de date, partagés.
- **Écran « Révisions »** (`/reviews`, 4e onglet avec pastille de rappel).
  Aucun cœur n'est perdu en révision ; 2 XP par bonne réponse.
- **Tests automatiques** — Vitest ajouté, 28 tests sur l'espacement,
  les dates et la série. `npm test`.

### Deux bugs trouvés par les tests

1. **Décalage d'un jour sur toutes les dates.** `new Date().toISOString()`
   rend la date UTC : en France (UTC+2 l'été), minuit local est encore la
   veille en UTC. Les révisions auraient été reprogrammées un jour trop tôt.
2. **Même défaut sur la série quotidienne** (`computeStreak`), présent
   depuis le début : la série pouvait se casser un soir sur deux pour un
   apprenant hors du fuseau de Greenwich. Corrigé aussi.

### Piège rencontré

`schema.sql` ne s'exécute que sur une base vide : le relancer échoue
toujours sur `create table profiles`. Pour toute évolution de la base,
écrire un fichier `migration-*.sql` séparé.

## Fait dans les sessions précédentes

Refonte complète de l'interface d'après le handoff de design
« English4us App Moderne » (direction 3a), en six commits.

1. **Fondations** — palette bleue, polices Barlow / Barlow Condensed,
   icônes Lucide en remplacement des SVG maison.
2. **Parcours** (`/dashboard`) — nouvelle coque d'application (en-tête de
   marque + deux pastilles, navigation à trois onglets), carte « reprends »,
   carte de progression, lignes de leçon.
3. **Leçon, feedback, fin de leçon** (`/lesson/:id`) — bulle de question,
   réponses à badge-lettre, verdict juste / faux, écran de fin avec tuiles,
   carte « À revoir » et carte « Débloqué ».
4. **Profil** (`/profile`, nouvelle route) — identité, progression de niveau,
   trois statistiques, réglage du son, déconnexion.
5. **Classement** (`/leaderboard`) — top 20 par XP total.

## Décisions prises

- **La palette du handoff remplace l'ancienne** (indigo / sarcelle / ambre).
  `claude.md` a été mis à jour en conséquence.
- **Trois couleurs de la maquette ont été assombries** parce qu'elles
  échouaient au seuil de contraste 4,5:1 : l'encre désactivée, le blanc sur
  l'accent bleu, le blanc sur le vert de réussite. Les valeurs décoratives
  d'origine sont conservées pour les fonds et les pastilles.
- **Classement hebdomadaire abandonné.** La règle de sécurité de `streak_log`
  ne laisse chaque utilisateur lire que ses propres lignes : impossible de
  sommer les XP de la semaine côté client. Seul le classement par XP total
  est implémenté. Le rétablir demanderait une vue SQL agrégée en base.
- **Lecture à voix haute ajoutée** (`src/lib/speech.js`), parce que la
  maquette prévoit un bouton « Écouter la phrase ». Elle utilise la synthèse
  vocale du navigateur : gratuite, sans réseau, sans fichier audio.

## Reste à faire

Priorité pédagogique décidée le 16 août (après recherche sur les méthodes
d'apprentissage et le format TOEIC) :

- [ ] **Voix neuronales enregistrées** — ouvrir un compte Google Cloud ou
      Azure, générer les fichiers une fois, remplir `audio_url`. Gratuit au
      vu du volume, mais demande une carte bancaire. Décision en attente.
- [ ] **Lecture de passage** — email, annonce, article puis questions.
      Partie 7 du TOEIC : 54 questions sur 200.
- [ ] **Réponse orale** — reconnaissance vocale du navigateur (absente de
      Firefox). L'évaluation d'une réponse libre demanderait l'API Claude,
      donc un coût par exercice.
- [ ] **Examen blanc TOEIC** chronométré, score estimé 10-990. Suppose
      200 questions au format réel : gros travail de contenu, pas de code.

Reste de la feuille de route :

- [ ] Réglages « rappel quotidien à 18 h » et « objectif du jour » de la
      maquette : ce sont des fonctionnalités à part entière, pas de
      l'habillage. Volontairement laissées de côté.
- [ ] Classement hebdomadaire, si on écrit la vue SQL.
- [ ] Onboarding en trois écrans.
- [ ] Exercice « remets les mots dans l'ordre ».
- [ ] Fiche de leçon consultable avant de commencer.
- [ ] Recharge automatique des cœurs (1 par 4 h).
- [ ] Mode enseignant (suivi d'une classe).

## Outil de développement

`preview.html` affiche les six écrans avec des données de test, sans
connexion ni base. Ouvre `npm run dev` puis
<http://localhost:5173/preview.html>. Ce fichier n'est jamais inclus dans le
build de production (Vite ne construit que `index.html`).
