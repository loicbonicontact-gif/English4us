-- ============================================
-- SEED — vocabulaire
-- 150 exercices : 5 par leçon, A1 -> C2.
--
-- À exécuter APRÈS seed.sql. Rejouable : ces exercices portent un marqueur
-- « [voc] » en fin d'explication, qui permet de les supprimer sans toucher
-- aux autres.
--
-- POURQUOI LE VOCABULAIRE D'ABORD
-- C'est ce qui bloque le plus tôt. On ne comprend ni un texte ni un
-- dialogue dont les mots manquent, quelle que soit la grammaire maîtrisée.
-- Le TOEIC repose sur un socle d'environ 3 000 mots, très orienté monde du
-- travail : logistique, ressources humaines, réunions, contrats.
--
-- PROGRESSION
--   A1-A2  le quotidien concret
--   B1     l'entreprise vue de l'intérieur (poste, réunion, congés)
--   B2     les opérations (commande, livraison, facture, litige)
--   C1-C2  l'abstrait et la nuance (registres, sous-entendus, négociation)
--
-- Chaque exercice enseigne UNE distinction, et l'explication dit laquelle.
-- Les mauvaises réponses ne sont jamais absurdes : ce sont les confusions
-- réellement commises par les francophones.
-- ============================================

delete from exercises where explanation like '%[voc]';

-- ---------- A1.1 Se présenter ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(1, 'qcm', 'Quel mot désigne le nom de famille ?', '["surname","first name","nickname","username"]', 'surname', '« Surname » = nom de famille. « First name » est le prénom. Sur un formulaire anglais, « last name » veut dire la même chose que « surname ». [voc]'),
(1, 'qcm', 'Comment demander poliment le prénom de quelqu''un ?', '["May I ask your name?","What you name?","How is your name?","Who are your name?"]', 'May I ask your name?', '« May I… » est la formule polie. « How is your name » calque le français « comment » et ne se dit pas. [voc]'),
(1, 'trous', 'Complète : « I ___ from Lyon. » (Je viens de Lyon.)', null, 'am/come', 'Deux réponses justes : « I am from Lyon » ou « I come from Lyon ». Le verbe « venir » n''est pas obligatoire. [voc]'),
(1, 'trous', 'Complète : « Nice to ___ you. » (Enchanté.)', null, 'meet', '« Nice to meet you » à la première rencontre. Ensuite on dit « nice to see you ». La distinction existe aussi en français. [voc]'),
(1, 'traduction', 'Traduis en anglais : « Je suis étudiant. »', null, 'I am a student/I''m a student', 'L''article « a » est obligatoire devant un métier ou un statut en anglais. « I am student » est une faute très fréquente. [voc]'),

-- ---------- A1.2 La famille ----------
(2, 'qcm', 'Comment dit-on « les grands-parents » ?', '["grandparents","big parents","old parents","great parents"]', 'grandparents', '« Grand- » sert aux générations : grandparents, grandchildren. « Great-grandparents » remonte encore d''une génération. [voc]'),
(2, 'qcm', 'Que veut dire « sibling » ?', '["Frère ou sœur","Cousin","Voisin","Beau-parent"]', 'Frère ou sœur', '« Sibling » désigne un frère OU une sœur, sans préciser le sexe. Le français n''a pas d''équivalent en un mot. [voc]'),
(2, 'trous', 'Complète : « My father''s brother is my ___. »', null, 'uncle', 'Le frère du père est l''oncle. Sa femme serait « aunt », leurs enfants « cousins ». [voc]'),
(2, 'trous', 'Complète : « She is my ___-in-law. » (Elle est ma belle-sœur.)', null, 'sister', '« -in-law » marque la famille par alliance : sister-in-law, mother-in-law. Littéralement « par la loi ». [voc]'),
(2, 'traduction', 'Traduis en anglais : « J''ai deux enfants. »', null, 'I have two children/I have 2 children', '« Children » est le pluriel irrégulier de « child ». « Childs » n''existe pas. [voc]'),

-- ---------- A1.3 Les nombres et l'heure ----------
(3, 'qcm', 'Quel mot signifie « une quinzaine de jours » ?', '["fortnight","weekend","semester","decade"]', 'fortnight', '« Fortnight » = deux semaines. Mot très courant en anglais britannique, absent de l''américain. [voc]'),
(3, 'qcm', 'Comment dit-on 1 500 à l''oral ?', '["fifteen hundred","one thousand five","fifteen thousand","one five hundred"]', 'fifteen hundred', 'Entre 1 100 et 1 900, l''anglais compte en centaines : « fifteen hundred ». « One thousand five hundred » est correct mais plus lourd. [voc]'),
(3, 'trous', 'Complète : « The shop opens at ___ past nine. » (9 h 30)', null, 'half', '« Half past nine » = neuf heures et demie. Attention : « half nine » en anglais parlé signifie aussi 9 h 30, jamais 8 h 30. [voc]'),
(3, 'trous', 'Complète : « I will be there in a ___ of an hour. » (dans un quart d''heure)', null, 'quarter', '« A quarter of an hour » = un quart d''heure. On dit aussi « a quarter to five » pour cinq heures moins le quart. [voc]'),
(3, 'traduction', 'Traduis en anglais : « Le train arrive à midi. »', null, 'The train arrives at noon/The train arrives at midday', '« Noon » et « midday » = midi. « Midnight » = minuit. Ne pas dire « at twelve of the day ». [voc]'),

