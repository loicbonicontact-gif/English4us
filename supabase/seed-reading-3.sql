-- ============================================
-- SEED — compréhension écrite, troisième série
-- 12 documents (2 par niveau A1 -> C2), 36 questions.
--
-- À exécuter APRÈS seed-reading-2.sql. Rejouable : ce script ne supprime
-- QUE les passages dont la position dépasse 24, donc les deux premières
-- séries restent intactes.
--
-- CE QUE CETTE SÉRIE AJOUTE
-- Les deux premières couvraient le message, l'annonce, l'e-mail, l'horaire,
-- le formulaire et le document multiple. Celle-ci ajoute les écrits que le
-- TOEIC place presque toujours en fin d'épreuve, là où le temps manque :
--   - la conversation instantanée professionnelle (plusieurs intervenants,
--     phrases courtes, l'information est éclatée entre les répliques) ;
--   - le document chiffré — facture, bon de commande, tableau de résultats,
--     où la réponse se calcule au lieu de se lire ;
--   - la notice et la consigne de sécurité, dont l'enjeu est l'ordre
--     des opérations ;
--   - la réclamation et sa réponse, où le ton compte autant que les faits.
--
-- Un principe tenu partout : au moins une question par document ne peut pas
-- se résoudre en repérant un mot. Il faut relier deux endroits du texte, ou
-- comprendre une intention. C'est exactement ce que fait le TOEIC, et c'est
-- ce qui distingue un lecteur d'un chercheur de mots-clés.
-- ============================================

delete from reading_questions
where passage_id in (select id from reading_passages where position > 24);
delete from reading_passages where position > 24;

-- Les questions ci-dessous référencent les identifiants 25 à 36 en dur.
-- Sans cette remise à 25, un second passage du script attribuerait 37 et
-- suivants aux nouveaux textes, et toutes les questions pointeraient vers
-- des passages inexistants. La séquence est donc replacée juste après la
-- deuxième série.
alter sequence reading_passages_id_seq restart with 25;

-- ============================================
-- A1
-- ============================================
insert into reading_passages (level, format, title, context, documents, position, xp_reward) values
('A1', 'text_completion', 'Un mot laissé sur la porte', 'Un commerçant a affiché un mot pour ses clients. Trois mots manquent.',
 '[{"kind":"message","title":"Note on the door","text":"The shop is __(1)__ today.\nWe open again on Monday at 9 am.\n\nIf you need bread, the bakery in Green __(2)__ is open.\nSorry for the __(3)__.\n\nAnna"}]', 25, 10),

('A1', 'passage', 'Une carte de restaurant', 'Le menu du midi est affiché devant un petit restaurant.',
 '[{"kind":"advert","title":"Lunch menu — Tuesday to Saturday","text":"Soup of the day — 4 pounds\nChicken and rice — 9 pounds\nVegetable pasta — 8 pounds\nApple cake — 3 pounds\n\nTwo courses for 11 pounds.\nDrinks are not included.\nWe are closed on Sunday and Monday."}]', 26, 15);

insert into reading_questions (passage_id, position, question, options, correct_answer, explanation) values
(25, 1, 'Which word fits gap (1)?', '["closed","open","full","new"]', 'closed', 'La phrase suivante annonce une réouverture lundi : le magasin est donc fermé. Le sens vient de la phrase d''après, pas du mot lui-même.'),
(25, 2, 'Which word fits gap (2)?', '["Street","Shop","Bread","Morning"]', 'Street', '« Green Street » est un nom de rue. Les trois autres mots ne peuvent pas suivre un nom propre de ce genre.'),
(25, 3, 'Which word fits gap (3)?', '["trouble","price","time","day"]', 'trouble', '« Sorry for the trouble » est une formule d''excuse figée. Les autres mots donneraient des phrases sans sens.'),

(26, 1, 'How much do soup and apple cake cost together?', '["7 pounds","11 pounds","12 pounds","4 pounds"]', '7 pounds', '4 + 3 = 7. L''offre à 11 pounds ne s''applique que si elle est plus avantageuse : ici elle ne l''est pas.'),
(26, 2, 'On which day can you eat here?', '["Thursday","Sunday","Monday","Never"]', 'Thursday', 'Le titre annonce mardi à samedi, et la dernière ligne exclut dimanche et lundi. Deux endroits du texte disent la même chose.'),
(26, 3, 'What is NOT included in the price?', '["Drinks","Bread","Soup","Cake"]', 'Drinks', '« Drinks are not included » : la phrase est isolée en fin de carte, comme sur un vrai menu.');

-- ============================================
-- A2
-- ============================================
insert into reading_passages (level, format, title, context, documents, position, xp_reward) values
('A2', 'text_completion', 'Un message au propriétaire', 'Une locataire écrit à son propriétaire. Trois mots manquent.',
 '[{"kind":"email","title":"Heating problem","text":"Dear Mr Hughes,\n\nThe heating in the flat stopped __(1)__ on Friday evening.\nI called the number you gave me, but nobody __(2)__.\n\nCould you send someone this week? It is very cold in the __(3)__ room.\n\nThank you,\nSara Lund"}]', 27, 15),

('A2', 'passage', 'Une conversation entre collègues', 'Trois collègues échangent des messages instantanés au sujet d''une livraison.',
 '[{"kind":"message","title":"Team chat — Wednesday morning","text":"TOM (8:42): The delivery van is late again. Nothing yet.\nPRIYA (8:45): The driver just called me. He is stuck in traffic on the ring road.\nTOM (8:46): How long?\nPRIYA (8:47): Forty minutes, he thinks.\nMARK (8:51): I can start the meeting without the samples. We only need them after the break.\nPRIYA (8:52): Good. I will bring them straight to room 2 when they arrive."}]', 28, 20);

insert into reading_questions (passage_id, position, question, options, correct_answer, explanation) values
(27, 1, 'Which word fits gap (1)?', '["working","work","to work","worked"]', 'working', '« Stop + -ing » = cesser de faire. « Stop to work » signifierait s''arrêter POUR travailler : le sens change du tout au tout.'),
(27, 2, 'Which word fits gap (2)?', '["answered","answer","answering","answers"]', 'answered', 'Le récit est au passé (« I called »). La proposition suivante garde le même temps.'),
(27, 3, 'Which word fits gap (3)?', '["living","live","alive","lived"]', 'living', '« The living room » = le salon. Expression figée : aucun des autres mots ne s''emploie ici.'),

(28, 1, 'Why is the van late?', '["Traffic on the ring road","The driver is ill","It broke down","Nobody knows"]', 'Traffic on the ring road', 'Tom pose la question, Priya donne la réponse deux répliques plus loin. L''information est éclatée entre deux intervenants.'),
(28, 2, 'What does Mark decide to do?', '["Begin the meeting without the samples","Cancel the meeting","Wait for the van","Call the driver"]', 'Begin the meeting without the samples', 'Mark résout le problème sans qu''on le lui demande. Il faut comprendre une intention, pas repérer un mot.'),
(28, 3, 'At what time is the van expected?', '["Around 9:27","At 8:47","Before 8:51","At 10:00"]', 'Around 9:27', '8 h 47 plus quarante minutes. Aucune heure d''arrivée n''est écrite : elle se calcule.');

-- ============================================
-- B1
-- ============================================
insert into reading_passages (level, format, title, context, documents, position, xp_reward) values
('B1', 'text_completion', 'Une notice de sécurité', 'Une consigne affichée dans un atelier. Trois mots manquent.',
 '[{"kind":"notice","title":"Before using the cutting machine","text":"Always __(1)__ the guard is in place before you switch the machine on.\nNever leave the machine running __(2)__ attended.\n\nIn the event of a fault, press the red button and __(3)__ the supervisor immediately. Do not attempt a repair yourself."}]', 29, 20),

('B1', 'passage', 'Une facture contestée', 'Un client écrit au service comptable, qui lui répond le lendemain.',
 '[{"kind":"email","title":"Invoice 4471 — query","text":"Dear Sir or Madam,\n\nI have received invoice 4471 for 620 pounds. According to my order, the price agreed was 540 pounds plus 30 pounds for delivery.\n\nI have paid 570 pounds today. Could you confirm that the balance is an error?\n\nRegards,\nJ. Okoro"},
   {"kind":"email","title":"Re: Invoice 4471","text":"Dear Mr Okoro,\n\nThank you for your message. The difference of 50 pounds is the express delivery charge, which was added when you asked for Saturday delivery on 3 May.\n\nThe original order did indeed show 30 pounds for standard delivery. We should have sent you a revised confirmation, and I am sorry that we did not.\n\nThe outstanding amount is therefore 50 pounds. I have attached a corrected invoice.\n\nKind regards,\nAccounts"}]', 30, 25);

insert into reading_questions (passage_id, position, question, options, correct_answer, explanation) values
(29, 1, 'Which word fits gap (1)?', '["check","checking","checked","checks"]', 'check', 'Une consigne s''écrit à l''impératif, donc à la base verbale. « Always check » est le format standard des notices.'),
(29, 2, 'Which word fits gap (2)?', '["un","not","no","without"]', 'un', '« Unattended » = sans surveillance. Le préfixe « un- » suffit : « not attended » serait lourd et inhabituel ici.'),
(29, 3, 'Which word fits gap (3)?', '["inform","informing","informed","information"]', 'inform', 'La phrase enchaîne deux impératifs coordonnés par « and » : « press… and inform… ».'),

(30, 1, 'Why is the invoice higher than expected?', '["A Saturday delivery was requested","The price of the goods rose","A discount was removed","An extra item was sent"]', 'A Saturday delivery was requested', 'La réponse relie la somme du premier message à une demande faite le 3 mai, absente du premier document.'),
(30, 2, 'How much does the customer still owe?', '["50 pounds","80 pounds","620 pounds","Nothing"]', '50 pounds', '620 facturés, 570 déjà payés. Le chiffre figure aussi en toutes lettres dans la réponse : les deux voies mènent au même résultat.'),
(30, 3, 'What does the company admit?', '["It failed to send a revised confirmation","It charged the wrong price","It delivered late","It lost the order"]', 'It failed to send a revised confirmation', 'L''entreprise maintient le montant tout en reconnaissant un tort de procédure. Distinguer les deux est l''enjeu de la question.');

-- ============================================
-- B2
-- ============================================
insert into reading_passages (level, format, title, context, documents, position, xp_reward) values
('B2', 'text_completion', 'Un compte rendu de réunion', 'Extrait du relevé de décisions d''un comité. Trois mots manquent.',
 '[{"kind":"memo","title":"Minutes — Operations Committee, 12 June","text":"The committee __(1)__ the proposal to move the warehouse to the eastern site.\n\nMs Reyes raised concerns about the additional travel time for staff. It was agreed that a shuttle service would be __(2)__ before any decision is taken.\n\nThe item will be brought __(3)__ at the September meeting, together with the costings requested in April."}]', 31, 25),

('B2', 'passage', 'Des résultats trimestriels commentés', 'Un tableau de chiffres et la note du directeur financier qui l''accompagne.',
 '[{"kind":"report","title":"Quarterly sales by region (thousands of pounds)","text":"Region        Q1     Q2     Q3\nNorth        410    455    470\nSouth        620    598    540\nEast         180    240    310\nWest         300    295    301\n\nTotal       1510   1588   1621"},
   {"kind":"memo","title":"Note from the Finance Director","text":"The headline figure is encouraging, but it hides two opposite movements.\n\nGrowth in the East is genuine and is the result of the two contracts signed in February. Growth in the North is slower but steady.\n\nThe South, however, has fallen in each of the last two quarters. This is the region we should be discussing, not the total."}]', 32, 30);

insert into reading_questions (passage_id, position, question, options, correct_answer, explanation) values
(31, 1, 'Which word fits gap (1)?', '["considered","consider","considering","consideration"]', 'considered', 'Un compte rendu se rédige au passé : « the committee considered ». Le présent y serait inhabituel.'),
(31, 2, 'Which word fits gap (2)?', '["costed","cost","costly","costing"]', 'costed', 'Passif : « would be costed » = ferait l''objet d''un chiffrage. « Cost » a ici un participe régulier, contrairement au verbe ordinaire.'),
(31, 3, 'Which word fits gap (3)?', '["back","up","off","in"]', 'back', '« Bring an item back » = remettre un point à l''ordre du jour. « Bring up » serait le soulever pour la première fois.'),

(32, 1, 'Which region grew most between Q1 and Q3?', '["East","North","South","West"]', 'East', 'East passe de 180 à 310, soit +130. North gagne 60. La réponse demande une soustraction, elle n''est écrite nulle part.'),
(32, 2, 'What does the Finance Director consider the real issue?', '["The decline in the South","The total figure","The growth in the East","The stability of the West"]', 'The decline in the South', 'La dernière phrase le dit explicitement : le total encourageant masque le point qui devrait occuper la discussion.'),
(32, 3, 'What does the note say about the growth in the East?', '["It has an identified cause","It is temporary","It is an accounting effect","It is unexplained"]', 'It has an identified cause', '« The result of the two contracts signed in February » : la hausse est rattachée à un fait précis, ce qui la rend crédible.');

-- ============================================
-- C1
-- ============================================
insert into reading_passages (level, format, title, context, documents, position, xp_reward) values
('C1', 'text_completion', 'Une lettre de refus', 'Réponse d''un comité de sélection à une candidature. Trois mots manquent.',
 '[{"kind":"email","title":"Your application — reference 2214","text":"Thank you for your application, which the panel read with interest.\n\nOn this occasion we have decided not to take it __(1)__. The field was unusually strong, and the successful candidate had direct experience of the regulatory work that forms the bulk of the role.\n\nI should stress that this __(2)__ no reflection on the quality of your submission. We would encourage you to apply again should a __(3)__ position arise."}]', 33, 30),

('C1', 'passage', 'Une politique interne et son application', 'Une note de la direction, puis la question d''un responsable d''équipe.',
 '[{"kind":"memo","title":"Remote working policy — effective 1 September","text":"Staff may work remotely for up to two days per week, subject to the agreement of their line manager.\n\nAttendance is required on any day when a team meeting, a client visit or a training session is scheduled. Managers may not refuse a remote-working request without a reason connected to the operational needs of the team.\n\nRequests should be made at least one week in advance, other than in exceptional circumstances."},
   {"kind":"email","title":"Query from a team leader","text":"Two of my six analysts have asked for the same two days. If both are away, I have no cover for incoming client calls on those days.\n\nI would rather not refuse either request outright. May I ask them to take different days instead?"}]', 34, 35);

insert into reading_questions (passage_id, position, question, options, correct_answer, explanation) values
(33, 1, 'Which word fits gap (1)?', '["further","farther","forward to","onward"]', 'further', '« Take it further » = donner suite. « Farther » ne s''emploie que pour une distance physique.'),
(33, 2, 'Which word fits gap (2)?', '["is","has","makes","gives"]', 'is', '« This is no reflection on… » est la formule figée. Les autres verbes produiraient une phrase agrammaticale.'),
(33, 3, 'Which word fits gap (3)?', '["suitable","suited","suiting","suit"]', 'suitable', 'Il faut un adjectif devant « position ». « Suited » demanderait un complément : « suited to your profile ».'),

(34, 1, 'Under the policy, when may a manager refuse a request?', '["When the team''s operational needs require it","At any time","Never","Only in September"]', 'When the team''s operational needs require it', 'La note interdit un refus « without a reason connected to operational needs » : la double négation autorise donc précisément ce cas.'),
(34, 2, 'Does the policy allow the team leader to ask for different days?', '["Yes, since cover is an operational need","No, staff choose their own days","Only with written consent","The policy does not cover it"]', 'Yes, since cover is an operational need', 'Aucun texte ne le dit mot pour mot. Il faut appliquer la règle générale au cas particulier posé dans le second document.'),
(34, 3, 'What does the team leader''s wording suggest about their position?', '["They want to avoid an outright refusal","They oppose remote working","They have already decided","They are seeking a rule change"]', 'They want to avoid an outright refusal', '« I would rather not refuse either request outright » : le conditionnel signale une préférence, non une décision. Le ton porte l''information.');

-- ============================================
-- C2
-- ============================================
insert into reading_passages (level, format, title, context, documents, position, xp_reward) values
('C2', 'text_completion', 'Une mise en garde méthodologique', 'Éditorial d''une revue statistique. Trois mots manquent.',
 '[{"kind":"article","title":"On the reading of small differences","text":"A gap of two points between two groups may be perfectly real and still __(1)__ nothing whatever about the individuals within them.\n\nThe temptation, once a difference reaches significance, is to treat it as if it __(2)__ the whole story. It does not. Significance speaks to the reliability of the difference, not to its size, and still less to its importance.\n\nWe would ask contributors to report effect sizes __(3)__, and to resist the headline that the p-value seems to offer."}]', 35, 35),

('C2', 'passage', 'Une controverse en trois textes', 'Un communiqué, l''analyse d''un chercheur et la mise au point du service de presse.',
 '[{"kind":"article","title":"Press release — Institute of Urban Studies","text":"Households in the pilot districts reduced their water consumption by 18 per cent following the introduction of the new tariff.\nThe scheme demonstrates that pricing alone can deliver substantial savings."},
   {"kind":"email","title":"Comment — Dr Halloran, independent researcher","text":"The 18 per cent figure is not in dispute. What is missing is that the pilot districts were selected because they had the highest consumption in the region.\nGroups chosen for an extreme value tend to move toward the average at the next measurement, whatever is done to them. Some part of the saving — nobody yet knows how much — would have occurred with no tariff at all.\nThe scheme may well work. This study cannot show that it does."},
   {"kind":"memo","title":"Institute press office — clarification","text":"Dr Halloran is correct that the districts were selected on the basis of high consumption, and our release should have said so.\nWe maintain that a saving of this magnitude is unlikely to be explained by that effect alone. A controlled comparison is now under way and will report next year."}]', 36, 40);

insert into reading_questions (passage_id, position, question, options, correct_answer, explanation) values
(35, 1, 'Which word fits gap (1)?', '["tell","say","speak","talk"]', 'tell', '« Tell us nothing about » est la collocation attendue. « Say nothing about » se dit d''un texte, pas d''un écart chiffré.'),
(35, 2, 'Which word fits gap (2)?', '["were","was","is","has been"]', 'were', 'Subjonctif après « as if » dans une hypothèse contraire aux faits : « as if it were ». Registre soigné.'),
(35, 3, 'Which word fits gap (3)?', '["alongside","along","aside","besides"]', 'alongside', '« Alongside » = en parallèle de. « Besides » signifierait « en outre », ce qui rendrait la consigne incohérente.'),

(36, 1, 'What is Dr Halloran''s objection?', '["The districts were selected for an extreme value","The 18 per cent figure is wrong","The tariff was never applied","The sample was too small"]', 'The districts were selected for an extreme value', 'Il accepte le chiffre et conteste ce qu''on en déduit. Le désaccord porte sur la méthode de sélection, pas sur les données.'),
(36, 2, 'What does the press office concede?', '["That the selection criterion was omitted","That the scheme failed","That the figure was overstated","That the study was withdrawn"]', 'That the selection criterion was omitted', '« Our release should have said so » : le service concède l''omission tout en maintenant sa conclusion.'),
(36, 3, 'Taking the three texts together, what can be concluded?', '["The saving is real but its cause is not established","The tariff had no effect","The figure was invented","The researcher has withdrawn his comment"]', 'The saving is real but its cause is not established', 'Aucun des trois textes ne le dit seul. Le communiqué affirme la cause, l''objection la met en doute, la mise au point concède le fait sans trancher.');
