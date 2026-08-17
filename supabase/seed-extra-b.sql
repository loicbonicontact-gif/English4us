-- ============================================
-- SEED COMPLEMENTAIRE B — English4us
-- Ajoute 6 exercices aux leçons 11 à 20 (niveaux B1 et B2).
-- À exécuter dans Supabase SQL Editor APRES seed.sql
-- ============================================

-- ATTENTION — cette suppression a deja efface du contenu par le passe.
-- Elle ne garde que les 3 exercices d'origine de chaque lecon, donc elle
-- effacait les dictees, les exercices oraux et le vocabulaire si ce script
-- etait relance apres eux. Les trois familles sont desormais protegees
-- explicitement, et le comptage des « 3 premiers » les ignore aussi.
delete from exercises
where lesson_id between 11 and 20
  and type not in ('ecoute', 'oral')
  and coalesce(explanation, '') not like '%[voc]'
  and id not in (
    select id from (
      select id, row_number() over (partition by lesson_id order by id) as rang
      from exercises
      where lesson_id between 11 and 20
        and type not in ('ecoute', 'oral')
        and coalesce(explanation, '') not like '%[voc]'
    ) t where rang <= 3
  );

-- ---------- B1.1 Exprimer une opinion ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(11, 'qcm', 'Quelle formule exprime un doute poli ?', '["I am not so sure about that.","You are completely wrong.","That makes no sense.","Nonsense."]', 'I am not so sure about that.', 'La litote est très employée en anglais : dire moins pour dire autant.'),
(11, 'trous', 'Complète : « As far as I am ___, the plan is risky. » (en ce qui me concerne)', null, 'concerned', 'Locution figée : « as far as I am concerned ».'),
(11, 'traduction', 'Traduis en anglais : « Je ne suis pas d''accord avec cette décision. »', null, 'I do not agree with this decision / I disagree with this decision', 'Rappel : « agree » est un verbe. Jamais « I am not agree ».'),
(11, 'qcm', 'Que signifie « to have second thoughts » ?', '["Avoir des doutes","Réfléchir vite","Changer de sujet","Avoir deux idées"]', 'Avoir des doutes', 'Littéralement « des deuxièmes pensées » : commencer à douter d''une décision.'),
(11, 'trous', 'Complète : « It seems ___ me that we need more time. »', null, 'to', '« It seems to me that… » introduit une opinion nuancée.'),
(11, 'traduction', 'Traduis en anglais : « À mon avis, c''est une erreur. »', null, 'In my opinion, it is a mistake', 'Noter « in my opinion », jamais « at my opinion ».');

-- ---------- B1.2 Le monde du travail ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(12, 'qcm', 'Que signifie « a deadline » ?', '["Une date limite","Une ligne morte","Un licenciement","Une pause"]', 'Une date limite', '« Deadline » = échéance. Le mot est passé tel quel en français.'),
(12, 'trous', 'Complète : « I have a job ___ on Monday. » (entretien)', null, 'interview', '« Job interview » = entretien d''embauche.'),
(12, 'traduction', 'Traduis en anglais : « Je travaille dans une petite entreprise. »', null, 'I work for a small company / I work in a small company', '« Work for » souligne l''employeur, « work in » le lieu ou le secteur.'),
(12, 'qcm', 'Que signifie « to be laid off » ?', '["Être licencié économiquement","Être promu","Être en congé","Être en retard"]', 'Être licencié économiquement', 'À distinguer de « to be fired », qui suppose une faute.'),
(12, 'trous', 'Complète : « She is in ___ of the marketing team. » (responsable)', null, 'charge', '« In charge of » = responsable de.'),
(12, 'traduction', 'Traduis en anglais : « Il faut respecter les délais. »', null, 'We must meet the deadlines / We have to meet the deadlines', 'On « rencontre » une échéance en anglais : « meet a deadline », jamais « respect ».');

-- ---------- B1.3 Present perfect ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(13, 'qcm', 'Choisis : « I ___ my keys. I cannot find them. »', '["have lost","lost","was losing","had lost"]', 'have lost', 'Le résultat compte encore maintenant : present perfect.'),
(13, 'trous', 'Complète : « Have you ___ finished? » (déjà)', null, 'already', '« Already » dans une question exprime la surprise. « Yet » en fin de phrase serait neutre.'),
(13, 'traduction', 'Traduis en anglais : « Je travaille ici depuis cinq ans. »', null, 'I have worked here for five years / I have been working here for five years', 'Le français emploie le présent, l''anglais le present perfect. Erreur très fréquente.'),
(13, 'qcm', 'Quelle phrase est correcte ?', '["I saw him yesterday.","I have seen him yesterday.","I have saw him yesterday.","I seen him yesterday."]', 'I saw him yesterday.', 'Une date passée précise interdit le present perfect : prétérit obligatoire.'),
(13, 'trous', 'Complète : « She has not called me ___. » (encore)', null, 'yet', '« Yet » se place en fin de phrase négative ou interrogative.'),
(13, 'traduction', 'Traduis en anglais : « As-tu déjà visité Londres ? »', null, 'Have you ever visited London', '« Ever » = à un moment quelconque de ta vie. Expérience sans date : present perfect.');