-- ---------- A1.4 Nourriture et boissons ----------
(4, 'qcm', 'Quel mot désigne le plat principal ?', '["main course","first plate","big dish","central meal"]', 'main course', 'Un repas anglais : « starter » (entrée), « main course » (plat), « dessert ». « Plate » désigne l''assiette, pas le plat. [voc]'),
(4, 'qcm', 'Que commande-t-on avec « I would like the bill » ?', '["L''addition","Le menu","Un billet","Une facture d''électricité"]', 'L''addition', 'Au restaurant : « the bill » en anglais britannique, « the check » en américain. « Ticket » ne se dit pas. [voc]'),
(4, 'trous', 'Complète : « Would you like ___ water? » (un peu d''eau)', null, 'some', '« Some » devant un indénombrable dans une offre. « A water » ne se dit qu''en commandant une bouteille précise. [voc]'),
(4, 'trous', 'Complète : « This soup is very ___. » (savoureuse)', null, 'tasty', '« Tasty » = savoureux. Attention au faux ami « savoury », qui signifie salé par opposition à sucré. [voc]'),
(4, 'traduction', 'Traduis en anglais : « Je suis végétarien. »', null, 'I am vegetarian/I am a vegetarian/I''m vegetarian', 'Les deux formes existent, avec ou sans article. « I am vegetarian » est le plus courant à l''oral. [voc]'),

-- ---------- A1.5 Verbes essentiels ----------
(5, 'qcm', 'Quel verbe signifie « devenir » ?', '["become","come","begin","belong"]', 'become', '« Become » = devenir. Ne pas le confondre avec l''allemand « bekommen » (recevoir), piège classique. [voc]'),
(5, 'qcm', 'Que veut dire « to borrow » ?', '["Emprunter","Prêter","Rendre","Acheter"]', 'Emprunter', '« Borrow » = emprunter (je prends). « Lend » = prêter (je donne). Les confondre inverse le sens de la phrase. [voc]'),
(5, 'trous', 'Complète : « I ___ my keys. » (J''ai perdu mes clés.)', null, 'lost', '« Lost » est le passé de « lose » (perdre). Ne pas confondre avec « loose », qui veut dire desserré. [voc]'),
(5, 'trous', 'Complète : « Can you ___ me a favour? » (rendre un service)', null, 'do', '« Do someone a favour » : le verbe est « do », jamais « make ». Expression figée. [voc]'),
(5, 'traduction', 'Traduis en anglais : « Il fait ses devoirs. »', null, 'He does his homework/He is doing his homework', '« Homework » est indénombrable : jamais « homeworks », jamais « a homework ». [voc]'),

-- ---------- A2.1 Le passé simple ----------
(6, 'qcm', 'Quel est le passé de « to teach » ?', '["taught","teached","teached up","tought"]', 'taught', '« Teach » devient « taught », comme « catch » devient « caught ». Verbe irrégulier fréquent. [voc]'),
(6, 'qcm', 'Quel est le passé de « to bring » ?', '["brought","bringed","brang","brung"]', 'brought', '« Bring » -> « brought ». Même schéma que « think » -> « thought » et « buy » -> « bought ». [voc]'),
(6, 'trous', 'Complète : « She ___ the letter yesterday. » (écrire)', null, 'wrote', '« Write » -> « wrote » -> « written ». Le prétérit est « wrote », le participe passé « written ». [voc]'),
(6, 'trous', 'Complète : « They ___ in London last year. » (vivre)', null, 'lived', 'Verbe régulier : on ajoute « -ed ». Le « e » final de « live » ne se double pas. [voc]'),
(6, 'traduction', 'Traduis en anglais : « Je suis allé au cinéma hier. »', null, 'I went to the cinema yesterday', '« Went » est le passé de « go ». Ne pas dire « I was gone », qui n''a pas ce sens. [voc]'),

-- ---------- A2.2 Voyages et directions ----------
(7, 'qcm', 'Que désigne « a return ticket » ?', '["Un aller-retour","Un aller simple","Un remboursement","Un échange"]', 'Un aller-retour', '« Return ticket » = aller-retour (britannique). Un aller simple est « a single » ou « one-way ». [voc]'),
(7, 'qcm', 'Quel mot désigne les bagages ?', '["luggage","bagages","packets","cases"]', 'luggage', '« Luggage » est indénombrable : jamais « luggages ». On compte en « pieces of luggage » ou « suitcases ». [voc]'),
(7, 'trous', 'Complète : « The hotel is just ___ the corner. » (au coin de la rue)', null, 'around', '« Around the corner » = tout près. Expression figée qui signifie aussi « imminent » au figuré. [voc]'),
(7, 'trous', 'Complète : « Go ___ the bridge. » (traverser le pont)', null, 'across/over', 'Les deux se disent. « Across » insiste sur la traversée, « over » sur le passage au-dessus. [voc]'),
(7, 'traduction', 'Traduis en anglais : « Où est la station de métro ? »', null, 'Where is the underground station/Where is the tube station/Where is the subway station', '« Underground » ou « tube » à Londres, « subway » à New York. Attention : « subway » en Angleterre désigne un passage souterrain piéton. [voc]'),

