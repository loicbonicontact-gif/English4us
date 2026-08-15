-- ============================================
-- SEED — LinguaFree
-- 30 leçons (A1 -> C2), 3 exercices par leçon.
-- Rejouable : on vide d'abord les tables de contenu.
-- À exécuter dans Supabase SQL Editor APRÈS schema.sql
-- ============================================

truncate table exercises restart identity cascade;
truncate table lessons restart identity cascade;

-- ============================================
-- LEÇONS (l'ordre d'insertion fixe les id 1..30)
-- ============================================
insert into lessons (level, unit_order, title, theme, xp_reward) values
  ('A1', 1, 'Se présenter',                        'basics',      10),
  ('A1', 2, 'La famille',                          'family',      10),
  ('A1', 3, 'Les nombres et l''heure',             'numbers',     10),
  ('A1', 4, 'Nourriture et boissons',              'food',        10),
  ('A1', 5, 'Verbes essentiels (be, have, do)',    'grammar',     15),
  ('A2', 1, 'Le passé simple',                     'grammar',     15),
  ('A2', 2, 'Voyages et directions',               'travel',      15),
  ('A2', 3, 'Achats et argent',                    'shopping',    15),
  ('A2', 4, 'Décrire son quotidien',               'routine',     15),
  ('A2', 5, 'Le futur (will / going to)',          'grammar',     20),
  ('B1', 1, 'Exprimer une opinion',                'opinion',     20),
  ('B1', 2, 'Le monde du travail',                 'work',        20),
  ('B1', 3, 'Present perfect',                     'grammar',     20),
  ('B1', 4, 'Santé et bien-être',                  'health',      20),
  ('B1', 5, 'Comparatifs et superlatifs',          'grammar',     25),
  ('B2', 1, 'Débattre et argumenter',              'debate',      25),
  ('B2', 2, 'Conditionnels (1st, 2nd)',            'grammar',     25),
  ('B2', 3, 'Environnement et société',            'society',     25),
  ('B2', 4, 'Voix passive',                        'grammar',     25),
  ('B2', 5, 'Anglais professionnel',               'business',    30),
  ('C1', 1, 'Nuances et registres de langue',      'nuance',      30),
  ('C1', 2, 'Conditionnels avancés (3rd, mixed)',  'grammar',     30),
  ('C1', 3, 'Actualités et médias',                'media',       30),
  ('C1', 4, 'Expressions idiomatiques',            'idioms',      30),
  ('C1', 5, 'Rédaction argumentative',             'writing',     35),
  ('C2', 1, 'Registres académiques et littéraires','academic',    35),
  ('C2', 2, 'Subtilités phonétiques et accents',   'phonetics',   35),
  ('C2', 3, 'Négociation et diplomatie',           'negotiation', 35),
  ('C2', 4, 'Humour, ironie et sous-entendus',     'humor',       35),
  ('C2', 5, 'Maîtrise totale : synthèse',          'mastery',     40);

-- ============================================
-- EXERCICES
-- options : tableau JSON (uniquement pour les QCM)
-- correct_answer : doit correspondre exactement à une option pour les QCM
-- ============================================

-- ---------- A1.1 Se présenter ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(1, 'qcm', 'Comment dit-on « Je m''appelle Marie » ?', '["My name is Marie","I name Marie","Me call Marie","I am call Marie"]', 'My name is Marie', 'On utilise « My name is… ». Le verbe « call » demanderait la forme passive : « I am called Marie ».'),
(1, 'trous', 'Complète : « Hello, ___ are you? » (Bonjour, comment vas-tu ?)', null, 'how', '« How are you? » est la question standard. Attention à ne pas confondre avec « what », qui interroge sur une chose.'),
(1, 'traduction', 'Traduis en anglais : « J''ai vingt ans. »', null, 'I am twenty years old', 'Piège classique : en anglais on **est** un âge (I am), on ne l''**a** pas comme en français.');

