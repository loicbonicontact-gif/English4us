# Où on en est — English4us

Dernière mise à jour : 16 août 2026

## Fait dans cette session (révision espacée)

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

- [ ] **Dictée audio** — écoute et réécris la phrase. Réutilise la synthèse
      vocale déjà en place, alimente la file de révision. Prochaine étape.
- [ ] **Compréhension orale longue** — dialogue de 30-60 s puis 2-3
      questions. C'est le format des parties 3 et 4 du TOEIC.
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