-- ---------- A2.3 Achats et argent ----------
(8, 'qcm', 'Que signifie « a bargain » ?', '["Une bonne affaire","Une dispute","Un remboursement","Un acompte"]', 'Une bonne affaire', '« A bargain » = une bonne affaire. Le verbe « to bargain » signifie marchander. [voc]'),
(8, 'qcm', 'Que veut dire « to afford » ?', '["Avoir les moyens de payer","Offrir un cadeau","Emprunter","Économiser"]', 'Avoir les moyens de payer', '« I cannot afford it » = je n''en ai pas les moyens. Faux ami : rien à voir avec « offrir ». [voc]'),
(8, 'trous', 'Complète : « Do you accept ___? » (les cartes bancaires)', null, 'cards', '« Do you accept cards? » ou « card payments ». « Bank card » se dit, mais « cards » suffit dans un magasin. [voc]'),
(8, 'trous', 'Complète : « Keep the ___. » (Gardez la monnaie.)', null, 'change', '« Change » = la monnaie rendue. La monnaie d''un pays est « currency ». Deux mots bien distincts. [voc]'),
(8, 'traduction', 'Traduis en anglais : « C''est trop cher. »', null, 'It is too expensive/It''s too expensive', '« Expensive » = cher. Ne jamais dire « too much expensive » : « too » suffit devant un adjectif. [voc]'),

-- ---------- A2.4 Décrire son quotidien ----------
(9, 'qcm', 'Que veut dire « to commute » ?', '["Faire le trajet domicile-travail","Changer d''avis","Échanger un article","Communiquer"]', 'Faire le trajet domicile-travail', '« Commute » = faire la navette quotidienne. « Commuter » désigne la personne. Mot très fréquent au TOEIC. [voc]'),
(9, 'qcm', 'Quel mot signifie « faire la grasse matinée » ?', '["lie in","sleep late","big morning","long night"]', 'lie in', '« To have a lie-in » = faire la grasse matinée. « Sleep in » se dit aussi, surtout en américain. [voc]'),
(9, 'trous', 'Complète : « I do the ___ every evening. » (la vaisselle)', null, 'washing-up/dishes', '« The washing-up » en britannique, « the dishes » en américain. Les deux sont acceptés. [voc]'),
(9, 'trous', 'Complète : « She ___ up at six every day. » (se lever)', null, 'gets', '« Get up » = se lever du lit. « Stand up » = se mettre debout. Les deux ne sont pas interchangeables. [voc]'),
(9, 'traduction', 'Traduis en anglais : « Je travaille de chez moi. »', null, 'I work from home/I work at home', '« Work from home » est la forme consacrée, souvent abrégée en WFH dans les e-mails professionnels. [voc]'),

-- ---------- A2.5 Le futur ----------
(10, 'qcm', 'Que veut dire « to look forward to » ?', '["Attendre avec impatience","Regarder devant soi","Prévoir","Chercher"]', 'Attendre avec impatience', '« I look forward to hearing from you » clôt la plupart des e-mails professionnels. Attention : suivi d''un verbe en -ing. [voc]'),
(10, 'qcm', 'Que signifie « eventually » ?', '["Finalement","Éventuellement","Peut-être","Rarement"]', 'Finalement', 'Faux ami majeur. « Eventually » = finalement, au bout du compte. « Éventuellement » se dit « possibly ». [voc]'),
(10, 'trous', 'Complète : « I am ___ to call him tomorrow. » (j''ai l''intention)', null, 'going', '« Going to » exprime une intention déjà décidée. « Will » servirait pour une décision prise à l''instant. [voc]'),
(10, 'trous', 'Complète : « The meeting is due to ___ place on Monday. »', null, 'take', '« Take place » = avoir lieu. Le verbe est « take », jamais « have » ni « happen ». [voc]'),
(10, 'traduction', 'Traduis en anglais : « Je te tiendrai au courant. »', null, 'I will keep you posted/I will keep you informed/I''ll keep you posted', '« Keep you posted » est la formule idiomatique. « Keep you informed » est plus formel. [voc]'),

-- ---------- B1.1 Exprimer une opinion ----------
(11, 'qcm', 'Quelle expression introduit un avis nuancé ?', '["As far as I am concerned","In my opinion of","At my advice","For me it is"]', 'As far as I am concerned', '« As far as I am concerned » = en ce qui me concerne. Marque que l''avis n''engage que soi. [voc]'),
(11, 'qcm', 'Que veut dire « I beg to differ » ?', '["Je ne suis pas d''accord","Je demande pardon","Je préfère attendre","Je m''en moque"]', 'Je ne suis pas d''accord', 'Formule polie et légèrement formelle pour marquer un désaccord. Plus douce que « I disagree ». [voc]'),
(11, 'trous', 'Complète : « I am not ___ about that. » (convaincu)', null, 'convinced', '« Convinced » = convaincu. Attention au faux ami « to convince » qui ne veut jamais dire « faire venir ». [voc]'),
(11, 'trous', 'Complète : « That is a fair ___. » (un argument recevable)', null, 'point', '« A fair point » = une remarque juste. On l''emploie pour concéder avant de nuancer. [voc]'),
(11, 'traduction', 'Traduis en anglais : « Je ne suis pas tout à fait d''accord. »', null, 'I do not quite agree/I don''t quite agree', '« Not quite » adoucit. Un « I do not agree » sec passerait pour brutal en réunion. [voc]'),

