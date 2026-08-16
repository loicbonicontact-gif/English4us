-- ============================================
-- SEED — dictées audio (type « ecoute »)
-- 60 exercices : 2 par leçon, A1 -> C2.
--
-- À exécuter dans Supabase SQL Editor APRÈS seed.sql.
-- Rejouable : les dictées existantes sont d'abord supprimées.
--
-- CONVENTION PROPRE À CE TYPE D'EXERCICE
--   question       = la consigne EN FRANÇAIS uniquement. Elle donne le
--                    contexte (qui parle, de quoi) sans jamais contenir un
--                    mot de la phrase attendue — sinon il n'y a plus rien
--                    à écouter.
--   correct_answer = la phrase ANGLAISE. C'est elle que la synthèse vocale
--                    lit à voix haute, et elle ne s'affiche qu'après
--                    validation.
--   explanation    = le point de langue ou le piège d'écoute.
--
-- Une barre « / » sépare deux orthographes également justes (chiffres en
-- lettres ou en nombres). La comparaison ignore déjà la ponctuation, les
-- majuscules et les contractions courantes (don't / do not).
--
-- Les phrases montent en longueur avec le niveau : 5 à 7 mots en A1,
-- 12 à 16 en C2. À partir de B2 le vocabulaire est volontairement celui du
-- monde du travail, qui est aussi celui du TOEIC.
-- ============================================

delete from exercises where type = 'ecoute';

-- ---------- A1 ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(1, 'ecoute', 'Quelqu''un se présente. Écris sa phrase.', null, 'Hello, my name is Anna', 'Le « h » de « hello » est bien prononcé en anglais, contrairement au français où il reste muet.'),
(1, 'ecoute', 'La même personne dit d''où elle vient.', null, 'I am from France/I''m from France', 'À l''oral, « I am » devient presque toujours « I''m ». Les deux orthographes sont acceptées.'),

(2, 'ecoute', 'Quelqu''un décrit sa famille.', null, 'I have two brothers and one sister/I have 2 brothers and 1 sister', 'Piège d''écoute : « brothers » porte un « s » sonore, « sister » est au singulier. Compte bien.'),
(2, 'ecoute', 'Cette personne parle du métier de sa mère.', null, 'My mother is a teacher', 'L''article « a » est obligatoire devant un métier en anglais : « she is a teacher », jamais « she is teacher ».'),

(3, 'ecoute', 'Une annonce donne l''heure d''un cours.', null, 'The lesson starts at nine o''clock', '« At » introduit une heure précise. « O''clock » ne s''emploie que pour une heure pile.'),
(3, 'ecoute', 'Quelqu''un compte les élèves d''une classe.', null, 'There are fifteen students in the class/There are 15 students in the class', 'Le piège le plus classique de l''anglais : « fifteen » (15) et « fifty » (50). L''accent tonique tombe sur la fin pour 15, sur le début pour 50.'),

(4, 'ecoute', 'Quelqu''un commande une boisson au café.', null, 'I would like a cup of tea please/I''d like a cup of tea please', '« I would like » est la forme polie de « I want ». À l''oral elle se contracte en « I''d like ».'),
(4, 'ecoute', 'Quelqu''un explique une habitude alimentaire.', null, 'She does not eat meat/She doesn''t eat meat', 'À la 3ᵉ personne, la négation se construit avec « does not », et le verbe reste à l''infinitif : « eat », pas « eats ».'),

(5, 'ecoute', 'Quelqu''un parle de la nouvelle acquisition d''un ami.', null, 'He has a new bicycle', '« Has » est la forme de « have » à la 3ᵉ personne du singulier. Le « s » est bien audible.'),
(5, 'ecoute', 'Quelqu''un dit que ses voisins sont absents.', null, 'They are not at home today/They aren''t at home today', 'On dit « at home » sans article. « In the home » existe mais désigne un établissement, pas le domicile.'),

-- ---------- A2 ----------
(6, 'ecoute', 'Quelqu''un raconte son week-end.', null, 'We visited my grandmother last weekend', 'La terminaison « -ed » de « visited » se prononce ici « id », parce que le verbe se termine par un « t ».'),
(6, 'ecoute', 'Quelqu''un explique une absence de la veille.', null, 'She did not go to school yesterday/She didn''t go to school yesterday', 'Avec « did not », le verbe revient à l''infinitif : « go », jamais « went ».'),

(7, 'ecoute', 'Un passant indique le chemin.', null, 'Turn left at the traffic lights', '« Traffic lights » est presque toujours au pluriel en anglais britannique.'),
(7, 'ecoute', 'Le passant précise où se trouve la gare.', null, 'The station is opposite the post office', '« Opposite » signifie « en face de ». Ne pas confondre avec « in front of », qui veut dire « devant ».'),

(8, 'ecoute', 'Un client interroge un vendeur sur un prix.', null, 'How much does this jacket cost?', 'Dans une question, « does » porte le temps et le verbe reste à l''infinitif : « cost », pas « costs ».'),
(8, 'ecoute', 'Le client dit combien il a payé.', null, 'I paid thirty euros for these shoes/I paid 30 euros for these shoes', '« Shoes » est toujours au pluriel pour une paire, comme « trousers » ou « glasses ».'),

(9, 'ecoute', 'Quelqu''un décrit sa routine du matin.', null, 'I usually wake up at seven in the morning/I usually wake up at 7 in the morning', 'L''adverbe de fréquence « usually » se place avant le verbe principal, contrairement au français.'),
(9, 'ecoute', 'Quelqu''un décrit l''habitude d''un ami.', null, 'He never drinks coffee after dinner', '« Never » est déjà négatif : on ne dit jamais « he does not never ».'),

(10, 'ecoute', 'Quelqu''un annonce un projet décidé depuis longtemps.', null, 'They are going to move to London next year/They''re going to move to London next year', '« Going to » annonce une intention déjà décidée, là où « will » exprime une décision prise sur le moment.'),
(10, 'ecoute', 'Quelqu''un fait une promesse.', null, 'I will call you as soon as I arrive/I''ll call you as soon as I arrive', 'Après « as soon as », l''anglais utilise le présent pour parler du futur : « I arrive », pas « I will arrive ».'),

-- ---------- B1 ----------
(11, 'ecoute', 'Quelqu''un donne son avis sur un film.', null, 'In my opinion, this film is far too long', '« Far too » renforce « too » : bien plus fort que « very ».'),
(11, 'ecoute', 'Quelqu''un exprime un désaccord poli.', null, 'I do not agree with what he said/I don''t agree with what he said', 'On dit « agree with » quelqu''un, jamais « agree to » une personne. « Agree to » s''emploie pour une proposition.'),

(12, 'ecoute', 'Quelqu''un raconte une démarche professionnelle.', null, 'She applied for a job at a marketing company', '« Apply for » un poste, « apply to » une entreprise. Le vocabulaire du recrutement est très présent au TOEIC.'),
(12, 'ecoute', 'Une note de service annonce un changement.', null, 'The meeting has been moved to Thursday afternoon', 'Voix passive au present perfect : la personne qui a déplacé la réunion n''a pas d''importance ici.'),

(13, 'ecoute', 'Quelqu''un parle de son ancienneté.', null, 'I have worked here for three years/I''ve worked here for 3 years', '« For » indique une durée, « since » indique un point de départ : « since 2023 ».'),
(13, 'ecoute', 'Quelqu''un pose une question sur un voyage passé.', null, 'Have you ever been to Scotland?', '« Been to » = y être allé et en être revenu. « Gone to » signifierait qu''on y est encore.'),

(14, 'ecoute', 'Un médecin donne un conseil.', null, 'You should drink more water and sleep better', '« Should » exprime le conseil, pas l''obligation. Le verbe qui suit reste à l''infinitif sans « to ».'),
(14, 'ecoute', 'Quelqu''un décrit un symptôme qui dure.', null, 'He has had a headache since this morning', 'Double « ha- » : « has had » est le present perfect de « have ». Difficile à entendre, facile à comprendre une fois écrit.'),

(15, 'ecoute', 'Quelqu''un compare deux hôtels.', null, 'This hotel is more expensive than the other one', 'Les adjectifs longs forment leur comparatif avec « more », jamais avec « -er » : « more expensive », pas « expensiver ».'),
(15, 'ecoute', 'Quelqu''un parle d''un repas mémorable.', null, 'It was the best meal I have ever eaten/It was the best meal I''ve ever eaten', '« Best » est le superlatif irrégulier de « good ». « Ever » renforce le present perfect.'),

-- ---------- B2 ----------
(16, 'ecoute', 'Quelqu''un nuance une proposition en réunion.', null, 'Although the idea sounds attractive, it would be difficult to implement', '« Although » introduit une concession. Contrairement au français, il n''est jamais suivi de « but » dans la même phrase.'),
(16, 'ecoute', 'Quelqu''un conteste une affirmation.', null, 'There is little evidence to support that claim', 'Attention : « little evidence » signifie « presque pas de preuves ». « A little evidence » voudrait dire l''inverse.'),

(17, 'ecoute', 'Quelqu''un envisage une conséquence probable.', null, 'If we leave now, we will catch the early train/If we leave now, we''ll catch the early train', 'Premier conditionnel : présent après « if », « will » dans l''autre partie. Jamais « if we will leave ».'),
(17, 'ecoute', 'Quelqu''un imagine une situation irréelle.', null, 'If I had more time, I would learn another language', 'Deuxième conditionnel : prétérit après « if », « would » ensuite. On parle d''une hypothèse, pas d''un projet.'),

(18, 'ecoute', 'Un rapport évoque le coût de la transition écologique.', null, 'Cutting emissions will require significant investment', '« Investment » est indénombrable dans ce sens : pas de « s », pas d''article « an ».'),
(18, 'ecoute', 'Le même rapport évoque la biodiversité.', null, 'Many species are threatened by the loss of their habitat', '« Species » a la même forme au singulier et au pluriel. C''est « are » qui révèle ici le pluriel.'),

(19, 'ecoute', 'Une phrase de rapport désigne l''auteur d''un document.', null, 'The report was written by an independent consultant', 'Passif au prétérit : « was » + participe passé. « By » introduit celui qui a agi.'),
(19, 'ecoute', 'Une consigne administrative fixe une échéance.', null, 'All applications must be submitted before Friday', 'Passif avec un modal : « must be » + participe passé. Tournure très fréquente dans les consignes du TOEIC.'),

(20, 'ecoute', 'Une phrase d''e-mail professionnel accompagne un document.', null, 'Please find the attached invoice for last month', '« Please find attached » est la formule figée des e-mails professionnels anglophones.'),
(20, 'ecoute', 'Un e-mail annonce un retard de livraison.', null, 'The shipment has been delayed due to bad weather', '« Due to » introduit une cause. « Shipment », « delayed », « supplier » : vocabulaire central de la partie 7 du TOEIC.'),

-- ---------- C1 ----------
(21, 'ecoute', 'Une réponse commerciale refuse poliment une demande.', null, 'I am afraid we are unable to accommodate your request/I''m afraid we are unable to accommodate your request', '« I am afraid » n''exprime aucune peur : c''est la formule d''un refus poli. « Unable to » est plus formel que « can''t ».'),
(21, 'ecoute', 'Quelqu''un exprime une déception avec retenue.', null, 'To be honest, I had rather hoped for a different outcome', '« Had rather hoped » adoucit le reproche : la déception est exprimée sans accuser personne.'),

(22, 'ecoute', 'Quelqu''un imagine un passé différent.', null, 'If she had known about the delay, she would have taken another flight', 'Troisième conditionnel : « had » + participe après « if », « would have » + participe ensuite. Le passé ne peut plus changer.'),
(22, 'ecoute', 'La même idée, sans le mot « if ».', null, 'Had we anticipated the demand, we would have ordered more stock', 'Inversion littéraire : « Had we… » remplace « If we had… ». Registre soutenu, fréquent à l''écrit.'),

(23, 'ecoute', 'Un commentaire porte sur un article de presse.', null, 'The article claims that the figures were deliberately misleading', '« Claims that » marque une distance : on rapporte l''affirmation sans la reprendre à son compte.'),
(23, 'ecoute', 'Un commentaire porte sur le traitement médiatique.', null, 'Coverage of the story has dominated the headlines all week', '« Coverage » est indénombrable : jamais « coverages ». « Headlines » désigne les gros titres.'),

(24, 'ecoute', 'Deux collègues décident d''arrêter le travail.', null, 'They decided to call it a day and go home', '« Call it a day » = s''arrêter là pour aujourd''hui. Rien à voir avec appeler ou avec un jour précis.'),
(24, 'ecoute', 'Quelqu''un décrit l''accueil réservé à une décision.', null, 'The new policy went down like a lead balloon', '« Go down like a lead balloon » = tomber complètement à plat. « Lead » se prononce ici « led », comme le métal.'),

(25, 'ecoute', 'Une phrase d''introduction annonce une thèse.', null, 'This essay will argue that the benefits outweigh the risks', '« Outweigh » = peser plus lourd que. Verbe clé de l''argumentation écrite.'),
(25, 'ecoute', 'Une phrase nuance la force d''une démonstration.', null, 'The evidence presented so far is far from conclusive', '« Far from » nie fortement : « loin d''être concluant ». À ne pas confondre avec « so far » = jusqu''ici.'),

-- ---------- C2 ----------
(26, 'ecoute', 'Un commentaire littéraire décrit la démarche d''un auteur.', null, 'The author draws a subtle distinction between memory and imagination', '« Draw a distinction » = établir une distinction. « Draw » a ici le sens de tracer, pas de dessiner.'),
(26, 'ecoute', 'Une phrase met en doute des présupposés.', null, 'Such assumptions rarely withstand close scrutiny', '« Withstand scrutiny » = résister à l''examen. Registre académique, très dense.'),

(27, 'ecoute', 'Une phrase joue sur un mot qui change de sens selon l''accent tonique.', null, 'The desert was deserted when we arrived', 'Même racine, deux accentuations : DEsert (le désert) et deSERted (déserté). L''accent tonique change tout.'),
(27, 'ecoute', 'Une autre phrase repose sur le déplacement de l''accent.', null, 'He objected to the object of the exercise', 'OBject (l''objet, nom) et obJECT (objecter, verbe). Règle générale : accent au début pour le nom, à la fin pour le verbe.'),

(28, 'ecoute', 'Une phrase de négociation propose une contrepartie.', null, 'We are prepared to lower the price if you increase the volume/We''re prepared to lower the price if you increase the volume', '« Be prepared to » = être disposé à. Formule de négociation qui engage sans promettre.'),
(28, 'ecoute', 'Une phrase reporte poliment un point de désaccord.', null, 'Let us set that issue aside and return to it later/Let''s set that issue aside and return to it later', '« Set aside » = mettre de côté. Manière diplomatique de contourner un blocage sans le nier.'),

(29, 'ecoute', 'Un commentaire ironique sur un événement raté.', null, 'Well, that went about as well as could be expected', 'Litote ironique : la phrase dit le contraire de ce qu''elle signifie. Le ton, pas les mots, porte le sens.'),
(29, 'ecoute', 'Une critique formulée par litote.', null, 'He is not exactly known for his patience/He''s not exactly known for his patience', '« Not exactly » atténue en apparence et accuse en réalité. Procédé très courant en anglais britannique.'),

(30, 'ecoute', 'Un bilan évoque une crise qu''on aurait pu éviter.', null, 'Had the committee acted sooner, the crisis might have been avoided', 'Trois difficultés en une phrase : inversion sans « if », modal « might have », et passif « been avoided ».'),
(30, 'ecoute', 'Une remarque finale exprime un constat désabusé.', null, 'What strikes me most is how little has actually changed', 'Structure clivée : « What strikes me most is… » met en avant l''idée principale, comme « Ce qui me frappe le plus… ».');