-- ---------- A1.2 La famille ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(2, 'qcm', 'Comment appelle-t-on la sœur de ton père ?', '["My aunt","My niece","My cousin","My sister"]', 'My aunt', '« Aunt » = tante. « Niece » = nièce, « cousin » = cousin(e).'),
(2, 'trous', 'Complète : « My ___ are John and Mary. » (Mes parents s''appellent John et Mary.)', null, 'parents', '« Parents » en anglais désigne uniquement le père et la mère, jamais la famille élargie.'),
(2, 'traduction', 'Traduis en anglais : « Elle a deux frères. »', null, 'She has two brothers', 'Avec « she », le verbe « have » devient « has » à la 3ᵉ personne du singulier.');

-- ---------- A1.3 Les nombres et l'heure ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(3, 'qcm', 'Quelle heure est-il ? — 7:30', '["It is half past seven","It is seven and half","It is half to seven","It is thirty past seven"]', 'It is half past seven', '« Half past » = et demie. Pour 7:45 on dirait « a quarter to eight ».'),
(3, 'trous', 'Écris le nombre en lettres : 15 → ___', null, 'fifteen', 'Attention : « fifteen » (15) et « fifty » (50) se confondent facilement à l''oral. L''accent tonique diffère.'),
(3, 'traduction', 'Traduis en anglais : « Le train part à neuf heures. »', null, 'The train leaves at nine o''clock', 'On utilise « at » pour une heure précise, contrairement à « in » pour un mois ou une année.');

-- ---------- A1.4 Nourriture et boissons ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(4, 'qcm', 'Comment dit-on « du pain » ?', '["Some bread","A bread","Some breads","One bread"]', 'Some bread', '« Bread » est indénombrable : pas d''article « a », pas de pluriel. On dit « a loaf of bread » pour une miche.'),
(4, 'trous', 'Complète : « I would like ___ glass of water. »', null, 'a', '« Glass » est dénombrable, donc « a glass ». C''est l''eau qui est indénombrable, pas le verre.'),
(4, 'traduction', 'Traduis en anglais : « Je n''aime pas le café. »', null, 'I do not like coffee', 'Au présent simple négatif, on utilise « do not » (ou « don''t ») + verbe à la base.');

-- ---------- A1.5 Verbes essentiels ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(5, 'qcm', 'Choisis la forme correcte : « She ___ a new car. »', '["has","have","haves","is have"]', 'has', 'À la 3ᵉ personne du singulier (he/she/it), « have » devient « has ».'),
(5, 'trous', 'Complète : « They ___ students. » (Ils sont étudiants.)', null, 'are', 'Le verbe « be » au présent : I am, you are, he/she/it is, we/you/they are.'),
(5, 'traduction', 'Traduis en anglais : « Est-ce que tu parles anglais ? »', null, 'Do you speak English', 'La question au présent simple se forme avec l''auxiliaire « do » placé devant le sujet.');

-- ---------- A2.1 Le passé simple ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(6, 'qcm', 'Quel est le prétérit de « go » ?', '["went","goed","gone","goes"]', 'went', '« Go » est irrégulier : go / went / gone. « Gone » est le participe passé, pas le prétérit.'),
(6, 'trous', 'Complète : « Yesterday I ___ a great film. » (voir)', null, 'saw', '« See » est irrégulier : see / saw / seen. « Yesterday » impose le prétérit.'),
(6, 'traduction', 'Traduis en anglais : « Il n''est pas venu hier. »', null, 'He did not come yesterday', 'Au prétérit négatif, « did » porte le passé : le verbe principal revient à sa forme de base (« come », pas « came »).');

-- ---------- A2.2 Voyages et directions ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(7, 'qcm', 'Comment demander son chemin poliment ?', '["Excuse me, how do I get to the station?","Where station?","You tell me the station","I want the station now"]', 'Excuse me, how do I get to the station?', '« Excuse me » + question indirecte : c''est la formule polie standard.'),
(7, 'trous', 'Complète : « Turn ___ at the traffic lights. » (à gauche)', null, 'left', '« Left » = gauche, « right » = droite. Attention, « right » signifie aussi « correct ».'),
(7, 'traduction', 'Traduis en anglais : « L''hôtel est en face de la gare. »', null, 'The hotel is opposite the station', '« Opposite » = en face de. « In front of » signifie plutôt « devant ».');

