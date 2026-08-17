-- ============================================
-- SEED — compréhension écrite
-- 12 documents (2 par niveau A1 -> C2), 36 questions.
--
-- À exécuter APRÈS migration-reading.sql. Rejouable.
--
-- RÉPARTITION PAR NIVEAU
--   1 texte à compléter (partie 6 du TOEIC) — 3 trous, 3 questions
--   1 lecture           (partie 7)          — 3 questions de compréhension
--
-- Les documents montent en difficulté ET en nature : un mot laissé sur la
-- table en A1, un échange d'e-mails professionnels en B2, deux documents à
-- croiser en C2. Ce dernier format — trouver la réponse en reliant deux
-- textes — est le plus difficile du TOEIC et celui qui sépare vraiment les
-- niveaux.
--
-- Les questions sont EN ANGLAIS, comme à l'examen. Les explications en
-- français : ce sont elles qui enseignent, elles doivent être comprises.
-- ============================================

-- Suppression CADREE aux positions 1 a 12, celles de cette serie.
-- Un « delete from reading_passages » sans condition effacerait aussi les
-- series suivantes : c'est exactement le piege qui a fait disparaitre les
-- 60 exercices oraux le 17/08.
delete from reading_questions
where passage_id in (select id from reading_passages where position <= 12);
delete from reading_passages where position <= 12;
alter sequence reading_passages_id_seq restart with 1;

-- ============================================
-- A1
-- ============================================
insert into reading_passages (level, format, title, context, documents, position, xp_reward) values
('A1', 'text_completion', 'Un mot sur la table', 'Quelqu''un a laissé un message avant de partir. Trois mots manquent.',
 '[{"kind":"message","title":"Note for Tom","text":"Hi Tom,\nI am at the __(1)__. I need milk and bread.\nYour lunch is in the __(2)__.\nSee you at six __(3)__ clock.\nMum"}]', 1, 10),

('A1', 'passage', 'Les horaires de la bibliothèque', 'Une affiche est collée sur la porte d''une bibliothèque.',
 '[{"kind":"notice","title":"City Library — Opening Hours","text":"Monday to Friday: 9 am to 6 pm\nSaturday: 10 am to 1 pm\nSunday: closed\n\nYou can borrow five books for three weeks.\nPlease do not eat or drink inside."}]', 2, 15);

insert into reading_questions (passage_id, position, question, options, correct_answer, explanation) values
(1, 1, 'Which word fits gap (1)?', '["shop","school","garden","car"]', 'shop', 'La phrase suivante parle de lait et de pain : on achète cela dans un magasin. Le contexte donne la réponse, pas la grammaire.'),
(1, 2, 'Which word fits gap (2)?', '["fridge","street","bus","window"]', 'fridge', 'Un déjeuner se garde au frigo. Les trois autres mots sont possibles grammaticalement mais absurdes ici.'),
(1, 3, 'Which word fits gap (3)?', '["o","the","a","in"]', 'o', '« Six o clock » : l''expression figée pour dire l''heure. Elle s''écrit normalement « o''clock ».'),

(2, 1, 'When is the library closed?', '["Sunday","Saturday","Monday","Friday"]', 'Sunday', '« Closed » signifie fermé. Samedi la bibliothèque ouvre, mais moins longtemps — un piège fréquent.'),
(2, 2, 'How many books can you borrow?', '["Five","Three","Six","Ten"]', 'Five', 'Le texte contient deux nombres : cinq livres et trois semaines. Il faut associer chaque nombre à la bonne chose.'),
(2, 3, 'What is not allowed inside?', '["Eating","Talking","Reading","Borrowing"]', 'Eating', '« Do not eat or drink » est la seule interdiction du texte. Les autres activités ne sont jamais mentionnées.');

-- ============================================
-- A2
-- ============================================
insert into reading_passages (level, format, title, context, documents, position, xp_reward) values
('A2', 'text_completion', 'Une carte postale', 'Une amie écrit pendant ses vacances. Trois mots manquent.',
 '[{"kind":"message","title":"Postcard from Brighton","text":"Dear Emma,\nI arrived in Brighton on Tuesday. The weather __(1)__ terrible on the first day, but now it is sunny.\nYesterday I __(2)__ to the beach and swam in the sea.\nI will be back __(3)__ Sunday evening.\nLove, Clara"}]', 3, 15),

('A2', 'passage', 'Une annonce de magasin', 'Une pancarte est affichée à l''entrée d''un magasin de vêtements.',
 '[{"kind":"notice","title":"Summer Sale","text":"All summer clothes: 30% off.\nShoes and bags: 20% off.\nThe sale ends on 31 August.\n\nWe cannot exchange sale items.\nOpen every day from 10 am, except Sunday."}]', 4, 15);

