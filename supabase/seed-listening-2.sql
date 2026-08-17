-- ============================================
-- SEED — compréhension orale, deuxième série
-- 24 passages (4 par niveau A1 -> C2), 60 questions.
--
-- À exécuter APRÈS seed-listening.sql. Rejouable : ce script ne supprime
-- QUE les passages dont la position dépasse 18, donc la première série
-- reste intacte.
--
-- POURQUOI L'ÉCOUTE ET PAS AUTRE CHOSE
-- Au TOEIC, l'écoute pèse 100 questions sur 200 — autant que la lecture.
-- Avant cette série, l'application comptait 42 questions d'écoute contre
-- 108 de lecture : le pilier le plus lourd de l'épreuve était le plus
-- léger de l'app. Cette série le fait passer à 102.
--
-- RÉPARTITION PAR NIVEAU
--   1 question-réponse (partie 2 du TOEIC) — 1 question
--   2 conversations    (partie 3)          — 3 questions chacune
--   1 annonce / exposé (partie 4)          — 3 questions
--
-- Trois questions par conversation : c'est le format réel du TOEIC, et
-- c'est ce qui oblige à retenir un échange entier au lieu d'attraper un
-- mot au vol.
--
-- CE QUE CETTE SÉRIE TRAVAILLE
-- La première série entraînait la compréhension du sens explicite. Celle-ci
-- ajoute systématiquement, à chaque niveau, une question qui ne peut pas se
-- résoudre en réentendant une phrase :
--   - l'inférence — la réponse n'est dite par personne (« What will the man
--     probably do next? ») ;
--   - le locuteur — qui parle, et à quel titre ;
--   - l'intention — un « that could work » enthousiaste et un « that could
--     work » résigné n'annoncent pas la même suite.
--
-- Les scripts anglais évitent les apostrophes : la synthèse vocale les rend
-- mal, et le contenu doit rester lisible tant qu'aucun fichier audio n'est
-- enregistré. `audio_url` reste null — le jour où des voix neuronales
-- seront générées, il suffira de remplir ce champ.
-- ============================================

delete from listening_questions
where passage_id in (select id from listening_passages where position > 18);
delete from listening_passages where position > 18;

-- Les questions ci-dessous référencent les identifiants 19 à 42 en dur.
-- Sans cette remise à 19, une seconde exécution attribuerait 43 et suivants
-- aux nouveaux passages, et toutes les questions pointeraient vers des
-- passages inexistants.
alter sequence listening_passages_id_seq restart with 19;

-- ============================================
-- A1
-- ============================================
insert into listening_passages (level, format, title, context, script, position, xp_reward) values
('A1', 'question_response', 'Une question sur l''heure', 'Quelqu''un t''adresse la parole. Écoute la question, puis les trois réponses possibles.',
 '[{"speaker":"A","text":"What time does the shop open?"},
   {"speaker":"B","text":"Answer A. On Green Street."},
   {"speaker":"B","text":"Answer B. At nine in the morning."},
   {"speaker":"B","text":"Answer C. Yes, it is open."}]', 19, 10),

('A1', 'conversation', 'À la réception de l''hôtel', 'Une voyageuse arrive à son hôtel.',
 '[{"speaker":"A","text":"Good evening. Do you have a reservation?"},
   {"speaker":"B","text":"Yes, under the name Miller. Two nights."},
   {"speaker":"A","text":"Here it is. Room twelve, on the first floor. Breakfast is from seven to ten."},
   {"speaker":"B","text":"Thank you. Is there a lift?"},
   {"speaker":"A","text":"I am sorry, there is not. But your bag is small, and it is only one floor."}]', 20, 15),

('A1', 'conversation', 'Prendre rendez-vous', 'Un patient téléphone à un cabinet médical.',
 '[{"speaker":"A","text":"Doctor Shaw surgery, good morning."},
   {"speaker":"B","text":"Good morning. I would like an appointment, please."},
   {"speaker":"A","text":"We have Tuesday at two, or Wednesday at ten."},
   {"speaker":"B","text":"Tuesday is difficult. I work until six."},
   {"speaker":"A","text":"Wednesday at ten, then. What is your name, please?"}]', 21, 15),