-- ---------- B1.2 Le monde du travail ----------
(12, 'qcm', 'Que désigne « a deadline » ?', '["Une date limite","Une ligne fermée","Un licenciement","Une pause"]', 'Une date limite', '« Deadline » = échéance. « To meet a deadline » = tenir les délais, « to miss a deadline » = les manquer. [voc]'),
(12, 'qcm', 'Que veut dire « to be promoted » ?', '["Obtenir une promotion","Faire de la publicité","Être muté","Être en congé"]', 'Obtenir une promotion', '« Promoted » = promu. Le mot sert aussi pour la publicité, mais avec une personne comme sujet il signifie promotion. [voc]'),
(12, 'trous', 'Complète : « She handed in her ___ last week. » (démission)', null, 'resignation', '« Hand in your resignation » = remettre sa démission. « Notice » désigne le préavis. [voc]'),
(12, 'trous', 'Complète : « I am on annual ___. » (congés payés)', null, 'leave', '« Annual leave » = congés payés. « Sick leave » = arrêt maladie, « maternity leave » = congé maternité. [voc]'),
(12, 'traduction', 'Traduis en anglais : « Je postule pour ce poste. »', null, 'I am applying for this position/I am applying for this job', '« Apply FOR » un poste, « apply TO » une entreprise. La préposition change le sens. [voc]'),

-- ---------- B1.3 Present perfect ----------
(13, 'qcm', 'Quelle phrase est correcte ?', '["I have known him since 2019","I know him since 2019","I am knowing him since 2019","I knew him since 2019"]', 'I have known him since 2019', 'Une situation commencée dans le passé et toujours vraie demande le present perfect. Le présent simple est la faute la plus fréquente. [voc]'),
(13, 'qcm', 'Que veut dire « I have just finished » ?', '["Je viens de finir","Je finirai bientôt","Je finis toujours","J''avais fini"]', 'Je viens de finir', '« Just » + present perfect traduit « venir de ». Le français utilise un verbe, l''anglais un adverbe. [voc]'),
(13, 'trous', 'Complète : « Have you ___ finished? » (déjà, dans une question)', null, 'already/yet', 'Les deux existent : « already » marque la surprise, « yet » la simple attente. « Yet » se place en fin de phrase. [voc]'),
(13, 'trous', 'Complète : « I have worked here ___ five years. »', null, 'for', '« For » + durée, « since » + point de départ. Confondre les deux est l''erreur numéro un à ce niveau. [voc]'),
(13, 'traduction', 'Traduis en anglais : « Je n''ai jamais visité l''Écosse. »', null, 'I have never visited Scotland/I''ve never been to Scotland', '« Never » se place entre l''auxiliaire et le participe. Pas de double négation avec « not ». [voc]'),

-- ---------- B1.4 Santé et bien-être ----------
(14, 'qcm', 'Que veut dire « to recover » ?', '["Se rétablir","Recouvrir","Retrouver un objet","Rembourser"]', 'Se rétablir', '« Recover from an illness » = se remettre d''une maladie. Le sens de « recouvrir » n''existe pas en anglais. [voc]'),
(14, 'qcm', 'Que désigne « a prescription » ?', '["Une ordonnance","Une prescription légale","Un abonnement","Une inscription"]', 'Une ordonnance', 'Faux ami. « Prescription » = ordonnance médicale. Un abonnement est « a subscription ». [voc]'),
(14, 'trous', 'Complète : « I have a sore ___. » (mal à la gorge)', null, 'throat', '« Sore throat » = mal de gorge. « Sore » indique une douleur localisée : sore back, sore eyes. [voc]'),
(14, 'trous', 'Complète : « You should take some ___ off work. » (du repos)', null, 'time', '« Take time off work » = prendre du repos. « Time off » désigne toute absence, congés ou maladie. [voc]'),
(14, 'traduction', 'Traduis en anglais : « Je dois prendre rendez-vous chez le médecin. »', null, 'I need to make an appointment with the doctor/I must make an appointment with the doctor', '« Make an appointment » : le verbe est « make », jamais « take ». Faux ami avec « prendre rendez-vous ». [voc]'),

-- ---------- B1.5 Comparatifs ----------
(15, 'qcm', 'Quelle phrase est correcte ?', '["This is far better","This is more better","This is more good","This is the more good"]', 'This is far better', '« Better » est déjà un comparatif : jamais « more better ». « Far » ou « much » le renforcent. [voc]'),
(15, 'qcm', 'Que veut dire « as cheap as » ?', '["Aussi bon marché que","Moins cher que","Plus cher que","Le moins cher"]', 'Aussi bon marché que', '« As… as » exprime l''égalité. « Not as cheap as » indique une infériorité, pas une supériorité. [voc]'),
(15, 'trous', 'Complète : « It is the ___ expensive of the three. » (le moins)', null, 'least', '« Least » = le moins. Superlatif d''infériorité, opposé de « most ». [voc]'),
(15, 'trous', 'Complète : « The ___ we wait, the worse it gets. » (plus)', null, 'longer', 'Structure « the more… the more… ». Ici « the longer we wait » = plus on attend. [voc]'),
(15, 'traduction', 'Traduis en anglais : « Ce projet est bien plus ambitieux. »', null, 'This project is much more ambitious/This project is far more ambitious', '« Much » ou « far » renforcent un comparatif. « Very more » n''existe pas. [voc]'),

