-- ============================================
-- SEED — compréhension orale
-- 18 passages (3 par niveau A1 -> C2), 48 questions.
--
-- À exécuter APRÈS migration-listening.sql. Rejouable.
--
-- RÉPARTITION PAR NIVEAU
--   1 question-réponse (partie 2 du TOEIC) — 1 question
--   1 conversation     (partie 3)          — 3 questions
--   1 annonce / exposé (partie 4)          — 3 questions
--
-- Le champ `script` est un tableau de répliques : [{"speaker":"A","text":…}].
-- « A » et « B » désignent deux interlocuteurs, lus par deux voix
-- différentes. Une annonce n'a qu'un « A ».
--
-- Les questions sont EN ANGLAIS (c'est le cas au TOEIC, et comprendre la
-- question fait partie de l'épreuve). Les explications sont en français.
--
-- `audio_url` reste null : la synthèse du navigateur lit le script. Le jour
-- où des fichiers audio neuronaux seront générés, il suffira de remplir ce
-- champ — aucun code d'exercice ne changera.
-- ============================================

delete from listening_questions;
delete from listening_passages;
alter sequence listening_passages_id_seq restart with 1;

-- ============================================
-- A1
-- ============================================
insert into listening_passages (level, format, title, context, script, position, xp_reward) values
('A1', 'question_response', 'Une question simple', 'Quelqu''un t''adresse la parole. Écoute la question, puis les trois réponses possibles.',
 '[{"speaker":"A","text":"Where do you live?"},
   {"speaker":"B","text":"Answer A. I live in Manchester."},
   {"speaker":"B","text":"Answer B. Yes, I do."},
   {"speaker":"B","text":"Answer C. At six o clock."}]', 1, 10),

('A1', 'conversation', 'Au café', 'Deux personnes commandent au comptoir d''un café.',
 '[{"speaker":"A","text":"Good morning. What would you like?"},
   {"speaker":"B","text":"Good morning. A coffee and a chocolate cake, please."},
   {"speaker":"A","text":"Of course. Would you like the coffee with milk?"},
   {"speaker":"B","text":"No, thank you. Just black. How much is that?"},
   {"speaker":"A","text":"That is five euros fifty."}]', 2, 15),

('A1', 'talk', 'Annonce à la gare', 'Une annonce est diffusée dans une gare britannique.',
 '[{"speaker":"A","text":"Good afternoon. The train to Oxford will leave from platform four at three o clock. Please do not leave your bags on the seats. Thank you."}]', 3, 15);

insert into listening_questions (passage_id, position, question, options, correct_answer, explanation) values
(1, 1, 'Which response is correct?', '["Answer A","Answer B","Answer C"]', 'Answer A', 'La question commence par « where » : elle attend un lieu. « Yes, I do » répondrait à une question fermée, et « at six » à une question avec « when ».'),

(2, 1, 'What does the customer order?', '["A coffee and a cake","A tea and a sandwich","Two coffees","A chocolate drink"]', 'A coffee and a cake', 'Le client demande « a coffee and a chocolate cake ». Le mot « chocolate » désigne ici le gâteau, pas la boisson : un piège d''écoute classique.'),
(2, 2, 'Does the customer want milk?', '["No","Yes","Only a little","He does not say"]', 'No', '« Just black » signifie « noir, sans lait ». Il faut avoir retenu la réponse « no, thank you » qui précède.'),
(2, 3, 'How much does it cost?', '["5.50","5.15","15.50","5.05"]', '5.50', '« Five euros fifty ». Attention à ne pas entendre « fifteen » : c''est la confusion la plus fréquente à ce niveau.'),

(3, 1, 'Where does the train leave from?', '["Platform four","Platform three","Platform fourteen","Platform forty"]', 'Platform four', 'Le quai est « four » et l''heure « three ». L''annonce donne les deux nombres à la suite pour brouiller l''écoute.'),
(3, 2, 'What time does the train leave?', '["Three o clock","Four o clock","Three thirty","Two o clock"]', 'Three o clock', 'Ne pas confondre le numéro de quai et l''heure : c''est exactement le piège de la partie 4 du TOEIC.'),
(3, 3, 'What are passengers asked not to do?', '["Put bags on the seats","Eat on the train","Use the phone","Stand near the doors"]', 'Put bags on the seats', '« Do not leave your bags on the seats » : une consigne négative, souvent mal entendue parce que le « not » est peu accentué.');

-- ============================================
-- A2
-- ============================================
insert into listening_passages (level, format, title, context, script, position, xp_reward) values
('A2', 'question_response', 'Proposer quelque chose', 'Un collègue te propose quelque chose. Choisis la réponse qui convient.',
 '[{"speaker":"A","text":"Shall we meet at the station tomorrow?"},
   {"speaker":"B","text":"Answer A. It was very good, thanks."},
   {"speaker":"B","text":"Answer B. Yes, that sounds good. What time?"},
   {"speaker":"B","text":"Answer C. No, I did not go there."}]', 4, 10),

('A2', 'conversation', 'Demander son chemin', 'Une touriste demande son chemin à un passant.',
 '[{"speaker":"A","text":"Excuse me, how do I get to the museum?"},
   {"speaker":"B","text":"Go straight on, then turn right after the bank."},
   {"speaker":"A","text":"Is it far? I am walking."},
   {"speaker":"B","text":"About ten minutes on foot. It is next to the library."},
   {"speaker":"A","text":"Thank you very much. Is it open on Sunday?"},
   {"speaker":"B","text":"No, it closes on Sunday and Monday."}]', 5, 15),

('A2', 'talk', 'Message sur répondeur', 'Tu écoutes un message laissé sur ton répondeur téléphonique.',
 '[{"speaker":"A","text":"Hello, this is Sarah from the dentist. I am calling about your appointment on Thursday. Unfortunately the doctor is ill, so we have to move it to next Tuesday at two thirty. Please call us back to confirm. Thank you."}]', 6, 15);

insert into listening_questions (passage_id, position, question, options, correct_answer, explanation) values
(4, 1, 'Which response is correct?', '["Answer A","Answer B","Answer C"]', 'Answer B', '« Shall we…? » est une proposition pour le futur. Les réponses A et C sont au passé : elles ne peuvent pas convenir.'),

(5, 1, 'Where does the woman want to go?', '["The museum","The library","The bank","The station"]', 'The museum', 'Les trois autres lieux sont bien cités, mais comme points de repère du chemin.'),
(5, 2, 'How long does it take on foot?', '["About ten minutes","About two minutes","About twenty minutes","Half an hour"]', 'About ten minutes', '« Ten » et « twenty » se confondent facilement quand le débit est rapide.'),
(5, 3, 'When is the museum closed?', '["Sunday and Monday","Only Sunday","Saturday and Sunday","Every evening"]', 'Sunday and Monday', 'La touriste ne demande que le dimanche, mais le passant ajoute le lundi. Il faut écouter la réponse complète, pas seulement le début.'),

(6, 1, 'Why is the appointment moved?', '["The doctor is ill","The patient is late","The office is closed","There was a mistake"]', 'The doctor is ill', '« The doctor is ill » : la raison arrive au milieu du message, entre deux informations de date.'),
(6, 2, 'What is the new day?', '["Tuesday","Thursday","Wednesday","Monday"]', 'Tuesday', 'Jeudi est l''ancien rendez-vous, mardi le nouveau. Repérer lequel est annulé et lequel le remplace est tout l''exercice.'),
(6, 3, 'What should the patient do?', '["Call back to confirm","Come earlier","Send an email","Wait for another call"]', 'Call back to confirm', '« Please call us back to confirm ». Les messages de répondeur se terminent presque toujours par la consigne : c''est là qu''il faut être attentif.');

-- ============================================
-- B1
-- ============================================
insert into listening_passages (level, format, title, context, script, position, xp_reward) values
('B1', 'question_response', 'Une question au bureau', 'Un collègue te pose une question sur un dossier.',
 '[{"speaker":"A","text":"Have you finished the report yet?"},
   {"speaker":"B","text":"Answer A. Almost. I need another hour."},
   {"speaker":"B","text":"Answer B. Yes, I will finish it last week."},
   {"speaker":"B","text":"Answer C. It is on the third floor."}]', 7, 10),

('B1', 'conversation', 'Un entretien d''embauche', 'Une candidate répond aux questions d''un recruteur.',
 '[{"speaker":"A","text":"Thank you for coming. Tell me about your current job."},
   {"speaker":"B","text":"I have worked as a sales assistant for three years, mostly with international clients."},
   {"speaker":"A","text":"And why do you want to leave?"},
   {"speaker":"B","text":"I would like more responsibility. My current position offers little room to grow."},
   {"speaker":"A","text":"I see. Are you available from the first of September?"},
   {"speaker":"B","text":"I would need two more weeks. My notice period ends in the middle of the month."}]', 8, 20),

('B1', 'talk', 'Consigne en réunion', 'Un responsable s''adresse à son équipe en début de réunion.',
 '[{"speaker":"A","text":"Before we start, a quick reminder. The new expense forms must be submitted online, not on paper. Anything sent by post after Friday will not be processed this month. If you have any questions, speak to Anna in accounts, not to me."}]', 9, 20);

insert into listening_questions (passage_id, position, question, options, correct_answer, explanation) values
(7, 1, 'Which response is correct?', '["Answer A","Answer B","Answer C"]', 'Answer A', 'La question est au present perfect et porte sur l''avancement. La réponse B mélange futur et passé, ce qui est impossible.'),

(8, 1, 'How long has she been in her current job?', '["Three years","Two years","Three months","Since September"]', 'Three years', '« For three years » indique une durée. Les autres nombres du dialogue concernent son préavis.'),
(8, 2, 'Why does she want to leave?', '["She wants more responsibility","The pay is too low","She is moving abroad","She does not like her manager"]', 'She wants more responsibility', 'Elle ne critique jamais son employeur directement : « little room to grow » est une formulation prudente, typique d''un entretien.'),
(8, 3, 'Can she start on the first of September?', '["No, she needs two more weeks","Yes, immediately","No, she needs two months","She does not say"]', 'No, she needs two more weeks', 'Elle ne dit pas « no » : elle répond « I would need two more weeks ». Un refus poli, à reconnaître comme tel.'),

(9, 1, 'How must expense forms be sent?', '["Online","By post","In person","By email"]', 'Online', '« Online, not on paper » : la structure « X, not Y » place l''information juste avant la négation.'),
(9, 2, 'What happens to forms posted after Friday?', '["They will not be processed this month","They will be lost","They cost extra","They go to Anna"]', 'They will not be processed this month', '« Will not be processed this month » : ce n''est pas un refus définitif, mais un report. Nuance importante.'),
(9, 3, 'Who should people ask about questions?', '["Anna","The speaker","Nobody","The accounts manager by email"]', 'Anna', 'La phrase se termine par « not to me » : le locuteur s''exclut lui-même. Écouter jusqu''au bout change la réponse.');

-- ============================================
-- B2
-- ============================================
insert into listening_passages (level, format, title, context, script, position, xp_reward) values
('B2', 'question_response', 'Réagir à une objection', 'Un client émet une réserve sur une proposition.',
 '[{"speaker":"A","text":"I am not sure the deadline is realistic."},
   {"speaker":"B","text":"Answer A. Fair enough. What timeframe would work for you?"},
   {"speaker":"B","text":"Answer B. Yes, the deadline was yesterday."},
   {"speaker":"B","text":"Answer C. No, I have not seen the invoice."}]', 10, 10),

('B2', 'conversation', 'Un retard de livraison', 'Un client appelle un fournisseur au sujet d''une commande.',
 '[{"speaker":"A","text":"I am calling about order forty two seventeen. It was due last Monday."},
   {"speaker":"B","text":"I am sorry about that. Let me check. It seems the shipment was held at customs."},
   {"speaker":"A","text":"Nobody informed us. We have clients waiting."},
   {"speaker":"B","text":"You are right, and I apologise. We should have contacted you immediately."},
   {"speaker":"A","text":"So when can we expect it?"},
   {"speaker":"B","text":"It cleared customs this morning. Delivery is scheduled for Thursday, and we will waive the shipping cost."}]', 11, 25),

('B2', 'talk', 'Résultats trimestriels', 'Une directrice présente les résultats du trimestre à son équipe.',
 '[{"speaker":"A","text":"Overall, the quarter was stronger than expected. Sales rose by twelve per cent, driven almost entirely by the online channel. Our retail stores, however, saw a slight decline. We will therefore shift part of the marketing budget towards digital from next month. I should stress that no store closures are planned."}]', 12, 25);

insert into listening_questions (passage_id, position, question, options, correct_answer, explanation) values
(10, 1, 'Which response is correct?', '["Answer A","Answer B","Answer C"]', 'Answer A', 'Face à une objection, on reconnaît puis on relance. « Fair enough » accepte la réserve sans céder sur le fond.'),

(11, 1, 'Why was the order delayed?', '["It was held at customs","The address was wrong","The item was out of stock","A driver was ill"]', 'It was held at customs', '« Held at customs » = bloqué en douane. Vocabulaire logistique très présent au TOEIC.'),
(11, 2, 'What is the customer most annoyed about?', '["Not being informed","The price","The quality","The packaging"]', 'Not being informed', 'Il ne se plaint pas du retard lui-même mais du silence : « nobody informed us ». La nuance est tout le sens de l''appel.'),
(11, 3, 'What does the supplier offer?', '["Free shipping","A full refund","A discount on the next order","An extra item"]', 'Free shipping', '« Waive the shipping cost » = renoncer aux frais de port. « Waive » est un verbe clé du registre commercial.'),

(12, 1, 'What drove the increase in sales?', '["The online channel","The retail stores","A price rise","A new product"]', 'The online channel', '« Driven almost entirely by the online channel » : « driven by » introduit la cause.'),
(12, 2, 'What happened to retail stores?', '["A slight decline","Strong growth","No change","They closed"]', 'A slight decline', '« However » annonce le contraste : ce petit mot signale que l''information qui suit va à l''inverse de la précédente.'),
(12, 3, 'What does the speaker want to make clear?', '["No stores will close","Budgets are frozen","Results were disappointing","Staff will be cut"]', 'No stores will close', '« I should stress that » sert à devancer une inquiétude. La phrase existe précisément parce que le déclin des magasins pouvait faire craindre des fermetures.');

-- ============================================
-- C1
-- ============================================
insert into listening_passages (level, format, title, context, script, position, xp_reward) values
('C1', 'question_response', 'Un refus poli', 'Un partenaire répond à une demande délicate.',
 '[{"speaker":"A","text":"Could you possibly bring the launch forward by a month?"},
   {"speaker":"B","text":"Answer A. I would love to say yes, but that would compromise testing."},
   {"speaker":"B","text":"Answer B. The launch was very successful, thank you."},
   {"speaker":"B","text":"Answer C. Yes, it launched last month."}]', 13, 10),

('C1', 'conversation', 'Un désaccord en réunion', 'Deux responsables débattent d''un choix stratégique.',
 '[{"speaker":"A","text":"I appreciate the ambition, but I am not convinced the figures support it."},
   {"speaker":"B","text":"Which figures concern you specifically?"},
   {"speaker":"A","text":"The growth assumption. Fifteen per cent looks optimistic given last year."},
   {"speaker":"B","text":"That is a fair point. Although in fairness, last year included the supply disruption."},
   {"speaker":"A","text":"True. Would you be willing to model a more conservative scenario alongside it?"},
   {"speaker":"B","text":"Happily. If the case holds at ten per cent, we have a much stronger argument."}]', 14, 30),

('C1', 'talk', 'Chronique de radio', 'Un journaliste commente une étude qui vient de paraître.',
 '[{"speaker":"A","text":"The study, published this morning, has been widely reported as proof that remote work damages productivity. That is not quite what it says. The authors found a correlation in one sector over eighteen months, and they explicitly warn against generalising. What the headlines have done, once again, is turn a cautious finding into a settled conclusion."}]', 15, 30);

insert into listening_questions (passage_id, position, question, options, correct_answer, explanation) values
(13, 1, 'Which response is correct?', '["Answer A","Answer B","Answer C"]', 'Answer A', '« I would love to say yes, but… » est la formule type du refus poli : elle accepte l''intention et rejette la demande.'),

(14, 1, 'What is the first speaker sceptical about?', '["The growth assumption","The budget","The team size","The deadline"]', 'The growth assumption', 'Il ne conteste pas le projet mais une hypothèse précise. Distinguer les deux est ce que teste un niveau C1.'),
(14, 2, 'How does the second speaker defend the figure?', '["Last year was affected by supply problems","The figure came from an expert","Competitors grew faster","The market has changed"]', 'Last year was affected by supply problems', '« In fairness » introduit une nuance en faveur de sa propre position, sans nier l''objection.'),
(14, 3, 'What do they agree to do?', '["Model a more conservative scenario","Cancel the project","Postpone the decision","Ask for external advice"]', 'Model a more conservative scenario', 'Ils ne tranchent pas le désaccord : ils le transforment en tâche. C''est la sortie de conflit la plus courante en réunion.'),

(15, 1, 'What do the headlines claim?', '["That remote work harms productivity","That remote work helps productivity","That the study is false","That the sector is growing"]', 'That remote work harms productivity', 'Le journaliste rapporte cette affirmation pour la contester ensuite : ce n''est pas son avis.'),
(15, 2, 'What did the authors actually find?', '["A correlation in one sector","Proof across all sectors","No effect at all","A drop of eighteen per cent"]', 'A correlation in one sector', 'Corrélation dans un seul secteur, pas preuve générale. La différence entre les deux est tout le propos.'),
(15, 3, 'What is the speaker criticising?', '["The press coverage","The authors","Remote workers","The length of the study"]', 'The press coverage', '« What the headlines have done, once again » : la critique vise le traitement médiatique, pas l''étude elle-même.');

-- ============================================
-- C2
-- ============================================
insert into listening_passages (level, format, title, context, script, position, xp_reward) values
('C2', 'question_response', 'Une remarque à double sens', 'Un collègue commente un projet. Écoute le ton autant que les mots.',
 '[{"speaker":"A","text":"Well, that is certainly one way of approaching it."},
   {"speaker":"B","text":"Answer A. You have reservations, then. Tell me what worries you."},
   {"speaker":"B","text":"Answer B. Thank you, I am glad you like it."},
   {"speaker":"B","text":"Answer C. Yes, there are two ways to get there."}]', 16, 10),

('C2', 'conversation', 'Une négociation tendue', 'Deux négociateurs cherchent une issue sans céder ouvertement.',
 '[{"speaker":"A","text":"Let me be candid. At that price, we would be working at a loss."},
   {"speaker":"B","text":"I hear you. Though I would gently point out that volume has doubled since we last spoke."},
   {"speaker":"A","text":"It has, and we have absorbed the cost without passing it on. That cannot continue indefinitely."},
   {"speaker":"B","text":"Nobody is asking it to. What if we indexed the price to volume, rather than fixing it?"},
   {"speaker":"A","text":"That is worth exploring, provided the floor is high enough to keep us viable."},
   {"speaker":"B","text":"Then let us put a floor on paper and see whether the rest follows."}]', 17, 35),

('C2', 'talk', 'Une critique ironique', 'Un chroniqueur revient sur une décision politique.',
 '[{"speaker":"A","text":"The scheme was announced with considerable fanfare, and it must be said, an admirable disregard for arithmetic. Three years on, the promised savings have failed to materialise, the review has been quietly shelved, and those responsible have moved on to other things. It would be unkind to call this a failure. It has succeeded perfectly, just not at anything it claimed to be doing."}]', 18, 35);

insert into listening_questions (passage_id, position, question, options, correct_answer, explanation) values
(16, 1, 'Which response is correct?', '["Answer A","Answer B","Answer C"]', 'Answer A', '« That is certainly one way of approaching it » est une critique déguisée en compliment. Le prendre pour un éloge est l''erreur que teste cette question.'),

(17, 1, 'What is the first speaker''s core problem?', '["The price makes the deal unprofitable","The volume is too low","The deadline is too short","The quality has dropped"]', 'The price makes the deal unprofitable', '« Working at a loss » = travailler à perte. Tout le reste de la conversation découle de ce point.'),
(17, 2, 'What does the second speaker propose?', '["Indexing the price to volume","A fixed discount","Ending the contract","Paying in advance"]', 'Indexing the price to volume', 'Il ne concède pas sur le prix : il change la variable. Déplacer le terrain plutôt que céder est une manœuvre de négociation classique.'),
(17, 3, 'On what condition does the first speaker agree?', '["A high enough price floor","An immediate payment","A longer contract","A written apology"]', 'A high enough price floor', '« Provided the floor is high enough » : « provided » introduit une condition ferme sous une forme polie.'),

(18, 1, 'What does the speaker mean by "disregard for arithmetic"?', '["The figures did not add up","The scheme was too complex","Nobody could count the participants","The budget was secret"]', 'The figures did not add up', 'Litote ironique : « an admirable disregard for arithmetic » signifie que les calculs étaient faux, formulé comme un compliment.'),
(18, 2, 'What happened to the review?', '["It was quietly shelved","It was published","It is still running","It was extended"]', 'It was quietly shelved', '« Quietly shelved » = enterré sans bruit. L''adverbe porte l''accusation : ce n''est pas seulement abandonné, c''est abandonné discrètement.'),
(18, 3, 'What is the speaker''s final judgement?', '["The scheme served purposes it never admitted","The scheme was a clear success","The scheme was too expensive","The scheme should be restarted"]', 'The scheme served purposes it never admitted', '« It has succeeded perfectly, just not at anything it claimed to be doing » : l''ironie affirme la réussite pour dénoncer les vraies intentions.');
