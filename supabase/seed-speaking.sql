-- ============================================
-- SEED — expression orale (type « oral »)
-- 60 exercices : 2 par leçon, A1 -> C2.
--
-- À exécuter APRÈS seed.sql. Rejouable.
--
-- DÉROULEMENT DE L'EXERCICE
--   1. la phrase anglaise est affichée ET lue à voix haute automatiquement
--   2. l'apprenant appuie sur le micro et la répète
--   3. la reconnaissance vocale transcrit, l'application compare mot à mot
--
-- CONVENTION
--   question       = la consigne en français (contexte, intention).
--   correct_answer = la phrase ANGLAISE à prononcer. Affichée, lue en
--                    modèle, et comparée à ce qui a été dit.
--   explanation    = le point de prononciation à retenir.
--
-- CHOIX DES PHRASES
-- Chacune vise une difficulté de prononciation propre aux francophones :
-- le « th », le « h » aspiré, les terminaisons « -ed » et « -s », l'accent
-- tonique, les voyelles longues et brèves. Les phrases restent courtes :
-- la reconnaissance vocale décroche sur les phrases longues, et l'apprenant
-- ne saurait pas quel mot corriger.
-- ============================================

delete from exercises where type = 'oral';

-- ---------- A1 ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(1, 'oral', 'Présente-toi à voix haute.', null, 'Hello, my name is Anna', 'Le « h » de « hello » se prononce, soufflé. En français il est muet : c''est la première habitude à défaire.'),
(1, 'oral', 'Dis d''où tu viens.', null, 'I am from France', 'Le « I » se prononce « aïe », jamais « i ». Erreur la plus fréquente des débutants francophones.'),

(2, 'oral', 'Parle de ta famille.', null, 'This is my mother and my father', 'Deux « th » différents : celui de « this » est sonore (la gorge vibre), celui de « thank » ne l''est pas. Ici, il vibre.'),
(2, 'oral', 'Dis combien tu as de frères.', null, 'I have three brothers', '« Three » commence par un « th » sourd. Ne le remplace pas par « tree » : ce serait « un arbre ».'),

(3, 'oral', 'Donne l''heure.', null, 'It is half past seven', 'Le « f » de « half » ne se prononce pas : on dit « haaf ». Piège classique.'),
(3, 'oral', 'Compte de un à cinq.', null, 'One, two, three, four, five', '« Five » se termine par un « v » bien sonore, pas un « f ». La différence est audible en anglais.'),

(4, 'oral', 'Commande une boisson.', null, 'I would like a cup of tea', 'Le « d » de « would » est muet : on dit « woud ». Trois lettres, deux sons.'),
(4, 'oral', 'Demande l''addition.', null, 'Could I have the bill please', '« Could » se prononce « coud », le « l » est muet. Comme dans « should » et « would ».'),

(5, 'oral', 'Décris une action en cours.', null, 'She is reading a book', 'La terminaison « -ing » se prononce du fond de la gorge, jamais « ingue ». Ne fais pas sonner le « g ».'),
(5, 'oral', 'Dis ce que tu possèdes.', null, 'He has a new car', '« Has » a un « s » sonore, comme un « z » : « haz ». Le « s » sourd donnerait un autre mot.'),

-- ---------- A2 ----------
(6, 'oral', 'Raconte ce que tu as fait hier.', null, 'I walked to the station', 'La terminaison « -ed » se prononce ici « t » : « walkt ». Jamais « walk-ed » en deux syllabes.'),
(6, 'oral', 'Raconte une autre action passée.', null, 'We visited my grandmother', 'Ici « -ed » se prononce « id » et forme une syllabe : « visit-id ». Parce que le verbe finit par un « t ».'),

(7, 'oral', 'Demande ton chemin.', null, 'Excuse me, where is the station', 'L''intonation monte sur « where » puis descend. Une question ouverte ne monte pas à la fin, contrairement au français.'),
(7, 'oral', 'Indique une direction.', null, 'Turn left at the traffic lights', 'Le « gh » de « lights » est totalement muet : « laïts ». Comme dans « night » et « right ».'),

(8, 'oral', 'Demande un prix.', null, 'How much does this cost', '« Much » finit par le son « tch ». Ne le prononce pas « meuch ».'),
(8, 'oral', 'Dis ce que tu as acheté.', null, 'I bought these shoes yesterday', '« Bought » se prononce « bôt » : le « gh » est muet, comme dans « thought » et « brought ».'),