-- ---------- B1.4 Santé et bien-être ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(14, 'qcm', 'Que signifie « to feel under the weather » ?', '["Être un peu malade","Avoir froid","Être déprimé par la pluie","Être fatigué du voyage"]', 'Être un peu malade', 'Expression idiomatique : se sentir patraque, sans gravité.'),
(14, 'trous', 'Complète : « I need to make an ___ with the doctor. » (rendez-vous)', null, 'appointment', '« Appointment » pour un rendez-vous professionnel ou médical. « Date » serait un rendez-vous galant.'),
(14, 'traduction', 'Traduis en anglais : « Je suis enrhumé. »', null, 'I have a cold', 'On « a » un rhume en anglais : « have a cold », jamais « I am cold » (= j''ai froid).'),
(14, 'qcm', 'Choisis : « You ___ see a doctor. » (conseil ferme)', '["should","would","could","might"]', 'should', '« Should » = conseil. « Could » n''exprimerait qu''une possibilité.'),
(14, 'trous', 'Complète : « Getting enough ___ is essential. » (sommeil)', null, 'sleep', '« Sleep » est indénombrable dans ce sens : jamais « sleeps ».'),
(14, 'traduction', 'Traduis en anglais : « Il faut manger équilibré. »', null, 'You should eat a balanced diet / We should eat a balanced diet', '« Diet » signifie ici alimentation en général, pas seulement un régime amaigrissant.');

-- ---------- B1.5 Comparatifs et superlatifs ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(15, 'qcm', 'Choisis : « This exercise is ___ than the last one. »', '["easier","more easy","easyer","most easy"]', 'easier', 'Adjectif court en -y : le y devient i, puis on ajoute -er.'),
(15, 'trous', 'Complète : « She is as tall ___ her brother. »', null, 'as', 'Comparatif d''égalité : « as… as… ».'),
(15, 'traduction', 'Traduis en anglais : « C''est le plus beau jour de ma vie. »', null, 'It is the best day of my life / This is the best day of my life', '« Good » est irrégulier : good / better / best.'),
(15, 'qcm', 'Quelle phrase est correcte ?', '["He is the most intelligent student.","He is the intelligentest student.","He is more intelligent student.","He is most intelligent student."]', 'He is the most intelligent student.', 'Adjectif long : « the most » + adjectif. L''article défini est obligatoire.'),
(15, 'trous', 'Complète : « The ___ you practise, the better you get. » (plus)', null, 'more', 'Structure « the more…, the better… » : plus on fait X, plus il arrive Y.'),
(15, 'traduction', 'Traduis en anglais : « Ce livre est moins intéressant que le film. »', null, 'This book is less interesting than the film / This book is not as interesting as the film', '« Not as… as… » est plus naturel à l''oral que « less ».');

-- ---------- B2.1 Débattre et argumenter ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(16, 'qcm', 'Quel connecteur exprime la conséquence ?', '["Consequently","However","Although","Nevertheless"]', 'Consequently', 'Les trois autres marquent une opposition.'),
(16, 'trous', 'Complète : « The data is limited. ___, the trend is clear. » (néanmoins)', null, 'Nevertheless', '« Nevertheless » concède un point tout en maintenant sa position.'),
(16, 'traduction', 'Traduis en anglais : « Je comprends ton point de vue, mais je ne le partage pas. »', null, 'I understand your point of view, but I do not share it', '« Point of view » ou simplement « point ». « Share » convient pour une opinion.'),
(16, 'qcm', 'Que signifie « to play devil''s advocate » ?', '["Défendre la thèse adverse pour tester l''argument","Mentir sciemment","Refuser de débattre","Changer d''avis"]', 'Défendre la thèse adverse pour tester l''argument', 'Se faire l''avocat du diable : soutenir une position qu''on ne partage pas, pour éprouver le raisonnement.'),
(16, 'trous', 'Complète : « That is beside the ___. » (hors sujet)', null, 'point', '« Beside the point » = à côté de la question.'),
(16, 'traduction', 'Traduis en anglais : « Cet argument manque de preuves. »', null, 'This argument lacks evidence', '« Evidence » est indénombrable : jamais « evidences ».');

