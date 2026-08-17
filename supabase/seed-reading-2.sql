-- ============================================
-- SEED — compréhension écrite, deuxième série
-- 12 documents (2 par niveau A1 -> C2), 36 questions.
--
-- À exécuter APRÈS seed-reading.sql. Rejouable : ce script ne supprime QUE
-- les passages dont la position dépasse 12, donc la première série reste
-- intacte.
--
-- CE QUE CETTE SÉRIE AJOUTE
-- La première série couvrait le message, l'annonce, l'e-mail et l'échange.
-- Celle-ci ajoute les formats que le TOEIC affectionne et qu'aucun cours
-- classique ne travaille : l'horaire, le formulaire, la publicité, le
-- graphique commenté, et surtout le TRIPLE document en C2 — où la réponse
-- n'existe dans aucun des trois textes pris séparément.
-- ============================================

delete from reading_questions
where passage_id in (select id from reading_passages where position > 12);
delete from reading_passages where position > 12;

-- Les questions ci-dessous référencent les identifiants 13 à 24 en dur.
-- Sans cette remise à 13, un second passage du script attribuerait 25 et
-- suivants aux nouveaux textes, et toutes les questions pointeraient vers
-- des passages inexistants — le script « rejouable » ne le serait qu''une
-- fois. La séquence est donc replacée juste après la première série.
alter sequence reading_passages_id_seq restart with 13;

-- ============================================
-- A1
-- ============================================
insert into reading_passages (level, format, title, context, documents, position, xp_reward) values
('A1', 'text_completion', 'Une liste de courses', 'Quelqu''un a écrit une liste avant de partir au magasin. Trois mots manquent.',
 '[{"kind":"message","title":"Shopping list","text":"Buy at the __(1)__:\nsix eggs\ntwo __(2)__ of milk\none loaf of bread\napples and __(3)__\n\nDo not forget the keys!"}]', 13, 10),

('A1', 'passage', 'Un horaire de bus', 'Un panneau à l''arrêt de bus indique les départs.',
 '[{"kind":"schedule","title":"Bus 14 — Town Centre","text":"Monday to Friday: every 20 minutes, 6 am to 8 pm\nSaturday: every 30 minutes, 8 am to 6 pm\nSunday: no service\n\nA single ticket costs 2 pounds.\nChildren under 5 travel free."}]', 14, 15);

insert into reading_questions (passage_id, position, question, options, correct_answer, explanation) values
(13, 1, 'Which word fits gap (1)?', '["shop","kitchen","school","bank"]', 'shop', 'On achète des œufs et du pain dans un magasin. Le contexte impose le mot, pas la grammaire.'),
(13, 2, 'Which word fits gap (2)?', '["bottles","pieces","slices","bags"]', 'bottles', 'Le lait se compte en bouteilles. « Slices » servirait pour le pain, « pieces » pour un gâteau.'),
(13, 3, 'Which word fits gap (3)?', '["bananas","water","soap","paper"]', 'bananas', 'La ligne commence par « apples and » : on attend un autre fruit. Les trois autres mots ne sont pas des fruits.'),

(14, 1, 'How often does the bus run on Saturday?', '["Every 30 minutes","Every 20 minutes","Every hour","It does not run"]', 'Every 30 minutes', 'Deux fréquences sont données. Il faut relier « Saturday » à la bonne ligne, pas prendre le premier chiffre.'),
(14, 2, 'Can you take this bus on Sunday?', '["No","Yes, every hour","Yes, in the morning","Only with a ticket"]', 'No', '« No service » signifie aucun bus. Formulation courante sur les panneaux britanniques.'),
(14, 3, 'Who travels free?', '["Children under 5","All children","Nobody","People over 60"]', 'Children under 5', '« Under 5 » = moins de 5 ans. Un enfant de 6 ans paierait donc le tarif normal.');

-- ============================================
-- A2
-- ============================================
insert into reading_passages (level, format, title, context, documents, position, xp_reward) values
('A2', 'text_completion', 'Une petite annonce', 'Une annonce de location publiée sur un site. Trois mots manquent.',
 '[{"kind":"advert","title":"Flat to rent — city centre","text":"Bright two-bedroom flat, fifth __(1)__, with a lift.\nClose to the station and to several shops.\nAvailable __(2)__ 1 September.\nRent: 750 pounds per month, bills not __(3)__.\nCall Mrs Doyle on 0208 555 4412."}]', 15, 15),

('A2', 'passage', 'Une inscription à un cours', 'Un formulaire d''inscription à un cours du soir, et sa notice.',
 '[{"kind":"notice","title":"Evening Spanish Course — Registration","text":"Classes start on 12 September and run for ten weeks.\nTuesdays and Thursdays, 6.30 pm to 8 pm.\nPrice: 120 pounds for the full course.\n\nRegister before 5 September to get a 10% discount.\nNo classes during the half-term break (24-28 October)."}]', 16, 15);

