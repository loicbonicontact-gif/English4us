# Où on en est — English4us

Dernière mise à jour : 17 août 2026

## Contenu en base — état au 17 août 2026

| Type | Quantité |
|---|---|
| Exercices de leçon | 840 (28 par leçon) |
| dont vocabulaire | 450 (trois séries, `[voc]`, `[voc2]`, `[voc3]`) |
| dont dictées audio | 60 |
| dont expression orale | 60 |
| Passages d'écoute | 42 (102 questions) |
| Textes de lecture | 36 (108 questions) |

**Cinq scripts sont écrits mais pas encore passés en base** — ils sont sur
le Bureau, à exécuter dans cet ordre : `6-vocabulaire-2.sql`,
`7-lecture-2.sql`, `8-vocabulaire-3.sql`, `9-lecture-3.sql`,
`10-ecoute-2.sql`. Les chiffres
ci-dessus décrivent donc la base **une fois ces scripts passés**.
`4-verification.sql` affiche l'inventaire réel et compte désormais les trois
séries séparément.

**Examen blanc** (`/exam`) : n'a aucun contenu propre, il assemble une
épreuve d'environ 150 questions à partir de ce qui précède.

**Piège corrigé le 17/08** : `seed-extra-a/b/c.sql` supprimaient tout ce qui
dépassait les 3 exercices d'origine de chaque leçon. Les relancer après
`seed-speaking.sql` a effacé les 60 exercices oraux. Les trois scripts
protègent désormais explicitement les types `ecoute`, `oral` et les
exercices marqués `[voc]`. L'ordre reste néanmoins à respecter.

Scripts à rejouer si la base est recréée, **dans cet ordre** :
`schema.sql` (base vide uniquement), `seed.sql`, `seed-extra-a/b/c.sql`,
`seed-dictation.sql`, `seed-speaking.sql`, `seed-vocabulary.sql`,
`migration-review-queue.sql`, `migration-listening.sql`,
`seed-listening.sql`, `migration-reading.sql`, `seed-reading.sql`,
`seed-reading-2.sql`, `seed-vocabulary-2.sql`, `seed-vocabulary-3.sql`,
`seed-reading-3.sql`, `seed-listening-2.sql`.

Avec la révision espacée (5 rencontres par item), cela représente de
l'ordre de **3 000 rencontres** étalées sur plusieurs mois.

## Écrit le 17 août — l'écoute rattrape son retard

24 passages et 60 questions de plus (`seed-listening-2.sql`, positions 19
à 42). L'écoute passe de 42 à 102 questions.

### Pourquoi l'écoute et pas une quatrième série de vocabulaire
Au TOEIC, l'écoute pèse **100 questions sur 200**, exactement autant que la
lecture. L'application comptait 42 questions d'écoute contre 108 de lecture :
le pilier le plus lourd de l'épreuve était le plus léger de l'app. C'est
aussi la partie où les francophones perdent le plus de points — on lit un
texte à son rythme, on n'écoute pas au sien.

Répartition par niveau, calquée sur l'épreuve : 1 question-réponse
(partie 2), 2 conversations et 1 annonce (parties 3 et 4), avec **trois
questions par passage** comme au TOEIC réel.

### Ce que la deuxième série ajoute
La première entraînait la compréhension du sens explicite. Celle-ci place à
chaque niveau au moins une question qui ne se résout pas en réentendant une
phrase : l'inférence (la réponse n'est dite par personne), l'identification
du locuteur, et l'intention — un « that could work » enthousiaste et un
« that could work » résigné n'annoncent pas la même suite.

### Deux limites à connaître
- **La voix reste une voix de synthèse.** Elle ne reproduit ni les accents
  (australien, indien) que le TOEIC fait entendre, ni le débit naturel. Les
  scripts anglais évitent les apostrophes, que la synthèse rend mal.