-- ---------- B2.1 Débattre et argumenter ----------
(16, 'qcm', 'Que veut dire « to acknowledge » ?', '["Reconnaître","Ignorer","Contester","Annoncer"]', 'Reconnaître', '« Acknowledge a point » = reconnaître un argument. Dans un e-mail, « acknowledge receipt » = accuser réception. [voc]'),
(16, 'qcm', 'Que signifie « a drawback » ?', '["Un inconvénient","Un recul","Un dessin","Un retard"]', 'Un inconvénient', '« Drawback » = inconvénient. Synonymes : « downside », « disadvantage ». Très fréquent dans les textes argumentatifs. [voc]'),
(16, 'trous', 'Complète : « That argument does not hold ___. » (ne tient pas)', null, 'water', '« Hold water » = tenir debout, en parlant d''un raisonnement. Image figée, à retenir telle quelle. [voc]'),
(16, 'trous', 'Complète : « Let us look at the ___ side. » (le revers de la médaille)', null, 'other/flip', '« The other side » ou « the flip side ». Sert à annoncer le contre-argument. [voc]'),
(16, 'traduction', 'Traduis en anglais : « Les preuves sont insuffisantes. »', null, 'The evidence is insufficient/There is insufficient evidence', '« Evidence » est indénombrable : jamais « evidences », et le verbe reste au singulier. [voc]'),

-- ---------- B2.2 Conditionnels ----------
(17, 'qcm', 'Quelle phrase est correcte ?', '["If I were you, I would wait","If I was you, I will wait","If I am you, I would wait","If I would be you, I wait"]', 'If I were you, I would wait', 'Au deuxième conditionnel, « be » devient « were » à toutes les personnes. « If I was » existe à l''oral mais reste familier. [voc]'),
(17, 'qcm', 'Que veut dire « unless » ?', '["À moins que","Sauf si ce n''est","Malgré","Puisque"]', 'À moins que', '« Unless » = si… ne… pas. « Unless you call » = à moins que tu appelles. Il ne se combine jamais avec « not ». [voc]'),
(17, 'trous', 'Complète : « ___ you need help, let me know. » (au cas où)', null, 'If', '« If you need help » suffit. « In case » existe mais change le sens : il exprime une précaution préalable. [voc]'),
(17, 'trous', 'Complète : « I would rather you ___ not mention it. »', null, 'did', 'Après « would rather » + sujet, le verbe se met au prétérit : « I would rather you did not ». Structure contre-intuitive. [voc]'),
(17, 'traduction', 'Traduis en anglais : « Si nous partons maintenant, nous arriverons à l''heure. »', null, 'If we leave now, we will arrive on time/If we leave now, we''ll arrive on time', 'Premier conditionnel : présent après « if », « will » ensuite. Jamais « if we will leave ». [voc]'),

-- ---------- B2.3 Environnement et société ----------
(18, 'qcm', 'Que veut dire « sustainable » ?', '["Durable","Soutenable moralement","Supportable","Substantiel"]', 'Durable', '« Sustainable development » = développement durable. Le sens est écologique et économique, pas moral. [voc]'),
(18, 'qcm', 'Que désigne « landfill » ?', '["Une décharge","Un remblai","Un terrain à vendre","Une inondation"]', 'Une décharge', '« Landfill » = décharge, site d''enfouissement. « Waste » désigne les déchets eux-mêmes. [voc]'),
(18, 'trous', 'Complète : « We must reduce our carbon ___. » (empreinte)', null, 'footprint', '« Carbon footprint » = empreinte carbone. « Footprint » signifie littéralement trace de pas. [voc]'),
(18, 'trous', 'Complète : « The species is ___ danger. » (en voie de disparition)', null, 'in', '« In danger » = en danger. On dit aussi « endangered species », en un seul adjectif. [voc]'),
(18, 'traduction', 'Traduis en anglais : « Le recyclage est obligatoire ici. »', null, 'Recycling is compulsory here/Recycling is mandatory here', '« Compulsory » (britannique) et « mandatory » (plus international) sont tous deux justes. [voc]'),

-- ---------- B2.4 Voix passive ----------
(19, 'qcm', 'Quelle phrase est au passif ?', '["The report was sent yesterday","We sent the report","The report arrived","Sending the report"]', 'The report was sent yesterday', 'Passif = « be » + participe passé. Le sujet subit l''action au lieu de la faire. [voc]'),
(19, 'qcm', 'Que veut dire « to be laid off » ?', '["Être licencié économiquement","Être en retard","Être promu","Être en congé"]', 'Être licencié économiquement', '« Laid off » = licencié pour raison économique. « Fired » = renvoyé pour faute. La nuance compte au TOEIC. [voc]'),
(19, 'trous', 'Complète : « The invoice has been ___. » (réglée)', null, 'paid/settled', '« Paid » ou « settled ». « Settle an invoice » appartient au registre commercial. [voc]'),
(19, 'trous', 'Complète : « Applications must be ___ before Friday. » (soumises)', null, 'submitted', '« Submit » = soumettre, déposer. Verbe central des consignes administratives du TOEIC. [voc]'),
(19, 'traduction', 'Traduis en anglais : « La réunion a été reportée. »', null, 'The meeting has been postponed/The meeting was postponed', '« Postpone » = reporter à plus tard. « Cancel » signifierait annuler purement et simplement. [voc]'),