(9, 'oral', 'Décris ta routine du matin.', null, 'I usually wake up at seven', 'Le « s » de « usually » se prononce comme le « j » français de « je ». Son rare en anglais.'),
(9, 'oral', 'Parle d''une habitude.', null, 'He never drinks coffee', 'L''accent tonique de « coffee » tombe sur la première syllabe : CO-ffee, pas co-FFEE.'),

(10, 'oral', 'Annonce un projet.', null, 'I am going to visit London', 'À l''oral, « going to » devient « gonna » chez les anglophones. Prononce-le clairement pour l''instant, mais habitue ton oreille.'),
(10, 'oral', 'Fais une promesse.', null, 'I will call you tomorrow', 'Le « w » de « will » se prononce avec les lèvres arrondies vers l''avant. Ne dis pas « vil ».'),

-- ---------- B1 ----------
(11, 'oral', 'Donne ton opinion.', null, 'In my opinion, this is a mistake', 'L''accent de « opinion » tombe sur la deuxième syllabe : o-PI-nion. En français il tombe à la fin.'),
(11, 'oral', 'Exprime un désaccord poli.', null, 'I am afraid I do not agree', 'L''accent de « agree » tombe sur la fin : a-GREE. Le contraire du français « accord ».'),

(12, 'oral', 'Parle de ton travail.', null, 'I work for an international company', '« Company » a trois syllabes et l''accent sur la première : COM-pa-ny.'),
(12, 'oral', 'Annonce une réunion.', null, 'The meeting has been postponed', '« Postponed » se termine par « d » sonore. Deux « p » à articuler séparément : post-PONED.'),

(13, 'oral', 'Parle de ton ancienneté.', null, 'I have worked here for three years', 'Le « r » anglais ne roule pas et ne racle pas la gorge : la langue recule sans toucher le palais.'),
(13, 'oral', 'Pose une question sur une expérience.', null, 'Have you ever been to Scotland', 'Ici l''intonation monte à la fin : c''est une question fermée, elle attend oui ou non.'),

(14, 'oral', 'Donne un conseil de santé.', null, 'You should drink more water', 'Le « l » de « should » est muet. Et « water » a un « a » long, comme « wô ».'),
(14, 'oral', 'Décris un symptôme.', null, 'I have had a headache since Monday', '« Headache » se prononce « hèd-éïk » : le « ch » sonne « k », pas « ch ».'),

(15, 'oral', 'Compare deux choses.', null, 'This one is more expensive', '« Expensive » porte l''accent au milieu : ex-PEN-sive.'),
(15, 'oral', 'Utilise un superlatif.', null, 'It was the best day of my year', 'Les mots courts s''enchaînent sans pause : « the best day » se dit d''un seul souffle.'),

-- ---------- B2 ----------
(16, 'oral', 'Introduis une objection nuancée.', null, 'Although I understand your point', '« Although » contient un « th » sonore. L''accent tombe sur la fin : al-THOUGH.'),
(16, 'oral', 'Conteste une affirmation.', null, 'There is little evidence for that', '« Evidence » porte l''accent sur la première syllabe : E-vi-dence.'),

(17, 'oral', 'Formule une condition.', null, 'If we leave now, we will arrive early', 'Une virgule à l''écrit est une vraie pause à l''oral. Elle sépare les deux parties de la condition.'),
(17, 'oral', 'Imagine une situation.', null, 'If I had more time, I would travel', 'Dans « would », le « l » et le « d » se fondent : « woud ». Ne détache pas.'),

(18, 'oral', 'Parle d''environnement.', null, 'We must reduce our carbon emissions', '« Emissions » se termine par le son « chens ». L''accent est au milieu : e-MI-ssions.'),
(18, 'oral', 'Évoque une menace.', null, 'Many species are under threat', '« Species » se prononce « spii-chiiz », pas « spé-cièss ».'),

(19, 'oral', 'Utilise la voix passive.', null, 'The report was written last week', '« Written » a un double « t » qui claque : wri-TTen. La voyelle est brève.'),
(19, 'oral', 'Donne une consigne formelle.', null, 'All forms must be submitted online', '« Submitted » : le « -ed » forme une syllabe entière ici, comme « visited ».'),

