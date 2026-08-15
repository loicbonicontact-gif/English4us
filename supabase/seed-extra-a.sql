-- ============================================
-- SEED COMPLEMENTAIRE A — English4us
-- Ajoute 6 exercices aux leçons 1 à 10 (niveaux A1 et A2).
-- Chaque leçon passe ainsi de 3 à 9 exercices (~3 min).
-- Rejouable : on supprime d'abord les exercices complementaires
-- de ces leçons (ceux au-dela des 3 premiers).
-- À exécuter dans Supabase SQL Editor APRES seed.sql
-- ============================================

delete from exercises
where lesson_id between 1 and 10
  and id not in (
    select id from (
      select id, row_number() over (partition by lesson_id order by id) as rang
      from exercises where lesson_id between 1 and 10
    ) t where rang <= 3
  );

-- ---------- A1.1 Se présenter ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(1, 'qcm', 'Quelle est la réponse la plus naturelle à « How are you? »', '["I am fine, thanks.","I am good day.","Yes, I am.","How are you too."]', 'I am fine, thanks.', 'La réponse standard. « I am good » se dit aussi en anglais courant, mais « fine » reste le plus sûr.'),
(1, 'trous', 'Complète : « Where are you ___? » (D''où viens-tu ?)', null, 'from', '« Where are you from? » est figé. « Where do you come from? » existe aussi, mais est plus lourd.'),
(1, 'traduction', 'Traduis en anglais : « Enchanté de te rencontrer. »', null, 'Nice to meet you', 'Formule figée. « Pleased to meet you » est plus formel.'),
(1, 'qcm', 'Comment dit-on « Je suis français » ?', '["I am French","I am france","I am a french","I am from French"]', 'I am French', 'La nationalité prend une majuscule en anglais et s''emploie sans article.'),
(1, 'trous', 'Complète : « My name ___ Paul. »', null, 'is', 'Le verbe « be » à la 3ᵉ personne du singulier : « name » est le sujet, donc « is ».'),
(1, 'traduction', 'Traduis en anglais : « Comment tu t''appelles ? »', null, 'What is your name / What''s your name', 'On demande « quel » est ton nom, pas « comment » : donc « what », jamais « how ».');

-- ---------- A1.2 La famille ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(2, 'qcm', 'Comment appelle-t-on le fils de ton frère ?', '["My nephew","My cousin","My grandson","My uncle"]', 'My nephew', '« Nephew » = neveu. Sa sœur serait « niece ».'),
(2, 'trous', 'Complète : « This is my ___. » (ma femme)', null, 'wife', '« Wife » = épouse, pluriel irrégulier « wives ». « Woman » signifie simplement « femme ».'),
(2, 'traduction', 'Traduis en anglais : « Mon grand-père a 80 ans. »', null, 'My grandfather is eighty years old', 'Rappel : en anglais on **est** un âge. « Grandfather » s''écrit en un seul mot.'),
(2, 'qcm', 'Que signifie « in-laws » ?', '["La belle-famille","Les avocats","Les voisins","Les enfants"]', 'La belle-famille', '« Mother-in-law » = belle-mère, « brother-in-law » = beau-frère.'),
(2, 'trous', 'Complète : « I have two ___ and one sister. » (frères)', null, 'brothers', 'Pluriel régulier : on ajoute -s.'),
(2, 'traduction', 'Traduis en anglais : « Nous sommes une famille nombreuse. »', null, 'We are a big family / We have a big family', '« Nombreux » ne se traduit pas par « numerous » ici : on dit simplement « big » ou « large ».');

-- ---------- A1.3 Les nombres et l'heure ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(3, 'qcm', 'Quelle heure est-il ? — 10:45', '["It is a quarter to eleven","It is a quarter past ten","It is forty-five ten","It is eleven to quarter"]', 'It is a quarter to eleven', '« To » regarde vers l''heure suivante. 10:45, c''est un quart d''heure avant 11h.'),
(3, 'trous', 'Écris en lettres : 30 → ___', null, 'thirty', 'Attention à l''orthographe : « thirty », pas « thirsty » (qui signifie assoiffé).'),
(3, 'traduction', 'Traduis en anglais : « Il est midi. »', null, 'It is noon / It is midday / It is twelve o''clock', '« Noon » est le plus courant. Minuit se dit « midnight ».'),
(3, 'qcm', 'Comment lit-on l''année 1995 ?', '["nineteen ninety-five","one thousand nine hundred ninety-five","nineteen nine five","one nine nine five"]', 'nineteen ninety-five', 'Les années se lisent par paires de chiffres. 2005 fait exception : « two thousand and five ».'),
(3, 'trous', 'Complète : « The shop opens ___ 9 a.m. »', null, 'at', '« At » pour une heure précise, « on » pour un jour, « in » pour un mois.'),
(3, 'traduction', 'Traduis en anglais : « J''ai trois enfants. »', null, 'I have three children', '« Children » est le pluriel irrégulier de « child ». Jamais « childs ».');