-- ---------- B2.5 Anglais professionnel ----------
(20, 'qcm', 'Que désigne « a supplier » ?', '["Un fournisseur","Un supplément","Un remplaçant","Un client"]', 'Un fournisseur', '« Supplier » = fournisseur. « Customer » ou « client » désigne l''acheteur. Vocabulaire central des parties 6 et 7. [voc]'),
(20, 'qcm', 'Que veut dire « to issue an invoice » ?', '["Émettre une facture","Contester une facture","Payer une facture","Classer une facture"]', 'Émettre une facture', '« Issue » = émettre, délivrer. On l''emploie pour une facture, un passeport, un communiqué. [voc]'),
(20, 'trous', 'Complète : « Please find the ___ document. » (ci-joint)', null, 'attached', '« Please find attached » est la formule figée des e-mails professionnels. « Joined » ne se dit pas. [voc]'),
(20, 'trous', 'Complète : « The shipment is ___ transit. » (en cours d''acheminement)', null, 'in', '« In transit » = en cours de transport. Vocabulaire logistique très présent à l''examen. [voc]'),
(20, 'traduction', 'Traduis en anglais : « Nous accusons réception de votre commande. »', null, 'We acknowledge receipt of your order', '« Acknowledge receipt » est la formule consacrée. Ne pas traduire « accuser » par « accuse ». [voc]'),

-- ---------- C1.1 Nuances et registres ----------
(21, 'qcm', 'Quelle formule est la plus formelle ?', '["I would be grateful if you could","Can you","Could you please","I want you to"]', 'I would be grateful if you could', 'Échelle de politesse croissante : can you / could you please / I would be grateful if you could. [voc]'),
(21, 'qcm', 'Que veut dire « somewhat » ?', '["Quelque peu","Beaucoup","Pas du tout","Parfois"]', 'Quelque peu', '« Somewhat » atténue : « somewhat disappointing » = un peu décevant. Registre écrit et prudent. [voc]'),
(21, 'trous', 'Complète : « I am afraid that will not be ___. » (possible)', null, 'possible', '« I am afraid » n''exprime aucune peur : c''est l''ouverture standard d''un refus poli. [voc]'),
(21, 'trous', 'Complète : « With all due ___, I disagree. » (respect)', null, 'respect', '« With all due respect » annonce un désaccord ferme sous une forme courtoise. Souvent ironique à l''oral. [voc]'),
(21, 'traduction', 'Traduis en anglais : « Nous ne sommes pas en mesure d''accepter. »', null, 'We are unable to accept/We are not in a position to accept', '« Unable to » est plus formel que « cannot ». « Not in a position to » l''est encore plus. [voc]'),

-- ---------- C1.2 Conditionnels avancés ----------
(22, 'qcm', 'Quelle phrase exprime un regret sur le passé ?', '["I should have called","I should call","I would call","I must call"]', 'I should have called', '« Should have » + participe = regret ou reproche sur le passé. « J''aurais dû appeler. » [voc]'),
(22, 'qcm', 'Que veut dire « had it not been for » ?', '["Sans","Malgré","Grâce à","Depuis"]', 'Sans', '« Had it not been for your help » = sans ton aide. Inversion littéraire de « if it had not been for ». [voc]'),
(22, 'trous', 'Complète : « I wish I ___ more time. » (j''aimerais avoir)', null, 'had', 'Après « I wish », le prétérit exprime un souhait sur le présent. « I wish I have » est une faute. [voc]'),
(22, 'trous', 'Complète : « If only we ___ known earlier. »', null, 'had', '« If only we had known » = si seulement nous avions su. Regret sur le passé, même construction qu''au troisième conditionnel. [voc]'),
(22, 'traduction', 'Traduis en anglais : « Nous aurions pu éviter cela. »', null, 'We could have avoided that/We could have avoided this', '« Could have » + participe = aurions pu. À l''oral, « could have » se contracte presque en « could''ve ». [voc]'),

-- ---------- C1.3 Actualités et médias ----------
(23, 'qcm', 'Que veut dire « to allege » ?', '["Affirmer sans preuve","Démontrer","Nier","Publier"]', 'Affirmer sans preuve', '« Alleged » = présumé. La presse l''emploie pour rapporter une accusation non établie, par prudence juridique. [voc]'),
(23, 'qcm', 'Que désigne « a source close to the matter » ?', '["Une source anonyme proche du dossier","Un document officiel","Un témoin direct","Une agence de presse"]', 'Une source anonyme proche du dossier', 'Formule journalistique consacrée pour citer sans nommer. Signale une information non confirmée officiellement. [voc]'),
(23, 'trous', 'Complète : « The report ___ doubt on the figures. » (jette le doute)', null, 'casts', '« Cast doubt on » = jeter le doute sur. Le verbe est « cast », dont le passé est aussi « cast ». [voc]'),
(23, 'trous', 'Complète : « The story made the ___. » (les gros titres)', null, 'headlines', '« Make the headlines » = faire la une. « Headline » est le titre, « front page » la première page. [voc]'),
(23, 'traduction', 'Traduis en anglais : « Ces chiffres sont trompeurs. »', null, 'These figures are misleading', '« Misleading » = trompeur, sans intention nécessairement malveillante. « Lying » accuserait directement. [voc]'),