(20, 'oral', 'Écris une phrase d''e-mail professionnel.', null, 'Please find the attached document', '« Document » porte l''accent sur la première syllabe quand c''est un nom : DO-cument.'),
(20, 'oral', 'Annonce un retard.', null, 'The delivery has been delayed', '« Delayed » se prononce en deux syllabes : de-LAYD. Le « -ed » ne s''entend pas séparément.'),

-- ---------- C1 ----------
(21, 'oral', 'Refuse poliment une demande.', null, 'I am afraid that will not be possible', 'Le ton doit rester bas et calme : c''est lui qui rend le refus poli, pas les mots.'),
(21, 'oral', 'Exprime une réserve.', null, 'I would rather we discussed this later', '« Rather » contient un « th » sonore entre deux voyelles. La langue passe entre les dents.'),

(22, 'oral', 'Exprime un regret sur le passé.', null, 'She would have taken another flight', 'À l''oral « would have » devient « would''ve », presque « woudev ». Enchaîne les deux mots.'),
(22, 'oral', 'Utilise une inversion soutenue.', null, 'Had we known, we would have waited', 'L''inversion demande une intonation descendante sur « known », qui marque la fin de la condition.'),

(23, 'oral', 'Commente un article de presse.', null, 'The figures were deliberately misleading', '« Deliberately » a cinq syllabes, accent sur la deuxième : de-LI-be-rate-ly.'),
(23, 'oral', 'Parle du traitement médiatique.', null, 'The story dominated the headlines', '« Dominated » : accent sur la première syllabe, DO-mi-na-ted.'),

(24, 'oral', 'Utilise une expression idiomatique.', null, 'Let us call it a day', 'Une expression figée se dit d''un bloc, sans détacher les mots. C''est ce qui la rend naturelle.'),
(24, 'oral', 'Emploie une autre expression.', null, 'It went down like a lead balloon', '« Lead » se prononce ici « lèd », comme le métal, pas « liid » comme le verbe conduire.'),

(25, 'oral', 'Annonce une thèse à l''oral.', null, 'The benefits clearly outweigh the risks', '« Outweigh » : le « gh » est muet, on dit « aoutt-wéï ».'),
(25, 'oral', 'Nuance une conclusion.', null, 'The evidence is far from conclusive', 'Marque une légère pause avant « far from » : elle met l''accent sur la réserve.'),

-- ---------- C2 ----------
(26, 'oral', 'Prononce une phrase de registre académique.', null, 'The author draws a subtle distinction', '« Subtle » : le « b » est totalement muet. On dit « seutl ».'),
(26, 'oral', 'Formule une critique savante.', null, 'Such assumptions rarely withstand scrutiny', '« Scrutiny » porte l''accent sur la première syllabe : SCRU-ti-ny.'),

(27, 'oral', 'Prononce une phrase à accent mobile.', null, 'The desert was deserted', 'DE-sert (le désert, nom) puis de-SER-ted (déserté). Même racine, accent différent : c''est lui qui distingue les deux.'),
(27, 'oral', 'Une autre phrase à accent mobile.', null, 'He objected to the object', 'ob-JEC-ted (verbe) puis OB-ject (nom). Règle générale : le nom accentue le début, le verbe la fin.'),

(28, 'oral', 'Fais une proposition de négociation.', null, 'We are prepared to lower the price', 'Le ton doit rester neutre : une proposition dite avec assurance se négocie mieux qu''une proposition hésitante.'),
(28, 'oral', 'Reporte un point de désaccord.', null, 'Let us set that aside for now', 'Enchaîne « set that » sans marquer le premier « t » : les deux se fondent en un seul son.'),

(29, 'oral', 'Prononce une phrase ironique.', null, 'Well, that went about as well as expected', 'Toute l''ironie est dans le ton : allonge « well » et descends sur « expected ». Les mots seuls ne disent rien.'),
(29, 'oral', 'Formule une litote.', null, 'He is not exactly known for his patience', 'Appuie sur « exactly » : c''est ce mot qui retourne le sens de la phrase.'),

(30, 'oral', 'Prononce une phrase de synthèse complexe.', null, 'Had the committee acted sooner, this could have been avoided', 'Trois difficultés enchaînées : inversion, « could have » contracté en « could''ve », et « avoided » en trois syllabes.'),
(30, 'oral', 'Termine par un constat.', null, 'What strikes me most is how little has changed', 'La structure clivée met en avant « what strikes me most » : marque une pause après « most ».');