-- ---------- A2.3 Achats et argent ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(8, 'qcm', 'Comment demander le prix ?', '["How much is it?","How many is it?","What price it?","How cost it?"]', 'How much is it?', '« How much » pour une quantité indénombrable comme l''argent ; « how many » pour ce qui se compte.'),
(8, 'trous', 'Complète : « These shoes are too ___. I cannot afford them. » (chères)', null, 'expensive', '« Expensive » = cher. Le contraire est « cheap ».'),
(8, 'traduction', 'Traduis en anglais : « Je voudrais payer par carte. »', null, 'I would like to pay by card', '« By card », « by cash » : on utilise « by » pour le moyen de paiement.');

-- ---------- A2.4 Décrire son quotidien ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(9, 'qcm', 'Où placer l''adverbe ? « I ___ get up at seven. » (toujours)', '["always","all times","every always","the always"]', 'always', 'Les adverbes de fréquence se placent avant le verbe principal, mais après « be ».'),
(9, 'trous', 'Complète : « She ___ to work by bus every day. »', null, 'goes', 'Présent simple, 3ᵉ personne du singulier : on ajoute -es à « go ».'),
(9, 'traduction', 'Traduis en anglais : « Je me lève tôt le matin. »', null, 'I get up early in the morning', '« In the morning » avec l''article, contrairement au français « le matin ».');

-- ---------- A2.5 Le futur ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(10, 'qcm', 'Regarde ces nuages ! « It ___ rain. »', '["is going to","will","would","is willing to"]', 'is going to', '« Going to » exprime une prédiction fondée sur un indice visible. « Will » servirait pour une décision spontanée.'),
(10, 'trous', 'Complète : « The phone is ringing. I ___ answer it! »', null, 'will', 'Décision prise à l''instant même : c''est le domaine de « will », pas de « going to ».'),
(10, 'traduction', 'Traduis en anglais : « Nous allons déménager le mois prochain. »', null, 'We are going to move next month', 'Projet déjà décidé : « going to ». Noter « next month » sans article.');

-- ---------- B1.1 Exprimer une opinion ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(11, 'qcm', 'Quelle formule nuance le mieux un désaccord ?', '["I see your point, but…","You are wrong.","That is stupid.","No."]', 'I see your point, but…', 'Reconnaître l''argument adverse avant d''objecter est la marque d''un registre poli en anglais.'),
(11, 'trous', 'Complète : « ___ my opinion, the film was overrated. »', null, 'In', 'L''expression figée est « in my opinion ». « At » ou « to » sont des erreurs fréquentes.'),
(11, 'traduction', 'Traduis en anglais : « Je suis tout à fait d''accord avec toi. »', null, 'I totally agree with you', '« Agree » est un verbe en anglais : jamais « I am agree », qui est un calque du français.');

-- ---------- B1.2 Le monde du travail ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(12, 'qcm', 'Que signifie « to apply for a job » ?', '["Postuler à un emploi","Obtenir un emploi","Quitter un emploi","Créer un emploi"]', 'Postuler à un emploi', '« Apply for » = poser sa candidature. Obtenir se dirait « to get » ou « to land a job ».'),
(12, 'trous', 'Complète : « I have been ___ for this company since 2020. »', null, 'working', 'Present perfect continu : « have been » + verbe en -ing, pour une action commencée dans le passé et toujours en cours.'),
(12, 'traduction', 'Traduis en anglais : « Elle a été promue le mois dernier. »', null, 'She was promoted last month', 'Voix passive au prétérit : « was » + participe passé, car elle subit l''action.');

-- ---------- B1.3 Present perfect ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(13, 'qcm', 'Choisis : « I ___ to Japan three times. »', '["have been","went","have gone","am going"]', 'have been', '« Have been » = y être allé et en être revenu. « Have gone » sous-entendrait qu''on y est encore.'),
(13, 'trous', 'Complète : « She has lived here ___ 2015. »', null, 'since', '« Since » + point de départ précis ; « for » + durée (for five years).'),
(13, 'traduction', 'Traduis en anglais : « Je n''ai jamais mangé de sushi. »', null, 'I have never eaten sushi', 'Expérience de vie sans date précise : present perfect. « Eaten » est le participe passé de « eat ».');

