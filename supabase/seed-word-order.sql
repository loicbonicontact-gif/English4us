-- ============================================
-- SEED — « Remets les mots dans l'ordre »
-- 60 exercices : 2 par leçon, A1 -> C2.
--
-- À exécuter APRÈS migration-word-order.sql (sans elle, la contrainte de
-- type refuse ces lignes et rien n'est inséré).
-- Rejouable : ces exercices portent un marqueur « [ordre] » en fin
-- d'explication, qui permet de les supprimer sans toucher aux autres.
--
-- POURQUOI CE FORMAT, ET POURQUOI IL N'EST PAS UN DOUBLON DE LA TRADUCTION
-- Une traduction libre mélange trois difficultés : le vocabulaire,
-- l'orthographe et l'ordre des mots. Quand l'apprenant se trompe, on ne
-- sait pas laquelle a lâché — et lui non plus. Ici le vocabulaire est
-- donné, l'orthographe est donnée : il ne reste QUE l'ordre. C'est le point
-- où le français trahit l'anglais le plus mécaniquement.
--
-- LES PIÈGES CIBLÉS, dans l'ordre où ils apparaissent
--   A1-A2  l'adjectif avant le nom, l'adverbe de fréquence avant le verbe,
--          l'auxiliaire « do/does » de la question et de la négation,
--          « there is » pour « il y a »
--   B1     « very much » en fin de phrase, le double objet (send me the
--          report), « never » entre l'auxiliaire et le participe
--   B2     pas de « will » dans la subordonnée de condition, la voix
--          passive, la place du complément de temps
--   C1-C2  l'inversion après un adverbe négatif en tête de phrase
--          (« Never had I seen… », « Under no circumstances will we… »),
--          la seule structure anglaise qui n'a aucun équivalent français
--
-- COLONNE `options` — ATTENTION, SENS DIFFÉRENT D'UN QCM
-- Pour un exercice 'ordre', `options` ne contient pas des propositions
-- mais des ÉTIQUETTES EN TROP : des mots intrus. Sans intrus, il suffit de
-- vider la réserve pour réussir sans rien comprendre. Avec un intrus, il
-- faut décider qu'un mot ne sert pas — c'est là que la règle s'apprend.
--
-- Chaque intrus est le mot que le francophone ajoute spontanément : le
-- « to » de « you should to see », le « do » de « we do not are late ».
-- Aucun intrus ne permet de construire une SECONDE phrase correcte : ce
-- serait refuser une bonne réponse.
--
-- LES VARIANTES SÉPARÉES PAR « / »
-- Quand deux ordres sont tous les deux naturels (« Yesterday I went to
-- London » / « I went to London yesterday »), les deux sont acceptés. Les
-- étiquettes se découpent sur la PREMIÈRE variante ; la correction, elle,
-- accepte les deux.
--
-- LA DÉCISION LA PLUS DISCUTABLE : les inversions du C1-C2
-- Les mêmes étiquettes que « Never had I seen such a thing » forment aussi
-- « I had never seen such a thing », qui est de l'anglais correct. Deux
-- choix se présentaient : refuser la seconde pour forcer l'inversion, ou
-- l'accepter.
--
-- Elle est acceptée. Refuser une phrase juste apprendrait à l'apprenant que
-- l'application se trompe, et c'est la leçon la plus coûteuse qu'un
-- exercice puisse donner. C'est l'explication — affichée après validation —
-- qui enseigne alors la différence : l'inversion n'est pas plus correcte,
-- elle est d'un autre registre. Sept exercices des niveaux C1-C2 acceptent
-- ainsi deux ordres, dix-huit sur les soixante toutes causes confondues, et
-- `src/lib/wordOrder.content.test.js` vérifie qu'aucune variante acceptée
-- n'est impossible à construire avec les étiquettes affichées.
-- ============================================

delete from exercises where explanation like '%[ordre]';

-- ---------- A1.1 Se présenter ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(1, 'ordre', 'Construis la phrase anglaise : « Je m''appelle Sarah et j''ai vingt ans. »', null, 'My name is Sarah and I am twenty years old', 'Deux structures d''un coup : « my name is » (et non « I call me »), et surtout « I AM twenty » — en anglais on EST un âge, on ne l''a pas. [ordre]'),
(1, 'ordre', 'Construis la phrase anglaise : « D''où viens-tu ? »', null, 'Where do you come from', 'La question anglaise réclame l''auxiliaire « do », absent du français, et la préposition part à la fin : « Where do you come FROM ». « From where » existe, mais seulement à l''écrit très formel. [ordre]');

-- ---------- A1.2 La famille ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(2, 'ordre', 'Construis la phrase anglaise : « C''est le mari de ma sœur. »', '["of"]', 'This is my sister''s husband', 'Le français dit « le mari DE ma sœur », l''anglais renverse : le possesseur passe devant, avec ''s. « The husband of my sister » se comprend mais sonne étranger. [ordre]'),
(2, 'ordre', 'Construis la phrase anglaise : « Je n''ai pas de frères. »', null, 'I do not have any brothers', 'La négation anglaise passe par « do not » + le verbe à la base. « I have not brothers » est la faute la plus fréquente : elle traduit le français mot à mot. [ordre]');

-- ---------- A1.3 Les nombres et l'heure ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(3, 'ordre', 'Construis la phrase anglaise : « Il est huit heures et quart. »', '["and"]', 'It is a quarter past eight', 'L''anglais annonce les minutes AVANT l''heure : « a quarter past eight ». Le français fait l''inverse (« huit heures et quart »), et son « et » n''a pas d''équivalent ici. [ordre]'),
(3, 'ordre', 'Construis la phrase anglaise : « Le magasin ouvre à neuf heures tous les jours. »', null, 'The shop opens at nine every day / Every day the shop opens at nine', 'L''ordre anglais est verbe, puis lieu ou heure, puis fréquence. Le complément de temps général (« every day ») se met en fin de phrase. [ordre]');

-- ---------- A1.4 Nourriture et boissons ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(4, 'ordre', 'Construis la phrase anglaise : « Je bois toujours du thé le matin. »', null, 'I always drink tea in the morning / In the morning I always drink tea', 'L''adverbe de fréquence (always, often, never) se glisse AVANT le verbe : « I always drink ». Le français le met après (« je bois toujours »). [ordre]'),
(4, 'ordre', 'Construis la phrase anglaise : « Il y a du lait dans le frigo. »', '["it"]', 'There is some milk in the fridge', '« Il y a » se dit « there is » — jamais « it is ». « It » désignerait une chose précise déjà connue ; « there » annonce une existence. [ordre]');

-- ---------- A1.5 Verbes essentiels (be, have, do) ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(5, 'ordre', 'Construis la phrase anglaise : « Est-ce qu''elle a une voiture ? »', '["has"]', 'Does she have a car', 'Dès que « does » ouvre la question, le verbe revient à sa forme de base : « does she HAVE », jamais « does she has ». Le -s est déjà porté par l''auxiliaire. [ordre]'),
(5, 'ordre', 'Construis la phrase anglaise : « Nous ne sommes pas en retard. »', '["do"]', 'We are not late', '« Be » se nie tout seul : « we are not ». L''auxiliaire « do » ne sert qu''aux autres verbes — « we do not are » est impossible. [ordre]');

-- ---------- A2.1 Le passé simple ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(6, 'ordre', 'Construis la phrase anglaise : « Hier, je suis allé à Londres. »', null, 'Yesterday I went to London / I went to London yesterday', 'Les deux ordres sont corrects : le complément de temps peut ouvrir ou fermer la phrase, mais jamais se glisser entre le verbe et son complément. [ordre]'),
(6, 'ordre', 'Construis la phrase anglaise : « Elle n''a pas fini son travail. »', '["has"]', 'She did not finish her work', 'Le passé nié se construit avec « did not » + la base du verbe. Le passé est déjà dans « did » : « did not finished » double la marque. [ordre]');

-- ---------- A2.2 Voyages et directions ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(7, 'ordre', 'Construis la phrase anglaise : « Comment puis-je aller à la gare ? »', null, 'How can I get to the station', 'Après le mot interrogatif, l''anglais inverse le modal et le sujet : « how CAN I ». On dit « get to » plutôt que « go to » pour demander un chemin. [ordre]'),
(7, 'ordre', 'Construis la phrase anglaise : « Tournez à gauche au deuxième feu. »', null, 'Turn left at the second traffic light', 'L''impératif anglais n''a pas de sujet, et « left » suit directement le verbe, sans préposition — pas de « turn to the left ». [ordre]');

-- ---------- A2.3 Achats et argent ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(8, 'ordre', 'Construis la phrase anglaise : « Combien coûte cette chemise ? »', '["costs"]', 'How much does this shirt cost', 'Même règle qu''au A1 : « does » ouvre la question, donc le verbe reste nu. « How much does this shirt costs » est la faute réflexe. [ordre]'),
(8, 'ordre', 'Construis la phrase anglaise : « Je voudrais payer par carte. »', null, 'I would like to pay by card', '« Would like » demande toujours « to » devant le verbe suivant. Le français « je voudrais payer » n''a pas ce mot, et il manque souvent. [ordre]');

-- ---------- A2.4 Décrire son quotidien ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(9, 'ordre', 'Construis la phrase anglaise : « Je me lève à sept heures tous les matins. »', '["myself"]', 'I get up at seven every morning / Every morning I get up at seven', '« Se lever » est réfléchi en français, pas en anglais : « I get up », jamais « I get up myself ». L''heure précède la fréquence. [ordre]'),
(9, 'ordre', 'Construis la phrase anglaise : « Il ne travaille jamais le dimanche. »', '["not"]', 'He never works on Sundays / On Sundays he never works', '« Never » porte déjà la négation : ajouter « not » la doublerait. Il se place avant le verbe, et le verbe garde son -s. [ordre]');

-- ---------- A2.5 Le futur (will / going to) ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(10, 'ordre', 'Construis la phrase anglaise : « Nous allons déménager l''année prochaine. »', null, 'We are going to move next year', 'Un projet décidé se dit « be going to » + base du verbe. Attention : « we are going to move », pas « we are going to moving ». [ordre]'),
(10, 'ordre', 'Construis la phrase anglaise : « Je pense qu''il pleuvra demain. »', '["that"]', 'I think it will rain tomorrow / I think that it will rain tomorrow', 'Après « I think », l''anglais laisse tomber « that » à l''oral. Le futur se marque une seule fois, dans la subordonnée. [ordre]');

-- ---------- B1.1 Exprimer une opinion ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(11, 'ordre', 'Construis la phrase anglaise : « À mon avis, ce film est trop long. »', '["at"]', 'In my opinion this film is too long / This film is too long in my opinion', 'On dit « IN my opinion » — « at my opinion » calque le français « à ». « Too » précède l''adjectif qu''il intensifie. [ordre]'),
(11, 'ordre', 'Construis la phrase anglaise : « J''aime beaucoup ce livre. »', null, 'I like this book very much', 'Le piège le plus tenace : « very much » se place en FIN de phrase, jamais entre le verbe et son objet. « I like very much this book » se repère immédiatement comme une faute de francophone. [ordre]');

-- ---------- B1.2 Le monde du travail ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(12, 'ordre', 'Construis la phrase anglaise : « Elle travaille dans cette entreprise depuis cinq ans. »', '["since"]', 'She has worked for this company for five years', 'Une action commencée dans le passé et toujours vraie demande le present perfect. « For » introduit une DURÉE, « since » un point de départ : cinq ans est une durée. [ordre]'),
(12, 'ordre', 'Construis la phrase anglaise : « Pouvez-vous m''envoyer le rapport ? »', '["to"]', 'Can you send me the report / Can you send the report to me', 'Deux compléments : la personne d''abord, la chose ensuite, sans préposition. « Send me the report » ou « send the report TO me », mais jamais « send to me the report ». [ordre]');

-- ---------- B1.3 Present perfect ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(13, 'ordre', 'Construis la phrase anglaise : « Je n''ai jamais visité l''Écosse. »', null, 'I have never visited Scotland', '« Never » se glisse ENTRE l''auxiliaire et le participe : « have never visited ». Le français le met après le participe, d''où l''erreur « I have visited never ». [ordre]'),
(13, 'ordre', 'Construis la phrase anglaise : « As-tu déjà fini ? »', null, 'Have you finished yet', 'Dans une question, « déjà » se dit « yet » et ferme la phrase. « Already » marque la surprise (« you have already finished? »), ce n''est pas la même question. [ordre]');

-- ---------- B1.4 Santé et bien-être ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(14, 'ordre', 'Construis la phrase anglaise : « Je ne me sens pas très bien aujourd''hui. »', '["good"]', 'I do not feel very well today / Today I do not feel very well', 'Sur la santé, on dit « well », pas « good » : « good » qualifierait la qualité de la sensation, pas l''état. La négation passe par « do not ». [ordre]'),
(14, 'ordre', 'Construis la phrase anglaise : « Tu devrais voir un médecin. »', '["to"]', 'You should see a doctor', 'Après un modal (should, must, can, will), le verbe suit nu, sans « to ». « You should to see » est une faute de francophone quasi systématique. [ordre]');

-- ---------- B1.5 Comparatifs et superlatifs ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(15, 'ordre', 'Construis la phrase anglaise : « Ce train est plus rapide que l''autre. »', '["more"]', 'This train is faster than the other one', 'Un adjectif court prend -er, pas « more » : « faster », jamais « more fast ». Et « the other » réclame « one » quand le nom n''est pas répété. [ordre]'),
(15, 'ordre', 'Construis la phrase anglaise : « C''est le meilleur restaurant de la ville. »', '["of"]', 'It is the best restaurant in town', 'Après un superlatif, le lieu s''introduit par « in », pas « of » : « the best restaurant IN town ». Le français « de la ville » induit l''erreur. [ordre]');

-- ---------- B2.1 Débattre et argumenter ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(16, 'ordre', 'Construis la phrase anglaise : « Je ne suis pas du tout d''accord avec cette idée. »', '["am"]', 'I do not agree with this idea at all', '« Agree » est un VERBE en anglais : « I agree », pas « I am agree » — la faute la plus reconnaissable du francophone. « At all » renforce la négation en fin de phrase. [ordre]'),
(16, 'ordre', 'Construis la phrase anglaise : « D''une part, cela coûterait très cher. »', null, 'On the one hand it would be very expensive', 'La formule figée est « on the one hand » (suivie plus loin de « on the other hand »). « Very » précède toujours l''adjectif. [ordre]');

-- ---------- B2.2 Conditionnels (1st, 2nd) ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(17, 'ordre', 'Construis la phrase anglaise : « Si j''avais plus de temps, j''apprendrais le piano. »', null, 'If I had more time I would learn the piano / I would learn the piano if I had more time', 'Deuxième conditionnel : passé simple après « if », « would » dans l''autre moitié. Jamais « if I would have » — le conditionnel ne se met pas des deux côtés. [ordre]'),
(17, 'ordre', 'Construis la phrase anglaise : « Nous resterons à la maison s''il pleut. »', '["will"]', 'We will stay at home if it rains / If it rains we will stay at home', 'Après « if », l''anglais emploie le présent même quand le sens est futur : « if it rains », jamais « if it will rain ». Le futur reste dans l''autre moitié. [ordre]');

-- ---------- B2.3 Environnement et société ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(18, 'ordre', 'Construis la phrase anglaise : « De plus en plus de gens utilisent les transports en commun. »', '["peoples"]', 'More and more people use public transport', '« People » est déjà pluriel : pas de -s, et le verbe suit sans -s (« people use »). « Public transport » ne se met pas au pluriel en anglais britannique. [ordre]'),
(18, 'ordre', 'Construis la phrase anglaise : « Nous devons agir avant qu''il ne soit trop tard. »', '["will"]', 'We must act before it is too late', 'Après « before », l''anglais reste au présent : « before it IS too late ». Et « must » est suivi du verbe nu, sans « to ». [ordre]');

-- ---------- B2.4 Voix passive ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(19, 'ordre', 'Construis la phrase anglaise : « Ce pont a été construit en 1890. »', '["has"]', 'This bridge was built in 1890', 'Une date passée et fermée demande le passé simple passif : « was built ». « Has been built » supposerait un lien avec le présent, ce que « en 1890 » exclut. [ordre]'),
(19, 'ordre', 'Construis la phrase anglaise : « La réunion a été annulée par le directeur. »', '["from"]', 'The meeting was cancelled by the manager', 'L''auteur de l''action passive s''introduit par « by », jamais « from » : « cancelled BY the manager ». Le français « par » aide ici, mais « from » reste une erreur fréquente. [ordre]');

-- ---------- B2.5 Anglais professionnel ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(20, 'ordre', 'Construis la phrase anglaise : « Je vous écris pour postuler à ce poste. »', '["for"]', 'I am writing to apply for this position', 'Le but se dit « to » + verbe, jamais « for » + verbe : « I am writing TO apply ». En revanche « apply FOR a position » garde bien sa préposition. [ordre]'),
(20, 'ordre', 'Construis la phrase anglaise : « N''hésitez pas à me contacter. »', null, 'Please do not hesitate to contact me', 'Formule figée de l''e-mail professionnel. L''impératif nié garde « do not » même sans sujet, et le pronom objet vient après le verbe. [ordre]');

-- ---------- C1.1 Nuances et registres de langue ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(21, 'ordre', 'Construis la phrase anglaise : « Je n''avais jamais vu une telle chose. »', null, 'Never had I seen such a thing / I had never seen such a thing', 'Un adverbe négatif en tête de phrase FORCE l''inversion : « Never HAD I seen ». C''est la structure anglaise sans aucun équivalent français — et la marque d''un registre soutenu. [ordre]'),
(21, 'ordre', 'Construis la phrase anglaise : « Ce n''est pas tant une question d''argent que de temps. »', '["than"]', 'It is not so much a question of money as of time', 'La comparaison « pas tant… que » se dit « not so much… AS », jamais « than ». « Than » appartient aux comparatifs simples (bigger than). [ordre]');

-- ---------- C1.2 Conditionnels avancés (3rd, mixed) ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(22, 'ordre', 'Construis la phrase anglaise : « Si j''avais su, je ne serais pas venu. »', null, 'If I had known I would not have come / I would not have come if I had known', 'Troisième conditionnel, un regret : plus-que-parfait après « if », « would have » + participe dans l''autre moitié. Le « would » ne franchit jamais le « if ». [ordre]'),
(22, 'ordre', 'Construis la phrase anglaise : « Elle aurait dû nous le dire plus tôt. »', '["must"]', 'She should have told us earlier', 'Le reproche se construit « should have » + participe. « Must have » existe mais dit autre chose : la déduction (« elle a dû nous le dire »). [ordre]');

-- ---------- C1.3 Actualités et médias ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(23, 'ordre', 'Construis la phrase anglaise : « Le rapport aurait été divulgué la semaine dernière. »', null, 'The report is said to have been leaked last week', 'Le conditionnel journalistique français (« aurait été ») se rend par « is said to have been » : la source n''est pas endossée. Une traduction par « would have been » dirait tout autre chose. [ordre]'),
(23, 'ordre', 'Construis la phrase anglaise : « Rarement une élection a suscité autant d''intérêt. »', null, 'Rarely has an election aroused so much interest / An election has rarely aroused so much interest', 'Même mécanique que « never » : « rarely » en tête entraîne l''inversion (« rarely HAS an election »). Sans inversion, la phrase reste comprise mais sonne comme une traduction. [ordre]');

-- ---------- C1.4 Expressions idiomatiques ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(24, 'ordre', 'Construis la phrase anglaise : « Il a vendu la mèche. »', '["sold"]', 'He let the cat out of the bag', 'Une image ne se traduit pas : l''anglais laisse sortir le chat du sac là où le français vend la mèche. L''ordre des mots est figé, il n''y a rien à négocier. [ordre]'),
(24, 'ordre', 'Construis la phrase anglaise : « Ça ne me dit rien du tout. »', null, 'That does not ring a bell at all', '« Ring a bell » = éveiller un souvenir. La négation passe par « does not », et « at all » ferme la phrase pour la renforcer. [ordre]');

-- ---------- C1.5 Rédaction argumentative ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(25, 'ordre', 'Construis la phrase anglaise : « Non seulement c''est coûteux, mais c''est aussi inefficace. »', null, 'Not only is it expensive but it is also ineffective / It is not only expensive but it is also ineffective', '« Not only » en tête inverse la première moitié (« not only IS it »), et la seconde reste normale. Cette asymétrie est le point difficile. [ordre]'),
(25, 'ordre', 'Construis la phrase anglaise : « Il convient de souligner que les données restent incomplètes. »', '["datas"]', 'It should be pointed out that the data remain incomplete', 'En registre académique, « data » est traité comme un pluriel : « the data REMAIN ». Et il ne prend jamais de -s. [ordre]');

-- ---------- C2.1 Registres académiques et littéraires ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(26, 'ordre', 'Construis la phrase anglaise : « Aussi convaincant que soit l''argument, il reste théorique. »', '["although"]', 'Convincing as the argument may be it remains theoretical', 'Structure concessive littéraire : l''adjectif ouvre la phrase, suivi de « as… may be ». « Although » dirait la même chose en registre neutre, mais ce n''est pas la structure demandée. [ordre]'),
(26, 'ordre', 'Construis la phrase anglaise : « Ce n''est qu''alors que la véritable ampleur est apparue. »', null, 'Only then did the true scale become apparent', '« Only » en tête entraîne l''inversion avec « did », et le verbe revient à sa base : « did the true scale BECOME ». Le passé est porté par « did » seul. [ordre]');

-- ---------- C2.2 Subtilités phonétiques et accents ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(27, 'ordre', 'Construis la phrase anglaise : « Ce n''est pas tant ce qu''il a dit que la façon dont il l''a dit. »', '["than"]', 'It was not what he said so much as the way he said it', 'Deux subordonnées enchâssées sans pronom relatif : « the way he said it », sans « that » ni « in which ». Et toujours « so much AS », jamais « than ». [ordre]'),
(27, 'ordre', 'Construis la phrase anglaise : « À peine avait-elle parlé que la salle s''est tue. »', null, 'Hardly had she spoken when the room fell silent / She had hardly spoken when the room fell silent', '« Hardly » en tête inverse (« hardly HAD she spoken »), et la suite s''introduit par « when », jamais par « than » — le « que » français n''est pas un comparatif ici. [ordre]');

-- ---------- C2.3 Négociation et diplomatie ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(28, 'ordre', 'Construis la phrase anglaise : « En aucun cas nous n''accepterons ces conditions. »', null, 'Under no circumstances will we accept these terms', 'La formule est figée et l''inversion obligatoire : « under no circumstances WILL WE accept ». Sans elle, la fermeté du propos tombe à plat. [ordre]'),
(28, 'ordre', 'Construis la phrase anglaise : « Nous serions disposés à revoir notre offre. »', '["for"]', 'We would be prepared to reconsider our offer', 'La disposition se dit « prepared TO » + verbe. « Prepared for » existe mais annonce un nom (« prepared for the meeting »), pas une action. [ordre]');

-- ---------- C2.4 Humour, ironie et sous-entendus ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(29, 'ordre', 'Construis la phrase anglaise : « Ce n''est pas ce qu''on appellerait un homme patient. »', null, 'He is not what you would call a patient man', 'L''euphémisme anglais type : « not what you would call… ». Et l''adjectif reste devant le nom (« a patient man »), même dans une tournure sinueuse. [ordre]'),
(29, 'ordre', 'Construis la phrase anglaise : « Autant dire qu''il n''était pas ravi. »', null, 'Suffice it to say he was not delighted', 'Formule figée avec inversion fossilisée : « suffice IT to say ». L''ironie tient à l''écart entre la litote (« not delighted ») et la réalité. [ordre]');

-- ---------- C2.5 Maîtrise totale : synthèse ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(30, 'ordre', 'Construis la phrase anglaise : « Ce n''est qu''en écoutant attentivement qu''on saisit la nuance. »', null, 'Only by listening carefully can one grasp the nuance / One can grasp the nuance only by listening carefully', 'Cumul de tout ce qui précède : « only » en tête, donc inversion (« CAN ONE grasp »), et « by » + forme en -ing pour le moyen. [ordre]'),
(30, 'ordre', 'Construis la phrase anglaise : « Quoi qu''il arrive, nous tiendrons nos engagements. »', null, 'Whatever happens we will keep our commitments / We will keep our commitments whatever happens', '« Whatever » suffit, sans « that », et la subordonnée reste au présent : « whatever HAPPENS ». Le futur ne se marque qu''une fois, dans la proposition principale. [ordre]');

-- ============================================
-- VÉRIFICATION — doit renvoyer 60, puis 2 par leçon pour les 30 leçons.
-- ============================================
select count(*) as total_ordre from exercises where type = 'ordre';

select lesson_id, count(*) as nb
from exercises
where type = 'ordre'
group by lesson_id
order by lesson_id;