- **Il n'y a pas d'équivalent à la partie 1** (décrire une photo) : il
  faudrait des images, donc des droits ou des photos maison.

Le champ `audio_url` reste vide sur les 42 passages : le jour où des voix
enregistrées seront générées, il suffira de le remplir.

### Le contrôleur a servi dès sa deuxième utilisation
Les mêmes cinq blocs `insert` se terminaient par une virgule au lieu d'un
point-virgule — la faute que `scripts/check-seeds.py` avait été écrit pour
attraper. Elle aurait fait rejeter le fichier entier par Postgres, sans
qu'aucun passage ne soit inséré.

## Écrit le 17 août — troisième série de contenu

150 exercices de vocabulaire (`seed-vocabulary-3.sql`) et 12 textes de
lecture avec 36 questions (`seed-reading-3.sql`).

### Ce que la troisième série travaille, et pourquoi
Les deux premières couvraient le socle, puis les faux amis et les verbes à
particule. Celle-ci vise trois mécaniques qui rapportent beaucoup de mots
d'un coup, au lieu de les apprendre un par un :

1. **La dérivation** — un mot connu en donne quatre (decide, decision,
   decisive, decisively). C'est exactement ce que teste la partie 5 du
   TOEIC, et le seul levier réaliste pour approcher les 3 000 mots.
2. **Les prépositions imposées** — « depend ON », « responsible FOR »,
   « married TO ». Aucune règle ne les prédit, le français en suggère une
   autre, et l'erreur s'entend immédiatement.
3. **Le dénombrable** — « an advice » et « informations » n'existent pas.
   Faute de francophone par excellence, très visible à l'écrit.

Côté lecture : la conversation instantanée à plusieurs intervenants, le
document chiffré (facture, tableau de résultats) où la réponse se **calcule**
au lieu de se lire, la notice de sécurité, et la réclamation avec sa réponse.
Dans chaque document, au moins une question ne peut pas se résoudre en
repérant un mot : il faut relier deux endroits du texte ou comprendre une
intention. C'est la différence entre lire et chercher des mots-clés.

### Un piège de syntaxe trouvé par la vérification automatique
Cinq blocs `insert` du script de lecture se terminaient par une virgule au
lieu d'un point-virgule. Postgres aurait avalé le bloc suivant dans la même
instruction et rejeté tout le fichier — donc aucun des 12 textes n'aurait
été inséré. Un script de contrôle relit désormais chaque fichier SQL :
il vérifie que chaque instruction se termine, que les listes de réponses
sont du JSON valide, et que **la bonne réponse figure bien parmi les choix
proposés**. Les six fichiers de contenu passent ce contrôle.

    python3 scripts/check-seeds.py supabase/seed-vocabulary-3.sql supabase/seed-reading-3.sql

À relancer avant de passer tout nouveau script en base : il ne se connecte
à rien, il relit seulement le texte.

## Décisions structurantes de la session du 17 août

### L'examen blanc annonce ses limites
Le barème réel du TOEIC n'est pas public et varie d'une session à l'autre.
Le score s'affiche donc en **fourchette de ±50 points**, jamais en nombre
unique, avec un encadré qui explique ce que l'estimation vaut. Un chiffre
précis serait plus flatteur et moins honnête — et une école qui
découvrirait la limite après coup perdrait confiance.

Le chronomètre compare à un instant de départ au lieu de décompter : un
onglet en arrière-plan ralentit les minuteries, un simple compteur
offrirait du temps gratuit à qui change d'onglet.

### L'IA payante est retirée du projet
`api/generate-exercise.js` et `src/lib/aiExercise.js` sont supprimés.
En vérifiant, la fonction serveur s'est révélée **déployée, publique et
sans authentification** : n'importe qui trouvant l'adresse pouvait envoyer
des requêtes facturées sur le compte Anthropic. La clé n'était pas exposée,
mais son usage l'était. **Ne jamais définir `ANTHROPIC_API_KEY` sur
Vercel.** Le contenu s'écrit à la main.

