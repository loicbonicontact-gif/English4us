-- ============================================
-- SEED COMPLEMENTAIRE C — English4us
-- Ajoute 6 exercices aux leçons 21 à 30 (niveaux C1 et C2).
-- À exécuter dans Supabase SQL Editor APRES seed.sql
-- ============================================

-- ATTENTION — cette suppression a deja efface du contenu par le passe.
-- Elle ne garde que les 3 exercices d'origine de chaque lecon, donc elle
-- effacait les dictees, les exercices oraux et le vocabulaire si ce script
-- etait relance apres eux. Les trois familles sont desormais protegees
-- explicitement, et le comptage des « 3 premiers » les ignore aussi.
delete from exercises
where lesson_id between 21 and 30
  and type not in ('ecoute', 'oral')
  and coalesce(explanation, '') not like '%[voc]'
  and id not in (
    select id from (
      select id, row_number() over (partition by lesson_id order by id) as rang
      from exercises
      where lesson_id between 21 and 30
        and type not in ('ecoute', 'oral')
        and coalesce(explanation, '') not like '%[voc]'
    ) t where rang <= 3
  );

-- ---------- C1.1 Nuances et registres ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(21, 'qcm', 'Lequel est le plus soutenu pour « commencer » ?', '["To commence","To start","To kick off","To get going"]', 'To commence', '« Commence » relève du registre officiel. « Kick off » est familier.'),
(21, 'trous', 'Complète : « The results were, to say the ___, disappointing. » (le moins qu''on puisse dire)', null, 'least', '« To say the least » = c''est un euphémisme.'),
(21, 'traduction', 'Traduis en anglais : « Ce n''est pas sans intérêt. »', null, 'It is not without interest', 'La double négation atténue l''éloge : figure très fréquente en anglais soutenu.'),
(21, 'qcm', 'Que sous-entend « That is an interesting idea… » avec une hésitation ?', '["Un désaccord poli","Un enthousiasme sincère","Une demande de détails","Une approbation totale"]', 'Un désaccord poli', 'L''anglais britannique atténue le refus. Le ton et la pause portent le sens réel.'),
(21, 'trous', 'Complète : « I would ___ say it is impossible. » (n''irais pas jusqu''à)', null, 'not', '« I would not say » atténue une affirmation trop tranchée.'),
(21, 'traduction', 'Traduis en anglais : « Je me permets de vous contredire. »', null, 'If I may, I would disagree / I beg to differ', '« I beg to differ » est la formule consacrée, très soutenue.');

-- ---------- C1.2 Conditionnels avancés ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(22, 'qcm', 'Choisis : « ___ it not been for your help, I would have failed. »', '["Had","If","Would","Should"]', 'Had', 'Inversion sans « if » : tournure soutenue du type 3.'),
(22, 'trous', 'Complète : « I wish I ___ told her the truth. » (regret sur le passé)', null, 'had', '« Wish » + plus-que-parfait exprime le regret d''un fait passé.'),
(22, 'traduction', 'Traduis en anglais : « Si seulement je l''avais su plus tôt. »', null, 'If only I had known earlier', '« If only » renforce le regret par rapport à « I wish ».'),
(22, 'qcm', 'Quel type de conditionnel : « If I had studied medicine, I would be a doctor now » ?', '["Mixte","Type 1","Type 2","Type 3 pur"]', 'Mixte', 'Condition dans le passé, conséquence dans le présent : conditionnel mixte.'),
(22, 'trous', 'Complète : « ___ you require assistance, please let us know. » (registre formel)', null, 'Should', '« Should you… » remplace « if you… » en registre soutenu.'),
(22, 'traduction', 'Traduis en anglais : « Il aurait dû nous prévenir. »', null, 'He should have told us / He should have warned us', '« Should have » + participe passé exprime le reproche.');

-- ---------- C1.3 Actualités et médias ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(23, 'qcm', 'Que signifie « an outlet » dans « a media outlet » ?', '["Un organe de presse","Une prise électrique","Un magasin d''usine","Une sortie"]', 'Un organe de presse', 'Le mot a plusieurs sens : ici, un média.'),
(23, 'trous', 'Complète : « The story went ___. » (est devenue virale)', null, 'viral', '« To go viral » = se propager massivement.'),
(23, 'traduction', 'Traduis en anglais : « Cette source n''est pas fiable. »', null, 'This source is not reliable / This source is unreliable', '« Reliable » = fiable. « Trustworthy » convient aussi pour une personne.'),
(23, 'qcm', 'Que signifie « a headline » ?', '["Un titre d''article","Une ligne éditoriale","Un éditorial","Une une de couverture"]', 'Un titre d''article', '« Headline » = le titre. La une se dit « the front page ».'),
(23, 'trous', 'Complète : « The minister ___ the accusations. » (a démenti)', null, 'denied', '« Deny » = démentir. « Refuse » signifierait refuser.'),
(23, 'traduction', 'Traduis en anglais : « Cette information a été démentie. »', null, 'This information has been denied / This report has been denied', 'Attention : « information » est indénombrable, jamais « informations ».');