insert into reading_questions (passage_id, position, question, options, correct_answer, explanation) values
(3, 1, 'Which word fits gap (1)?', '["was","is","were","are"]', 'was', 'Le passage parle du premier jour, donc du passé, et « weather » est singulier. « Were » serait au pluriel.'),
(3, 2, 'Which word fits gap (2)?', '["went","go","going","gone"]', 'went', '« Yesterday » impose le prétérit. « Went » est le passé irrégulier de « go ».'),
(3, 3, 'Which word fits gap (3)?', '["on","in","at","to"]', 'on', 'On utilise « on » devant un jour précis : on Sunday, on Monday. « In » sert aux mois et aux années.'),

(4, 1, 'How much cheaper are the shoes?', '["20%","30%","50%","10%"]', '20%', 'Deux remises différentes sont annoncées. Il faut relier « shoes » à la bonne ligne, pas prendre le premier chiffre lu.'),
(4, 2, 'When does the sale finish?', '["31 August","10 August","Every Sunday","It does not say"]', '31 August', '« Ends » signifie se termine. La date est donnée en toutes lettres dans le texte.'),
(4, 3, 'What can you NOT do with sale items?', '["Exchange them","Try them","Pay by card","Buy two"]', 'Exchange them', '« We cannot exchange sale items » : les articles soldés ne sont pas échangeables. Une question négative demande de repérer l''interdiction.');

-- ============================================
-- B1
-- ============================================
insert into reading_passages (level, format, title, context, documents, position, xp_reward) values
('B1', 'text_completion', 'Un e-mail au travail', 'Un collègue écrit à toute l''équipe. Trois mots manquent.',
 '[{"kind":"email","title":"Subject: Team meeting moved","text":"Dear all,\nThe meeting planned for Wednesday has been __(1)__ to Friday at 2 pm, because the meeting room is being repainted.\nPlease bring your monthly figures. If you __(2)__ attend, send them to me by email.\nSorry for the __(3)__ notice.\nBest regards,\nDaniel"}]', 5, 20),

('B1', 'passage', 'Une candidature', 'Une candidate écrit à une entreprise, qui lui répond.',
 '[{"kind":"email","title":"From: Sarah Klein — Subject: Application for Sales Assistant","text":"Dear Mr Owens,\nI am writing to apply for the position of Sales Assistant advertised on your website.\nI have worked in retail for four years, and for the last two years I have managed a small team.\nI am available from the first of October.\nYours sincerely,\nSarah Klein"},
   {"kind":"email","title":"From: James Owens — Subject: Re: Application","text":"Dear Ms Klein,\nThank you for your application. We were impressed by your experience.\nWe would like to invite you to an interview on 12 September at 10 am.\nPlease confirm by Friday. The interview will last about an hour.\nBest regards,\nJames Owens"}]', 6, 20);

insert into reading_questions (passage_id, position, question, options, correct_answer, explanation) values
(5, 1, 'Which word fits gap (1)?', '["moved","arrived","opened","closed"]', 'moved', 'Le sujet de l''e-mail dit « meeting moved ». Le titre aide souvent à comprendre le corps du message.'),
(5, 2, 'Which word fits gap (2)?', '["cannot","can","will","do"]', 'cannot', 'La phrase propose une solution de secours : envoyer les chiffres. Elle ne concerne donc que ceux qui ne peuvent PAS venir.'),
(5, 3, 'Which word fits gap (3)?', '["short","long","early","late"]', 'short', '« Sorry for the short notice » = désolé de prévenir si tard. Expression figée du monde professionnel.'),

(6, 1, 'How long has Sarah managed a team?', '["Two years","Four years","Six years","She has not"]', 'Two years', 'Le texte donne deux durées : quatre ans dans le commerce, deux ans à diriger une équipe. Confondre les deux est le piège.'),
(6, 2, 'What must Sarah do before Friday?', '["Confirm the interview","Send her figures","Start the job","Call the website"]', 'Confirm the interview', '« Please confirm by Friday » se trouve dans le second e-mail. La réponse exige de lire les DEUX documents.'),
(6, 3, 'When would Sarah be able to start?', '["1 October","12 September","Friday","In four years"]', '1 October', '« Available from the first of October ». Attention : le 12 septembre est la date de l''entretien, pas de l''embauche.');