('A1', 'talk', 'Annonce dans un magasin', 'Une annonce est diffusée dans les rayons d''un supermarché.',
 '[{"speaker":"A","text":"Attention please. The store will close in fifteen minutes. Please take your shopping to the checkout. The fruit and vegetable section is now closed. Thank you for shopping with us today."}]', 22, 15);

insert into listening_questions (passage_id, position, question, options, correct_answer, explanation) values
(19, 1, 'Which response is correct?', '["Answer A","Answer B","Answer C"]', 'Answer B', '« What time » attend une heure. « On Green Street » répondrait à « where », et « yes » à une question fermée.'),

(20, 1, 'How many nights will she stay?', '["Two","One","Three","Twelve"]', 'Two', '« Two nights » est dit une seule fois, juste après le nom. Le nombre douze qui suit est le numéro de chambre : deux nombres proches, deux sens différents.'),
(20, 2, 'What is the problem with the hotel?', '["There is no lift","Breakfast is late","The room is small","It is full"]', 'There is no lift', '« I am sorry, there is not » répond à la question sur l''ascenseur. Il faut relier la réponse à la question posée juste avant.'),
(20, 3, 'What does the receptionist suggest?', '["The stairs are not a problem","She should change rooms","She should leave her bag","She should come back later"]', 'The stairs are not a problem', 'Personne ne dit « prenez l''escalier ». Le sens se déduit de « your bag is small, and it is only one floor » : c''est une question d''inférence.'),

(21, 1, 'When is the appointment?', '["Wednesday at ten","Tuesday at two","Wednesday at two","Tuesday at ten"]', 'Wednesday at ten', 'Deux créneaux sont proposés, un seul est retenu. Il faut attendre la fin de l''échange : la première date entendue n''est pas la bonne.'),
(21, 2, 'Why does he refuse the first time?', '["He works until six","He is ill","It is too early","He is away"]', 'He works until six', '« Tuesday is difficult » ne dit pas pourquoi ; la raison arrive dans la phrase suivante.'),
(21, 3, 'Who is the first speaker?', '["Someone at the doctor''s office","The doctor","A patient","A pharmacist"]', 'Someone at the doctor''s office', 'La première phrase annonce le nom du cabinet. Ce n''est pas le médecin lui-même : rien ne le dit, et la question « what is your name » indique un accueil.'),

(22, 1, 'How long before the store closes?', '["Fifteen minutes","Fifty minutes","Five minutes","Half an hour"]', 'Fifteen minutes', 'Piège classique : « fifteen » et « fifty » ne se distinguent que par l''accent, sur la deuxième syllabe pour fifteen.'),
(22, 2, 'Which section is already closed?', '["Fruit and vegetables","The checkout","The bakery","The whole store"]', 'Fruit and vegetables', 'Une seule section est nommée. Le reste du magasin ferme dans un quart d''heure.'),
(22, 3, 'What are customers asked to do?', '["Go to the checkout","Leave immediately","Come back tomorrow","Wait in the aisles"]', 'Go to the checkout', '« Take your shopping to the checkout » est une consigne polie, pas un ordre de sortir.');

-- ============================================
-- A2
-- ============================================
insert into listening_passages (level, format, title, context, script, position, xp_reward) values
('A2', 'question_response', 'Refuser une proposition', 'Quelqu''un te propose quelque chose. Écoute la proposition, puis les trois réponses.',
 '[{"speaker":"A","text":"Would you like to join us for lunch?"},
   {"speaker":"B","text":"Answer A. I would love to, but I have a meeting."},
   {"speaker":"B","text":"Answer B. It was very good, thank you."},
   {"speaker":"B","text":"Answer C. At the restaurant near the park."}]', 23, 15),

('A2', 'conversation', 'Réserver une table', 'Un client téléphone à un restaurant.',
 '[{"speaker":"A","text":"Good afternoon, Bella Vista."},
   {"speaker":"B","text":"Hello. I would like a table for four on Friday evening."},
   {"speaker":"A","text":"Friday is very busy. I can offer you eight thirty, or seven o clock on Saturday."},
   {"speaker":"B","text":"Eight thirty is quite late for the children. We will take Saturday."},
   {"speaker":"A","text":"Saturday at seven, table for four. May I have a telephone number?"}]', 24, 20),