-- ---------- C1.4 Expressions idiomatiques ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(24, 'qcm', 'Que signifie « to let the cat out of the bag » ?', '["Vendre la mèche","Libérer quelqu''un","Prendre un risque","Faire une bêtise"]', 'Vendre la mèche', 'Révéler un secret, souvent par maladresse.'),
(24, 'trous', 'Complète : « It costs an arm and a ___. » (les yeux de la tête)', null, 'leg', '« An arm and a leg » = extrêmement cher.'),
(24, 'traduction', 'Traduis en anglais : « Ce n''est pas la mer à boire. »', null, 'It is not rocket science / It is not that hard', 'Les idiomes se rendent par équivalence, jamais mot à mot.'),
(24, 'qcm', 'Que signifie « to beat around the bush » ?', '["Tourner autour du pot","Battre la campagne","Chercher querelle","Se cacher"]', 'Tourner autour du pot', 'Éviter d''aborder le sujet directement.'),
(24, 'trous', 'Complète : « Once in a blue ___. » (très rarement)', null, 'moon', '« Once in a blue moon » = une fois tous les trente-six du mois.'),
(24, 'traduction', 'Traduis en anglais : « Il a mis les pieds dans le plat. »', null, 'He put his foot in his mouth / He put his foot in it', 'Littéralement « il a mis le pied dans sa bouche » : commettre une bourde.');

-- ---------- C1.5 Rédaction argumentative ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(25, 'qcm', 'Quel connecteur introduit une reformulation ?', '["In other words","For example","In contrast","Meanwhile"]', 'In other words', '« In other words » reformule ce qui vient d''être dit.'),
(25, 'trous', 'Complète : « This raises the ___ of fairness. » (question)', null, 'question', '« Raise the question of » = soulever la question de.'),
(25, 'traduction', 'Traduis en anglais : « En conclusion, les preuves sont insuffisantes. »', null, 'In conclusion, the evidence is insufficient', 'Rappel : « evidence » est indénombrable, donc verbe au singulier.'),
(25, 'qcm', 'Quelle formule ouvre une objection anticipée ?', '["It could be argued that…","As shown above…","To sum up…","For instance…"]', 'It could be argued that…', 'Le passif impersonnel introduit une objection sans l''endosser.'),
(25, 'trous', 'Complète : « The argument rests ___ a false premise. » (repose sur)', null, 'on', '« Rest on » = reposer sur.'),
(25, 'traduction', 'Traduis en anglais : « Cette hypothèse mérite d''être examinée. »', null, 'This hypothesis deserves further examination / This hypothesis is worth examining', '« Worth » est suivi du verbe en -ing.');

-- ---------- C2.1 Registres académiques ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(26, 'qcm', 'Lequel convient à un article scientifique ?', '["The findings suggest that…","We totally proved that…","It is obvious that…","Everybody knows that…"]', 'The findings suggest that…', 'La prudence énonciative est la norme dans l''écrit académique.'),
(26, 'trous', 'Complète : « The sample ___ of 200 participants. » (se composait)', null, 'consisted', '« Consist of » = se composer de. Jamais « consist in » dans ce sens.'),
(26, 'traduction', 'Traduis en anglais : « Ces résultats corroborent notre hypothèse. »', null, 'These results support our hypothesis / These findings corroborate our hypothesis', '« Support » est plus courant que « corroborate » dans l''usage réel.'),
(26, 'qcm', 'Que signifie « a caveat » ?', '["Une réserve, une mise en garde","Une cavité","Une preuve","Un résumé"]', 'Une réserve, une mise en garde', 'Du latin « qu''il prenne garde ». Terme fréquent en anglais universitaire.'),
(26, 'trous', 'Complète : « Further research is ___. » (nécessaire)', null, 'needed', 'Formule de clôture quasi rituelle des articles scientifiques.'),
(26, 'traduction', 'Traduis en anglais : « Cette étude comporte plusieurs limites. »', null, 'This study has several limitations', '« Limitations » et non « limits » dans un contexte de recherche.');

