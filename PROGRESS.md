# Où on en est — English4us

Dernière mise à jour : 17 août 2026

## Contenu en base — état au 17 août 2026

| Type | Quantité |
|---|---|
| Exercices de leçon | 900 (30 par leçon) |
| dont ordre des mots | 60 (`[ordre]`) |
| dont vocabulaire | 450 (trois séries, `[voc]`, `[voc2]`, `[voc3]`) |
| dont dictées audio | 60 |
| dont expression orale | 60 |
| Passages d'écoute | 42 (102 questions) |
| Textes de lecture | 36 (108 questions) |
| Fiches de leçon | 30 (une par leçon) |

**Ces chiffres décrivent la base RÉELLE, et non un état à venir.** Tous les
scripts de contenu sont passés, confirmé par Loïc le 17/08 — les cinq du
Bureau (`6-vocabulaire-2.sql`, `7-lecture-2.sql`, `8-vocabulaire-3.sql`,
`9-lecture-3.sql`, `10-ecoute-2.sql`) comme les cinq du dépôt listés plus
bas. Il n'y a plus aucun écart entre les fichiers et la base.

`4-verification.sql` affiche l'inventaire réel et compte les trois séries de
vocabulaire séparément : c'est lui qui fait foi si un doute revient, pas ce
tableau.

**Examen blanc** (`/exam`) : n'a aucun contenu propre, il assemble une
épreuve **au format réel — 100 questions d'écoute, 99 de lecture, environ
1 h 59** à partir de ce qui précède.

**Piège corrigé le 17/08** : `seed-extra-a/b/c.sql` supprimaient tout ce qui
dépassait les 3 exercices d'origine de chaque leçon. Les relancer après
`seed-speaking.sql` a effacé les 60 exercices oraux. Les trois scripts
protègent désormais explicitement les types `ecoute`, `oral`, `ordre` et
les exercices marqués `[voc]`. L'ordre reste néanmoins à respecter.

Scripts à rejouer si la base est recréée, **dans cet ordre** :
`schema.sql` (base vide uniquement), `seed.sql`, `seed-extra-a/b/c.sql`,
`seed-dictation.sql`, `seed-speaking.sql`, `seed-vocabulary.sql`,
`migration-review-queue.sql`, `migration-listening.sql`,
`seed-listening.sql`, `migration-reading.sql`, `seed-reading.sql`,
`seed-reading-2.sql`, `seed-vocabulary-2.sql`, `seed-vocabulary-3.sql`,
`seed-reading-3.sql`, `seed-listening-2.sql`, `migration-placement.sql`,
`migration-word-order.sql`, `seed-word-order.sql`,
`migration-lesson-notes.sql`, `seed-lesson-notes.sql`.

Avec la révision espacée (5 rencontres par item), cela représente de
l'ordre de **3 000 rencontres** étalées sur plusieurs mois.

## EN ATTENTE — les rappels quotidiens ne sont pas encore branches

Le code est ecrit et teste, mais **rien n'est actif** tant que quatre etapes
ne sont pas faites par Loic (detaillees dans README.md, section « Rappel
quotidien ») :

1. generer la paire de cles VAPID (`npx web-push generate-vapid-keys`) ;
2. passer `migration-push.sql` ;
3. deployer la fonction `daily-reminder` avec les secrets ;
4. passer `migration-push-cron.sql`, apres avoir rempli ses deux trous.

Tant que ce n'est pas fait, l'application se comporte exactement comme
avant : sans cle publique et sans la colonne `push_asked_at`, l'invitation
n'apparait jamais et le reglage reste masque dans le profil.

**ETAT INCERTAIN A VERIFIER EN PRIORITE** : le 17/08 au soir, Loic a colle
`migration-push-cron.sql` d'un seul bloc dans l'editeur SQL. Consequences
probables — l'etape du coffre a ete IGNOREE (elle est livree en commentaire),
et une tache planifiee a ete creee avec l'adresse litterale « TON-PROJET »,
donc qui echoue chaque jour sans rien dire.

`supabase/diagnostic-push.sql` (ne modifie rien) repond en cinq blocs : table
creee ou non, colonne presente ou non, cle dans le coffre ou non, tache
correcte ou a refaire, dernieres executions. **A passer avant de toucher a
quoi que ce soit d'autre sur les rappels.**

Aucune fuite : verifie le 17/08, la cle n'est ni dans le dossier de travail,
ni dans un commit, ni sur GitHub. L'editeur SQL de Supabase garde en revanche
un historique des requetes — l'entree contenant la cle est a supprimer de la
colonne de gauche.

**Ce que je n'ai PAS pu verifier moi-meme** : l'envoi reel. Il demande un
projet Supabase deploye, des secrets et une tache planifiee. Le choix du
message, lui, est teste (14 tests) — c'est la partie ou une erreur se voit.

## Ecrit le 17 aout — le rappel quotidien

Demande de Loic : « chaque jour l'appli envoie une notification pour dire a
l'utilisateur qu'il est a peu de devenir bilingue et l'inciter a s'entrainer ».

### La phrase demandee a ete ecartee, et remplacee
« Tu es a peu de devenir bilingue » apres cinq lecons est **faux**. Un eleve
le sait, et un etablissement scolaire le verra immediatement. Une application
qui flatte pour faire revenir perd exactement ce qui fait sa credibilite
aupres d'une ecole.

Le message retenu vise le meme sentiment — tu approches du but — avec un
chiffre exact : « 12 lecons sur 30. Plus que 18 avant la fin du parcours. »
Un test verrouille l'ecart : aucun message ne peut contenir « bilingue »,
« couramment » ou « maitrise ».