('A2', 'conversation', 'À la pharmacie', 'Une cliente demande conseil au pharmacien.',
 '[{"speaker":"A","text":"How can I help you?"},
   {"speaker":"B","text":"I have a bad cough. It started three days ago."},
   {"speaker":"A","text":"Do you have a temperature?"},
   {"speaker":"B","text":"No, I do not think so. I just cannot sleep at night."},
   {"speaker":"A","text":"This syrup will help you sleep. But if the cough is still there on Monday, please see a doctor."}]', 25, 20),

('A2', 'talk', 'Un bulletin météo', 'Le bulletin météo du soir à la radio.',
 '[{"speaker":"A","text":"And now the weather. Tonight will be cold, with temperatures near zero in the north. Tomorrow morning starts with heavy rain, but the afternoon will be dry and much warmer. Drivers should take care on the roads before eight o clock."}]', 26, 20);

insert into listening_questions (passage_id, position, question, options, correct_answer, explanation) values
(23, 1, 'Which response is correct?', '["Answer A","Answer B","Answer C"]', 'Answer A', 'Une invitation appelle une acceptation ou un refus motivé. La réponse B parle d''un repas passé, la C donne un lieu : ni l''une ni l''autre ne répond à « would you like ».'),

(24, 1, 'When will they eat?', '["Saturday at seven","Friday at eight thirty","Friday at seven","Saturday at eight thirty"]', 'Saturday at seven', 'Quatre combinaisons de jour et d''heure circulent dans l''échange. Seule la dernière réplique confirme la bonne.'),
(24, 2, 'Why does he refuse Friday?', '["The time is too late for the children","The restaurant is closed","It costs too much","He is away"]', 'The time is too late for the children', 'La raison est donnée une seule fois, en passant. Le mot « children » n''apparaît nulle part ailleurs.'),
(24, 3, 'What does the restaurant ask for at the end?', '["A telephone number","A deposit","An email","A name"]', 'A telephone number', 'La demande arrive dans la toute dernière phrase, quand l''attention baisse. C''est là que le TOEIC place souvent l''information.'),

(25, 1, 'How long has she had the cough?', '["Three days","Three weeks","Since Monday","One night"]', 'Three days', '« It started three days ago » : la durée est donnée par un point de départ, pas par une durée directe.'),
(25, 2, 'What is her main problem?', '["She cannot sleep","She has a fever","She has a headache","She cannot eat"]', 'She cannot sleep', 'Elle nie la fièvre juste avant. Le vrai problème est ce qui suit « I just cannot sleep at night ».'),
(25, 3, 'What should she do if the cough continues?', '["See a doctor","Take more syrup","Come back to the pharmacy","Rest at home"]', 'See a doctor', 'La consigne est conditionnelle : « if the cough is still there on Monday ». Elle ne vaut pas tout de suite.'),

(26, 1, 'What will the weather be like tomorrow afternoon?', '["Dry and warmer","Cold and wet","Rainy all day","Windy"]', 'Dry and warmer', 'Le bulletin oppose le matin et l''après-midi. Entendre « heavy rain » sans attendre la suite mène à la mauvaise réponse.'),
(26, 2, 'Where will it be coldest tonight?', '["In the north","In the south","Everywhere","On the roads"]', 'In the north', 'Une seule région est nommée. Le reste du pays n''est pas mentionné.'),
(26, 3, 'Why should drivers take care before eight?', '["Because of the rain","Because of the ice","Because of the traffic","Because it is dark"]', 'Because of the rain', 'La consigne suit immédiatement l''annonce de la pluie du matin. Le mot « rain » n''est pas répété : il faut relier deux phrases.');

-- ============================================
-- B1
-- ============================================
insert into listening_passages (level, format, title, context, script, position, xp_reward) values
('B1', 'question_response', 'Demander un délai', 'Un collègue te parle. Écoute la question, puis les trois réponses.',
 '[{"speaker":"A","text":"Could you send me the figures before the meeting?"},
   {"speaker":"B","text":"Answer A. I met them last week."},
   {"speaker":"B","text":"Answer B. Would tomorrow morning be early enough?"},
   {"speaker":"B","text":"Answer C. It is in the meeting room."}]', 27, 20),