-- ---------- B1.4 Santé et bien-être ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(14, 'qcm', 'Comment dit-on « J''ai mal à la tête » ?', '["I have a headache","I have mal at the head","My head has pain","I am headache"]', 'I have a headache', '« Headache » est un mot composé dénombrable, d''où l''article « a ».'),
(14, 'trous', 'Complète : « You should ___ a doctor. » (consulter)', null, 'see', '« To see a doctor » est l''expression idiomatique ; « consult » existe mais sonne très formel.'),
(14, 'traduction', 'Traduis en anglais : « Il devrait faire plus d''exercice. »', null, 'He should exercise more', '« Should » exprime le conseil, et est toujours suivi de la base verbale sans « to ».');

-- ---------- B1.5 Comparatifs et superlatifs ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(15, 'qcm', 'Choisis : « This book is ___ than the other one. »', '["more interesting","interestinger","most interesting","more interestinger"]', 'more interesting', 'Les adjectifs longs (3 syllabes et plus) forment leur comparatif avec « more », pas avec -er.'),
(15, 'trous', 'Complète : « She is the ___ student in the class. » (meilleure)', null, 'best', '« Good » est irrégulier : good / better / best.'),
(15, 'traduction', 'Traduis en anglais : « Ma voiture est moins rapide que la tienne. »', null, 'My car is less fast than yours', 'On accepte aussi « not as fast as yours », tournure plus naturelle en anglais courant.');

-- ---------- B2.1 Débattre et argumenter ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(16, 'qcm', 'Quel connecteur introduit une concession ?', '["Although","Because","Therefore","Moreover"]', 'Although', '« Although » = bien que. « Because » exprime la cause, « therefore » la conséquence, « moreover » l''addition.'),
(16, 'trous', 'Complète : « ___ hand, the policy could reduce costs. » (D''un autre côté : « On the ___ hand »)', null, 'other', 'Le couple figé est « on the one hand… on the other hand ».'),
(16, 'traduction', 'Traduis en anglais : « Cet argument ne tient pas debout. »', null, 'This argument does not hold up', 'On accepte aussi « does not stand up ». Traduire mot à mot par « stand straight » serait un calque fautif.');

-- ---------- B2.2 Conditionnels ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(17, 'qcm', 'Choisis : « If I ___ rich, I would travel the world. »', '["were","am","will be","would be"]', 'were', 'Conditionnel de type 2 (hypothèse irréelle) : « were » à toutes les personnes, y compris « I ».'),
(17, 'trous', 'Complète : « If it rains tomorrow, we ___ stay home. »', null, 'will', 'Conditionnel de type 1 (hypothèse réelle) : « if » + présent, puis « will » + base verbale.'),
(17, 'traduction', 'Traduis en anglais : « Si j''avais le temps, je t''aiderais. »', null, 'If I had time, I would help you', 'Type 2 : prétérit dans la subordonnée, « would » + base verbale dans la principale.');

-- ---------- B2.3 Environnement et société ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(18, 'qcm', 'Que signifie « climate change mitigation » ?', '["L''atténuation du changement climatique","L''accélération du changement climatique","La mesure du climat","L''adaptation au climat"]', 'L''atténuation du changement climatique', '« Mitigation » = réduction des causes. À distinguer de « adaptation », qui vise les conséquences.'),
(18, 'trous', 'Complète : « We must reduce our carbon ___. » (empreinte)', null, 'footprint', '« Carbon footprint » = empreinte carbone. Le mot « print » seul ne convient pas.'),
(18, 'traduction', 'Traduis en anglais : « Les énergies renouvelables se développent rapidement. »', null, 'Renewable energy is growing rapidly', 'En anglais, « energy » est le plus souvent indénombrable, donc verbe au singulier.');

-- ---------- B2.4 Voix passive ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(19, 'qcm', 'Mets à la voix passive : « They built the bridge in 1990. »', '["The bridge was built in 1990","The bridge is built in 1990","The bridge has built in 1990","The bridge built in 1990"]', 'The bridge was built in 1990', 'Passif au prétérit : « was/were » + participe passé.'),
(19, 'trous', 'Complète : « The results will ___ announced tomorrow. »', null, 'be', 'Passif au futur : « will be » + participe passé. « Will announced » est agrammatical.'),
(19, 'traduction', 'Traduis en anglais : « Ce livre a été traduit en douze langues. »', null, 'This book has been translated into twelve languages', 'Passif au present perfect : « has been » + participe passé. Noter « into » et non « in ».');