-- ---------- B2.2 Conditionnels ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(17, 'qcm', 'Choisis : « If you heat water to 100°C, it ___. » (vérité générale)', '["boils","will boil","would boil","boiled"]', 'boils', 'Conditionnel de type zéro : présent dans les deux propositions, pour une loi générale.'),
(17, 'trous', 'Complète : « I would go if I ___ time. »', null, 'had', 'Type 2 : prétérit dans la subordonnée en « if ».'),
(17, 'traduction', 'Traduis en anglais : « Si tu étudies, tu réussiras. »', null, 'If you study, you will pass / If you study, you will succeed', 'Type 1 : « if » + présent, puis « will ». Jamais « if you will study ».'),
(17, 'qcm', 'Quelle phrase est correcte ?', '["If I were you, I would accept.","If I was you, I would accept.","If I am you, I would accept.","If I would be you, I accept."]', 'If I were you, I would accept.', 'Dans le conseil hypothétique, « were » s''emploie à toutes les personnes.'),
(17, 'trous', 'Complète : « ___ you need help, call me. » (au cas où)', null, 'If', '« If » suffit ici. « In case » existe mais change légèrement le sens.'),
(17, 'traduction', 'Traduis en anglais : « Que ferais-tu à ma place ? »', null, 'What would you do in my place / What would you do if you were me', 'Hypothèse irréelle : « would » + base verbale.');

-- ---------- B2.3 Environnement et société ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(18, 'qcm', 'Que signifie « sustainable » ?', '["Durable","Soutenable moralement","Supportable","Substantiel"]', 'Durable', 'Faux ami fréquent : « sustainable development » = développement durable.'),
(18, 'trous', 'Complète : « We must cut greenhouse gas ___. » (émissions)', null, 'emissions', '« Emissions » s''emploie au pluriel dans ce contexte.'),
(18, 'traduction', 'Traduis en anglais : « Le recyclage devrait être obligatoire. »', null, 'Recycling should be compulsory / Recycling should be mandatory', '« Compulsory » (britannique) ou « mandatory » (américain).'),
(18, 'qcm', 'Que signifie « a landfill » ?', '["Une décharge","Un terrain rempli","Un remblai","Une réserve naturelle"]', 'Une décharge', 'Site d''enfouissement des déchets.'),
(18, 'trous', 'Complète : « Air pollution ___ public health. » (met en danger)', null, 'threatens', '« Threaten » = menacer, mettre en péril.'),
(18, 'traduction', 'Traduis en anglais : « Il faut sensibiliser le public. »', null, 'We must raise public awareness', '« Raise awareness » est l''expression consacrée pour sensibiliser.');

-- ---------- B2.4 Voix passive ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(19, 'qcm', 'Mets au passif : « Someone stole my bike. »', '["My bike was stolen.","My bike is stolen.","My bike has stolen.","My bike stole."]', 'My bike was stolen.', 'Quand l''auteur est inconnu, on l''omet : c''est l''usage principal du passif.'),
(19, 'trous', 'Complète : « This bridge ___ built in 1890. »', null, 'was', 'Passif au prétérit : « was » + participe passé.'),
(19, 'traduction', 'Traduis en anglais : « On parle anglais ici. »', null, 'English is spoken here', 'Le « on » impersonnel français se rend souvent par un passif en anglais.'),
(19, 'qcm', 'Choisis : « The report ___ being written now. »', '["is","was","has","will"]', 'is', 'Passif au présent progressif : « is being » + participe passé.'),
(19, 'trous', 'Complète : « The letter was written ___ my sister. » (par)', null, 'by', '« By » introduit l''auteur de l''action au passif.'),
(19, 'traduction', 'Traduis en anglais : « La réunion a été annulée. »', null, 'The meeting was cancelled / The meeting has been cancelled', 'Britannique : « cancelled » avec deux L. Américain : « canceled ».');

-- ---------- B2.5 Anglais professionnel ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(20, 'qcm', 'Comment ouvrir un email formel sans connaître le destinataire ?', '["Dear Sir or Madam,","Hey there,","Hello you,","To whom,"]', 'Dear Sir or Madam,', '« To whom it may concern » convient aussi, mais est plus impersonnel.'),
(20, 'trous', 'Complète : « I look forward to ___ from you. » (avoir de vos nouvelles)', null, 'hearing', 'Après « look forward to », le verbe prend -ing : « to » est ici une préposition.'),
(20, 'traduction', 'Traduis en anglais : « Merci de votre réponse rapide. »', null, 'Thank you for your prompt reply / Thank you for your quick reply', '« Prompt » relève du registre professionnel.'),
(20, 'qcm', 'Que signifie « Let us touch base next week » ?', '["Reprenons contact la semaine prochaine","Changeons de base","Repartons de zéro","Réservons une salle"]', 'Reprenons contact la semaine prochaine', 'Expression très courante en entreprise, empruntée au baseball.'),
(20, 'trous', 'Complète : « Please do not ___ to contact me. » (hésitez)', null, 'hesitate', 'Formule figée : « please do not hesitate to contact me ».'),
(20, 'traduction', 'Traduis en anglais : « Je vous joins le compte rendu. »', null, 'Please find attached the minutes / I am attaching the minutes', '« Minutes » = compte rendu de réunion, toujours au pluriel.');