-- ---------- A1.4 Nourriture et boissons ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(4, 'qcm', 'Comment commander poliment au restaurant ?', '["I would like a coffee, please.","Give me a coffee.","I want coffee now.","Coffee!"]', 'I would like a coffee, please.', '« I would like » est la forme polie de « I want », qui sonne brutal en anglais.'),
(4, 'trous', 'Complète : « How ___ sugar do you want? » (combien)', null, 'much', '« Much » pour l''indénombrable (sucre, eau), « many » pour ce qui se compte.'),
(4, 'traduction', 'Traduis en anglais : « Le petit-déjeuner est à sept heures. »', null, 'Breakfast is at seven o''clock', '« Breakfast » s''emploie sans article dans ce sens général.'),
(4, 'qcm', 'Lequel est indénombrable ?', '["water","apple","sandwich","egg"]', 'water', 'On ne dit pas « two waters » mais « two glasses of water ».'),
(4, 'trous', 'Complète : « I am ___. Let''s eat! » (j''ai faim)', null, 'hungry', 'En anglais on **est** affamé (I am hungry), on n''**a** pas faim.'),
(4, 'traduction', 'Traduis en anglais : « Elle boit du thé tous les matins. »', null, 'She drinks tea every morning', '3ᵉ personne du singulier au présent simple : « drinks » avec un -s.');

-- ---------- A1.5 Verbes essentiels ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(5, 'qcm', 'Choisis : « ___ you like coffee? »', '["Do","Are","Is","Does"]', 'Do', 'Avec « you », l''auxiliaire est « do ». « Does » se réserve à he/she/it.'),
(5, 'trous', 'Complète : « He ___ not have a car. »', null, 'does', 'Négation au présent, 3ᵉ personne : « does not have », et le verbe reste à la base.'),
(5, 'traduction', 'Traduis en anglais : « Je n''ai pas de frères. »', null, 'I do not have any brothers / I have no brothers', '« Any » accompagne la négation. « I don''t have brothers » est accepté à l''oral.'),
(5, 'qcm', 'Quelle phrase est correcte ?', '["She does not like tea.","She do not likes tea.","She not like tea.","She does not likes tea."]', 'She does not like tea.', 'Une seule marque de 3ᵉ personne : elle est portée par « does », pas par le verbe.'),
(5, 'trous', 'Complète : « We ___ happy today. » (sommes)', null, 'are', 'Le verbe « be » : we/you/they → « are ».'),
(5, 'traduction', 'Traduis en anglais : « Est-ce qu''elle a un chien ? »', null, 'Does she have a dog', 'Question avec « does » devant le sujet, puis le verbe à la base.');

-- ---------- A2.1 Le passé simple ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(6, 'qcm', 'Quel est le prétérit de « buy » ?', '["bought","buyed","boughted","buys"]', 'bought', 'Irrégulier : buy / bought / bought.'),
(6, 'trous', 'Complète : « She ___ to Paris last year. » (aller)', null, 'went', '« Last year » situe l''action dans un passé achevé : prétérit obligatoire.'),
(6, 'traduction', 'Traduis en anglais : « Nous avons mangé au restaurant hier. »', null, 'We ate at the restaurant yesterday', 'Le passé composé français se rend par le prétérit anglais quand la date est précisée.'),
(6, 'qcm', 'Choisis : « Did you ___ the film? »', '["watch","watched","watching","watches"]', 'watch', 'Après « did », le verbe revient toujours à sa forme de base.'),
(6, 'trous', 'Complète : « They ___ at home yesterday. » (étaient)', null, 'were', 'Prétérit de « be » : I/he/she/it → was ; we/you/they → were.'),
(6, 'traduction', 'Traduis en anglais : « Il a écrit une lettre. »', null, 'He wrote a letter', 'Irrégulier : write / wrote / written.');