-- ============================================
-- B2
-- ============================================
insert into reading_passages (level, format, title, context, documents, position, xp_reward) values
('B2', 'text_completion', 'Une note de service', 'La direction informe le personnel d''un changement. Trois mots manquent.',
 '[{"kind":"memo","title":"Memo — New expense procedure","text":"From 1 November, all expense claims must be submitted __(1)__ the online portal. Paper forms will no longer be __(2)__.\nClaims received after the fifth of each month will be paid the following month.\nIf you have difficulty accessing the portal, please contact the finance team __(3)__ than your line manager."}]', 7, 25),

('B2', 'passage', 'Un retard de livraison', 'Un client réclame, le fournisseur répond, et un horaire est joint.',
 '[{"kind":"email","title":"From: Nora Blake — Subject: Order 4217 still not delivered","text":"Dear Sir or Madam,\nOrder 4217 was due on 3 May and has still not arrived. We were not informed of any delay, and two of our clients are now waiting.\nWe would appreciate a delivery date today, and an explanation.\nRegards,\nNora Blake"},
   {"kind":"email","title":"From: Customer Service — Subject: Re: Order 4217","text":"Dear Ms Blake,\nWe apologise for the delay and for the lack of communication, which was our fault.\nThe shipment was held at customs and cleared this morning. It will be delivered on Thursday before noon.\nAs a gesture, we have cancelled the shipping charge on this order. Your invoice will be corrected automatically."}]', 8, 25);

insert into reading_questions (passage_id, position, question, options, correct_answer, explanation) values
(7, 1, 'Which word fits gap (1)?', '["through","across","under","among"]', 'through', '« Submitted through the portal » = soumis via le portail. « Through » exprime le moyen, le canal.'),
(7, 2, 'Which word fits gap (2)?', '["accepted","allowed","refused","offered"]', 'accepted', '« No longer be accepted » = ne seront plus acceptés. « Refused » créerait une double négation absurde.'),
(7, 3, 'Which word fits gap (3)?', '["rather","more","better","sooner"]', 'rather', '« Rather than » = plutôt que. Locution figée : les trois autres mots ne se combinent pas avec « than » dans ce sens.'),

(8, 1, 'What annoys the customer most?', '["The lack of communication","The price","The quality","The packaging"]', 'The lack of communication', 'Elle écrit « we were not informed of any delay ». Ce n''est pas le retard en soi qu''elle reproche, mais le silence.'),
(8, 2, 'Why was the order late?', '["It was held at customs","The address was wrong","The item was out of stock","A driver was ill"]', 'It was held at customs', '« Held at customs » = bloqué en douane. Vocabulaire logistique central du TOEIC.'),
(8, 3, 'What compensation is offered?', '["Free shipping","A full refund","A discount on the next order","An extra item"]', 'Free shipping', '« We have cancelled the shipping charge » : les frais de port sont annulés. Ce n''est ni un remboursement ni une remise.');

-- ============================================
-- C1
-- ============================================
insert into reading_passages (level, format, title, context, documents, position, xp_reward) values
('C1', 'text_completion', 'Un extrait de presse', 'Un article commente une étude qui vient de paraître. Trois mots manquent.',
 '[{"kind":"article","title":"Remote work and productivity: what the study really says","text":"The report has been widely presented as evidence that remote work harms productivity. That claim does not __(1)__ close reading.\nThe authors examined a single sector over eighteen months and explicitly __(2)__ against generalising their findings.\nWhat the coverage has done, __(3)__ again, is turn a cautious correlation into a settled conclusion."}]', 9, 30),

('C1', 'passage', 'Un désaccord commercial', 'Deux e-mails et une note interne, à croiser pour comprendre la situation.',
 '[{"kind":"email","title":"From: Priya Raman — Subject: Revised terms","text":"Dear Marcus,\nWe have reviewed the revised terms. While we appreciate the flexibility on delivery, the pricing remains difficult for us.\nAt the proposed rate we would be operating on margins that are not sustainable beyond this quarter.\nWould you consider indexing the price to volume rather than fixing it?\nRegards,\nPriya"},
   {"kind":"memo","title":"Internal note — Marcus Feld to finance team","text":"Priya has pushed back on price, as expected. Her volume has doubled since March, which strengthens her position more than she seems to realise.\nI am inclined to accept indexation provided we set a floor. Please model the impact at a floor of eight per cent below the current rate before Thursday."}]', 10, 30);

insert into reading_questions (passage_id, position, question, options, correct_answer, explanation) values
(9, 1, 'Which word fits gap (1)?', '["survive","escape","prevent","remain"]', 'survive', '« Does not survive close reading » = ne résiste pas à un examen attentif. Image courante du registre journalistique.'),
(9, 2, 'Which word fits gap (2)?', '["warned","refused","agreed","promised"]', 'warned', '« Warned against generalising » = mettaient en garde contre toute généralisation. Le mot est capital : il oppose les auteurs à la presse.'),
(9, 3, 'Which word fits gap (3)?', '["once","one","only","even"]', 'once', '« Once again » = une fois de plus. Locution figée qui marque ici la lassitude du journaliste.'),