-- ---------- B2.5 Anglais professionnel ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(20, 'qcm', 'Quelle formule clôt le mieux un email formel ?', '["Kind regards,","Bye!","See ya,","Love,"]', 'Kind regards,', '« Kind regards » ou « Best regards » conviennent au registre professionnel. Les autres sont familiers ou affectifs.'),
(20, 'trous', 'Complète : « Please find ___ the report you requested. » (ci-joint)', null, 'attached', '« Please find attached » est la formule consacrée pour une pièce jointe.'),
(20, 'traduction', 'Traduis en anglais : « Pourriez-vous confirmer votre disponibilité ? »', null, 'Could you confirm your availability', '« Could you » marque une demande polie, plus douce que « can you ».');

-- ---------- C1.1 Nuances et registres ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(21, 'qcm', 'Lequel appartient au registre le plus soutenu ?', '["I would be grateful if you could…","Can you…?","Gimme…","I need you to…"]', 'I would be grateful if you could…', 'Le conditionnel et la nominalisation marquent le registre formel en anglais comme en français.'),
(21, 'trous', 'Complète : « The evidence is ___ conclusive. » (loin d''être : « far ___ »)', null, 'from', '« Far from conclusive » = loin d''être concluant. C''est une locution figée.'),
(21, 'traduction', 'Traduis en anglais : « Il a laissé entendre qu''il démissionnerait. »', null, 'He implied that he would resign', 'On accepte « hinted » pour « laissé entendre ». Noter la concordance des temps avec « would ».');

-- ---------- C1.2 Conditionnels avancés ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(22, 'qcm', 'Choisis : « If I ___ harder, I would have passed. »', '["had studied","studied","would study","have studied"]', 'had studied', 'Type 3 (regret sur le passé) : « had » + participe passé, puis « would have » + participe passé.'),
(22, 'trous', 'Complète : « If she had taken the job, she ___ be living in Berlin now. »', null, 'would', 'Conditionnel mixte : condition passée, conséquence présente. D''où « would » sans « have ».'),
(22, 'traduction', 'Traduis en anglais : « Si tu m''avais prévenu, je serais venu. »', null, 'If you had told me, I would have come', 'Type 3 pur : les deux propositions renvoient à un passé non réalisé.');

-- ---------- C1.3 Actualités et médias ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(23, 'qcm', 'Que signifie « to break a story » en journalisme ?', '["Révéler une information en premier","Démentir une information","Censurer un article","Résumer un article"]', 'Révéler une information en premier', '« Breaking news » vient de là : une nouvelle qui vient d''éclater.'),
(23, 'trous', 'Complète : « The article is heavily ___. » (biaisé)', null, 'biased', '« Biased » = biaisé, partial. Le nom correspondant est « bias ».'),
(23, 'traduction', 'Traduis en anglais : « Cette information n''a pas été recoupée. »', null, 'This information has not been cross-checked', '« Cross-check » = recouper. « Fact-check » désigne plutôt la vérification des faits énoncés.');

-- ---------- C1.4 Expressions idiomatiques ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(24, 'qcm', 'Que signifie « to bite the bullet » ?', '["Prendre son courage à deux mains","Manger trop vite","Se taire","Rater une occasion"]', 'Prendre son courage à deux mains', 'L''expression évoque le fait d''affronter une épreuve pénible mais inévitable.'),
(24, 'trous', 'Complète : « It is raining cats and ___. »', null, 'dogs', '« Raining cats and dogs » = pleuvoir des cordes. L''ordre des mots est figé.'),
(24, 'traduction', 'Traduis en anglais : « Ça ne me dit rien qui vaille. »', null, 'I have a bad feeling about this', 'Les idiomes se traduisent par équivalence de sens, jamais mot à mot.');

-- ---------- C1.5 Rédaction argumentative ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(25, 'qcm', 'Quel connecteur introduit le mieux une conclusion ?', '["All things considered","For instance","Namely","In addition"]', 'All things considered', '« All things considered » = tout bien considéré. Les autres introduisent un exemple, une précision ou un ajout.'),
(25, 'trous', 'Complète : « The data ___ that the trend is reversing. » (suggère)', null, 'suggests', 'En anglais courant, « data » est traité comme un singulier ; « suggest » resterait correct en registre scientifique strict.'),
(25, 'traduction', 'Traduis en anglais : « Cette thèse mérite d''être nuancée. »', null, 'This argument needs to be qualified', '« To qualify » signifie ici nuancer, apporter des réserves — un faux ami fréquent.');