-- ---------- A2.2 Voyages et directions ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(7, 'qcm', 'Que signifie « go straight ahead » ?', '["Continue tout droit","Tourne à droite","Fais demi-tour","Arrête-toi"]', 'Continue tout droit', '« Straight » = droit devant. À ne pas confondre avec « right » = à droite.'),
(7, 'trous', 'Complète : « The museum is ___ the corner. » (au coin)', null, 'on', '« On the corner » pour un angle de rue. « In the corner » désignerait le coin d''une pièce.'),
(7, 'traduction', 'Traduis en anglais : « Où est la gare ? »', null, 'Where is the train station / Where is the station', '« Station » seul suffit dans le contexte. « Gare » ne se traduit jamais par « gar ».'),
(7, 'qcm', 'Comment dit-on « un aller-retour » ?', '["a return ticket","a go-back ticket","a two-way ticket","a double ticket"]', 'a return ticket', 'En anglais britannique : « return ». En américain : « round trip ».'),
(7, 'trous', 'Complète : « I am going ___ holiday next week. »', null, 'on', '« On holiday » (britannique) ou « on vacation » (américain). Jamais « in holiday ».'),
(7, 'traduction', 'Traduis en anglais : « Le vol dure deux heures. »', null, 'The flight takes two hours / The flight lasts two hours', 'On utilise « take » pour une durée de trajet.');

-- ---------- A2.3 Achats et argent ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(8, 'qcm', 'Que signifie « It is on sale » ?', '["C''est en promotion","C''est en vente libre","C''est vendu","C''est salé"]', 'C''est en promotion', 'Piège : « on sale » = en solde. « For sale » = à vendre.'),
(8, 'trous', 'Complète : « Can I try it ___? » (essayer un vêtement)', null, 'on', '« Try on » = essayer un vêtement. « Try out » = tester un objet.'),
(8, 'traduction', 'Traduis en anglais : « C''est trop cher pour moi. »', null, 'It is too expensive for me', '« Too » = trop (excès). « Very » signifierait seulement « très ».'),
(8, 'qcm', 'Comment dit-on « la monnaie » (qu''on rend) ?', '["change","money","coins","currency"]', 'change', '« Change » = monnaie rendue. « Currency » désigne la devise d''un pays.'),
(8, 'trous', 'Complète : « I got a 20% ___ on this jacket. » (réduction)', null, 'discount', '« Discount » = remise. « Reduction » existe mais est moins courant dans le commerce.'),
(8, 'traduction', 'Traduis en anglais : « Combien ça coûte ? »', null, 'How much does it cost / How much is it', 'Deux formulations également correctes et courantes.');

-- ---------- A2.4 Décrire son quotidien ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(9, 'qcm', 'Choisis : « I ___ go to bed late. » (rarement)', '["rarely","rare","rarity","rarest"]', 'rarely', '« Rarely » est l''adverbe. « Rare » est l''adjectif.'),
(9, 'trous', 'Complète : « She ___ breakfast at 7. » (prend)', null, 'has', 'On « a » son petit-déjeuner en anglais : « have breakfast », jamais « take breakfast ».'),
(9, 'traduction', 'Traduis en anglais : « Je travaille de 9h à 17h. »', null, 'I work from nine to five', '« From… to… » pour un intervalle. « Nine to five » est même devenu une expression.'),
(9, 'qcm', 'Où placer « usually » ? « I ___ have lunch at noon. »', '["usually","usual","usualy","usually the"]', 'usually', 'Les adverbes de fréquence se placent avant le verbe principal.'),
(9, 'trous', 'Complète : « He ___ his teeth twice a day. » (se brosse)', null, 'brushes', '« Brush » prend -es à la 3ᵉ personne, car il se termine par -sh.'),
(9, 'traduction', 'Traduis en anglais : « Le week-end, je fais du sport. »', null, 'I do sport at the weekend / I play sports on weekends', 'Britannique : « at the weekend ». Américain : « on the weekend ».');

-- ---------- A2.5 Le futur ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(10, 'qcm', 'Choisis : « I ___ visit my grandmother tomorrow. » (projet décidé)', '["am going to","will be","would","am will"]', 'am going to', 'Projet déjà décidé : « going to ». « Will » exprimerait une décision prise à l''instant.'),
(10, 'trous', 'Complète : « I think it ___ be a good year. » (opinion)', null, 'will', 'Après « I think », on exprime une opinion sur le futur : « will ».'),
(10, 'traduction', 'Traduis en anglais : « Je te rappellerai demain. »', null, 'I will call you back tomorrow', '« Call back » = rappeler au téléphone.'),
(10, 'qcm', 'Quelle phrase exprime un horaire fixe ?', '["The train leaves at 6.","The train will leave at 6.","The train is going to leave at 6.","The train would leave at 6."]', 'The train leaves at 6.', 'Les horaires officiels s''expriment au présent simple, comme en français.'),
(10, 'trous', 'Complète : « She ___ going to move to London. »', null, 'is', '« Be going to » : le verbe « be » s''accorde avec le sujet.'),
(10, 'traduction', 'Traduis en anglais : « Il ne viendra pas ce soir. »', null, 'He will not come tonight / He won''t come tonight', '« Won''t » est la contraction de « will not », très courante à l''oral.');