('B1', 'conversation', 'Un problème informatique', 'Une employée appelle le support technique.',
 '[{"speaker":"A","text":"IT support, how can I help?"},
   {"speaker":"B","text":"I cannot open the shared folder. It says I do not have permission."},
   {"speaker":"A","text":"Did it work last week?"},
   {"speaker":"B","text":"Yes, until Thursday. Then I changed my password."},
   {"speaker":"A","text":"That explains it. The old permission is linked to the old password. I will reset it now, but you will have to log out and back in."},
   {"speaker":"B","text":"I am presenting in ten minutes. Can it wait until after?"},
   {"speaker":"A","text":"Of course. Call me back when you are free."}]', 28, 25),

('B1', 'conversation', 'Organiser un déplacement', 'Deux collègues préparent un déplacement professionnel.',
 '[{"speaker":"A","text":"The client wants us in Lyon on Thursday morning. Train or plane?"},
   {"speaker":"B","text":"The plane is faster, but we would have to leave the night before anyway."},
   {"speaker":"A","text":"Then the train makes more sense. We can work on the way."},
   {"speaker":"B","text":"Agreed. I will book two seats. Do you want the hotel near the station or near the client?"},
   {"speaker":"A","text":"Near the client. I would rather walk in the morning than take a taxi."}]', 29, 25),

('B1', 'talk', 'Consigne de sécurité', 'Un responsable s''adresse aux nouveaux arrivants sur un site industriel.',
 '[{"speaker":"A","text":"Before you go onto the floor, three things. Helmets are worn at all times, without exception. If an alarm sounds, leave by the nearest door and go to the car park, not to your office. And do not take photographs anywhere on the site. Your badge gives you access to the building, but not to the laboratory."}]', 30, 25);

insert into listening_questions (passage_id, position, question, options, correct_answer, explanation) values
(27, 1, 'Which response is correct?', '["Answer A","Answer B","Answer C"]', 'Answer B', 'La bonne réponse ne dit ni oui ni non : elle propose un délai, ce qui est la façon naturelle de répondre. La A joue sur « figures » et « met », la C sur « meeting ».'),

(28, 1, 'What caused the problem?', '["She changed her password","The folder was deleted","Her computer is old","The server is down"]', 'She changed her password', 'La cause n''est pas annoncée : elle se déduit de « until Thursday, then I changed my password » et de « that explains it ».'),
(28, 2, 'What will she have to do after the reset?', '["Log out and back in","Restart the computer","Call the manager","Change her password again"]', 'Log out and back in', 'La consigne est donnée en fin de réplique, après la solution. C''est souvent là que l''attention retombe.'),
(28, 3, 'What will she probably do next?', '["Give her presentation","Log out immediately","Call back at once","Go to the IT office"]', 'Give her presentation', 'Personne ne le dit. Elle annonce une présentation dans dix minutes et demande à repousser : la suite se déduit.'),

(29, 1, 'Why do they choose the train?', '["They would have to travel the night before anyway","It is cheaper","The plane was full","The client asked for it"]', 'They would have to travel the night before anyway', 'L''avantage de l''avion, la vitesse, est annulé par le départ la veille. L''argument est donné avant la décision.'),
(29, 2, 'What can they do on the train?', '["Work","Sleep","Meet the client","Eat"]', 'Work', '« We can work on the way » est dit une fois, comme argument. Rien n''est dit du repas ni du sommeil.'),
(29, 3, 'Why does she prefer a hotel near the client?', '["To avoid taking a taxi","It is cheaper","It is quieter","It is near the station"]', 'To avoid taking a taxi', '« I would rather walk than take a taxi » : la préférence est exprimée par une comparaison, pas par une raison directe.'),