-- ---------- C2.2 Phonétique ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(27, 'qcm', 'Lequel se prononce avec un /s/ et non un /z/ ?', '["house (nom)","rise","choose","please"]', 'house (nom)', 'Le nom « house » finit en /s/, mais le verbe « to house » en /z/.'),
(27, 'trous', 'Quel mot rime avec « heard » ? ___ (indice : oiseau)', null, 'bird', 'Tous deux se prononcent /ɜːd/, malgré des orthographes très différentes.'),
(27, 'traduction', 'Traduis en anglais : « Il a un accent à couper au couteau. »', null, 'He has a thick accent / He has a strong accent', '« Thick » ou « strong » pour un accent marqué. Jamais « cut with a knife ».'),
(27, 'qcm', 'Où tombe l''accent dans le verbe « to record » ?', '["re-CORD","RE-cord","les deux","aucun"]', 're-CORD', 'Règle utile : le nom s''accentue sur la 1ʳᵉ syllabe (RE-cord), le verbe sur la 2ᵉ.'),
(27, 'trous', 'Complète : la lettre muette dans « knife » est le ___', null, 'k', 'Le « k » initial de knife, knee, know est muet.'),
(27, 'traduction', 'Traduis en anglais : « Peux-tu répéter plus lentement ? »', null, 'Could you repeat that more slowly / Can you say that again more slowly', '« More slowly » : adverbe long, donc comparatif avec « more ».');

-- ---------- C2.3 Négociation ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(28, 'qcm', 'Que signifie « a deal-breaker » ?', '["Un point non négociable","Un négociateur","Une rupture de contrat","Une remise"]', 'Un point non négociable', 'Condition dont le refus fait échouer l''accord.'),
(28, 'trous', 'Complète : « Let us find some common ___. » (terrain d''entente)', null, 'ground', '« Common ground » = points d''accord.'),
(28, 'traduction', 'Traduis en anglais : « Nous sommes prêts à revoir notre offre. »', null, 'We are willing to review our offer / We are prepared to revise our offer', '« Willing to » = disposé à. Plus souple que « ready to ».'),
(28, 'qcm', 'Quelle formule maintient une position sans fermer la porte ?', '["I am afraid that would be difficult.","No.","Absolutely not.","Out of the question."]', 'I am afraid that would be difficult.', 'Le refus indirect laisse la négociation ouverte.'),
(28, 'trous', 'Complète : « That is our final ___. » (offre)', null, 'offer', '« Final offer » = dernière proposition.'),
(28, 'traduction', 'Traduis en anglais : « Trouvons un terrain d''entente. »', null, 'Let us meet halfway / Let us find common ground', 'Deux idiomes également naturels.');

-- ---------- C2.4 Humour et ironie ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(29, 'qcm', 'Que traduit « Lovely weather, isn''t it? » sous une pluie battante ?', '["De l''ironie","De l''optimisme","De la surprise","Une observation neutre"]', 'De l''ironie', 'L''écart entre l''énoncé et la réalité produit l''ironie : ressort central de l''humour britannique.'),
(29, 'trous', 'Complète : « He is not exactly a ___ of patience. » (un modèle)', null, 'model', 'La litote ironique : « pas exactement un modèle » signifie « très impatient ».'),
(29, 'traduction', 'Traduis en anglais : « Il ne manque pas d''air ! »', null, 'He has got some nerve / He has a lot of nerve', '« Nerve » désigne ici le culot, l''audace.'),
(29, 'qcm', 'Que signifie « deadpan » ?', '["Un humour dit sans expression","Un humour noir","Un humour absurde","Une blague ratée"]', 'Un humour dit sans expression', 'Le visage reste impassible : c''est le contraste qui fait rire.'),
(29, 'trous', 'Complète : « No pun ___. » (sans jeu de mots)', null, 'intended', '« No pun intended » s''ajoute quand un jeu de mots survient involontairement.'),
(29, 'traduction', 'Traduis en anglais : « C''était une plaisanterie. »', null, 'I was joking / It was a joke', '« I was joking » est plus naturel à l''oral.');

-- ---------- C2.5 Synthèse ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(30, 'qcm', 'Laquelle est parfaitement idiomatique ?', '["Rarely have I seen such a performance.","Rarely I have seen such performance.","Rarely I saw such a performance.","Rarely did I have seen such performance."]', 'Rarely have I seen such a performance.', 'Un adverbe négatif en tête de phrase entraîne l''inversion sujet-auxiliaire.'),
(30, 'trous', 'Complète : « Not only ___ he late, but he also forgot the files. »', null, 'was', 'Après « not only » placé en tête, l''inversion est obligatoire.'),
(30, 'traduction', 'Traduis en anglais : « Quoi qu''il en soit, la décision est prise. »', null, 'Be that as it may, the decision has been made', '« Be that as it may » est une concession de registre soutenu.'),
(30, 'qcm', 'Que signifie « to hedge one''s bets » ?', '["Se ménager une porte de sortie","Parier gros","Renoncer","Doubler sa mise"]', 'Se ménager une porte de sortie', 'Répartir les risques pour ne pas tout perdre.'),
(30, 'trous', 'Complète : « ___ as it may seem, the theory holds. » (aussi étrange que)', null, 'Strange', 'Structure « Adjectif + as it may seem » : concession soutenue.'),
(30, 'traduction', 'Traduis en anglais : « Il n''en demeure pas moins que le problème persiste. »', null, 'The fact remains that the problem persists', '« The fact remains that… » rend exactement cette articulation.');