(10, 1, 'What does Priya object to?', '["The price","The delivery times","The contract length","The quality"]', 'The price', 'Elle salue la souplesse sur la livraison pour mieux isoler son objection. Distinguer la concession du reproche est le cœur du niveau C1.'),
(10, 2, 'What does Marcus think of her position?', '["Stronger than she realises","Weaker than she claims","Identical to last year","Impossible to assess"]', 'Stronger than she realises', 'La note interne dit « strengthens her position more than she seems to realise ». Cette information n''est PAS dans l''e-mail : il faut croiser les deux documents.'),
(10, 3, 'What condition does Marcus set?', '["A price floor","A longer contract","An immediate payment","A written apology"]', 'A price floor', '« Provided we set a floor » : il accepte l''indexation à condition qu''un plancher soit fixé. « Provided » introduit une condition ferme.');

-- ============================================
-- C2
-- ============================================
insert into reading_passages (level, format, title, context, documents, position, xp_reward) values
('C2', 'text_completion', 'Un rapport officiel', 'Extrait d''un rapport d''évaluation publique. Trois mots manquent.',
 '[{"kind":"article","title":"Evaluation of the regional transport scheme","text":"The scheme was launched with considerable publicity and, it must be said, an optimism that the underlying figures did little to __(1)__.\nThree years on, the projected savings have not materialised, and the promised independent review has been quietly __(2)__.\nIt would be unfair to describe the programme as a failure __(3)__; it has achieved a great deal, simply not what it set out to achieve."}]', 11, 35),

('C2', 'passage', 'Une controverse', 'Un éditorial et la réponse d''un chercheur, à lire l''un contre l''autre.',
 '[{"kind":"article","title":"Editorial — The case for caution","text":"Enthusiasm for the new framework has outpaced the evidence supporting it. Advocates point to three pilot programmes, none of which ran for longer than a year, and all of which were conducted in unusually favourable conditions.\nNone of this makes the framework wrong. It does make the current confidence in it premature."},
   {"kind":"email","title":"Letter to the editor — Dr Amara Okonjo","text":"Your editorial is right about the limits of the pilot data and wrong about what follows from them.\nShort trials in favourable conditions establish that something can work; they were never intended to establish that it will work everywhere. To treat that modest claim as overconfidence is to hold the research to a standard nobody proposed.\nThe question is not whether we know enough, but whether we know enough to proceed carefully."}]', 12, 35);

insert into reading_questions (passage_id, position, question, options, correct_answer, explanation) values
(11, 1, 'Which word fits gap (1)?', '["justify","prevent","increase","explain"]', 'justify', '« An optimism that the figures did little to justify » = un optimisme que les chiffres ne justifiaient guère. Litote : la phrase dit poliment que les chiffres le contredisaient.'),
(11, 2, 'Which word fits gap (2)?', '["shelved","published","extended","funded"]', 'shelved', '« Quietly shelved » = enterré sans bruit. C''est l''adverbe qui porte l''accusation, pas le verbe.'),
(11, 3, 'Which word fits gap (3)?', '["outright","entirely","already","instead"]', 'outright', '« A failure outright » = un échec pur et simple. Le mot prépare la nuance qui suit le point-virgule.'),

(12, 1, 'What is the editorial''s main criticism?', '["Confidence exceeds the evidence","The framework is wrong","The pilots were dishonest","The costs are too high"]', 'Confidence exceeds the evidence', 'L''éditorial dit explicitement « None of this makes the framework wrong ». Il vise l''excès de confiance, pas le dispositif.'),
(12, 2, 'What does Dr Okonjo concede?', '["The limits of the pilot data","That the framework failed","That the trials were biased","Nothing at all"]', 'The limits of the pilot data', '« Right about the limits » : elle accorde le premier point pour mieux contester le second. Concéder pour mieux réfuter est une manœuvre de registre soutenu.'),
(12, 3, 'Where do the two authors actually disagree?', '["On what the pilot data implies","On how long the pilots lasted","On the cost of the framework","On who funded the research"]', 'On what the pilot data implies', 'Les deux s''accordent sur les FAITS — des essais courts, en conditions favorables. Le désaccord porte sur ce qu''on peut en conclure. Repérer qu''un désaccord est interprétatif et non factuel est une compétence de niveau C2.');