(30, 1, 'Where should people go if the alarm sounds?', '["The car park","Their office","The nearest door only","The laboratory"]', 'The car park', 'Deux lieux sont cités dans la même phrase, dont un pour être écarté : « not to your office ».'),
(30, 2, 'What does the badge NOT give access to?', '["The laboratory","The building","The car park","The floor"]', 'The laboratory', 'La dernière phrase oppose deux accès. La négation porte sur le second, prononcé sans insistance.'),
(30, 3, 'How many rules does the speaker announce?', '["Three","Two","Four","Five"]', 'Three', 'Il annonce « three things » au début, puis en énonce trois : casque, alarme, photographies. L''histoire du badge précise la troisième, elle n''en ajoute pas une quatrième.');

-- ============================================
-- B2
-- ============================================
insert into listening_passages (level, format, title, context, script, position, xp_reward) values
('B2', 'question_response', 'Un accord sous réserve', 'Un interlocuteur te parle. Écoute la remarque, puis les trois réponses.',
 '[{"speaker":"A","text":"So we are agreed on the deadline?"},
   {"speaker":"B","text":"Answer A. In principle, yes, provided the budget is confirmed."},
   {"speaker":"B","text":"Answer B. It was agreed last year."},
   {"speaker":"B","text":"Answer C. The line is very good, thank you."}]', 31, 25),

('B2', 'conversation', 'Négocier un devis', 'Une acheteuse discute avec un fournisseur.',
 '[{"speaker":"A","text":"Your quotation came to forty two thousand. Our budget stops at thirty eight."},
   {"speaker":"B","text":"I understand. I can reach thirty nine if we drop the on site training."},
   {"speaker":"A","text":"The training is the part my team actually needs."},
   {"speaker":"B","text":"Then let us keep it and move the second delivery to October. That takes it to thirty eight five, and spreads the cost across two budget years."},
   {"speaker":"A","text":"That could work. I would need it in writing before Friday."}]', 32, 30),

('B2', 'conversation', 'Un entretien annuel', 'Une responsable reçoit un membre de son équipe.',
 '[{"speaker":"A","text":"Your results this year are strong. The clients ask for you by name."},
   {"speaker":"B","text":"Thank you. Although I have to say the workload has been heavy."},
   {"speaker":"A","text":"I know. That is partly why I want to talk about the team leader role."},
   {"speaker":"B","text":"I am interested, but I would not want to stop working with clients altogether."},
   {"speaker":"A","text":"It would be about half and half. Think about it and tell me in two weeks."}]', 33, 30),

('B2', 'talk', 'Annonce de réorganisation', 'Un directeur s''adresse au personnel.',
 '[{"speaker":"A","text":"From September, the two customer teams will become one. Let me be clear about what this does not mean: there are no redundancies, and no one is being asked to move offices. What does change is the reporting line. You will have a single manager instead of two, which should put an end to the contradictory instructions many of you have described. The new structure will be reviewed after six months, and I would rather hear your objections now than read them in a survey next spring."}]', 34, 30);

insert into listening_questions (passage_id, position, question, options, correct_answer, explanation) values
(31, 1, 'Which response is correct?', '["Answer A","Answer B","Answer C"]', 'Answer A', 'La seule réponse qui accepte tout en posant une condition. « In principle » annonce la réserve qui suit : c''est le marqueur à repérer.'),

(32, 1, 'What is the gap between the quotation and the budget?', '["Four thousand","Three thousand","Forty two thousand","Five hundred"]', 'Four thousand', '42 000 moins 38 000. Aucun des deux interlocuteurs ne donne l''écart : il se calcule.'),
(32, 2, 'Why does the buyer refuse the first offer?', '["Her team needs the training","The price is still too high","The delivery is too late","She does not trust the supplier"]', 'Her team needs the training', 'Le refus ne porte pas sur le prix, qui baissait, mais sur ce qui est supprimé pour l''obtenir.'),
(32, 3, 'What is the buyer''s attitude at the end?', '["Interested but not committed","Fully convinced","Opposed","Indifferent"]', 'Interested but not committed', '« That could work » et une condition écrite : elle avance sans s''engager. Le ton porte l''information, pas les mots.'),

