# English4us

Application d'apprentissage de l'anglais, niveaux CECRL A1 à C2, orientée
préparation au TOEIC. Gratuite, sans publicité, sans appel à une API payante.

React + Vite côté navigateur, Supabase pour l'authentification et la base de
données. Aucun serveur à maintenir : le site est statique, tout passe par
Supabase.

---

## Ce que contient l'application

| | |
|---|---|
| Leçons | 30, réparties de A1 à C2 |
| Exercices | 900 — QCM, textes à trous, traduction, dictée, expression orale, ordre des mots |
| Fiches de leçon | 30, une par leçon (règle, exemples, piège) |
| Compréhension orale | 42 passages, 102 questions |
| Compréhension écrite | 36 textes, 108 questions |
| Examen blanc | assemblé au format réel du TOEIC à partir de ce qui précède |

S'y ajoutent un test de placement (A1 → C2), une file de révision espacée, un
compteur de série, et la synthèse vocale du navigateur pour la prononciation.

---

## Prérequis

- **Node 18 ou plus récent** (exigence de Vite 5)
- un compte **Supabase** (l'offre gratuite suffit)
- un compte **Vercel** pour la mise en ligne (l'offre gratuite suffit)

---

## 1. Installation en local

```bash
npm install
```

Copier le fichier d'exemple et y mettre ses propres clés :

```bash
cp .env.example .env
```

Deux variables sont nécessaires, toutes deux **publiques** — elles sont
destinées au navigateur et n'ouvrent aucun accès privilégié :

| Variable | Où la trouver dans Supabase |
|---|---|
| `VITE_SUPABASE_URL` | Project Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Project Settings → API → Project API keys → `anon` `public` |

> **Ne jamais mettre la clé `service_role` ici.** Elle contourne toutes les
> règles de sécurité, et tout ce qui entre dans ce fichier finit dans le code
> envoyé au navigateur. Seule la clé `anon` doit être utilisée.

Le fichier `.env` est ignoré par git (voir `.gitignore`). Il ne doit jamais
être commité.

Lancer :

```bash
npm run dev
```

Si les variables manquent, l'application n'affiche pas une page blanche : elle
affiche un écran « Configuration incomplète » qui nomme la variable absente.

---

## 2. Préparer la base Supabase

Tous les scripts se trouvent dans `supabase/` et s'exécutent dans
**Supabase → SQL Editor**, en copiant le contenu du fichier puis en cliquant
**Run**.

**L'ordre compte.** Un script de contenu échoue si la table qu'il remplit
n'existe pas encore.

<details>
<summary><b>Les 23 scripts, dans l'ordre</b></summary>

```
schema.sql                 (base VIDE uniquement — voir l'avertissement plus bas)
seed.sql
seed-extra-a.sql
seed-extra-b.sql
seed-extra-c.sql
seed-dictation.sql
seed-speaking.sql
seed-vocabulary.sql
migration-review-queue.sql
migration-listening.sql
seed-listening.sql
migration-reading.sql
seed-reading.sql
seed-reading-2.sql
seed-vocabulary-2.sql
seed-vocabulary-3.sql
seed-reading-3.sql
seed-listening-2.sql
migration-placement.sql
migration-word-order.sql
seed-word-order.sql
migration-lesson-notes.sql
seed-lesson-notes.sql
```

</details>

Le dossier contient deux fichiers **absents de cette liste**, et c'est voulu :

- `verification.sql` — ne modifie rien, affiche l'inventaire réel de la base.
  **C'est lui qui fait foi**, pas les tableaux écrits à la main dans la
  documentation, qui dérivent.
- `correction-orthographe.sql` — une correction ponctuelle passée le 17/08 sur
  la base d'alors. Les fichiers de contenu portent déjà le texte corrigé : sur
  une base reconstruite, ce script n'a plus rien à corriger.

Chaque script de la liste affiche sa propre vérification en fin d'exécution.

### Deux avertissements

**`schema.sql` ne se rejoue pas sur une base en service.** Il crée les tables
depuis zéro et détruirait tout le contenu existant. Il ne sert qu'une fois, sur
une base vide.

**`seed-extra-a/b/c.sql` suppriment avant d'insérer.** Ils ne gardent que les
3 exercices d'origine de chaque leçon. Ils ont déjà effacé 60 exercices oraux
par le passé, en étant relancés après le script qui les avait créés. Ils
protègent désormais explicitement les dictées, l'expression orale, l'ordre des
mots et le vocabulaire — mais **l'ordre ci-dessus reste à respecter**.

### Sécurité

Toutes les tables ont la Row Level Security activée. Le contenu pédagogique
(leçons, exercices, fiches, textes) est en lecture publique ; les données
personnelles — progression, série, file de révision — ne sont lisibles et
modifiables que par leur propriétaire. Aucune écriture de contenu n'est
possible depuis le navigateur : le contenu ne se modifie que par script.

### Authentification

Dans **Supabase → Authentication → Providers**, activer **Email**. Pour tester
sans boîte mail, désactiver « Confirm email » le temps des essais.

---

## 3. Mise en ligne sur Vercel

1. Importer le dépôt sur Vercel. Le framework Vite est détecté seul
   (`npm run build`, dossier de sortie `dist`).
2. **Settings → Environment Variables**, ajouter les deux mêmes variables
   qu'en local. Le préfixe `E4U_VITE_` est également accepté, utile si le
   compte Vercel partage déjà des variables `VITE_` avec d'autres projets :

   ```
   E4U_VITE_SUPABASE_URL
   E4U_VITE_SUPABASE_ANON_KEY
   ```

3. Déployer.

> Les variables sont lues **au moment de la construction**, pas à l'exécution.
> Après avoir ajouté ou modifié une variable, il faut **redéployer** — sinon
> rien ne change.

`vercel.json` renvoie toutes les routes vers `index.html`. Sans cela, ouvrir
directement une adresse comme `/lesson/12` donnerait une erreur 404 : le
routage est côté navigateur.

### Aucune clé d'IA

L'application n'appelle aucune API payante. La génération d'exercices par IA a
été retirée le 16/08/2026 : la fonction serveur était accessible publiquement,
sans authentification ni limite d'appels, et n'importe qui aurait pu facturer
le compte. **Ne pas définir `ANTHROPIC_API_KEY` sur Vercel.** Le contenu
s'écrit à la main.

---

## Commandes

| Commande | Effet |
|---|---|
| `npm run dev` | serveur de développement |
| `npm run build` | construction de production dans `dist/` |
| `npm run preview` | sert le résultat de `build` en local |
| `npm test` | la suite de tests (216 tests) |

Deux contrôles complètent les tests :

```bash
python3 scripts/check-seeds.py supabase/seed-*.sql
```

relit les scripts de contenu sans se connecter à quoi que ce soit : ponctuation
SQL, nombre de valeurs par ligne, JSON valide, bonne réponse présente parmi les
propositions.

```bash
npm run dev   # puis ouvrir http://localhost:5173/preview.html
```

affiche chaque écran de l'application avec des données de test, sans Supabase
ni connexion. C'est le moyen le plus rapide de vérifier un rendu ou un point de
rupture.

---

## Organisation du code

```
src/
  components/   un composant = un fichier = une responsabilité
  lib/          logique pure, testée (gamification, correction, révision…)
  data/         le curriculum A1 → C2
supabase/       schéma, migrations et contenu (SQL)
scripts/        contrôle des fichiers de contenu
dev/            prévisualisation des écrans, hors build de production
```

Les composants suivent une séparation constante : un fichier **conteneur**
charge les données (`Exercise.jsx`), un fichier **vue** affiche sans jamais
requêter (`ExerciseView.jsx`). C'est ce qui permet de prévisualiser chaque
écran sans base de données.

Le code, les noms de variables et les messages de commit sont en anglais ; les
commentaires et l'interface sont en français.

---

## Documentation interne

- **`PROGRESS.md`** — l'état d'avancement, les décisions prises et leurs
  raisons. À lire en premier pour reprendre le projet.
- **`CLAUDE.md`** — les règles du projet : identité visuelle, contraintes
  d'interface, feuille de route.

---

## Licence

Projet personnel de Loïc Boni. Aucune licence n'a été choisie à ce jour : sans
mention explicite, le code reste sous droit d'auteur classique.