insert into reading_questions (passage_id, position, question, options, correct_answer, explanation) values
(15, 1, 'Which word fits gap (1)?', '["floor","level","stage","step"]', 'floor', '« Fifth floor » = cinquième étage. « Level » s''emploie pour un parking, « stage » pour une étape.'),
(15, 2, 'Which word fits gap (2)?', '["from","since","during","until"]', 'from', '« Available from 1 September » = disponible à partir du. « Since » ne s''emploie que pour le passé.'),
(15, 3, 'Which word fits gap (3)?', '["included","including","include","inclusive"]', 'included', '« Bills not included » = charges non comprises. Participe passé après « not », pas la forme en -ing.'),

(16, 1, 'How many weeks does the course last?', '["Ten","Twelve","Five","Two"]', 'Ten', 'Le texte contient plusieurs nombres : dix semaines, le 12 septembre, 120 livres. Chacun désigne autre chose.'),
(16, 2, 'How can you pay less?', '["Register before 5 September","Come on Tuesdays only","Pay in cash","Bring a friend"]', 'Register before 5 September', '« Register before… to get a discount » : la remise est conditionnée à la date, pas au mode de paiement.'),
(16, 3, 'What happens in late October?', '["There are no classes","The price goes up","The course ends","Classes move to Monday"]', 'There are no classes', '« No classes during the half-term break » : la pause scolaire d''automne interrompt le cours.');

-- ============================================
-- B1
-- ============================================
insert into reading_passages (level, format, title, context, documents, position, xp_reward) values
('B1', 'text_completion', 'Une note au personnel', 'Une note affichée dans la salle de pause. Trois mots manquent.',
 '[{"kind":"memo","title":"Notice to all staff — Car park works","text":"The staff car park will be closed for resurfacing __(1)__ 14 and 18 March.\nDuring this period, staff may park in the visitor area __(2)__ charge.\nWe __(3)__ for the inconvenience and thank you for your patience.\nFacilities Team"}]', 17, 20),

('B1', 'passage', 'Une réservation de salle', 'Une demande de réservation, la réponse du prestataire, et le tarif joint.',
 '[{"kind":"email","title":"From: Tom Reyes — Subject: Meeting room for 20 March","text":"Dear Sir or Madam,\nI would like to book a meeting room for 20 March, from 9 am to 1 pm, for twelve people.\nWe will need a projector and coffee for the morning break.\nCould you confirm availability and price?\nKind regards,\nTom Reyes"},
   {"kind":"email","title":"From: Venue Booking — Subject: Re: Meeting room","text":"Dear Mr Reyes,\nThe Oak Room is free on that date and seats up to fifteen people.\nHalf-day hire is 180 pounds. The projector is included at no extra cost.\nCatering is charged separately: coffee and biscuits come to 4 pounds per person.\nWe would need confirmation at least five working days in advance."}]', 18, 20);

insert into reading_questions (passage_id, position, question, options, correct_answer, explanation) values
(17, 1, 'Which word fits gap (1)?', '["between","during","among","within"]', 'between', '« Between 14 and 18 March ». « Between… and » encadre deux bornes ; « during » demande un nom, pas deux dates.'),
(17, 2, 'Which word fits gap (2)?', '["free of","without a","no","out of"]', 'free of', '« Free of charge » = gratuitement. Locution figée : « without charge » existe aussi mais « without a » est faux.'),
(17, 3, 'Which word fits gap (3)?', '["apologise","excuse","sorry","regret to"]', 'apologise', '« We apologise for the inconvenience » est la formule standard. « We are sorry » se dirait, mais « we sorry » est agrammatical.'),

(18, 1, 'Is the room big enough?', '["Yes, it seats fifteen","No, it seats ten","No, it seats twelve exactly","The email does not say"]', 'Yes, it seats fifteen', 'Douze personnes demandées, quinze places disponibles. Il faut comparer deux nombres situés dans deux documents différents.'),
(18, 2, 'What is included in the hire price?', '["The projector","The coffee","Both","Neither"]', 'The projector', '« The projector is included at no extra cost », mais « catering is charged separately ». Les deux phrases se répondent.'),
(18, 3, 'What is the total catering cost for the group?', '["48 pounds","180 pounds","4 pounds","60 pounds"]', '48 pounds', '4 livres par personne pour douze personnes. Le calcul exige de reprendre l''effectif dans le premier e-mail.');

