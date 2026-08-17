-- ============================================
-- SEED — vocabulaire, deuxième série
-- 150 exercices : 5 par leçon, A1 -> C2.
--
-- À exécuter APRÈS seed-vocabulary.sql. Rejouable : marqueur « [voc2] »,
-- indépendant de la première série marquée « [voc] ».
--
-- CE QUE CETTE SÉRIE AJOUTE
-- La première série posait le socle. Celle-ci vise ce qui fait réellement
-- trébucher : les faux amis, les verbes à particule, les collocations
-- (les mots qui vont ensemble et qu'aucune règle ne prédit), et le lexique
-- des documents professionnels — celui des parties 5, 6 et 7 du TOEIC.
--
-- Les verbes à particule ont une place à part : « look after », « call
-- off », « turn down » n'ont aucun rapport avec le sens de leurs éléments.
-- Ils sont invisibles au dictionnaire et omniprésents à l'oral.
-- ============================================

delete from exercises where explanation like '%[voc2]';

-- ---------- A1.1 Se présenter ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(1, 'qcm', 'Comment répondre à « How do you do? » ?', '["How do you do?","Very good","I am fine thanks","Nothing special"]', 'How do you do?', 'Formule figée et formelle : on répond par la même phrase, ce n''est pas une vraie question. « How are you? » attend en revanche une réponse. [voc2]'),
(1, 'qcm', 'Que veut dire « to be called » ?', '["S''appeler","Être appelé au téléphone","Être convoqué","Crier"]', 'S''appeler', '« I am called Marie » est correct mais rare ; « My name is Marie » est plus naturel. [voc2]'),
(1, 'trous', 'Complète : « Where are you ___? » (D''où viens-tu ?)', null, 'from', '« Where are you from? » La préposition se place à la fin en anglais, jamais au début comme en français. [voc2]'),
(1, 'trous', 'Complète : « Let me ___ myself. » (Permettez-moi de me présenter.)', null, 'introduce', '« Introduce » = présenter quelqu''un. Faux ami : « introduire » un objet se dit « insert ». [voc2]'),
(1, 'traduction', 'Traduis en anglais : « Comment ça s''écrit ? »', null, 'How do you spell it/How do you spell that', '« Spell » = épeler. Question indispensable quand on donne son nom au téléphone. [voc2]'),

-- ---------- A1.2 La famille ----------
(2, 'qcm', 'Que veut dire « to look after » ?', '["S''occuper de","Chercher","Ressembler à","Regarder derrière"]', 'S''occuper de', 'Verbe à particule : « look after the children » = garder les enfants. Rien à voir avec regarder. [voc2]'),
(2, 'qcm', 'Que désigne « a relative » ?', '["Un membre de la famille","Un ami proche","Un voisin","Un collègue"]', 'Un membre de la famille', '« Relatives » = la parenté. Attention : « parents » en anglais ne désigne que le père et la mère. [voc2]'),
(2, 'trous', 'Complète : « He takes ___ his father. » (Il tient de son père.)', null, 'after', '« Take after someone » = ressembler à un parent. Encore un verbe à particule imprévisible. [voc2]'),
(2, 'trous', 'Complète : « They are bringing ___ three children. » (élever)', null, 'up', '« Bring up » = élever un enfant. « Raise » se dit aussi, surtout en américain. [voc2]'),
(2, 'traduction', 'Traduis en anglais : « Je suis fils unique. »', null, 'I am an only child/I''m an only child', '« Only child » quel que soit le sexe. « Unique child » serait un contresens : « unique » signifie exceptionnel. [voc2]'),

-- ---------- A1.3 Les nombres et l'heure ----------
(3, 'qcm', 'Que veut dire « It is a quarter to six » ?', '["17 h 45","18 h 15","16 h 45","6 h 25"]', '17 h 45', '« To » retranche : un quart avant six heures. « Past » ajoute : « a quarter past six » = 18 h 15. [voc2]'),
(3, 'qcm', 'Comment écrit-on la date 03/04 en anglais britannique ?', '["3 April","4 March","March 3","April 4"]', '3 April', 'Britannique : jour/mois. Américain : mois/jour, donc 3 April deviendrait 04/03. Source d''erreurs coûteuses au travail. [voc2]'),
(3, 'trous', 'Complète : « The meeting lasts one ___ and a half. » (heure)', null, 'hour', '« One hour and a half » ou « an hour and a half ». Attention : « half an hour » = une demi-heure. [voc2]'),
(3, 'trous', 'Complète : « I will be there ___ ten minutes. » (dans dix minutes)', null, 'in', '« In ten minutes » = dans dix minutes. « Within ten minutes » signifierait « en moins de dix minutes ». [voc2]'),
(3, 'traduction', 'Traduis en anglais : « Il est presque midi. »', null, 'It is almost noon/It''s nearly noon/It is nearly midday', '« Almost » et « nearly » sont interchangeables ici. Tous deux se placent devant le mot qu''ils modifient. [voc2]'),

-- ---------- A1.4 Nourriture et boissons ----------
(4, 'qcm', 'Que veut dire « to take away » (nourriture) ?', '["À emporter","À jeter","À réchauffer","À partager"]', 'À emporter', '« Takeaway » en britannique, « takeout » en américain. « Eat in » signifie sur place. [voc2]'),
(4, 'qcm', 'Quel mot signifie « épicé » ?', '["spicy","spiced","sharp","hot only"]', 'spicy', '« Spicy » = épicé, piquant. « Hot » veut dire chaud ET piquant : le contexte tranche. [voc2]'),
(4, 'trous', 'Complète : « I am ___ of nuts. » (allergique)', null, 'allergic', 'Attention : la construction est « allergic TO nuts ». Le mot manquant reste « allergic ». [voc2]'),
(4, 'trous', 'Complète : « Could I have a ___ of water? » (un verre)', null, 'glass', '« A glass of water » : « glass » désigne le verre-récipient. Le verre-matière est aussi « glass », indénombrable. [voc2]'),
(4, 'traduction', 'Traduis en anglais : « J''ai faim. »', null, 'I am hungry/I''m hungry', 'En anglais on EST affamé, on ne l''a pas. Même logique que pour l''âge : « I am twenty ». [voc2]'),

-- ---------- A1.5 Verbes essentiels ----------
(5, 'qcm', 'Quelle est la différence entre « to say » et « to tell » ?', '["Tell demande un destinataire","Say est plus formel","Tell est au passé","Aucune différence"]', 'Tell demande un destinataire', '« Tell me » (à qui), « say something » (quoi). « Say me » est une faute très fréquente. [voc2]'),
(5, 'qcm', 'Que veut dire « to give up » ?', '["Abandonner","Donner","Se lever","Rendre"]', 'Abandonner', '« Give up smoking » = arrêter de fumer. Le sens n''a rien à voir avec « donner ». [voc2]'),
(5, 'trous', 'Complète : « I need to ___ out this form. » (remplir)', null, 'fill', '« Fill out » ou « fill in » un formulaire. « Complete » se dit aussi, plus formel. [voc2]'),
(5, 'trous', 'Complète : « Please turn ___ the light. » (éteindre)', null, 'off', '« Turn off » = éteindre, « turn on » = allumer. « Turn down » = baisser le volume. [voc2]'),
(5, 'traduction', 'Traduis en anglais : « Je suis d''accord. »', null, 'I agree', '« Agree » est un VERBE : jamais « I am agree ». L''une des fautes les plus répandues chez les francophones. [voc2]'),

-- ---------- A2.1 Le passé simple ----------
(6, 'qcm', 'Quel est le passé de « to lead » (diriger) ?', '["led","leaded","lead","leded"]', 'led', '« Lead » -> « led ». Attention : « lead » le métal se prononce déjà « led ». [voc2]'),
(6, 'qcm', 'Que veut dire « used to » ?', '["Avait l''habitude de","Est utilisé pour","A besoin de","Vient de"]', 'Avait l''habitude de', '« I used to smoke » = je fumais autrefois, plus maintenant. Ne pas confondre avec « to be used to » (être habitué à). [voc2]'),
(6, 'trous', 'Complète : « She ___ born in 1990. » (naître)', null, 'was', '« Be born » est toujours au passif : « I was born ». « I born » n''existe pas. [voc2]'),
(6, 'trous', 'Complète : « We ___ up early yesterday. » (se lever)', null, 'got', '« Get up » -> « got up ». Verbe irrégulier à particule : seul le verbe change. [voc2]'),
(6, 'traduction', 'Traduis en anglais : « Il y avait beaucoup de monde. »', null, 'There were a lot of people/There was a big crowd', '« People » est toujours pluriel : « there WERE ». « Peoples » n''existe qu''au sens de « les peuples ». [voc2]'),

-- ---------- A2.2 Voyages et directions ----------
(7, 'qcm', 'Que veut dire « to check in » ?', '["S''enregistrer","Vérifier","Entrer","Réserver"]', 'S''enregistrer', '« Check in » à l''hôtel ou à l''aéroport. « Check out » = régler et partir. [voc2]'),
(7, 'qcm', 'Que désigne « a delay » ?', '["Un retard","Un délai accordé","Une durée","Une annulation"]', 'Un retard', 'Faux ami majeur. « Delay » = retard subi. Un délai imparti se dit « deadline » ou « time frame ». [voc2]'),
(7, 'trous', 'Complète : « The flight was ___ off. » (annulé)', null, 'called', '« Call off » = annuler. « Cancel » se dit aussi, mais « call off » est plus courant à l''oral. [voc2]'),
(7, 'trous', 'Complète : « We got ___ at the wrong stop. » (descendre)', null, 'off', '« Get off » un bus ou un train, « get out of » une voiture. La particule change selon le véhicule. [voc2]'),
(7, 'traduction', 'Traduis en anglais : « Je suis perdu. »', null, 'I am lost/I''m lost', '« Lost » est un participe passé employé comme adjectif. « I lost me » serait un contresens. [voc2]'),

-- ---------- A2.3 Achats et argent ----------
(8, 'qcm', 'Que veut dire « a refund » ?', '["Un remboursement","Une réduction","Un acompte","Un fonds"]', 'Un remboursement', '« Refund » = remboursement. « Discount » = remise, « deposit » = acompte. Trois mots à ne pas mélanger. [voc2]'),
(8, 'qcm', 'Que veut dire « to run out of » ?', '["Être à court de","Sortir en courant","Dépasser","Épuiser quelqu''un"]', 'Être à court de', '« We have run out of paper » = nous n''avons plus de papier. Verbe à particule très fréquent au bureau. [voc2]'),
(8, 'trous', 'Complète : « Is this item in ___? » (en stock)', null, 'stock', '« In stock » = disponible, « out of stock » = épuisé. Vocabulaire central de la partie 7 du TOEIC. [voc2]'),
(8, 'trous', 'Complète : « I would like to pay in ___. » (en espèces)', null, 'cash', '« Cash » = espèces. « Money » désigne l''argent en général, pas le mode de paiement. [voc2]'),
(8, 'traduction', 'Traduis en anglais : « Ça coûte combien ? »', null, 'How much is it/How much does it cost', '« How much » pour un prix, « how many » pour un nombre d''objets. [voc2]'),

-- ---------- A2.4 Décrire son quotidien ----------
(9, 'qcm', 'Que veut dire « to get on with » quelqu''un ?', '["Bien s''entendre avec","Monter avec","Continuer avec","Partir avec"]', 'Bien s''entendre avec', '« I get on well with my colleagues » = je m''entends bien avec. En américain : « get along with ». [voc2]'),
(9, 'qcm', 'Que signifie « a chore » ?', '["Une corvée ménagère","Un chœur","Une chorale","Un choix"]', 'Une corvée ménagère', '« Household chores » = les tâches ménagères. Se prononce « tchor », rien à voir avec le français « chœur ». [voc2]'),
(9, 'trous', 'Complète : « I usually ___ up at seven. » (se réveiller)', null, 'wake', '« Wake up » = se réveiller, « get up » = sortir du lit. La distinction existe aussi en français. [voc2]'),
(9, 'trous', 'Complète : « She is used ___ working late. » (habituée à)', null, 'to', '« Be used TO + verbe en -ing ». Ne pas confondre avec « used to + infinitif », qui parle du passé. [voc2]'),
(9, 'traduction', 'Traduis en anglais : « Je fais les courses le samedi. »', null, 'I do the shopping on Saturdays/I go shopping on Saturdays', '« Do the shopping » = faire les courses alimentaires. « Go shopping » évoque plutôt le lèche-vitrine. [voc2]'),

-- ---------- A2.5 Le futur ----------
(10, 'qcm', 'Que veut dire « to be about to » ?', '["Être sur le point de","Parler de","Être environ","Réfléchir à"]', 'Être sur le point de', '« I am about to leave » = je suis sur le point de partir. Futur très proche, plus immédiat que « going to ». [voc2]'),
(10, 'qcm', 'Que veut dire « to put off » ?', '["Reporter","Enlever","Éteindre","Poser"]', 'Reporter', '« Put off the meeting » = reporter la réunion. Synonyme de « postpone », mais plus courant à l''oral. [voc2]'),
(10, 'trous', 'Complète : « The train is due ___ arrive at noon. »', null, 'to', '« Due to arrive » = doit arriver. « Due » suivi d''un infinitif exprime une prévision d''horaire. [voc2]'),
(10, 'trous', 'Complète : « I am ___ forward to it. » (j''attends ça avec impatience)', null, 'looking', '« Looking forward to » — attention, la forme est toujours en -ing après « to ». [voc2]'),
(10, 'traduction', 'Traduis en anglais : « On verra bien. »', null, 'We will see/We''ll see/Let us see', 'Formule d''attente. « We will see well » serait un calque incompréhensible. [voc2]'),

-- ---------- B1.1 Exprimer une opinion ----------
(11, 'qcm', 'Que veut dire « to be biased » ?', '["Être partial","Être biaisé techniquement","Être hésitant","Être franc"]', 'Être partial', '« A biased report » = un rapport orienté. Mot central de tout esprit critique. [voc2]'),
(11, 'qcm', 'Que veut dire « to point out » ?', '["Faire remarquer","Pointer du doigt","Sortir","Désigner un lieu"]', 'Faire remarquer', '« I would point out that… » sert à corriger poliment son interlocuteur en réunion. [voc2]'),
(11, 'trous', 'Complète : « I take your ___. » (Je comprends votre argument.)', null, 'point', '« I take your point » concède l''argument avant d''y répondre. Formule de débat courtois. [voc2]'),
(11, 'trous', 'Complète : « That is beside the ___. » (hors sujet)', null, 'point', '« Beside the point » = à côté de la question. Sert à écarter un argument sans le contredire. [voc2]'),
(11, 'traduction', 'Traduis en anglais : « Ça dépend du point de vue. »', null, 'It depends on your point of view/That depends on the point of view', '« Depend ON » toujours. Le calque « depend of » vient directement du français. [voc2]'),

-- ---------- B1.2 Le monde du travail ----------
(12, 'qcm', 'Que désigne « a shift » ?', '["Une équipe de travail (horaire)","Un changement de poste","Un déplacement","Une chemise"]', 'Une équipe de travail (horaire)', '« Night shift » = équipe de nuit. « Shift work » = travail posté. Vocabulaire fréquent au TOEIC. [voc2]'),
(12, 'qcm', 'Que veut dire « to hand in your notice » ?', '["Démissionner","Prendre note","Rendre un document","Recevoir un avertissement"]', 'Démissionner', '« Notice » = préavis. « Hand in your notice » = poser sa démission. [voc2]'),
(12, 'trous', 'Complète : « He was ___ over for promotion. » (écarté)', null, 'passed', '« Pass over someone » = ne pas retenir quelqu''un pour une promotion. Nuance amère, pas neutre. [voc2]'),
(12, 'trous', 'Complète : « She is in ___ of the project. » (responsable)', null, 'charge', '« In charge of » = responsable de. « Responsible for » se dit aussi, mais insiste sur la faute possible. [voc2]'),
(12, 'traduction', 'Traduis en anglais : « Je travaille à temps partiel. »', null, 'I work part-time/I work part time', '« Part-time » et « full-time » s''écrivent avec un trait d''union quand ils sont adjectifs. [voc2]'),

-- ---------- B1.3 Present perfect ----------
(13, 'qcm', 'Quelle phrase est correcte ?', '["I have been to Rome twice","I have gone to Rome twice","I am been to Rome","I have been in Rome twice"]', 'I have been to Rome twice', '« Been to » = y être allé et revenu. « Gone to » signifierait qu''on y est encore. [voc2]'),
(13, 'qcm', 'Que veut dire « so far » ?', '["Jusqu''ici","Si loin","Presque","Rarement"]', 'Jusqu''ici', '« So far, so good » = jusqu''ici tout va bien. Ne pas confondre avec « far from », qui nie. [voc2]'),
(13, 'trous', 'Complète : « I have not seen him ___ Monday. » (depuis lundi)', null, 'since', '« Since » + point de départ, « for » + durée. Le test : peut-on répondre « quand ? » — alors c''est « since ». [voc2]'),
(13, 'trous', 'Complète : « Have you finished ___? » (déjà, fin de phrase)', null, 'yet', '« Yet » se place en fin de question ou de négation. « Already » marquerait la surprise. [voc2]'),
(13, 'traduction', 'Traduis en anglais : « Ça fait trois ans que je vis ici. »', null, 'I have lived here for three years/I''ve been living here for three years', 'Le français utilise « ça fait… que » ; l''anglais utilise le present perfect. Pas de traduction mot à mot possible. [voc2]'),

-- ---------- B1.4 Santé et bien-être ----------
(14, 'qcm', 'Que veut dire « to come down with » ?', '["Attraper une maladie","Descendre","Se calmer","Se plaindre"]', 'Attraper une maladie', '« I am coming down with a cold » = je crois que j''attrape un rhume. Verbe à particule courant. [voc2]'),
(14, 'qcm', 'Que désigne « a check-up » ?', '["Un bilan de santé","Une vérification technique","Un contrôle fiscal","Une caisse"]', 'Un bilan de santé', '« Annual check-up » = visite médicale annuelle. À distinguer de « checkout » (caisse ou départ d''hôtel). [voc2]'),
(14, 'trous', 'Complète : « I need to cut ___ on sugar. » (réduire)', null, 'down', '« Cut down on » = réduire sa consommation. « Cut out » signifierait supprimer complètement. [voc2]'),
(14, 'trous', 'Complète : « He is getting ___ from the flu. » (se remettre)', null, 'over', '« Get over an illness » = se remettre. S''emploie aussi pour un chagrin. [voc2]'),
(14, 'traduction', 'Traduis en anglais : « Je me sens mieux. »', null, 'I feel better/I am feeling better', '« Feel » ne demande pas de pronom réfléchi : « I feel myself better » est une faute fréquente. [voc2]'),

-- ---------- B1.5 Comparatifs ----------
(15, 'qcm', 'Que veut dire « twice as expensive » ?', '["Deux fois plus cher","Deux fois moins cher","Presque aussi cher","Trop cher"]', 'Deux fois plus cher', '« Twice as… as » = deux fois plus. « Half as expensive » serait deux fois moins. [voc2]'),
(15, 'qcm', 'Quelle phrase est correcte ?', '["It is the same as before","It is same than before","It is the same than before","It is same as before"]', 'It is the same as before', '« The same AS », jamais « than ». « Than » ne s''emploie qu''après un comparatif. [voc2]'),
(15, 'trous', 'Complète : « This model is by ___ the best. » (de loin)', null, 'far', '« By far the best » = de loin le meilleur. Renforce un superlatif, pas un comparatif. [voc2]'),
(15, 'trous', 'Complète : « It is not ___ as good as I hoped. » (aussi)', null, 'as', '« Not as good as » = pas aussi bon que. « So » se dit aussi, mais surtout en registre soutenu. [voc2]'),
(15, 'traduction', 'Traduis en anglais : « Plus c''est simple, mieux c''est. »', null, 'The simpler the better/The simpler, the better', 'Structure « the + comparatif, the + comparatif ». Aucun verbe n''est nécessaire dans cette forme figée. [voc2]'),

-- ---------- B2.1 Débattre et argumenter ----------
(16, 'qcm', 'Que veut dire « to back up a claim » ?', '["Étayer une affirmation","Reculer","Annuler","Répéter"]', 'Étayer une affirmation', '« Back up » = appuyer, soutenir. En informatique, le même verbe signifie sauvegarder. [voc2]'),
(16, 'qcm', 'Que veut dire « admittedly » ?', '["Certes","Absolument","Rarement","Officiellement"]', 'Certes', 'Marqueur de concession : on reconnaît un point avant de le nuancer. Signale un argument honnête. [voc2]'),
(16, 'trous', 'Complète : « That is beside the ___. » (hors de propos)', null, 'point', 'Sert à écarter une objection sans la réfuter : elle n''est simplement pas pertinente ici. [voc2]'),
(16, 'trous', 'Complète : « The figures speak for ___. » (parlent d''eux-mêmes)', null, 'themselves', '« Speak for themselves » = se passent de commentaire. Formule de clôture d''argumentation. [voc2]'),
(16, 'traduction', 'Traduis en anglais : « Cet argument ne tient pas. »', null, 'That argument does not hold/That argument does not stand up', '« Hold » ou « stand up » : les deux images existent, comme « tenir debout » en français. [voc2]'),

-- ---------- B2.2 Conditionnels ----------
(17, 'qcm', 'Que veut dire « provided that » ?', '["À condition que","Fourni par","Bien que","Étant donné que"]', 'À condition que', '« Provided that we agree » = à condition que nous soyons d''accord. Registre formel, fréquent dans les contrats. [voc2]'),
(17, 'qcm', 'Que veut dire « otherwise » ?', '["Sinon","Autrement dit","Par ailleurs","Sagement"]', 'Sinon', '« Hurry, otherwise we will be late » = sinon nous serons en retard. À ne pas confondre avec « in other words ». [voc2]'),
(17, 'trous', 'Complète : « ___ you leave now, you will miss it. » (à moins que)', null, 'Unless', '« Unless » contient déjà la négation : « unless you leave » = si tu ne pars pas. [voc2]'),
(17, 'trous', 'Complète : « In ___ of emergency, call this number. » (en cas de)', null, 'case', '« In case of » + nom. « In case » seul, sans « of », introduit une proposition entière. [voc2]'),
(17, 'traduction', 'Traduis en anglais : « À ta place, j''attendrais. »', null, 'If I were you, I would wait/If I were you, I''d wait', 'Le français « à ta place » n''a pas d''équivalent littéral : on passe par le deuxième conditionnel. [voc2]'),

-- ---------- B2.3 Environnement et société ----------
(18, 'qcm', 'Que veut dire « to phase out » ?', '["Supprimer progressivement","Mettre en phase","Accélérer","Externaliser"]', 'Supprimer progressivement', '« Phase out plastic bags » = éliminer par étapes. « Phase in » désigne l''introduction progressive. [voc2]'),
(18, 'qcm', 'Que désigne « a stakeholder » ?', '["Une partie prenante","Un actionnaire uniquement","Un investisseur","Un fournisseur"]', 'Une partie prenante', '« Stakeholder » est plus large que « shareholder » (actionnaire) : il inclut salariés, riverains, clients. [voc2]'),
(18, 'trous', 'Complète : « We must cut ___ on waste. » (réduire)', null, 'down', '« Cut down on » = réduire. La particule « on » est obligatoire devant le complément. [voc2]'),
(18, 'trous', 'Complète : « Renewable energy is on the ___. » (en hausse)', null, 'rise', '« On the rise » = en augmentation. « On the decline » exprime l''inverse. [voc2]'),
(18, 'traduction', 'Traduis en anglais : « Il faut agir maintenant. »', null, 'We must act now/Action is needed now/We need to act now', '« Act » = agir. Faux ami : « actual » ne veut pas dire actuel mais réel. [voc2]'),

-- ---------- B2.4 Voix passive ----------
(19, 'qcm', 'Que veut dire « to be held » (une réunion) ?', '["Se tenir","Être retenu","Être tenu en main","Être annulé"]', 'Se tenir', '« The meeting will be held on Friday » = aura lieu vendredi. Formule standard des convocations. [voc2]'),
(19, 'qcm', 'Que veut dire « to be turned down » ?', '["Être refusé","Être baissé","Être retourné","Être renvoyé"]', 'Être refusé', '« My application was turned down » = ma candidature a été rejetée. Même verbe que baisser le son. [voc2]'),
(19, 'trous', 'Complète : « The order has been ___. » (traitée)', null, 'processed', '« Process an order » = traiter une commande. Verbe central de la logistique au TOEIC. [voc2]'),
(19, 'trous', 'Complète : « Visitors are ___ to sign in. » (priés de)', null, 'requested/required', '« Requested » est une demande polie, « required » une obligation. Les deux se lisent sur les panneaux. [voc2]'),
(19, 'traduction', 'Traduis en anglais : « On m''a dit d''attendre. »', null, 'I was told to wait', 'Le « on » français impersonnel se rend par un passif en anglais. « One told me » serait très maladroit. [voc2]'),

-- ---------- B2.5 Anglais professionnel ----------
(20, 'qcm', 'Que désigne « an estimate » (devis) ?', '["Une estimation chiffrée","Une facture","Un acompte","Une commande"]', 'Une estimation chiffrée', '« Estimate » ou « quote » = devis. « Invoice » = facture, émise après la prestation. [voc2]'),
(20, 'qcm', 'Que veut dire « to follow up » ?', '["Relancer","Suivre quelqu''un","Terminer","Résumer"]', 'Relancer', '« I am following up on my last email » = je me permets de relancer. Formule très courante. [voc2]'),
(20, 'trous', 'Complète : « Payment is due ___ 30 days. » (sous 30 jours)', null, 'within', '« Within 30 days » = dans un délai de 30 jours. « In 30 days » signifierait exactement au 30e jour. [voc2]'),
(20, 'trous', 'Complète : « Please do not ___ to contact us. » (hésiter)', null, 'hesitate', '« Do not hesitate to contact us » clôt la plupart des e-mails commerciaux. Formule figée. [voc2]'),
(20, 'traduction', 'Traduis en anglais : « Veuillez trouver ci-joint notre devis. »', null, 'Please find attached our quote/Please find our estimate attached', '« Please find attached » : l''ordre des mots est figé, ne pas traduire mot à mot depuis le français. [voc2]'),

-- ---------- C1.1 Nuances et registres ----------
(21, 'qcm', 'Que sous-entend « I hear what you are saying » ?', '["Un désaccord poli","Un accord total","Une demande de répétition","Un compliment"]', 'Un désaccord poli', 'Formule à double fond : elle reconnaît sans adhérer. Souvent suivie d''un « but ». [voc2]'),
(21, 'qcm', 'Que veut dire « arguably » ?', '["On peut soutenir que","De façon contestable","En se disputant","Certainement"]', 'On peut soutenir que', '« Arguably the best » = sans doute le meilleur, avec une réserve implicite. Marqueur de prudence savante. [voc2]'),
(21, 'trous', 'Complète : « I would ___ suggest we wait. » (respectueusement)', null, 'respectfully', '« I would respectfully suggest » adoucit une opposition ferme. Registre diplomatique. [voc2]'),
(21, 'trous', 'Complète : « That is not ___ what I meant. » (tout à fait)', null, 'quite', '« Not quite » corrige sans humilier. Bien plus doux que « that is wrong ». [voc2]'),
(21, 'traduction', 'Traduis en anglais : « Je crains que ce ne soit pas possible. »', null, 'I am afraid that will not be possible/I''m afraid that is not possible', '« I am afraid » n''exprime aucune crainte : c''est le marqueur standard du refus poli. [voc2]'),

-- ---------- C1.2 Conditionnels avancés ----------
(22, 'qcm', 'Que veut dire « but for your help » ?', '["Sans ton aide","Grâce à ton aide","Malgré ton aide","Pour ton aide"]', 'Sans ton aide', '« But for » = sans, n''eût été. Registre soutenu, souvent suivi d''un conditionnel passé. [voc2]'),
(22, 'qcm', 'Que veut dire « I would sooner » ?', '["Je préférerais","Je viendrais plus tôt","Je finirais vite","Je devrais"]', 'Je préférerais', '« I would sooner wait » = je préférerais attendre. Synonyme soutenu de « I would rather ». [voc2]'),
(22, 'trous', 'Complète : « Were it not ___ the delay, we would have finished. »', null, 'for', '« Were it not for » = si ce n''était pas à cause de. Inversion littéraire de « if it were not for ». [voc2]'),
(22, 'trous', 'Complète : « Should you ___ questions, let me know. » (avoir)', null, 'have', '« Should you have questions » = si d''aventure vous aviez des questions. Inversion très formelle des e-mails. [voc2]'),
(22, 'traduction', 'Traduis en anglais : « Nous aurions dû l''anticiper. »', null, 'We should have anticipated it/We should have foreseen it', '« Should have » + participe exprime le reproche rétrospectif, envers soi-même ici. [voc2]'),

-- ---------- C1.3 Actualités et médias ----------
(23, 'qcm', 'Que veut dire « to break a story » ?', '["Révéler une information","Démentir","Interrompre un récit","Résumer"]', 'Révéler une information', '« Breaking news » vient de là : l''information qui vient d''être révélée. [voc2]'),
(23, 'qcm', 'Que désigne « a retraction » ?', '["Un démenti publié","Une rétractation musculaire","Un retrait de vente","Une réduction"]', 'Un démenti publié', 'Un journal publie une « retraction » quand il reconnaît une erreur. Terme juridique et journalistique. [voc2]'),
(23, 'trous', 'Complète : « The claim was later ___. » (démentie)', null, 'denied/refuted', '« Denied » = nié, « refuted » = réfuté avec preuves. La nuance est importante en presse. [voc2]'),
(23, 'trous', 'Complète : « The findings were blown out of ___. » (exagérées)', null, 'proportion', '« Blown out of proportion » = monté en épingle. Critique classique du traitement médiatique. [voc2]'),
(23, 'traduction', 'Traduis en anglais : « Selon des sources proches du dossier. »', null, 'According to sources close to the matter', 'Formule journalistique figée pour citer sans nommer. Signale une information non officielle. [voc2]'),

-- ---------- C1.4 Expressions idiomatiques ----------
(24, 'qcm', 'Que veut dire « to bite the bullet » ?', '["Prendre son courage à deux mains","Se taire","Se venger","Renoncer"]', 'Prendre son courage à deux mains', 'Image d''origine militaire : mordre la balle pendant une opération sans anesthésie. [voc2]'),
(24, 'qcm', 'Que veut dire « to be in the loop » ?', '["Être tenu informé","Être coincé","Tourner en rond","Être en boucle"]', 'Être tenu informé', '« Keep me in the loop » = tiens-moi au courant. Expression très fréquente en entreprise. [voc2]'),
(24, 'trous', 'Complète : « Let us play it by ___. » (improviser selon la situation)', null, 'ear', '« Play it by ear » = aviser sur le moment. Image musicale : jouer sans partition. [voc2]'),
(24, 'trous', 'Complète : « That is the last ___. » (la goutte de trop)', null, 'straw', '« The last straw » = la goutte d''eau qui fait déborder le vase. Image du chameau surchargé. [voc2]'),
(24, 'traduction', 'Traduis en anglais : « On verra ça le moment venu. »', null, 'We will cross that bridge when we come to it/We''ll deal with it when the time comes', 'La première formule est l''idiome exact : on traversera ce pont quand on y arrivera. [voc2]'),

-- ---------- C1.5 Rédaction argumentative ----------
(25, 'qcm', 'Que veut dire « to undermine an argument » ?', '["Affaiblir un argument","Souligner un argument","Souterrainement soutenir","Résumer"]', 'Affaiblir un argument', '« Undermine » = saper. Image de creuser sous les fondations. [voc2]'),
(25, 'qcm', 'Quel connecteur exprime une conséquence ?', '["Hence","However","Nevertheless","Whereas"]', 'Hence', '« Hence » = d''où, par conséquent. Les trois autres marquent une opposition ou un contraste. [voc2]'),
(25, 'trous', 'Complète : « The results are ___ inconclusive. » (au mieux)', null, 'at best', '« At best inconclusive » = peu concluants dans le meilleur des cas. Litote critique. [voc2]'),
(25, 'trous', 'Complète : « This raises the ___ of bias. » (la question)', null, 'question/issue', '« Raise the question » = soulever la question. « Beg the question » a un sens tout autre : présupposer sa conclusion. [voc2]'),
(25, 'traduction', 'Traduis en anglais : « Cette hypothèse mérite d''être examinée. »', null, 'This hypothesis deserves examination/This assumption is worth examining', '« Worth » est suivi d''un verbe en -ing : « worth examining », jamais « worth to examine ». [voc2]'),

-- ---------- C2.1 Registres académiques ----------
(26, 'qcm', 'Que veut dire « to corroborate » ?', '["Confirmer par une autre source","Contredire","Résumer","Publier ensemble"]', 'Confirmer par une autre source', '« Corroborate » implique une confirmation indépendante, pas une simple répétition. [voc2]'),
(26, 'qcm', 'Que veut dire « ostensibly » ?', '["En apparence","Ouvertement","Visiblement vrai","Avec ostentation"]', 'En apparence', 'Faux ami. « Ostensibly neutral » = neutre en apparence, sous-entendu : peut-être pas en réalité. [voc2]'),
(26, 'trous', 'Complète : « The data ___ this interpretation. » (appuie)', null, 'supports', '« Support an interpretation » = étayer. « Data » prend aujourd''hui le singulier dans l''usage courant. [voc2]'),
(26, 'trous', 'Complète : « This account is at ___ with the evidence. » (en contradiction)', null, 'odds', '« At odds with » = en désaccord avec. Locution figée du registre savant. [voc2]'),
(26, 'traduction', 'Traduis en anglais : « Cette distinction reste floue. »', null, 'This distinction remains unclear/This distinction remains blurred', '« Unclear » est neutre, « blurred » suggère une confusion volontaire ou progressive. [voc2]'),

-- ---------- C2.2 Phonétique et accents ----------
(27, 'qcm', 'Où tombe l''accent dans « PHOtograph » et « phoTOgrapher » ?', '["Il se déplace selon le mot","Toujours au début","Toujours au milieu","Il n''y a pas d''accent"]', 'Il se déplace selon le mot', 'PHOtograph, phoTOgrapher, photoGRAphic : la même racine, trois accentuations. Piège majeur à l''oral. [voc2]'),
(27, 'qcm', 'Quel mot contient un « s » prononcé « z » ?', '["please","piece","peace","price"]', 'please', 'Le « s » entre deux voyelles se sonorise souvent : please, easy, reason. Ailleurs il reste sourd. [voc2]'),
(27, 'trous', 'Complète : « The word ___ has a silent k. » (genou)', null, 'knee', 'Le « k » initial est muet devant « n » : knee, knife, know, knock. Vestige du vieil anglais. [voc2]'),
(27, 'trous', 'Complète : « Comfortable has ___ syllables in speech. » (trois)', null, 'three', 'Écrit en quatre syllabes, prononcé « COMF-ter-bul » en trois. Même chose pour « vegetable » et « chocolate ». [voc2]'),
(27, 'traduction', 'Traduis en anglais : « Peux-tu répéter plus lentement ? »', null, 'Could you repeat that more slowly/Can you say that again more slowly', '« More slowly » : « slowly » est déjà un adverbe, on ne dit pas « slowlier ». [voc2]'),

-- ---------- C2.3 Négociation et diplomatie ----------
(28, 'qcm', 'Que veut dire « to concede a point » ?', '["Céder sur un point","Conclure","Concéder un marché","Refuser"]', 'Céder sur un point', 'Concéder un argument renforce souvent la crédibilité sur le reste. Technique de négociation. [voc2]'),
(28, 'qcm', 'Que veut dire « a sticking point » ?', '["Un point de blocage","Un point d''accord","Un détail","Un rappel"]', 'Un point de blocage', '« The sticking point is the price » = le blocage porte sur le prix. Image de ce qui coince. [voc2]'),
(28, 'trous', 'Complète : « We are willing to meet you ___. » (à mi-chemin)', null, 'halfway', '« Meet halfway » = faire un compromis. Chacun parcourt la moitié du chemin. [voc2]'),
(28, 'trous', 'Complète : « That is our final ___. » (offre)', null, 'offer', '« Final offer » clôt la négociation. Ne l''employer que si c''est vrai : le bluff se paie cher. [voc2]'),
(28, 'traduction', 'Traduis en anglais : « Nous sommes prêts à revoir notre position. »', null, 'We are prepared to review our position/We are willing to reconsider our position', '« Prepared to » et « willing to » = disposé à. Plus engageant que « we can ». [voc2]'),

-- ---------- C2.4 Humour, ironie et sous-entendus ----------
(29, 'qcm', 'Que sous-entend « with the greatest respect » ?', '["Un désaccord ferme","Une admiration sincère","Une demande","Un remerciement"]', 'Un désaccord ferme', 'Plus la formule de respect est appuyée, plus la contradiction qui suit est nette. Ironie britannique classique. [voc2]'),
(29, 'qcm', 'Que veut dire « to damn with faint praise » ?', '["Critiquer par un éloge tiède","Louer sincèrement","Insulter directement","Ignorer"]', 'Critiquer par un éloge tiède', '« He is remarkably punctual » à propos d''un collaborateur médiocre : le compliment mineur souligne l''absence des autres. [voc2]'),
(29, 'trous', 'Complète : « It is not ___ my cup of tea. » (vraiment)', null, 'really', '« Not really my cup of tea » = ce n''est pas mon truc. Litote polie pour dire qu''on n''aime pas. [voc2]'),
(29, 'trous', 'Complète : « That went down like a ___ balloon. » (très mal)', null, 'lead', 'Un ballon en plomb ne vole pas : l''idée est tombée à plat. « Lead » se prononce ici « led ». [voc2]'),
(29, 'traduction', 'Traduis en anglais : « Ce n''est pas la meilleure idée que tu aies eue. »', null, 'That is not the best idea you have had/That''s not your best idea', 'Litote : on nie l''excellence plutôt que d''affirmer la médiocrité. Même procédé dans les deux langues. [voc2]'),

-- ---------- C2.5 Maîtrise : synthèse ----------
(30, 'qcm', 'Que veut dire « to move the goalposts » ?', '["Changer les règles en cours de route","Marquer un but","Déplacer une réunion","Progresser"]', 'Changer les règles en cours de route', 'Reproche fréquent en négociation : l''autre partie modifie ses exigences après coup. [voc2]'),
(30, 'qcm', 'Que veut dire « the jury is still out » ?', '["La question n''est pas tranchée","Le procès est fini","Personne ne décide","Le verdict est tombé"]', 'La question n''est pas tranchée', 'Image judiciaire : le jury délibère encore. Sert à refuser une conclusion prématurée. [voc2]'),
(30, 'trous', 'Complète : « We are back to square ___. » (à la case départ)', null, 'one', '« Back to square one » = tout recommencer. Image du jeu de l''oie. [voc2]'),
(30, 'trous', 'Complète : « Let us not lose ___ of the objective. » (perdre de vue)', null, 'sight', '« Lose sight of » = perdre de vue, au sens propre comme au figuré. [voc2]'),
(30, 'traduction', 'Traduis en anglais : « Tout dépend de la façon dont on pose la question. »', null, 'It all depends on how the question is framed/Everything depends on how you frame the question', '« Frame a question » = formuler, cadrer. Verbe central de tout esprit critique. [voc2]');