### La regle qui commande tout : se taire
**On n'envoie rien a quelqu'un qui a deja travaille aujourd'hui.** C'est le
defaut le plus courant de ce genre de fonction, et le plus cher : une seule
occurrence suffit a faire couper les notifications, et une fois coupees elles
ne reviennent jamais.

Deuxieme silence : apres 30 jours d'absence, on arrete definitivement.
Quelqu'un qui n'est pas revenu depuis un mois n'a pas oublie l'application,
il a arrete. Continuer serait du harcelement.

### Quatre messages, choisis selon l'etat reel

| Situation | Message |
|---|---|
| Revisions echues | « 3 exercices t'attendent en revision. » |
| Serie en cours (>= 2 jours) | « Ta serie de 12 jours tient encore aujourd'hui. » |
| Absent depuis 3 jours ou plus | « Ca fait 5 jours. Une lecon de 3 minutes suffit pour reprendre. » |
| Progression | « 12 lecons sur 30. Plus que 18 avant la fin du parcours. » |
| **A deja travaille aujourd'hui** | **rien** |

### Une seule verite pour le texte
`supabase/functions/daily-reminder/message.js` est un fichier PUR, importe a
la fois par la fonction Supabase (Deno) et par les tests (Node). Le dupliquer
aurait garanti qu'une des deux copies derive. Pour changer une phrase, c'est
le seul endroit a toucher.

### L'ecran intermediaire, et pourquoi il n'est pas decoratif
La fenetre d'autorisation du navigateur ne dit rien d'utile, et **un refus
est definitif** : on ne peut plus jamais reposer la question sans passer par
les reglages du telephone.

D'ou l'ecran qui explique AVANT, et ne declenche la vraie demande que si
l'apprenant accepte. Celui qui dit « Non merci » la garde la possibilite
d'activer les rappels plus tard depuis son profil ; s'il avait refuse au
navigateur, cette porte serait fermee pour toujours.

Propose apres la **3e** lecon — la note, elle, arrive a la 5e : les deux
boites ne peuvent jamais s'afficher ensemble.

### iPhone
Les notifications ne marchent QUE si l'application a ete installee sur
l'ecran d'accueil. Dans un onglet Safari ordinaire, `PushManager` n'existe
pas. `isPushSupported` le detecte et ne propose rien — un interrupteur mort
serait un mensonge.

### RGPD
L'abonnement est une donnee personnelle : il permet d'ecrire sur l'ecran de
quelqu'un. Il est donc consenti explicitement, supprime — et non pas
seulement desactive — quand on coupe les rappels, et decrit dans la
politique de confidentialite, tableau compris.