-- ============================================
-- B2
-- ============================================
insert into reading_passages (level, format, title, context, documents, position, xp_reward) values
('B2', 'text_completion', 'Une politique de télétravail', 'Un extrait du règlement intérieur d''une entreprise. Trois mots manquent.',
 '[{"kind":"memo","title":"Remote working policy — extract","text":"Employees may work remotely up to two days per week, __(1)__ to line manager approval.\nRequests should be submitted at least one week in advance, except in __(2)__ circumstances.\nThe company will provide the necessary equipment; personal devices are not __(3)__ for security reasons."}]', 19, 25),

('B2', 'passage', 'Un litige de facturation', 'Une réclamation client, la réponse du fournisseur, et un extrait de contrat.',
 '[{"kind":"email","title":"From: Helena Cruz — Subject: Invoice 8842 — overcharge","text":"Dear Accounts,\nInvoice 8842 charges us for 240 units at the standard rate. Our contract provides a 12% discount above 200 units, which does not appear on this invoice.\nWe have withheld payment pending correction.\nRegards,\nHelena Cruz"},
   {"kind":"email","title":"From: Accounts — Subject: Re: Invoice 8842","text":"Dear Ms Cruz,\nThank you for bringing this to our attention. You are correct that the volume discount was not applied.\nA credit note will be issued within three working days, and a corrected invoice will follow.\nWe would ask that payment be made within the original terms once the corrected invoice is received."},
   {"kind":"notice","title":"Contract extract — clause 7.2","text":"A volume discount of 12% applies to orders exceeding 200 units in a single delivery. The discount does not apply to orders split across several deliveries."}]', 20, 25);

insert into reading_questions (passage_id, position, question, options, correct_answer, explanation) values
(19, 1, 'Which word fits gap (1)?', '["subject","open","liable","due"]', 'subject', '« Subject to approval » = sous réserve d''approbation. Locution figée du langage administratif.'),
(19, 2, 'Which word fits gap (2)?', '["exceptional","excepted","exceptive","excepting"]', 'exceptional', '« Exceptional circumstances » = circonstances exceptionnelles. Les trois autres formes ne sont pas des adjectifs valides ici.'),
(19, 3, 'Which word fits gap (3)?', '["permitted","permission","permissive","permitting"]', 'permitted', '« Are not permitted » = ne sont pas autorisés. Participe passé exigé après « are not ».'),

(20, 1, 'Why does the customer refuse to pay?', '["A discount was not applied","The goods never arrived","The quality was poor","The delivery was late"]', 'A discount was not applied', 'Le litige porte sur la remise volume, pas sur la marchandise. Lire la nature exacte du reproche est l''enjeu.'),
(20, 2, 'Does the supplier accept the complaint?', '["Yes, fully","No","Only in part","They ask for proof"]', 'Yes, fully', '« You are correct that the volume discount was not applied » : reconnaissance sans réserve.'),
(20, 3, 'Under the contract, when does the discount NOT apply?', '["When the order is split across deliveries","Below 200 units","After 12 months","For new customers"]', 'When the order is split across deliveries', 'Cette réserve figure UNIQUEMENT dans l''extrait de contrat. Ni le client ni le fournisseur ne la mentionnent : il faut aller au troisième document.');

-- ============================================
-- C1
-- ============================================
insert into reading_passages (level, format, title, context, documents, position, xp_reward) values
('C1', 'text_completion', 'Un commentaire de résultats', 'Extrait du rapport annuel d''une entreprise. Trois mots manquent.',
 '[{"kind":"article","title":"Annual report — chairman''s statement, extract","text":"Revenue grew by nine per cent, a result that __(1)__ expectations in a difficult market.\nThis performance was driven __(2)__ by the digital division, whose margins improved for the third consecutive year.\nThe board remains cautious, however: much of the growth reflects one-off contracts that are unlikely to __(3)__ in the coming year."}]', 21, 30),

('C1', 'passage', 'Un rappel de produit', 'Un communiqué public, un e-mail interne et une note juridique.',
 '[{"kind":"notice","title":"Public notice — Voluntary recall","text":"We are recalling batch numbers 4471 to 4479 of our travel kettle following reports of overheating.\nCustomers should stop using the product immediately and return it to any store for a full refund. No proof of purchase is required.\nNo injuries have been reported."},
   {"kind":"email","title":"Internal — Head of Operations to regional managers","text":"The recall covers nine batches, roughly 14,000 units, of which about 9,000 have been sold.\nStores should accept returns without question, including from customers presenting batches outside the affected range. The cost of over-accepting is trivial compared with the cost of a single refusal reaching social media."},
   {"kind":"memo","title":"Legal note","text":"The recall is voluntary and does not constitute an admission of liability. Staff should not speculate about causes with customers or the press. All media enquiries are to be directed to Communications."}]', 22, 30);