-- ---------- C1.4 Expressions idiomatiques ----------
(24, 'qcm', 'Que veut dire « to be on the same page » ?', '["Être d''accord","Lire la même chose","Travailler ensemble","Être en retard"]', 'Être d''accord', '« On the same page » = avoir la même compréhension. Très fréquent en réunion professionnelle. [voc]'),
(24, 'qcm', 'Que signifie « to cut corners » ?', '["Bâcler pour aller vite","Réduire les coûts","Prendre un raccourci physique","Négocier"]', 'Bâcler pour aller vite', '« Cut corners » a toujours une connotation négative : on gagne du temps au détriment de la qualité. [voc]'),
(24, 'trous', 'Complète : « Let us touch ___ next week. » (refaire un point)', null, 'base', '« Touch base » = reprendre contact brièvement. Image empruntée au baseball. [voc]'),
(24, 'trous', 'Complète : « That is a tall ___. » (une demande difficile)', null, 'order', '« A tall order » = une demande très exigeante. Rien à voir avec la taille ni avec une commande. [voc]'),
(24, 'traduction', 'Traduis en anglais : « Ça ne me dit rien. » (je ne m''en souviens pas)', null, 'It does not ring a bell/It doesn''t ring a bell', '« Ring a bell » = évoquer quelque chose. La traduction littérale de « ça ne me dit rien » serait incompréhensible. [voc]'),

-- ---------- C1.5 Rédaction argumentative ----------
(25, 'qcm', 'Quel connecteur marque une concession ?', '["Admittedly","Therefore","Moreover","Hence"]', 'Admittedly', '« Admittedly » = certes, il est vrai que. On concède avant de nuancer. Les trois autres enchaînent ou concluent. [voc]'),
(25, 'qcm', 'Que veut dire « to substantiate a claim » ?', '["Étayer une affirmation","Contester une affirmation","Résumer une affirmation","Publier une affirmation"]', 'Étayer une affirmation', '« Substantiate » = appuyer par des preuves. « Unsubstantiated » qualifie une affirmation sans fondement. [voc]'),
(25, 'trous', 'Complète : « This essay ___ that the policy failed. » (soutient)', null, 'argues', '« This essay argues that… » ouvre une thèse universitaire. « Argue » ne veut pas dire se disputer ici. [voc]'),
(25, 'trous', 'Complète : « The benefits ___ the risks. » (l''emportent sur)', null, 'outweigh', '« Outweigh » = peser plus lourd que. Verbe central de toute comparaison argumentée. [voc]'),
(25, 'traduction', 'Traduis en anglais : « En conclusion, les données restent insuffisantes. »', null, 'In conclusion, the data remains insufficient/To conclude, the data remains insufficient', '« Data » s''emploie aujourd''hui au singulier dans l''usage courant, même si « data are » reste correct en registre scientifique. [voc]'),

-- ---------- C2.1 Registres académiques ----------
(26, 'qcm', 'Que veut dire « to posit » ?', '["Poser comme hypothèse","Positionner","Refuser","Publier"]', 'Poser comme hypothèse', '« The author posits that… » = l''auteur pose comme postulat. Registre strictement académique. [voc]'),
(26, 'qcm', 'Que signifie « notwithstanding » ?', '["Malgré","Par conséquent","En outre","Sauf"]', 'Malgré', '« Notwithstanding the evidence » = malgré les preuves. Peut aussi se placer après le nom, ce qui est rare en anglais. [voc]'),
(26, 'trous', 'Complète : « These findings are ___ with earlier work. » (cohérentes)', null, 'consistent', '« Consistent with » = en accord avec. Faux ami : ne signifie pas « consistant » au sens de nourrissant. [voc]'),
(26, 'trous', 'Complète : « The study ___ a subtle distinction. » (établit)', null, 'draws', '« Draw a distinction » = établir une distinction. « Draw » a ici le sens de tracer. [voc]'),
(26, 'traduction', 'Traduis en anglais : « Ces hypothèses résistent rarement à l''examen. »', null, 'These assumptions rarely withstand scrutiny/Such assumptions rarely withstand scrutiny', '« Withstand scrutiny » = résister à l''examen. Collocation figée du registre savant. [voc]'),