### Verifications
- **254 tests** (+25 : 14 sur le choix du message, 11 sur l'abonnement).
- Verifie dans le navigateur : la boite, ses deux boutons, le focus, Echap.
- `public/sw.js` verifie syntaxiquement apres modification — une erreur de
  syntaxe y casserait tout le mode hors ligne, en silence.
- `npm run build` passe. Un ecran ajoute a la previsualisation (18).

### Ce qui n'est pas verifie
L'envoi reel. Il faut un projet deploye, des secrets et une tache planifiee —
rien de tout cela n'existe depuis mon poste. La commande de controle est
dans le README : `npx supabase functions invoke daily-reminder`, qui renvoie
le nombre d'envois et de silences.

## RIEN EN ATTENTE — migration-feedback.sql est passe le 17/08

Confirme par Loic. La table `app_feedback` et la colonne
`profiles.feedback_asked_at` existent : la demande de note s'affichera apres
la cinquieme lecon terminee, une seule fois.

## Ecrit le 17 aout — note de l'application, et le RGPD au passage

Demande de Loic : un popup apres quelques lecons pour noter l'application, et
« verifie le RGPD pour l'appli aussi ».

### Ce que la verification a trouve, et qui ne concerne pas le popup
**L'application n'avait AUCUNE politique de confidentialite.** Aucune
mention, aucune page, aucun lien — verifie par recherche dans tout le code.
Or elle collecte une adresse e-mail, un pseudo, une progression complete, et
de la voix pendant les exercices de prononciation.

C'etait un manquement present avant la demande, et plus serieux qu'elle.
Ajouter un champ de commentaire libre sans regler ca d'abord l'aurait
aggrave : un champ libre est l'endroit exact ou l'on ecrit son nom ou son
ecole sans y penser.

### Reponses de Loic qui ont cadre le travail
- **Public** : mineurs comme majeurs, tout le monde.
- **Hebergement** : Supabase en Irlande, donc dans l'UE — aucun transfert
  hors Union a documenter pour la base.
- **Formulaire** : note seule, pas de commentaire.

### La note : ce qui a ete decide, et pourquoi
- **Une seule fois dans la vie d'un compte.** `feedback_asked_at` est rempli
  que la personne note OU refuse. Un refus ne cree aucune ligne d'avis —
  refuser, c'est ne rien donner, pas meme une ligne qui dirait « a refuse ».
- **Aucune recompense.** Pas d'XP, pas de coeur, rien de debloque contre une
  note. L'application s'adresse aussi a des mineurs : offrir quelque chose
  contre un avis, c'est acheter l'avis d'un enfant.
- **Le bouton dit « Non merci », pas « Plus tard ».** Ecrit « Plus tard »
  d'abord, puis corrige : on ne redemande jamais, donc « plus tard » serait
  faux. Un bouton qui ment sur ce qu'il fait est un piege, meme quand il
  arrange.
- **Retirable en un bouton** depuis le profil. Le droit a l'effacement n'a de
  valeur que s'il tient en un geste : faire ecrire un e-mail pour retirer une
  note sur 5 serait un refus deguise.
- **Cinq lecons** avant de demander. Moins, on demande son avis a quelqu'un
  qui n'en a pas ; plus, on ne demande jamais rien a la majorite, qui
  s'arrete avant.

### La politique de confidentialite
`/confidentialite`, joignable depuis le profil **et depuis l'ecran de
connexion** — c'est la qu'on decide de confier son adresse e-mail, informer
apres coup n'aurait servi a rien.

Elle couvre les neuf mentions obligatoires et deux points trouves en lisant
le code :
- **la voix part chez Google.** La reconnaissance vocale de Chrome ne traite
  pas l'audio sur l'appareil : elle l'envoie a ses serveurs. C'est ecrit noir
  sur blanc, avec la consequence pratique (ne pas utiliser les exercices
  oraux, ou changer de navigateur) ;
- **les moins de 15 ans.** En France, en dessous de 15 ans, l'accord d'un
  parent est necessaire en plus de celui de l'enfant. Dit sur l'ecran
  d'inscription, pas seulement dans le document.

**Deux valeurs restent a completer par Loic** dans `src/components/Privacy.jsx`,
marquees en clair : l'adresse de contact du responsable de traitement. Elles
ne peuvent pas etre inventees — un document qui donne une fausse adresse est
pire qu'un document absent.

Ce texte n'est pas l'avis d'un juriste, et le dit.

### Verifications
- **229 tests** (+6 sur `lib/feedback`).
- Verifie dans le navigateur : `role="dialog"`, `aria-modal`, focus a
  l'ouverture, Echap ferme, etoiles a 48 px avec libelle « 3 sur 5 »,
  contrastes mesures (etoile allumee 4,86:1, eteinte 5,78:1).
- Politique lisible a 375 px sans debordement, tableau qui defile dans son
  cadre.
- `npm run build` passe. Deux ecrans ajoutes a la previsualisation (17).

### Pas fait
La notification quotidienne demandee en fin de session. Elle est traitee a
part : elle demande un serveur (Web Push + VAPID + tache planifiee), et le
message propose — « tu es a peu de devenir bilingue » — serait faux apres
cinq lecons. Voir la reponse a Loic.

## Ecrit le 17 aout — mode hors ligne de l'interface

Ajoute apres la question « comment publier sur les stores ». La reponse
honnete etait : tu as deja une application installable (PWA), il lui manque
juste de fonctionner sans reseau.

### Ce qui est garde, et ce qui ne l'est pas
`public/sw.js` garde en reserve l'interface — HTML, CSS, JavaScript, icones.
Il ne garde **jamais** les reponses de Supabase. Comme Supabase est sur un
autre domaine, la regle tient en une ligne : tout ce qui ne vient pas de
notre domaine part au reseau sans passer par le service worker.

Servir une progression vieille d'une semaine serait pire que de ne rien
servir : l'apprenant croirait avoir perdu son travail.

### Ecrit a la main, sans dependance
Un generateur (vite-plugin-pwa) produit un fichier illisible et une
dependance de plus. La regle tient en trente lignes commentees :
- navigation → reseau d'abord, reserve en secours ;
- fichiers construits → reserve d'abord (leur nom porte une empreinte unique,
  une version perimee ne peut pas etre servie a la place d'une neuve) ;
- Supabase → jamais touche.

### Le bandeau est la contrepartie obligatoire
Sans lui, l'application s'ouvrirait NORMALEMENT sans reseau : l'apprenant
repondrait, rien ne s'enregistrerait, et il ne saurait pas pourquoi.

### Le defaut trouve par le test reel
Le service worker a ete verifie en **coupant vraiment le serveur** puis en
rechargeant : l'application s'est affichee. C'est ce test qui a revele que
l'ecran de **connexion** apparaissait hors ligne sans le moindre
avertissement — le bandeau vivait dans `AppShell`, qui n'enveloppe que les
ecrans d'un compte connecte. Or c'est justement avant la connexion que
l'absence de reseau est la plus deroutante : le formulaire s'affiche mais ne
peut pas aboutir. Le bandeau a ete remonte au-dessus de tout.

Un test unitaire n'aurait pas trouve ca.

### Un chiffre de contraste corrige
Le commentaire CSS annoncait 8,1:1 pour l'encre du bandeau. La mesure donne
**7,28:1** — toujours largement au-dessus du seuil, mais le commentaire
mentait. Corrige : le projet ecrit des valeurs mesurees, pas estimees.

### Verifications
- **223 tests** (+7 sur `lib/network`).
- Verifie serveur eteint : l'application se charge depuis la reserve.
- Bandeau : apparait sur `offline`, disparait sur `online`, `role="status"`.
- `npm run build` passe. `npm run preview` est desormais dans
  `.claude/launch.json` (port 4173) — le service worker ne s'enregistre
  qu'en production, donc c'est le seul moyen de le tester.

### Ce que ca ne fait PAS
Les lecons ne sont pas jouables hors ligne. Choix de Loic, et le bon : cela
demanderait de stocker les exercices localement, de garder les reponses en
attente et de gerer les conflits entre appareils. C'est la que naissent les
bugs de donnees.

## Décision du 17/08 — le classement est définitivement écarté

Loïc : « pas la peine pour ça, c'est inutile ».

La décision ne change rien au code : le classement avait **déjà** été
construit puis retiré plus tôt le 17/08 (voir « la barre passe à trois
onglets » plus bas). Ce qui restait était une ligne oubliée dans la feuille
de route de `CLAUDE.md`, qui le remettait au programme comme s'il était à
faire. Elle est supprimée.

Les trois raisons tiennent toujours, et il est utile de les garder écrites
pour ne pas rouvrir le sujet une troisième fois :
1. un classement est un mécanisme social — vide avec un seul utilisateur ;
2. classer par XP total depuis toujours mesure l'ancienneté, pas l'effort ;
3. le classement hebdomadaire, qui serait juste, est **impossible en l'état** :
   la règle de sécurité de `streak_log` interdit de lire les XP des autres.
   Il faudrait une vue SQL agrégée en base pour le rétablir.

Reste au programme, par ordre de valeur : recharge automatique des cœurs,
objectif quotidien, les deux écrans d'onboarding, et le mode enseignant —
qui est l'argument des établissements, là où le classement ne l'était pas.

## RIEN EN ATTENTE — les cinq scripts sont passés le 17/08

Exécutés dans Supabase SQL Editor et confirmés par Loïc, dans cet ordre :
`migration-word-order.sql`, `seed-word-order.sql`,
`migration-lesson-notes.sql`, `seed-lesson-notes.sql`,
`correction-orthographe.sql`.

Les deux fonctionnalités écrites ce jour sont donc **actives en base** : le
type d'exercice `ordre` accepte ses 60 exercices, et les 30 fiches de leçon
sont lisibles depuis le parcours. Il n'y a plus d'écart entre ce que disent
les fichiers du dépôt et ce que contient la base.

Ces cinq scripts n'ont plus à être rejoués — sauf si la base est recréée,
auquel cas ils reprennent leur place dans la liste d'ordre ci-dessus.

## Écrit le 17 août — la fiche de leçon : la règle AVANT l'erreur

Jusqu'ici la règle n'existait qu'au singulier, dans le champ `explanation`
d'un exercice — donc **après s'être trompé**.

C'est tenable pour du vocabulaire : on ne devine pas un mot, on l'apprend en
le rencontrant. Ça ne l'est pas pour une structure. Personne ne devine le
present perfect, et se tromper cinq fois avant de lire la règle n'apprend pas
la règle : ça apprend qu'on n'y arrive pas.

### 30 fiches, une par leçon
Chaque fiche tient en quatre morceaux, et rien de plus :

| Morceau | Ce qu'il contient |
|---|---|
| Titre | la règle annoncée — « Se présenter » devient « Dire son nom et son âge » |
| Règle | deux à quatre phrases, en français |
| Exemples | trois phrases, anglais ET français côte à côte |
| Le piège | la faute que le francophone VA commettre |

Le format long est volontairement impossible : une fiche qu'on ne lit pas ne
sert à rien. Un test vérifie que chaque règle tient sous 460 caractères —
c'est vers le long qu'on dérive en écrivant.

### Pourquoi la traduction est donnée à côté de chaque exemple
Une fiche n'est pas un exercice : il n'y a rien à deviner ici. Cacher la
traduction transformerait la lecture en devinette, alors que le but est
justement de comprendre **avant** d'être mis à l'épreuve. C'est aussi
pourquoi le bouton d'écoute est présent sur chaque exemple sans condition,
là où l'écran d'exercice le retient tant que la réponse n'est pas validée.

### La décision : la fiche ne compte pas
La consulter ne donne aucun XP, n'avance aucune progression, n'entre dans
aucune file de révision. Lire une règle n'est pas la savoir, et faire croire
l'inverse gonflerait la progression avec du travail qui n'a pas eu lieu —
la même règle que pour le test de placement, qui ouvre les niveaux
inférieurs sans les cocher.

### Deux accès, aucun passage obligé
- sur la carte d'accueil, « Voir la fiche » à côté de « Commencer » ;
- sur chaque ligne de leçon ouverte, un bouton distinct à droite.

La fiche n'est jamais imposée avant la leçon. Quelqu'un qui veut seulement
s'entraîner garde son départ en un seul appui — c'est ce qu'il fait vingt
fois sur vingt et une.

Conséquence technique : une ligne de leçon **n'est plus un seul grand
bouton** quand une fiche existe. Un bouton dans un bouton est invalide en
HTML et le clic partirait au mauvais des deux. Le chevron disparaît alors :
à 375 px, trois éléments à droite serrent le titre sur trois lignes.

### Ce que les tests ont attrapé
Chaque exemple passe par le test de langue écrit en août pour la
prononciation (`lib/spoken`) : le côté anglais doit être sûrement anglais, le
côté français ne doit surtout pas l'être. C'est le contrôle qui repère
l'erreur la plus bête et la plus probable — les deux colonnes inversées à la
saisie.

Une première version exigeait aussi que le français porte un indice
français. Elle a échoué sur « On parle anglais ici. », qui n'en contient
aucun : « on » est volontairement exclu de la liste des marqueurs, puisqu'il
existe aussi en anglais. **C'était l'assertion qui était trop stricte, pas la
phrase.** Elle a été corrigée, et la raison est écrite dans le test.

Un défaut d'échappement a aussi été pris au passage : « avec un 's »
s'affichait « avec un ''s », parce que le texte avait été échappé deux fois —
une fois à la main, une fois par le générateur.

### Vérifications
- **216 tests** (+12), dont un banc d'essai qui relit `seed-lesson-notes.sql`
  et contrôle les 30 fiches réelles : couverture des 30 leçons, longueur de
  la règle, présence du piège, trois exemples traduits, et la langue de
  chaque moitié.
- `scripts/check-seeds.py` valide la colonne `examples` comme du JSON, et ne
  se trompe plus sur les parenthèses de `on conflict`.
- `npm run build` passe.
- Contrôlé dans le navigateur à 375 px et 1280 px : bouton d'écoute à
  44 × 44, bouton de fiche à 48 × 76, aucun débordement horizontal, largeur
  de lecture plafonnée à 680 px, aucune erreur en console. Le bouton d'une
  ligne ouvre bien la fiche et non la leçon.
- Un écran ajouté à la prévisualisation (entrée 16).

### Pas fait, et pourquoi
La fiche n'est pas consultable **pendant** la leçon. Ce n'est pas un oubli :
un exercice se fait de mémoire, et pouvoir rouvrir la règle au milieu d'une
question transformerait la leçon en exercice à livre ouvert. La règle se lit
avant, ou se relit après depuis le parcours.

## Écrit le 17 août — l'ordre des mots, premier format vraiment nouveau

Jusqu'ici les cinq types d'exercices partageaient un moteur : une question,
une réponse, un bouton « Vérifier ». Celui-ci change le geste — on ne tape
plus, on clique des étiquettes.

### Pourquoi ce format n'est pas un doublon de la traduction
Une traduction libre mélange trois difficultés : le vocabulaire,
l'orthographe et l'ordre des mots. Quand l'apprenant se trompe, **on ne sait
pas laquelle a lâché — et lui non plus.** Ici le vocabulaire est donné,
l'orthographe est donnée : il ne reste QUE l'ordre. C'est le point où le
français trahit l'anglais le plus mécaniquement — « a car red », « I like
very much this film », « Where you are going? ».

Les 60 exercices ciblent ces pièges, du plus mécanique au plus subtil :

| Niveau | Piège travaillé |
|---|---|
| A1-A2 | l'adverbe de fréquence avant le verbe, l'auxiliaire `do/does`, « there is » pour « il y a » |
| B1 | « very much » en fin de phrase, le double objet (send me the report), « never » entre l'auxiliaire et le participe |
| B2 | pas de `will` après `if`, la voix passive, la place du complément de temps |
| C1-C2 | l'inversion après un adverbe négatif en tête (« Never had I seen… ») |

### Cliquer, et non glisser
Le glisser-déposer est le réflexe pour ce format. Il a été écarté : sur
téléphone il entre en conflit avec le défilement de la page, et il est
inutilisable au clavier comme au lecteur d'écran. Deux clics — un pour
poser, un pour reprendre — font le même travail et fonctionnent partout.

Les mots posés laissent dans la réserve un **vide de la même taille** plutôt
que de disparaître : sans cela la réserve se réorganise sous le doigt, et on
ne retrouve plus un mot là où on l'avait vu.

### Les étiquettes en trop
La colonne `options` change de sens pour ce type : elle ne porte pas des
propositions de QCM mais des **mots intrus**. Sans intrus, il suffit de
vider la réserve pour réussir sans rien comprendre. Avec un intrus, il faut
décider qu'un mot ne sert pas — le « to » de « you should to see », le
« do » de « we do not are late ».

### La décision la plus discutable : accepter le bon anglais non demandé
Les mêmes étiquettes que « Never had I seen such a thing » forment aussi
« I had never seen such a thing », qui est de l'anglais correct. Fallait-il
la refuser pour forcer l'inversion ?

Non. **Refuser une phrase juste apprendrait à l'apprenant que l'application
se trompe** — la leçon la plus coûteuse qu'un exercice puisse donner. Les
deux ordres sont acceptés (sept exercices du C1-C2, dix-huit sur soixante
toutes causes confondues), et c'est l'explication affichée après validation
qui enseigne la différence : l'inversion n'est pas plus correcte, elle est
d'un autre registre.

### Deux défauts trouvés en construisant, pas cherchés

**Le mélange sautait à chaque clic.** Avec `Math.random`, React recalculait
l'ordre des étiquettes à chaque rendu : impossible de viser un mot. Le
mélange est désormais semé sur l'identifiant de l'exercice — fixe pour un
exercice donné, différent d'un exercice à l'autre. Un garde-fou décale d'un
cran si le hasard retombe sur l'ordre correct : sur une phrase de deux mots,
cela arrive une fois sur deux.

**Deux clics rapprochés n'en faisaient qu'un.** React regroupe les mises à
jour d'état : deux étiquettes cliquées coup sur coup lisaient toutes les
deux la même valeur, et la seconde effaçait la première. Le mot posé
disparaissait sans explication. Vérifié dans le navigateur, cinq clics dans
la même tâche donnent bien « You should see a doctor ».

### Le piège de suppression, évité cette fois
`seed-extra-a/b/c.sql` avaient déjà effacé les 60 exercices oraux par le
passé. Le type `ordre` a été ajouté à leur liste de protection **avant** que
le contenu n'existe en base, pas après l'avoir perdu.

### Vérifications
- **204 tests** (+24), dont un banc d'essai qui relit `seed-word-order.sql`
  et vérifie, pour chacun des 60 exercices réels : que les étiquettes ne
  s'affichent jamais déjà dans l'ordre, que la phrase remise dans l'ordre
  est acceptée, et que **chaque variante acceptée est constructible** avec
  les étiquettes affichées. Ce dernier contrôle a immédiatement débusqué
  deux variantes impossibles à saisir — une tolérance promise mais
  inexistante.
- `scripts/check-seeds.py` connaît le nouveau type : il ne cherche plus la
  bonne réponse parmi les `options` (ce serait faux ici) et vérifie qu'aucun
  intrus ne fait plus d'un mot.
- `npm run build` passe.
- Contrôlé dans le navigateur à 375 px et 1280 px : étiquettes à 45 px de
  haut (seuil 44), texte à 17 px, anneau de focus au clavier, aucun
  débordement horizontal, aucune erreur en console.
- Deux écrans ajoutés à la prévisualisation (entrées 15).

### Pas fait, et pourquoi
Le format ne remplace aucune traduction existante. Les 180 traductions
libres restent : elles font travailler l'orthographe, que les étiquettes
donnent. Les deux formats se complètent au lieu de se substituer.

## Écrit le 17 août — prononciation : deux fuites bouchées

Le chantier annoncé était « lecture audio des phrases anglaises ». En
ouvrant le dossier, la synthèse vocale était déjà là (dictées, oral,
écoutes). Le vrai travail était ailleurs : **le bouton « Écouter » lisait
ce qu'il ne fallait pas.**

### Défaut 1 — du français lu par une voix anglaise
`ExerciseView` lisait `exercise.question` dès que l'exercice n'était pas
une dictée. Or l'énoncé d'un QCM est en français. Vérifié en conditions
réelles avant correction, la console du navigateur affichait :

    lire : Comment dit-on « ma tante » ?

Prononcé avec la voix anglaise. Incompréhensible — et trompeur dans une
application qui prétend justement enseigner la prononciation.

### Défaut 2 — la réponse donnée avant validation
Sur une traduction, la phrase lue était `correct_answer`, et le bouton
s'affichait **avant** de répondre. « Traduis : "J'ai vingt ans." » puis, en
un appui, « I am twenty years old ». L'exercice se résolvait sans être fait.
Trouvé en auditant le premier défaut, pas cherché.

### La règle : ne lire que ce dont on est sûr
`src/lib/spoken.js` décide quoi lire, et quand :

| Type | Avant validation | Après |
|---|---|---|
| dictée, oral | la phrase (elle **est** l'exercice) | idem |
| traduction | rien | la réponse |
| texte à trous | rien (le trou trahirait) | la phrase, trou comblé |
| QCM | l'anglais cité, s'il y en a | idem |

Le point délicat est le QCM : entre guillemets on trouve tantôt de
l'anglais (« She ___ a new car. »), tantôt du français (« Je m'appelle
Marie »). Un test de langue tranche, volontairement **asymétrique** : il
faut au moins un indice anglais ET aucun indice français. Le coût des deux
erreurs n'est pas le même — se taire prive d'un bouton, parler faux
enseigne une prononciation fausse.

Le piège évité : « Je m'appelle Marie » ne porte aucun accent. Ce sont
l'élision « m' » et le mot « je » qui la trahissent. À l'inverse « on »,
« son », « pas », « note » existent dans les deux langues et sont exclus
des indices — sinon « Put the bags on the seats » passerait pour du
français.

### Mesuré sur les 840 exercices réels, pas supposé
Avant de faire confiance à la règle, elle a été passée sur tout le contenu :

| Type | Total | Lisible avant | Lisible après |
|---|---|---|---|
| QCM | 270 | 112 | 130 |
| Texte à trous | 270 | 0 | 262 |
| Traduction | 180 | 0 | 180 |
| Dictée | 60 | 60 | 60 |
| Oral | 60 | 60 | 60 |

**692 exercices sur 840** (82 %) offrent une phrase anglaise après
validation, et les 148 restants n'en offrent aucune — c'est voulu :
« Quelle heure est-il ? — 10:45 » n'a rien à prononcer, « Quel est le
prétérit de "buy" ? » cite un mot isolé, qui pourrait appartenir aux deux
langues. Le bouton disparaît au lieu de deviner.

### Un défaut de contraste trouvé en passant
`.listen-btn` était en `--ink-3` : **4,46:1** sur le fond d'app, sous le
seuil de 4,5. Le gris le faisait aussi passer pour désactivé. Passé à
l'encre d'accent : 6,4:1, et il se voit enfin comme un bouton.

### Vérifications
- **180 tests** (+22 sur `spoken.js`), dont le cas d'origine : l'énoncé
  français d'un QCM ne doit jamais ressortir.
- `npm run build` passe.
- Contrôlé dans le navigateur, console à l'appui : `lire : My parents are
  John and Mary.` (trou comblé), `lire : I am twenty years old` (après
  validation seulement), et plus aucun français.
- Quatre écrans ajoutés à la prévisualisation (entrées 14).

### Pas fait, et pourquoi
Les documents de compréhension écrite restent muets. Ce n'est pas un
oubli : au TOEIC, la partie lecture se passe sans audio, et entendre les
textes fausserait l'entraînement.

## Écrit le 17 août — le test de placement (dernier verrou levé)

Le défaut annoncé la veille est corrigé : un apprenant de niveau B1 ne
traverse plus quinze leçons connues avant d'atteindre la première qui lui
apprenne quelque chose.

### Script SQL — PASSÉ le 17/08
`supabase/migration-placement.sql`, exécuté dans Supabase SQL Editor et
confirmé par Loïc. Il ajoute trois colonnes à `profiles` et ne sème aucun
contenu. À rejouer seulement si la base est recréée.
**Tant qu'il n'est pas passé, l'application fonctionne exactement comme
avant** : l'invitation au test et la ligne « Point de départ » du profil
restent masquées plutôt que d'offrir un bouton qui échouerait.

### La méthode : un escalier
Cinq questions du niveau A1. Quatre bonnes réponses ou plus, on monte d'un
niveau et on recommence. En dessous, on s'arrête : c'est là que le parcours
commence.

| Parcours du test | Niveau retenu | Questions posées |
|---|---|---|
| A1 raté | A1 | 5 |
| A1 ✓, A2 raté | A2 | 10 |
| A1 ✓, A2 ✓, B1 raté | B1 | 15 |
| les six réussis | C2 | 30 |

Pourquoi partir du bas plutôt que du milieu : un vrai débutant répond à
cinq questions et c'est fini en une minute. C'est lui qu'il faut ménager —
quelqu'un qui vise C1 acceptera trente questions.

Pourquoi 4 sur 5 : avec quatre propositions, réussir 4 sur 5 au hasard a
environ une chance sur 800. À 3 sur 3, il aurait fallu un sans-faute — une
inattention aurait coûté un niveau entier.

**Aucun contenu n'a été écrit.** Le test puise dans les 840 exercices à
choix multiple déjà en base, tirés au hasard : deux passages ne posent pas
les mêmes questions, on ne peut donc pas apprendre les réponses par cœur.

### La décision qui commande tout : ouvrir sans cocher
Un apprenant placé en B1 n'a pas *terminé* A1 et A2. Le placement les
**ouvre** — révision libre, écoutes et lectures comprises — sans les
marquer faits.

L'alternative aurait été de cocher les leçons sautées. Elle a été écartée :
elle aurait gonflé la progression, l'XP et la précision moyenne avec du
travail qui n'a jamais eu lieu. Un établissement qui regarde le tableau de
bord d'un élève doit y lire ce que l'élève a fait, pas ce qu'on lui a
supposé. La progression d'un apprenant placé en B1 affiche donc 0 leçon
terminée le premier jour, et c'est la vérité.

Trois conséquences, toutes visibles à l'écran :
- la carte d'accueil pointe la première leçon du niveau de placement, pas
  A1.1 — sans cela le test n'aurait servi à rien ;
- les niveaux inférieurs portent le badge « Révision libre », et leurs
  leçons disent « Révision » et non « En cours » (ce serait faux) ;
- **dans** le niveau de placement, la chaîne classique reprend : B1.2 reste
  fermée tant que B1.1 n'est pas faite. Le test ouvre une porte d'entrée,
  il ne déverrouille pas un niveau entier.

### Ce que le test n'est pas
Une certification. Il s'appuie sur des questions écrites pour enseigner, pas
pour évaluer, et l'écran de résultat le dit en toutes lettres. C'est une
orientation, refaisable à tout moment depuis le profil — quelqu'un qui s'est
placé trop haut par optimisme se recorrige seul.

### Vérifications
- **158 tests** au total (+11 sur `buildPath`, +22 sur `placement.js`), dont
  celui qui verrouille la décision ci-dessus : aucune leçon n'est marquée
  terminée par un placement.
- `npm run build` passe.
- Quatre écrans ajoutés à la prévisualisation (`preview.html`, entrées 13),
  contrôlés à 375, 768, 1280 px et en paysage. Contrastes calculés : le plus
  bas est 6,4:1, au-dessus du seuil de 4,5:1.
- Un défaut trouvé et corrigé en chemin : le badge de niveau se coupait en
  deux lignes à 375 px et poussait le compteur « 0 / 5 » hors de sa place.

## Écrit le 17 août — la barre passe à trois onglets

Décision de Loïc, en deux temps.

### 1. Le classement est retiré
`Leaderboard.jsx`, `LeaderboardView.jsx` et la route `/leaderboard` sont
supprimés. Trois raisons :
1. **Il était vide** — un classement est un mécanisme social ; avec un seul
   utilisateur, la page affichait une ligne.
2. **Même rempli, il aurait mal fonctionné** : classement par XP **total
   depuis toujours**, donc une mesure d'ancienneté plutôt que d'effort.
   Duolingo utilise des ligues hebdomadaires pour cette raison — et le
   classement hebdomadaire avait déjà été abandonné ici, la règle de
   sécurité de `streak_log` empêchant de sommer les XP des autres.
3. **Il occupait une des quatre places de la barre.**

### 2. Son remplaçant a été retiré aussi
Un écran « Entraînement » (`/training`) a été construit à sa place, puis
supprimé le jour même. Loïc : « je ne trouve pas qu'il ait sa place ici ».
Il avait raison, et l'erreur mérite d'être écrite parce qu'elle est
instructive.

Un onglet permanent se mérite par une **visite quotidienne**. Le parcours et
les révisions s'ouvrent tous les jours ; le profil porte les réglages.
« Entraînement » était un catalogue qu'on parcourt de temps en temps.

Surtout : le problème qu'il prétendait résoudre — « l'écoute et la lecture
sont introuvables » — n'était pas un problème de navigation mais de
**verrouillage** (voir ci-dessous). J'avais ajouté un raccourci pour
contourner un défaut au lieu de corriger le défaut.

**La règle qui en sort** : avant d'ajouter un écran d'accès à du contenu,
vérifier que le contenu est atteignable. Un raccourci vers des portes
fermées ne sert à rien.

Une barre n'a pas à être remplie : trois destinations quotidiennes valent
mieux que quatre dont une qu'on n'ouvre jamais.

### 3. Un défaut de mise en page découvert au passage
La barre était figée à **quatre colonnes en dur** (`repeat(4, 1fr)`). Avec
trois onglets, le quatrième quart restait vide et tout paraissait poussé à
gauche. Remplacé par des colonnes automatiques de largeur égale
(`grid-auto-flow: column; grid-auto-columns: 1fr`) : la barre s'adapte
maintenant au nombre d'onglets, aujourd'hui et si un onglet revient un jour.

Répartition sur toute la largeur plutôt que groupe centré : chaque onglet
devient une cible plus large, et le pouce atteint les bords. Un groupe
centré laisserait deux zones mortes là où le pouce tombe le plus souvent.

Mesuré aux quatre largeurs imposées :

| Largeur | Onglets | Hauteur de cible |
|---|---|---|
| 375 px | 120 px chacun | 55 px |
| 768 px | 251 px chacun | 55 px |
| 812 x 375 (paysage) | 265 px chacun | 55 px |
| 1280 px | largeur naturelle, dans l'en-tête | 44 px |

Toutes au-dessus du minimum de 44 px.

## Écrit le 17 août — le verrouillage laissait le contenu hors d'atteinte

`interleave()` plaçait UNE mise en pratique après chaque leçon et entassait
le reste en fin de niveau, ouvert seulement une fois le niveau terminé.
Avec 78 mises en pratique pour 30 leçons, l'essentiel attendait la fin.

Elles sont maintenant **réparties également** sur les leçons du niveau :
13 pour 5 leçons donnent 3, 3, 3, 2, 2. Plus rien n'attend la fin.

| Leçons terminées | Écoutes + lectures ouvertes (avant → après) |
|---|---|
| 0 | 0 / 78 → 0 / 78 |
| 1 | 1 / 78 → **3 / 78** |
| 5 (A1 fini) | 13 / 78 → 13 / 78 |
| 15 | 39 / 78 → 39 / 78 |

**La règle de déverrouillage elle-même n'a pas changé** : une mise en
pratique s'ouvre quand la leçon qui la précède est terminée. On apprend
d'abord, on pratique ensuite. C'est pourquoi la ligne « 0 leçon » reste à
zéro : il faut faire une leçon, pas davantage.

Le gain est donc réel mais modeste, et il faut le dire : **le vrai verrou
reste l'absence de test de placement**. Un apprenant de niveau B1 démarre à
A1 leçon 1 et doit traverser quinze leçons avant d'atteindre son niveau.
C'est le chantier suivant, décidé avec Loïc.

Deux tests de non-régression ajoutés (125 au total) : aucune mise en
pratique ne se retrouve après la dernière leçon d'un niveau, et aucune ne
s'ouvre avant la sienne.

## Écrit le 17 août — l'examen blanc passe au format réel

Le contenu suffit désormais à tirer un **échantillon** au lieu de tout
prendre. Trois défauts disparaissent d'un coup.

### Avant : un examen unique, mal proportionné
L'assemblage prenait la totalité des questions d'écoute et de lecture.
Conséquences : deux examens successifs étaient **identiques** (seule la
partie 5 variait), les proportions ne ressemblaient pas à l'épreuve, et la
durée dérivait avec le contenu — chaque ajout de texte rallongeait l'examen.

### Maintenant : le format de l'épreuve
| Section | Cible | Obtenu |
|---|---|---|
| Écoute (parties 1-4) | 100 | 99 ou 100 selon le tirage |
| Phrases à compléter (partie 5) | 30 | 30 |
| Textes à trous (partie 6) | 16 | 15 |
| Documents (partie 7) | 54 | 54 |

Durée : environ 1 h 59, contre 2 h à l'épreuve réelle.

### La règle qui commande tout : un passage ne se coupe pas
Les trois questions d'une conversation portent sur le même enregistrement.
En tirer une seule ferait écouter deux minutes d'anglais pour une question,
et fausserait le minutage autant que la difficulté. L'échantillonnage
choisit donc des **passages entiers**, et saute ceux qui ne rentrent plus
au lieu de les tronquer.

C'est aussi pourquoi 100 n'est pas toujours atteint : 100 n'est pas un
multiple de 3. Ce sont les questions-réponses de la partie 2, qui ne
comptent qu'une question chacune, qui permettent de tomber juste. On
préfère 99 questions à un passage coupé en deux.

### Un défaut trouvé en chemin
La partie 5 puisait dans les 200 premiers exercices à choix multiple —
c'est-à-dire uniquement de l'A1 et de l'A2, quel que soit le niveau de
l'apprenant. La limite passe à 1 000 : les six niveaux sont maintenant
représentés.

**Vérifié en conditions réelles** le 17/08 sur iPhone, base complète :
« 199 questions · 119 minutes », 100 d'écoute et 99 de lecture. Les
invariants sont par ailleurs couverts par 10 tests automatiques (123 au
total) : jamais plus que la cible, jamais un passage coupé, jamais deux
examens identiques.

**À retenir pour les prochaines fois** : la première vérification a montré
les anciens chiffres (240 questions). Ce n'était pas un bug mais le délai de
construction de Vercel — une ou deux minutes entre le `git push` et la mise
en ligne. Avant de conclure qu'un correctif ne marche pas, recharger la page
une minute plus tard. En cas de doute, cette commande dit quelle version le
site sert réellement :

    curl -s https://english4us.vercel.app/ | grep -oE 'assets/index-[A-Za-z0-9_-]+\.js'

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
5. ~~**Classement** (`/leaderboard`)~~ — retiré le 17/08, remplacé par
   l'écran « Entraînement ».

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
- [x] ~~**Examen blanc TOEIC** au format réel~~ — fait le 17/08. Il reste
      une limite de fond : le barème du vrai TOEIC n'est pas public, donc
      le score s'affiche en fourchette de ±50 points.

Reste de la feuille de route :

- [ ] Réglages « rappel quotidien à 18 h » et « objectif du jour » de la
      maquette : ce sont des fonctionnalités à part entière, pas de
      l'habillage. Volontairement laissées de côté.
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