(33, 1, 'What does the employee raise?', '["The amount of work","A pay rise","A conflict with a colleague","A wish to leave"]', 'The amount of work', '« Although I have to say » annonce une réserve derrière un remerciement. La plainte est réelle, sa forme est polie.'),
(33, 2, 'What is the employee''s condition?', '["Keeping contact with clients","A higher salary","Fewer hours","A new office"]', 'Keeping contact with clients', 'La condition est exprimée négativement : « I would not want to stop… ». Il faut la retourner pour répondre.'),
(33, 3, 'What is the manager''s purpose in this meeting?', '["To offer a new role","To give a warning","To announce a transfer","To refuse a request"]', 'To offer a new role', 'Le compliment initial prépare la proposition. L''intention se comprend au mouvement de l''échange, pas à une phrase isolée.'),

(34, 1, 'What does the reorganisation NOT involve?', '["Job losses","A single manager","A review after six months","A merger of two teams"]', 'Job losses', 'La phrase « let me be clear about what this does not mean » annonce une liste de démentis. Écouter les négations est ici tout l''exercice.'),
(34, 2, 'What problem is the change meant to solve?', '["Contradictory instructions","Overtime","Office space","Staff turnover"]', 'Contradictory instructions', 'Le problème est nommé une seule fois, à la fin de la phrase sur la ligne hiérarchique.'),
(34, 3, 'What does the speaker ask of the staff?', '["To raise objections now","To complete a survey","To accept the change quietly","To choose their manager"]', 'To raise objections now', 'La dernière phrase oppose deux moments : maintenant, ou dans une enquête au printemps. La demande est dans le contraste.');

-- ============================================
-- C1
-- ============================================
insert into listening_passages (level, format, title, context, script, position, xp_reward) values
('C1', 'question_response', 'Éluder une question', 'Un interlocuteur te met en difficulté. Écoute la question, puis les trois réponses.',
 '[{"speaker":"A","text":"Can you guarantee the site will be ready by March?"},
   {"speaker":"B","text":"Answer A. What I can guarantee is that you will know by January whether it will be."},
   {"speaker":"B","text":"Answer B. March is a very pleasant month here."},
   {"speaker":"B","text":"Answer C. The guarantee lasts two years."}]', 35, 30),

('C1', 'conversation', 'Un arbitrage budgétaire', 'Deux responsables se disputent une enveloppe.',
 '[{"speaker":"A","text":"If we fund the new platform, the training budget goes to zero. I want that said out loud."},
   {"speaker":"B","text":"Nobody is hiding it. But a platform nobody can use is not a saving either."},
   {"speaker":"A","text":"Which is my point, not an answer to it."},
   {"speaker":"B","text":"Fair. What I would propose is a smaller first version this year, with the training kept, and the rest reconsidered in the autumn."},
   {"speaker":"A","text":"I could live with that, as long as the autumn review is in the minutes."}]', 36, 35),

('C1', 'conversation', 'Un recadrage en tête-à-tête', 'Un responsable reçoit un collaborateur après un incident.',
 '[{"speaker":"A","text":"I want to talk about Tuesday. You replied to the client directly, without copying anyone."},
   {"speaker":"B","text":"The client was waiting. I made a judgement call."},
   {"speaker":"A","text":"And the judgement was probably right. That is not what concerns me. What concerns me is that if it had been wrong, no one would have known until it was too late."},
   {"speaker":"B","text":"So you would rather I had waited."},
   {"speaker":"A","text":"I would rather you had answered and copied me in the same minute. The speed was not the problem."}]', 37, 35),

('C1', 'talk', 'Un point presse', 'Le porte-parole d''une agence publique répond aux journalistes.',
 '[{"speaker":"A","text":"I will take questions in a moment, but let me set out where we are. The interruption on Sunday affected about eleven thousand households, and supply was restored within four hours. I have seen the figure of a hundred thousand quoted this morning. That figure is the number of households in the region, not the number affected. As for the cause, the honest answer is that we do not yet know. An independent inspection begins on Wednesday, and we have undertaken to publish its findings whatever they say."}]', 38, 35);

insert into listening_questions (passage_id, position, question, options, correct_answer, explanation) values
(35, 1, 'Which response is correct?', '["Answer A","Answer B","Answer C"]', 'Answer A', 'La bonne réponse refuse la garantie demandée et en offre une autre, plus modeste mais tenable. Les deux autres jouent sur les mots « March » et « guarantee ».'),