-- ---------- C2.2 Phonétique et accents ----------
(27, 'qcm', 'Dans quel mot le « ch » se prononce-t-il « k » ?', '["chemistry","cheese","chair","church"]', 'chemistry', 'Les mots d''origine grecque gardent le son « k » : chemistry, character, chorus, architecture. [voc]'),
(27, 'qcm', 'Quel mot ne rime PAS avec les autres ?', '["though","through","dough","toe"]', 'through', '« Through » se prononce « throu ». Les trois autres riment en « ô ». L''orthographe anglaise ne prédit pas le son. [voc]'),
(27, 'trous', 'Complète : « The letter b in ___ is silent. » (dette)', null, 'debt', 'Le « b » de « debt » est muet, comme dans « doubt » et « subtle ». Héritage du latin, jamais prononcé. [voc]'),
(27, 'trous', 'Complète : « I will ___ the meeting. » (assister à — accent sur la 2e syllabe)', null, 'attend', '« Attend » = assister à. Faux ami : « attendre » se dit « wait ». L''accent tombe sur « -tend ». [voc]'),
(27, 'traduction', 'Traduis en anglais : « Ce mot est difficile à prononcer. »', null, 'This word is hard to pronounce/This word is difficult to pronounce', 'Attention : « pronounce » (verbe) mais « pronunciation » (nom) perd le « o ». Faute d''orthographe très répandue. [voc]'),

-- ---------- C2.3 Négociation et diplomatie ----------
(28, 'qcm', 'Que veut dire « to meet halfway » ?', '["Faire un compromis","Se retrouver à mi-chemin","Reporter","Refuser"]', 'Faire un compromis', '« Meet halfway » = chacun fait la moitié du chemin. Sens figuré presque exclusif en négociation. [voc]'),
(28, 'qcm', 'Que signifie « a deal-breaker » ?', '["Un point non négociable","Un négociateur","Une rupture de contrat","Une remise"]', 'Un point non négociable', '« Deal-breaker » = condition dont le refus fait échouer l''accord. Terme central de toute négociation. [voc]'),
(28, 'trous', 'Complète : « We are prepared to ___ on the price. » (faire un geste)', null, 'move', '« Move on the price » = bouger sur le prix. Plus souple que « lower », qui annoncerait déjà une baisse. [voc]'),
(28, 'trous', 'Complète : « Let us put that on ___ for now. » (mettre de côté)', null, 'hold', '« Put on hold » = suspendre, mettre en attente. Manière diplomatique de contourner un blocage. [voc]'),
(28, 'traduction', 'Traduis en anglais : « Cela dépend du volume. »', null, 'That depends on the volume/It depends on the volume', '« Depend ON », toujours avec cette préposition. « Depend of » est un calque du français. [voc]'),

-- ---------- C2.4 Humour, ironie et sous-entendus ----------
(29, 'qcm', 'Que sous-entend « that is one way of putting it » ?', '["Un désaccord poli","Un compliment","Une approbation","Une question"]', 'Un désaccord poli', 'Litote britannique : la phrase semble neutre mais signale clairement une réserve. [voc]'),
(29, 'qcm', 'Que veut dire « tongue in cheek » ?', '["Sur le ton de la plaisanterie","Avec mépris","Sans réfléchir","À voix basse"]', 'Sur le ton de la plaisanterie', '« Tongue in cheek » = pince-sans-rire. Signale qu''il ne faut pas prendre la phrase au premier degré. [voc]'),
(29, 'trous', 'Complète : « He is not ___ known for his patience. » (précisément)', null, 'exactly', '« Not exactly » atténue en apparence et accuse en réalité. Procédé d''euphémisme très britannique. [voc]'),
(29, 'trous', 'Complète : « Well, that went ___. » (ironique : ça s''est mal passé)', null, 'well', '« Well, that went well » dit avec le bon ton signifie exactement le contraire. Seule l''intonation porte le sens. [voc]'),
(29, 'traduction', 'Traduis en anglais : « Disons que ce n''était pas idéal. »', null, 'Let us say it was not ideal/Let''s say it was not ideal', 'La litote garde la même structure dans les deux langues : nier le positif plutôt qu''affirmer le négatif. [voc]'),

-- ---------- C2.5 Maîtrise : synthèse ----------
(30, 'qcm', 'Que veut dire « to hedge » dans un texte argumenté ?', '["Nuancer prudemment","Trancher","Exagérer","Résumer"]', 'Nuancer prudemment', '« Hedging » = usage de « might », « suggests », « appears » pour ne pas surinterpréter. Marque de rigueur savante. [voc]'),
(30, 'qcm', 'Que signifie « the elephant in the room » ?', '["Un problème évident que personne n''aborde","Un détail sans importance","Un invité encombrant","Une erreur de calcul"]', 'Un problème évident que personne n''aborde', 'Image très courante en réunion : le sujet que tout le monde voit et que personne ne nomme. [voc]'),
(30, 'trous', 'Complète : « What ___ me most is how little has changed. » (frappe)', null, 'strikes', '« What strikes me most » ouvre une structure clivée qui met l''idée en relief. Registre soutenu. [voc]'),
(30, 'trous', 'Complète : « The report falls ___ of expectations. » (ne répond pas aux attentes)', null, 'short', '« Fall short of » = ne pas être à la hauteur de. Litote fréquente dans les évaluations professionnelles. [voc]'),
(30, 'traduction', 'Traduis en anglais : « Il serait injuste de parler d''échec. »', null, 'It would be unfair to call it a failure/It would be unfair to describe it as a failure', 'Formule de nuance : on écarte le mot fort tout en laissant entendre la critique. [voc]');