insert into reading_questions (passage_id, position, question, options, correct_answer, explanation) values
(21, 1, 'Which word fits gap (1)?', '["exceeded","excelled","overtook","surpassed by"]', 'exceeded', '« Exceeded expectations » = a dépassé les attentes. Collocation figée : « surpassed » se dit, mais pas « surpassed by ».'),
(21, 2, 'Which word fits gap (2)?', '["largely","widely","strongly","heavily by"]', 'largely', '« Driven largely by » = tiré principalement par. « Widely » qualifierait une diffusion, pas une cause.'),
(21, 3, 'Which word fits gap (3)?', '["recur","occur again on","repeat themselves in","return back"]', 'recur', '« Recur » = se reproduire. Un seul mot suffit ; les autres formulations sont redondantes ou fautives.'),

(22, 1, 'What should customers do?', '["Return the product for a refund","Repair it themselves","Contact the manufacturer by post","Wait for a replacement"]', 'Return the product for a refund', 'Le communiqué public est explicite. Les autres options n''y figurent nulle part.'),
(22, 2, 'What are stores told to do beyond the public notice?', '["Accept returns outside the affected batches","Refuse returns without a receipt","Send products to head office","Offer a discount instead"]', 'Accept returns outside the affected batches', 'Cette consigne est dans l''e-mail INTERNE et contredit en apparence le communiqué. Croiser les deux est tout l''exercice.'),
(22, 3, 'What does the legal note forbid?', '["Speculating about causes","Accepting returns","Contacting customers","Selling remaining stock"]', 'Speculating about causes', '« Staff should not speculate about causes » : l''interdiction porte sur les explications, pas sur les retours.');

-- ============================================
-- C2
-- ============================================
insert into reading_passages (level, format, title, context, documents, position, xp_reward) values
('C2', 'text_completion', 'Une critique méthodologique', 'Extrait d''une revue scientifique. Trois mots manquent.',
 '[{"kind":"article","title":"Review — On the limits of the present study","text":"The authors are careful to __(1)__ their claims, and the paper is the better for it.\nWhere it falters is in the sampling: participants were recruited through a single online platform, which __(2)__ a population unlikely to be representative.\nNone of this invalidates the findings. It does, however, __(3)__ against the confident extrapolation that has followed in the press."}]', 23, 35),

('C2', 'passage', 'Un désaccord d''experts', 'Un rapport, une objection et une réponse — trois textes à lire les uns contre les autres.',
 '[{"kind":"article","title":"Commission report — summary of findings","text":"The programme met two of its five stated objectives. Cost overruns totalled eleven per cent, within the range considered acceptable for projects of this scale.\nWe conclude that the programme represents adequate value for money, though its governance was weak throughout."},
   {"kind":"email","title":"Dissenting note — Commissioner Aliyev","text":"I cannot endorse the conclusion. Meeting two objectives out of five is not adequate value by any ordinary reading, and the eleven per cent figure excludes the two contracts renegotiated mid-project.\nIncluding them, the true overrun approaches twenty per cent."},
   {"kind":"memo","title":"Response from the Chair","text":"Commissioner Aliyev is right about the renegotiated contracts, and the report should have said so.\nHe is wrong, however, to treat objective-counting as decisive. Two of the five objectives accounted for the great majority of the intended benefit; the remaining three were always secondary."}]', 24, 35);

insert into reading_questions (passage_id, position, question, options, correct_answer, explanation) values
(23, 1, 'Which word fits gap (1)?', '["qualify","quantify","justify","clarify"]', 'qualify', '« Qualify a claim » = nuancer une affirmation. Faux ami : rien à voir avec « qualifier » au sens de nommer.'),
(23, 2, 'Which word fits gap (2)?', '["yields","gives out","renders","produces up"]', 'yields', '« Yields a population » = produit un échantillon. Verbe consacré du registre scientifique.'),
(23, 3, 'Which word fits gap (3)?', '["caution","warn off","prevent","advise"]', 'caution', '« Caution against » = mettre en garde contre. « Warn » demanderait un complément d''objet direct.'),

(24, 1, 'What is the report''s overall conclusion?', '["Adequate value for money","Complete failure","Outstanding success","No conclusion is given"]', 'Adequate value for money', 'Le rapport conclut positivement tout en concédant une gouvernance faible. Distinguer la conclusion de ses réserves est l''enjeu.'),
(24, 2, 'On what factual point does the Chair agree with Aliyev?', '["The renegotiated contracts were excluded","The programme failed","The overrun was acceptable","Governance was strong"]', 'The renegotiated contracts were excluded', '« Aliyev is right about the renegotiated contracts » : le Président concède le fait tout en refusant la conclusion.'),
(24, 3, 'What is the real nature of their disagreement?', '["Whether counting objectives measures value","Whether the report was published","Whether costs were recorded","Whether the programme existed"]', 'Whether counting objectives measures value', 'Ils s''accordent sur les chiffres après correction. Le désaccord porte sur la méthode d''évaluation elle-même — un désaccord de critère, non de fait.');