(36, 1, 'What does the first speaker want made explicit?', '["That funding the platform ends the training budget","That the platform is too expensive","That the training is useless","That the decision is already taken"]', 'That funding the platform ends the training budget', 'Il ne s''oppose pas au projet : il exige que sa conséquence soit dite. La nuance porte tout l''échange.'),
(36, 2, 'What does « Which is my point, not an answer to it » mean?', '["The reply confirms his objection instead of answering it","He agrees with the reply","He has changed his mind","He did not hear the reply"]', 'The reply confirms his objection instead of answering it', 'Reproche argumentatif précis : l''autre a redit le problème en croyant le résoudre.'),
(36, 3, 'On what condition does he accept?', '["The autumn review is recorded in the minutes","The training budget is doubled","The platform is cancelled","The decision is delayed"]', 'The autumn review is recorded in the minutes', '« As long as » introduit la condition. Elle ne porte pas sur le fond mais sur la trace écrite — ce qui en dit long sur sa confiance.'),

(37, 1, 'What does the manager criticise?', '["The absence of a copy, not the decision","The decision itself","The delay","The tone of the reply"]', 'The absence of a copy, not the decision', 'Il valide explicitement le jugement (« probably right ») avant de nommer ce qui le gêne. Confondre les deux fait manquer tout l''entretien.'),
(37, 2, 'What does the employee assume the manager wants?', '["That he should have waited","That he should have refused","That he should have called","That he was too slow"]', 'That he should have waited', '« So you would rather I had waited » est une reformulation du collaborateur — et elle est fausse, comme la réponse suivante le montre.'),
(37, 3, 'What did the manager actually want?', '["Speed and a copy at the same time","More time to decide","A written report","A meeting before answering"]', 'Speed and a copy at the same time', 'La dernière phrase corrige le malentendu : « the speed was not the problem ». La réponse tient dans une négation finale.'),

(38, 1, 'How many households were affected?', '["About eleven thousand","A hundred thousand","Four thousand","The whole region"]', 'About eleven thousand', 'Deux chiffres circulent, dont un cité pour être corrigé. Retenir le plus impressionnant est exactement l''erreur visée.'),
(38, 2, 'What does the speaker say about the cause?', '["It is not yet known","It was a technical fault","It was human error","It will not be published"]', 'It is not yet known', '« The honest answer is that we do not yet know » : l''aveu est enrobé, mais c''est bien une absence de réponse.'),
(38, 3, 'What has the agency undertaken to do?', '["Publish the findings whatever they say","Compensate households","Replace the equipment","Hold a public meeting"]', 'Publish the findings whatever they say', 'L''engagement porte sur la publication, pas sur le résultat. La formule « whatever they say » est ce qui lui donne son poids.');

-- ============================================
-- C2
-- ============================================
insert into listening_passages (level, format, title, context, script, position, xp_reward) values
('C2', 'question_response', 'Une concession de façade', 'Un interlocuteur te répond. Écoute la remarque, puis les trois réponses.',
 '[{"speaker":"A","text":"You will admit the trial was too small to prove anything."},
   {"speaker":"B","text":"Answer A. I will admit it was small. Whether that is the same as proving nothing is precisely what is at issue."},
   {"speaker":"B","text":"Answer B. Yes, it was a very small room."},
   {"speaker":"B","text":"Answer C. The trial begins on Monday."}]', 39, 35),

('C2', 'conversation', 'Une médiation entre deux services', 'Une médiatrice reçoit les deux parties après plusieurs mois de tension.',
 '[{"speaker":"A","text":"I have read both accounts. They agree on every fact and on nothing else."},
   {"speaker":"B","text":"Because the facts were never the difficulty. The difficulty is that decisions are taken in a room we are not in, and presented to us as consultations."},
   {"speaker":"A","text":"And from the other side, the complaint is that consultation with your team has come to mean an indefinite delay."},
   {"speaker":"B","text":"That is not an unfair description of last year, I am afraid."},
   {"speaker":"A","text":"Then we have something to work with. Two grievances that are both true are easier than one that is contested."}]', 40, 40),