### Les cœurs ne bloquent plus jamais dans le temps
Ce sont les vies de la leçon en cours, remises à cinq au début de chacune.
Cinq erreurs et la leçon repart du début, immédiatement. Raison : une
application scolaire ne peut pas mettre un élève en attente. L'apprenant
est maître de sa progression, jamais l'horloge.

### Tout ce qui est rencontré entre en révision
La file ne recevait que les exercices ratés : un exercice juste du premier
coup ne revenait jamais, alors qu'un QCM à quatre choix se réussit une
fois sur quatre au hasard. Désormais tout y entre, à un palier d'entrée
différent (J+1 si raté, J+7 si réussi).

### Routage Vercel
`vercel.json` sert `index.html` sur toutes les routes. Sans lui, toute
adresse tapée directement ou rechargée renvoyait une 404 — un défaut
présent depuis le début, invisible tant qu'on partait de l'accueil.

## Fait dans la session du 16 août (3/3) — expression orale

Nouveau type d'exercice `oral` : la phrase anglaise est affichée ET lue
automatiquement, l'apprenant appuie sur le micro et la répète. 60 exercices,
2 par leçon (`supabase/seed-speaking.sql`), chacun visant une difficulté de
prononciation propre aux francophones (le « th », le « -ed », l'accent
mobile DE-sert / de-SER-ted).

Le retour n'est pas une note seule : la phrase s'affiche **mot par mot**,
les mots reconnus en vert, les manqués soulignés en rouge, avec ce que la
machine a réellement entendu.

### Ce que cette évaluation vaut, et ce qu'elle ne vaut pas

`SpeechRecognition` **transcrit**, il n'évalue pas la prononciation. On ne
saura jamais d'ici qu'un « th » a été prononcé « s ». Ce qui est mesuré est
l'**intelligibilité** : si une machine entraînée sur de l'anglais natif ne
reconnaît pas la phrase, un anglophone aura probablement du mal aussi.

Une vraie note phonème par phonème demanderait Azure Pronunciation
Assessment (payant). Le jour venu, elle remplacera `scoreSpeech()` sans
toucher aux exercices.

### Deux limites à annoncer aux écoles
- **Firefox n'a pas de reconnaissance vocale.** Les exercices oraux y sont
  automatiquement retirés plutôt qu'affichés et inutilisables.
- **Sur Chrome, l'audio part chez Google** pour être transcrit. À signaler
  dans tout dossier RGPD.

### Cœurs redéfinis
Ils ne valent plus pour le compte et ne se rechargent plus avec le temps :
ce sont les **vies de la leçon en cours**, remises à cinq au début de
chacune. Cinq erreurs et la leçon repart du début, immédiatement. Plus
aucune attente : l'apprenant est maître de sa progression.

## Fait dans la session du 16 août (2/3) — écoute et compréhension orale

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

## Fait dans la session du 16 août (1/3) — révision espacée

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

- [ ] **Plus de contenu, à la main** — seule voie gratuite vers le volume.
      840 exercices, c'est 140 par niveau CECRL. Le TOEIC suppose un socle
      d'environ 3 000 mots : il en reste donc à écrire. La prochaine série
      se marque `[voc4]` pour le vocabulaire et prend les positions 37 et
      suivantes pour la lecture — c'est ce marquage, et lui seul, qui
      permet de rejouer un script sans effacer les précédents.
- [ ] ~~**Mode enseignant**~~ — laissé de côté à la demande de Loïc le
      17/08/2026. Ne pas le relancer sans qu'il le redemande.
- [ ] **Voix neuronales enregistrées** — le champ `audio_url` est prêt sur
      les 42 passages d'écoute. Tient dans le quota gratuit de Google Cloud ou Azure,
      mais demande un compte avec carte bancaire. En attente de décision.
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