-- ---------- C2.1 Registres académiques ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(26, 'qcm', 'Quel terme est le plus soutenu pour « montrer » ?', '["To demonstrate","To show","To point out","To tell"]', 'To demonstrate', '« Demonstrate » relève du registre académique ; « show » est neutre, « tell » familier.'),
(26, 'trous', 'Complète : « The findings are ___ with previous research. » (cohérents)', null, 'consistent', '« Consistent with » = en accord avec. Faux ami : ce n''est pas « consistant » au sens de nourrissant.'),
(26, 'traduction', 'Traduis en anglais : « Cette étude remet en question les conclusions antérieures. »', null, 'This study challenges previous conclusions', '« To challenge » = remettre en question. « Question » comme verbe fonctionne aussi.');

-- ---------- C2.2 Phonétique ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(27, 'qcm', 'Où tombe l''accent tonique dans « photographer » ?', '["pho-TO-gra-pher","PHO-to-gra-pher","pho-to-GRA-pher","pho-to-gra-PHER"]', 'pho-TO-gra-pher', 'L''accent se déplace selon le suffixe : PHOtograph, phoTOgrapher, photoGRAPHic.'),
(27, 'trous', 'Quel mot rime avec « though » ? ___ (indice : pâte à pain)', null, 'dough', '« Though » et « dough » riment en /əʊ/, alors que « tough » se prononce /tʌf/.'),
(27, 'traduction', 'Traduis en anglais : « Son accent trahit ses origines. »', null, 'His accent gives away his origins', '« To give away » = trahir, révéler involontairement. On accepte aussi « betrays ».');

-- ---------- C2.3 Négociation ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(28, 'qcm', 'Que signifie « to meet someone halfway » ?', '["Trouver un compromis","Arriver en retard","Refuser de négocier","Rencontrer quelqu''un en chemin"]', 'Trouver un compromis', 'Littéralement « se retrouver à mi-chemin » : chacun fait la moitié du trajet.'),
(28, 'trous', 'Complète : « We are prepared to make some ___. » (concessions)', null, 'concessions', 'Le mot est identique en anglais, mais attention à la prononciation : /kənˈseʃənz/.'),
(28, 'traduction', 'Traduis en anglais : « Nous ne céderons pas sur ce point. »', null, 'We will not give way on this point', 'On accepte « back down » ou « budge ». « Give way » est le plus neutre en contexte de négociation.');

-- ---------- C2.4 Humour et ironie ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(29, 'qcm', 'Que traduit « Well, that went well. » après un échec évident ?', '["De l''ironie","De la satisfaction","De la surprise","De la colère"]', 'De l''ironie', 'L''écart entre l''énoncé et la situation crée l''ironie — ressort central de l''humour britannique.'),
(29, 'trous', 'Complète : « He has a very ___ sense of humour. » (pince-sans-rire)', null, 'dry', '« Dry humour » = humour pince-sans-rire, délivré sans changer d''expression.'),
(29, 'traduction', 'Traduis en anglais : « Il l''a dit avec un clin d''œil. »', null, 'He said it tongue in cheek', 'Littéralement « la langue dans la joue » : signale qu''on ne parle pas sérieusement.');

-- ---------- C2.5 Synthèse ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(30, 'qcm', 'Laquelle de ces phrases est parfaitement idiomatique ?', '["Had I known, I would have acted differently.","If I would have known, I would act different.","If I knew it, I would have act differently.","Would I have known, I acted different."]', 'Had I known, I would have acted differently.', 'Inversion sans « if » : tournure soutenue et parfaitement correcte du conditionnel de type 3.'),
(30, 'trous', 'Complète : « ___ than not, the simplest explanation is correct. » (le plus souvent)', null, 'More often', '« More often than not » = le plus souvent, la plupart du temps.'),
(30, 'traduction', 'Traduis en anglais : « Rien ne saurait justifier une telle décision. »', null, 'Nothing could justify such a decision', 'Noter « such a » + nom singulier dénombrable, et non « such decision ».');