('C2', 'conversation', 'Un désaccord entre chercheurs', 'Deux chercheurs discutent d''un résultat avant publication.',
 '[{"speaker":"A","text":"The effect holds in every subgroup. I do not see what more you want."},
   {"speaker":"B","text":"I want to know how many subgroups you looked at before these were the subgroups."},
   {"speaker":"A","text":"That is a serious accusation."},
   {"speaker":"B","text":"It is not an accusation at all. It is the question a referee will ask, and I would rather you answered it here than there."},
   {"speaker":"A","text":"Fifteen. We looked at fifteen, and we should say so in the paper."}]', 41, 40),

('C2', 'talk', 'Un discours de départ', 'Le directeur sortant d''une institution s''adresse à ses équipes.',
 '[{"speaker":"A","text":"I have been asked to say what I am proudest of. The honest answer is not on the list I was given. It is not the new wing, which was funded before I arrived, nor the ranking, which measures how we were doing five years ago. It is that this place now argues with itself in public, and survives it. When I came, disagreement was something that happened in corridors and reached me as rumour. I would ask my successor to guard that, because it is the first thing an institution loses when it becomes anxious about its reputation, and the last thing it gets back."}]', 42, 40);

insert into listening_questions (passage_id, position, question, options, correct_answer, explanation) values
(39, 1, 'Which response is correct?', '["Answer A","Answer B","Answer C"]', 'Answer A', 'La réponse concède le fait et refuse la conclusion qu''on veut lui faire tirer. Accepter la prémisse sans accepter l''inférence : c''est la manœuvre à reconnaître.'),

(40, 1, 'What do the two accounts have in common?', '["The facts","The conclusions","Nothing","The tone"]', 'The facts', '« They agree on every fact and on nothing else » : l''accord total sur les faits est précisément ce qui rend le désaccord intéressant.'),
(40, 2, 'What does the second speaker admit?', '["That the delays described are real","That the facts are wrong","That his team was consulted","That the dispute is over"]', 'That the delays described are real', '« That is not an unfair description » est une double négation : il concède, à contrecœur, une critique visant son propre camp.'),
(40, 3, 'Why does the mediator find the situation workable?', '["Both complaints are justified","One side has given in","The facts are disputed","The parties are calm"]', 'Both complaints are justified', 'La dernière phrase renverse l''intuition : deux griefs fondés sont plus faciles à traiter qu''un grief contesté.'),

(41, 1, 'What is the second speaker really asking about?', '["How many subgroups were tested before these were chosen","The size of the sample","The funding of the study","The publication date"]', 'How many subgroups were tested before these were chosen', 'La question porte sur une sélection après coup des sous-groupes. Formulée obliquement, elle vise une faute méthodologique précise.'),
(41, 2, 'How does the second speaker defend the question?', '["A referee will ask it anyway","It is only a formality","He does not trust the data","The journal requires it"]', 'A referee will ask it anyway', 'Il déplace l''enjeu : la question sera posée, mieux vaut y répondre ici. Ce n''est plus une attaque mais un service.'),
(41, 3, 'What does the first speaker do at the end?', '["He answers and accepts to disclose it","He refuses to answer","He withdraws the paper","He changes the subject"]', 'He answers and accepts to disclose it', 'Un seul mot, « fifteen », renverse la position tenue trois répliques plus tôt. Le revirement est dans le chiffre, pas dans une formule.'),

(42, 1, 'What is the speaker proudest of?', '["That the institution argues openly and survives it","The new wing","The ranking","His successor"]', 'That the institution argues openly and survives it', 'Deux fiertés attendues sont citées pour être écartées, avant la vraie. Répondre trop tôt mène aux deux mauvaises.'),
(42, 2, 'Why does he dismiss the ranking?', '["It reflects the situation five years ago","It is inaccurate","It is unimportant to staff","It was bought"]', 'It reflects the situation five years ago', 'La raison est glissée en incise, sans insistance : un classement mesure du passé.'),
(42, 3, 'What does he warn his successor about?', '["Concern for reputation silences disagreement","Funding will be harder to find","Staff will leave","Rankings will fall"]', 'Concern for reputation silences disagreement', 'L''avertissement est formulé comme une loi générale, et sa force tient à la fin : premier perdu, dernier retrouvé.');
