-- ============================================
-- SEED — vocabulaire, troisième série
-- 150 exercices : 5 par leçon, A1 -> C2.
--
-- À exécuter APRÈS seed-vocabulary-2.sql. Rejouable : marqueur « [voc3] »,
-- indépendant des séries « [voc] » et « [voc2] » qui restent intactes.
--
-- CE QUE CETTE SÉRIE AJOUTE
-- La première série posait le socle, la deuxième visait les faux amis et
-- les verbes à particule. Celle-ci travaille trois mécaniques qui font
-- gagner beaucoup de mots d'un coup :
--
--   1. LA DÉRIVATION — un mot connu en donne quatre (decide / decision /
--      decisive / decisively). C'est le levier le plus rentable pour
--      passer de 1 500 à 3 000 mots sans les apprendre un par un, et
--      c'est exactement ce que teste la partie 5 du TOEIC.
--   2. LES PRÉPOSITIONS IMPOSÉES — « depend ON », « interested IN »,
--      « responsible FOR ». Aucune règle ne les prédit, le français en
--      suggère souvent une autre, et une erreur ici s'entend tout de suite.
--   3. LE DÉNOMBRABLE — « an advice » n'existe pas, « informations » non
--      plus. Faute de francophone par excellence, très fréquente à l'écrit.
--
-- Le reste complète le lexique professionnel des documents authentiques.
-- ============================================

delete from exercises where explanation like '%[voc3]';

-- ---------- A1.1 Se présenter ----------
insert into exercises (lesson_id, type, question, options, correct_answer, explanation) values
(1, 'qcm', 'Quel est le nom formé sur le verbe « to meet » ?', '["a meeting","a meet","a meetment","a meetion"]', 'a meeting', 'Beaucoup de noms anglais se forment en -ing sur le verbe : meet -> meeting, train -> training, park -> parking. [voc3]'),
(1, 'qcm', 'Que veut dire « nice to meet you » ?', '["Enchanté","À bientôt","Bienvenue","Merci"]', 'Enchanté', 'On le dit à la PREMIÈRE rencontre. Aux suivantes on dit « nice to see you » : « meet » implique la découverte. [voc3]'),
(1, 'trous', 'Complète : « I am interested ___ languages. » (par les langues)', null, 'in', '« Interested IN » toujours. Le français dit « intéressé par », d''où la faute fréquente « interested by ». [voc3]'),
(1, 'trous', 'Complète : « This is my ___ time in London. » (première fois)', null, 'first', '« The first time » : les ordinaux prennent l''article « the » ou un possessif, jamais rien du tout. [voc3]'),
(1, 'traduction', 'Traduis en anglais : « Je viens de France. »', null, 'I come from France/I am from France/I''m from France', '« I come from » ou « I am from » sont tous deux corrects. « I am coming from » signifierait « j''arrive de ». [voc3]'),

-- ---------- A1.2 La famille ----------
(2, 'qcm', 'Quel est l''adjectif formé sur « friend » ?', '["friendly","friendful","friendish","friendous"]', 'friendly', 'Le suffixe -ly fabrique ici un ADJECTIF, pas un adverbe : friendly, lovely, lonely. Piège classique. [voc3]'),
(2, 'qcm', 'Comment appelle-t-on la mère de son épouse ?', '["mother-in-law","step-mother","god-mother","grand-mother"]', 'mother-in-law', '« In-law » = par alliance. « Step- » désigne un beau-parent par remariage : ce n''est pas la même chose. [voc3]'),
(2, 'trous', 'Complète : « I live ___ my parents. » (chez mes parents)', null, 'with', '« Live with someone » = habiter avec. « Live at my parents » est une faute : « at » demande un lieu, pas une personne. [voc3]'),
(2, 'trous', 'Complète : « She is married ___ a teacher. » (mariée à)', null, 'to', '« Married TO », jamais « married with ». Erreur presque universelle chez les francophones. [voc3]'),
(2, 'traduction', 'Traduis en anglais : « Nous sommes une famille nombreuse. »', null, 'We are a large family/We have a big family/We are a big family', '« Numerous family » ne se dit pas : « numerous » qualifie une quantité d''éléments, pas une taille. [voc3]'),

-- ---------- A1.3 Les nombres et l'heure ----------
(3, 'qcm', 'Comment lit-on « 1,500 » en anglais ?', '["one thousand five hundred","one comma five hundred","fifteen hundreds","one thousand and five hundreds"]', 'one thousand five hundred', 'La virgule anglaise sépare les milliers ; le point sépare les décimales. Exactement l''inverse du français. [voc3]'),
(3, 'qcm', 'Que veut dire « fortnight » ?', '["Deux semaines","Quatorze heures","Quarante nuits","Le week-end"]', 'Deux semaines', 'Contraction de « fourteen nights ». Très courant en britannique, rare en américain. [voc3]'),
(3, 'trous', 'Complète : « The shop opens ___ 9 am. » (à 9 h)', null, 'at', '« AT » pour une heure précise, « ON » pour un jour, « IN » pour un mois ou une année. Trois prépositions, trois échelles. [voc3]'),
(3, 'trous', 'Complète : « I was born ___ March. » (en mars)', null, 'in', '« IN March » (mois), mais « ON 5 March » (date précise). L''ajout du jour change la préposition. [voc3]'),
(3, 'traduction', 'Traduis en anglais : « Le train part toutes les vingt minutes. »', null, 'The train leaves every twenty minutes/The train departs every twenty minutes', '« Every » + durée = intervalle régulier. « All the twenty minutes » n''existe pas. [voc3]'),

-- ---------- A1.4 Nourriture et boissons ----------
(4, 'qcm', 'Lequel de ces mots est INDÉNOMBRABLE ?', '["bread","sandwich","apple","biscuit"]', 'bread', '« Bread » ne prend pas de pluriel : on compte « two loaves of bread » ou « two slices ». Même logique que « du pain ». [voc3]'),
(4, 'qcm', 'Que désigne « a starter » au restaurant ?', '["Une entrée","Le plat principal","Le dessert","L''apéritif"]', 'Une entrée', '« Starter » (britannique) ou « appetizer » (américain). Piège : « entrée » en américain désigne le PLAT PRINCIPAL. [voc3]'),
(4, 'trous', 'Complète : « How ___ sugar do you take? » (combien de)', null, 'much', '« Much » pour l''indénombrable (sugar, water, money), « many » pour ce qui se compte (apples, people). [voc3]'),
(4, 'trous', 'Complète : « I would like a ___ of coffee. » (une tasse)', null, 'cup', 'Un liquide se compte par son contenant : a cup of coffee, a glass of water, a bottle of wine. [voc3]'),
(4, 'traduction', 'Traduis en anglais : « L''addition, s''il vous plaît. »', null, 'The bill please/Could I have the bill please/The check please', '« Bill » en britannique, « check » en américain. « The addition » serait un calcul mathématique. [voc3]'),

-- ---------- A1.5 Verbes essentiels ----------
(5, 'qcm', 'Quelle phrase est correcte ?', '["She does not have a car","She do not have a car","She has not a car","She not have a car"]', 'She does not have a car', 'À la 3e personne, le -s passe sur l''auxiliaire « does » et disparaît du verbe : does not HAVE, jamais « does not has ». [voc3]'),
(5, 'qcm', 'Que veut dire « to do the washing-up » ?', '["Faire la vaisselle","Faire la lessive","Se laver","Nettoyer le sol"]', 'Faire la vaisselle', '« Washing-up » = vaisselle, « washing » seul = lessive. Une particule sépare deux corvées différentes. [voc3]'),
(5, 'trous', 'Complète : « It ___ two hours to get there. » (prendre du temps)', null, 'takes', '« It takes + durée » est la formule figée du temps nécessaire. « It needs » ne se dit pas ici. [voc3]'),
(5, 'trous', 'Complète : « I am good ___ cooking. » (doué pour)', null, 'at', '« Good AT something ». « Good for » signifierait « bénéfique à », un tout autre sens. [voc3]'),
(5, 'traduction', 'Traduis en anglais : « Je n''ai pas le temps. »', null, 'I do not have time/I don''t have time/I have no time', 'Sans article : « the time » désignerait l''heure qu''il est. « I have not time » est archaïque. [voc3]'),

-- ---------- A2.1 Le passé simple ----------
(6, 'qcm', 'Quel est le passé de « to teach » ?', '["taught","teached","tought","teacht"]', 'taught', 'teach -> taught, catch -> caught, buy -> bought : une même famille de verbes irréguliers en -ught. [voc3]'),
(6, 'qcm', 'Quel nom se forme sur le verbe « to arrive » ?', '["arrival","arrivement","arrivation","arriving only"]', 'arrival', 'Le suffixe -al forme des noms : arrive -> arrival, refuse -> refusal, approve -> approval. [voc3]'),
(6, 'trous', 'Complète : « I looked ___ the word in a dictionary. » (chercher)', null, 'up', '« Look up » = rechercher une information. « Look for » = chercher un objet perdu. La particule change tout. [voc3]'),
(6, 'trous', 'Complète : « We arrived ___ the airport at six. » (à l''aéroport)', null, 'at', '« Arrive AT » un lieu précis, « arrive IN » une ville ou un pays. Jamais « arrive to ». [voc3]'),
(6, 'traduction', 'Traduis en anglais : « Hier, j''ai oublié mes clés. »', null, 'Yesterday I forgot my keys/I forgot my keys yesterday', 'Avec « yesterday », l''anglais impose le prétérit : « I have forgotten » serait une faute ici. [voc3]'),

-- ---------- A2.2 Voyages et directions ----------
(7, 'qcm', 'Que veut dire « a return ticket » ?', '["Un aller-retour","Un billet remboursable","Un retour seul","Un billet échangeable"]', 'Un aller-retour', 'Britannique : « return ». Américain : « round trip ». Un aller simple est « a single » ou « one way ». [voc3]'),
(7, 'qcm', 'Quel est l''adjectif formé sur « to travel » ?', '["travelling","travelous","travelful","travelic"]', 'travelling', '« A travelling salesman » : le participe présent sert d''adjectif. Orthographe britannique à deux L, américaine à un seul. [voc3]'),
(7, 'trous', 'Complète : « Go straight ___ and turn left. » (tout droit)', null, 'ahead', '« Straight ahead » = tout droit. « Straight on » se dit aussi en britannique. [voc3]'),
(7, 'trous', 'Complète : « We are getting ___ at the next stop. » (descendre)', null, 'off', '« Get off » un bus ou un train, « get out of » une voiture. La taille du véhicule décide de la particule. [voc3]'),
(7, 'traduction', 'Traduis en anglais : « Est-ce loin d''ici ? »', null, 'Is it far from here/Is it a long way from here', '« Far » s''emploie surtout dans les questions et les négations. À l''affirmative on préfère « a long way ». [voc3]'),

-- ---------- A2.3 Achats et argent ----------
(8, 'qcm', 'Que veut dire « It is on sale » (américain) ?', '["C''est en promotion","C''est à vendre","C''est vendu","C''est en vitrine"]', 'C''est en promotion', 'Piège : « for sale » = à vendre, « on sale » = soldé. Une préposition sépare deux annonces très différentes. [voc3]'),
(8, 'qcm', 'Quel mot est INDÉNOMBRABLE ?', '["money","coin","note","price"]', 'money', '« Money » n''a pas de pluriel : on dit « a lot of money », jamais « moneys ». On compte les coins et les notes. [voc3]'),
(8, 'trous', 'Complète : « I paid ___ the tickets by card. » (payer les billets)', null, 'for', '« Pay FOR something » (ce qu''on achète) mais « pay somebody » sans préposition. Deux constructions à distinguer. [voc3]'),
(8, 'trous', 'Complète : « Can I have a ___ , please? » (un reçu)', null, 'receipt', '« Receipt » (le p est muet) = reçu. Faux ami : « recette » de cuisine se dit « recipe ». [voc3]'),
(8, 'traduction', 'Traduis en anglais : « Ça coûte trop cher. »', null, 'It is too expensive/It''s too expensive/That is too expensive', '« Too expensive », jamais « too much expensive » : « too » suffit devant un adjectif. [voc3]'),

-- ---------- A2.4 Décrire son quotidien ----------
(9, 'qcm', 'Quel adverbe exprime la plus grande fréquence ?', '["always","often","sometimes","rarely"]', 'always', 'Échelle : always > usually > often > sometimes > rarely > never. Utile pour nuancer une habitude. [voc3]'),
(9, 'qcm', 'Quel est le nom formé sur « to behave » ?', '["behaviour","behavement","behaving","behavation"]', 'behaviour', 'behave -> behaviour (britannique) / behavior (américain). Le -u britannique se retrouve dans colour, favour, neighbour. [voc3]'),
(9, 'trous', 'Complète : « I usually get ___ at seven. » (se lever)', null, 'up', '« Get up » = sortir du lit. « Wake up » = se réveiller. On peut être réveillé sans être levé. [voc3]'),
(9, 'trous', 'Complète : « She is used ___ working late. » (habituée à)', null, 'to', '« Be used TO + -ing » = être habitué à. À ne pas confondre avec « used to + base verbale » (habitude passée). [voc3]'),
(9, 'traduction', 'Traduis en anglais : « Je fais du sport trois fois par semaine. »', null, 'I do sport three times a week/I play sport three times a week/I exercise three times a week', '« Three times A week » : l''article « a » signifie ici « par ». « Per week » est plus formel. [voc3]'),

-- ---------- A2.5 Le futur ----------
(10, 'qcm', 'Quelle phrase annonce une décision prise à l''avance ?', '["I am going to sell my car","I will sell my car","I sell my car","I would sell my car"]', 'I am going to sell my car', '« Going to » = projet déjà formé. « Will » = décision prise à l''instant ou simple prédiction. [voc3]'),
(10, 'qcm', 'Que veut dire « to be about to » ?', '["Être sur le point de","Être question de","Être à propos","Être autour de"]', 'Être sur le point de', '« The train is about to leave » = il part dans quelques secondes. Futur le plus immédiat de l''anglais. [voc3]'),
(10, 'trous', 'Complète : « I am looking forward ___ seeing you. » (avoir hâte de)', null, 'to', 'Piège majeur : ce « to » est une PRÉPOSITION, donc suivie de -ing. « Look forward to see » est une faute. [voc3]'),
(10, 'trous', 'Complète : « She will call you as ___ as she arrives. » (dès que)', null, 'soon', '« As soon as » = dès que. Le verbe qui suit reste au présent : jamais « as soon as she will arrive ». [voc3]'),
(10, 'traduction', 'Traduis en anglais : « Il va pleuvoir. »', null, 'It is going to rain/It''s going to rain', 'Le ciel est déjà noir : l''indice est présent, donc « going to ». « It will rain » serait une prévision abstraite. [voc3]'),

-- ---------- B1.1 Exprimer une opinion ----------
(11, 'qcm', 'Lequel de ces mots est INDÉNOMBRABLE ?', '["advice","opinion","idea","argument"]', 'advice', '« An advice » n''existe pas : on dit « a piece of advice ». Même piège avec information, news, furniture, research. [voc3]'),
(11, 'qcm', 'Quel est l''adjectif formé sur « to convince » ?', '["convincing","convincive","convinceful","convincial"]', 'convincing', 'Le participe en -ing décrit ce qui produit l''effet (a convincing argument) ; le participe en -ed décrit celui qui le subit (I am convinced). [voc3]'),
(11, 'trous', 'Complète : « It depends ___ the context. » (ça dépend de)', null, 'on', '« Depend ON », jamais « depend of ». Le français « dépendre de » entraîne l''erreur presque à tous les coups. [voc3]'),
(11, 'trous', 'Complète : « I agree ___ you on that point. » (avec toi)', null, 'with', '« Agree WITH somebody », mais « agree TO a proposal » et « agree ON a date ». Trois prépositions, trois nuances. [voc3]'),
(11, 'traduction', 'Traduis en anglais : « À mon avis, c''est une erreur. »', null, 'In my opinion it is a mistake/In my view that is a mistake/To my mind it is a mistake', '« IN my opinion », pas « at ». « According to me » est une faute : « according to » ne s''emploie que pour autrui. [voc3]'),

-- ---------- B1.2 Le monde du travail ----------
(12, 'qcm', 'Que veut dire « to be made redundant » ?', '["Être licencié pour motif économique","Être promu","Être muté","Être inutile"]', 'Être licencié pour motif économique', 'Le poste est supprimé, la personne n''est pas en cause. « To be fired » implique au contraire une faute. [voc3]'),
(12, 'qcm', 'Quel est le nom de la personne dans « employ » ?', '["employee","employer","employment","employable"]', 'employee', 'Le suffixe -ee désigne celui qui SUBIT l''action : employee, trainee, interviewee. Le suffixe -er désigne celui qui l''exerce. [voc3]'),
(12, 'trous', 'Complète : « She is responsible ___ the whole team. » (responsable de)', null, 'for', '« Responsible FOR ». Le français « responsable de » pousse vers « of », qui est une faute. [voc3]'),
(12, 'trous', 'Complète : « He applied ___ a job in Leeds. » (postuler à)', null, 'for', '« Apply FOR a job » (le poste) mais « apply TO a company » (l''entreprise). La cible change la préposition. [voc3]'),
(12, 'traduction', 'Traduis en anglais : « Je travaille dans une petite entreprise. »', null, 'I work for a small company/I work in a small company/I work at a small firm', '« Work FOR » est le plus naturel pour un employeur. « Society » serait un faux ami : c''est la société au sens social. [voc3]'),

-- ---------- B1.3 Present perfect ----------
(13, 'qcm', 'Quelle phrase est correcte ?', '["I have lived here for ten years","I live here since ten years","I am living here since ten years","I lived here for ten years now"]', 'I have lived here for ten years', 'Une action commencée dans le passé et toujours vraie demande le present perfect. Le français emploie le présent, d''où l''erreur. [voc3]'),
(13, 'qcm', 'Quelle est la différence entre « for » et « since » ?', '["For = durée, since = point de départ","Aucune","For = passé, since = présent","Since = durée, for = date"]', 'For = durée, since = point de départ', '« For ten years » (combien de temps) / « since 2015 » (depuis quand). Deux questions différentes. [voc3]'),
(13, 'trous', 'Complète : « I have ___ finished my report. » (déjà)', null, 'already', '« Already » se place entre l''auxiliaire et le participe. À la question, on emploie « yet » en fin de phrase. [voc3]'),
(13, 'trous', 'Complète : « She has worked here ___ 2019. » (depuis)', null, 'since', 'Une date précise appelle « since ». Une durée appellerait « for ». [voc3]'),
(13, 'traduction', 'Traduis en anglais : « Je n''ai jamais vu ce film. »', null, 'I have never seen this film/I''ve never seen that movie', 'L''expérience de vie, sans date, appelle le present perfect. « I never saw » supposerait un moment passé identifié. [voc3]'),

-- ---------- B1.4 Santé et bien-être ----------
(14, 'qcm', 'Que veut dire « to feel under the weather » ?', '["Être patraque","Avoir froid","Être déprimé par la pluie","Être dehors"]', 'Être patraque', 'Idiome : se sentir légèrement malade, sans gravité. Rien à voir avec la météo réelle. [voc3]'),
(14, 'qcm', 'Quel est le nom formé sur « to treat » (soigner) ?', '["treatment","treating","treatance","treation"]', 'treatment', 'Le suffixe -ment forme des noms d''action : treat -> treatment, develop -> development, improve -> improvement. [voc3]'),
(14, 'trous', 'Complète : « He suffers ___ back pain. » (souffrir de)', null, 'from', '« Suffer FROM » une maladie. « Suffer of » est une faute calquée sur le français. [voc3]'),
(14, 'trous', 'Complète : « I have an appointment ___ the doctor. » (chez le médecin)', null, 'with', '« An appointment WITH the doctor » ou « AT the doctor''s ». « At the doctor » sans le ''s est incomplet. [voc3]'),
(14, 'traduction', 'Traduis en anglais : « J''ai mal à la tête. »', null, 'I have a headache/I''ve got a headache/My head hurts', '« Headache » est un nom dénombrable : l''article « a » est obligatoire. « I have headache » est incorrect. [voc3]'),

-- ---------- B1.5 Comparatifs et superlatifs ----------
(15, 'qcm', 'Quelle phrase est correcte ?', '["This is far more useful","This is far most useful","This is very more useful","This is much most useful"]', 'This is far more useful', 'Un comparatif se renforce par far, much, a lot — jamais par « very », qui ne modifie qu''un adjectif simple. [voc3]'),
(15, 'qcm', 'Quel est le comparatif de « little » (quantité) ?', '["less","littler","lesser only","more little"]', 'less', '« Less » pour l''indénombrable (less money), « fewer » pour le dénombrable (fewer people). Distinction soignée à l''écrit. [voc3]'),
(15, 'trous', 'Complète : « She is twice as tall ___ her sister. » (que)', null, 'as', 'Structure « as … as » pour l''égalité. Le « than » ne s''emploie qu''après un comparatif en -er ou en « more ». [voc3]'),
(15, 'trous', 'Complète : « The ___ we wait, the worse it gets. » (plus)', null, 'longer', 'Structure « the + comparatif, the + comparatif » = plus… plus… Très fréquente à l''écrit soigné. [voc3]'),
(15, 'traduction', 'Traduis en anglais : « C''est le meilleur résultat de l''année. »', null, 'It is the best result of the year/That is the best result this year', '« The best » : superlatif irrégulier de « good ». « The most good » n''existe pas. [voc3]'),

-- ---------- B2.1 Débattre et argumenter ----------
(16, 'qcm', 'Que veut dire « however » ?', '["Cependant","Autant","Comment","De toute façon"]', 'Cependant', 'Connecteur d''opposition, plus formel que « but » et placé en tête de phrase avec une virgule. [voc3]'),
(16, 'qcm', 'Lequel introduit une CONSÉQUENCE ?', '["therefore","although","whereas","despite"]', 'therefore', 'therefore, thus, hence = donc. Les trois autres marquent l''opposition ou la concession. [voc3]'),
(16, 'trous', 'Complète : « ___ the cost, the project went ahead. » (malgré)', null, 'Despite', '« Despite » et « in spite of » sont suivis d''un NOM. « Although » serait suivi d''une proposition complète. [voc3]'),
(16, 'trous', 'Complète : « He insisted ___ checking the figures. » (insister pour)', null, 'on', '« Insist ON + -ing ». « Insist to do » est une faute fréquente. [voc3]'),
(16, 'traduction', 'Traduis en anglais : « D''une part c''est cher, d''autre part c''est efficace. »', null, 'On the one hand it is expensive, on the other hand it is effective/On one hand it is expensive, on the other it is efficient', 'Paire figée « on the one hand / on the other hand ». On ne peut pas employer la seconde sans la première. [voc3]'),

-- ---------- B2.2 Conditionnels ----------
(17, 'qcm', 'Quelle phrase est correcte ?', '["If I had time, I would help","If I would have time, I would help","If I have time, I would help","If I had time, I will help"]', 'If I had time, I would help', 'Le « would » ne figure JAMAIS dans la proposition en « if » du deuxième conditionnel. Faute très répandue. [voc3]'),
(17, 'qcm', 'Que veut dire « unless » ?', '["À moins que","Sauf si non","Bien que","Puisque"]', 'À moins que', '« Unless you hurry » = si tu ne te dépêches pas. Le mot contient déjà la négation : jamais « unless you don''t ». [voc3]'),
(17, 'trous', 'Complète : « ___ I were you, I would accept. » (si)', null, 'If', '« If I were » : le subjonctif conserve « were » à toutes les personnes dans les hypothèses irréelles. [voc3]'),
(17, 'trous', 'Complète : « Provided ___ the budget is approved, we start in May. » (à condition que)', null, 'that', '« Provided that » = à condition que. Registre formel des contrats et des comptes rendus. [voc3]'),
(17, 'traduction', 'Traduis en anglais : « Si tu chauffes l''eau, elle bout. »', null, 'If you heat water, it boils/When you heat water it boils', 'Vérité générale : présent dans les deux propositions. C''est le conditionnel « zéro », sans will ni would. [voc3]'),

-- ---------- B2.3 Environnement et société ----------
(18, 'qcm', 'Que veut dire « landfill » ?', '["Une décharge","Un terrain rempli","Un remblai routier","Un champ cultivé"]', 'Une décharge', 'Site d''enfouissement des déchets. Mot central de tout dossier environnemental. [voc3]'),
(18, 'qcm', 'Quel est l''adjectif formé sur « sustain » ?', '["sustainable","sustainous","sustaining only","sustainful"]', 'sustainable', 'Le suffixe -able = qui peut être. sustain -> sustainable (durable, soutenable), rely -> reliable, afford -> affordable. [voc3]'),
(18, 'trous', 'Complète : « The city is committed ___ cutting emissions. » (engagé à)', null, 'to', '« Committed TO + -ing » : encore un « to » préposition, donc suivi de la forme en -ing. [voc3]'),
(18, 'trous', 'Complète : « Plastic has a serious impact ___ the ocean. » (impact sur)', null, 'on', '« Impact ON », « effect ON », « influence ON ». Trois noms, une seule préposition. [voc3]'),
(18, 'traduction', 'Traduis en anglais : « Il faut réduire notre consommation d''énergie. »', null, 'We must reduce our energy consumption/We need to cut our energy use', '« Consumption » = consommation. Faux ami : « consumption » désignait aussi la tuberculose en anglais ancien. [voc3]'),

-- ---------- B2.4 Voix passive ----------
(19, 'qcm', 'Quelle est la forme passive de « They deliver the goods on Friday » ?', '["The goods are delivered on Friday","The goods deliver on Friday","The goods are delivering on Friday","The goods have delivered on Friday"]', 'The goods are delivered on Friday', 'be + participe passé. Le complément devient sujet, l''auteur de l''action disparaît s''il n''importe pas. [voc3]'),
(19, 'qcm', 'Pourquoi le passif domine-t-il les textes techniques ?', '["L''auteur de l''action importe peu","Il est plus court","Il est plus poli","Il évite le passé"]', 'L''auteur de l''action importe peu', '« The samples were analysed » : qui a manipulé la pipette n''intéresse personne. Le passif met le procédé au centre. [voc3]'),
(19, 'trous', 'Complète : « The report was written ___ an external auditor. » (par)', null, 'by', '« BY » introduit l''auteur, « WITH » l''instrument : written by a consultant, written with a pen. [voc3]'),
(19, 'trous', 'Complète : « The meeting has been ___ until Monday. » (reporté)', null, 'postponed', '« Postpone » = reporter à plus tard. « Cancel » serait annuler purement et simplement. [voc3]'),
(19, 'traduction', 'Traduis en anglais : « On m''a dit que la réunion était annulée. »', null, 'I was told the meeting was cancelled/I have been told that the meeting is cancelled', 'Le « on » français impersonnel devient un passif en anglais : « I was told ». « One told me » est une lourdeur. [voc3]'),

-- ---------- B2.5 Anglais professionnel ----------
(20, 'qcm', 'Que veut dire « please find attached » ?', '["Veuillez trouver ci-joint","Merci de vous attacher","Voici l''annexe manquante","Prière de joindre"]', 'Veuillez trouver ci-joint', 'Formule figée du courriel professionnel. « Attached » pour un fichier, « enclosed » pour un courrier papier. [voc3]'),
(20, 'qcm', 'Quel est le nom formé sur « to deliver » (livrer) ?', '["delivery","deliverment","deliveration","delivering only"]', 'delivery', 'Le suffixe -y/-ery forme des noms : deliver -> delivery, discover -> discovery, recover -> recovery. [voc3]'),
(20, 'trous', 'Complète : « I am writing ___ regard to your invoice. » (au sujet de)', null, 'with', '« With regard to » ou « in regard to » = concernant. Attention : « regards » au pluriel sert à saluer. [voc3]'),
(20, 'trous', 'Complète : « We look forward to hearing ___ you. » (de vous)', null, 'from', '« Hear FROM somebody » = recevoir des nouvelles. « Hear ABOUT » = entendre parler de. [voc3]'),
(20, 'traduction', 'Traduis en anglais : « Je vous remercie de votre réponse rapide. »', null, 'Thank you for your prompt reply/Thank you for your quick response', '« Prompt » est le mot consacré du registre professionnel. « Rapid reply » serait maladroit. [voc3]'),

-- ---------- C1.1 Nuances et registres ----------
(21, 'qcm', 'Lequel est le plus FORMEL ?', '["to request","to ask for","to want","to need"]', 'to request', 'Échelle de formalité : want < ask for < request. Un courrier administratif emploie « request ». [voc3]'),
(21, 'qcm', 'Que signale l''emploi de « shall » à la 2e personne ?', '["Une obligation contractuelle","Une question polie","Un futur ordinaire","Une hypothèse"]', 'Une obligation contractuelle', '« The tenant shall maintain the property » : le « shall » juridique impose, il ne prédit pas. [voc3]'),
(21, 'trous', 'Complète : « This proposal is subject ___ approval. » (soumis à)', null, 'to', '« Subject to approval » = sous réserve d''accord. Formule figée des devis et des contrats. [voc3]'),
(21, 'trous', 'Complète : « I would be ___ if you could confirm. » (reconnaissant)', null, 'grateful', '« I would be grateful if you could » : la demande polie standard de l''écrit formel britannique. [voc3]'),
(21, 'traduction', 'Traduis en anglais : « Nous vous saurions gré de bien vouloir nous répondre. »', null, 'We would appreciate a reply/We should be grateful for your reply/We would be grateful if you could reply', 'Le conditionnel « would » porte à lui seul la politesse : aucun mot supplémentaire n''est nécessaire. [voc3]'),

-- ---------- C1.2 Conditionnels avancés ----------
(22, 'qcm', 'Que veut dire « Had I known, I would have called » ?', '["Si j''avais su, j''aurais appelé","J''ai su et j''ai appelé","J''aurais dû savoir","Je savais et j''appelais"]', 'Si j''avais su, j''aurais appelé', 'Inversion sans « if » : registre soutenu. « Had I known » = « If I had known ». [voc3]'),
(22, 'qcm', 'Quel est le sens de « I wish I had studied » ?', '["Je regrette de ne pas avoir étudié","Je souhaite étudier","J''ai souhaité étudier","J''étudierai"]', 'Je regrette de ne pas avoir étudié', '« Wish + past perfect » exprime le regret d''un passé irréversible. Avec le prétérit simple, il porterait sur le présent. [voc3]'),
(22, 'trous', 'Complète : « ___ it not been for your help, we would have failed. » (sans)', null, 'Had', '« Had it not been for » = n''eût été. Inversion littéraire, fréquente dans les discours de remerciement. [voc3]'),
(22, 'trous', 'Complète : « If only I ___ listened to her. » (avais écouté)', null, 'had', '« If only + past perfect » : même regret que « I wish », avec une charge affective plus forte. [voc3]'),
(22, 'traduction', 'Traduis en anglais : « Si nous étions partis plus tôt, nous serions déjà arrivés. »', null, 'If we had left earlier, we would already be there/If we had left earlier we would have arrived by now', 'Conditionnel mixte : condition dans le passé, conséquence au présent. Les deux temps ne se correspondent pas. [voc3]'),

-- ---------- C1.3 Actualités et médias ----------
(23, 'qcm', 'Que veut dire « to break a story » ?', '["Révéler une information en premier","Démentir une nouvelle","Interrompre un journal","Résumer un article"]', 'Révéler une information en premier', '« Breaking news » vient de là : l''information rompt le cours ordinaire de la diffusion. [voc3]'),
(23, 'qcm', 'Que désigne « a source close to the matter » ?', '["Une source anonyme informée","Un porte-parole officiel","Un témoin direct","Un document public"]', 'Une source anonyme informée', 'Formule de prudence journalistique : l''information est sourcée sans que la source soit nommée. Elle signale aussi qu''elle n''est pas vérifiable. [voc3]'),
(23, 'trous', 'Complète : « The minister was accused ___ misleading Parliament. » (accusé de)', null, 'of', '« Accuse somebody OF something ». « Charge somebody WITH » suit une autre construction. [voc3]'),
(23, 'trous', 'Complète : « The article ___ doubt on the official figures. » (jette le doute)', null, 'casts', '« Cast doubt on » = mettre en doute. Collocation figée : « throw doubt » se dit, « put doubt » non. [voc3]'),
(23, 'traduction', 'Traduis en anglais : « Selon le journal, l''enquête est toujours en cours. »', null, 'According to the newspaper, the investigation is still ongoing/According to the paper the inquiry is still under way', '« According to » attribue l''information à autrui — précisément ce que « in my opinion » ne fait pas. [voc3]'),

-- ---------- C1.4 Expressions idiomatiques ----------
(24, 'qcm', 'Que veut dire « to bite the bullet » ?', '["Prendre son courage à deux mains","Se taire","Perdre patience","Mordre à l''hameçon"]', 'Prendre son courage à deux mains', 'Image des chirurgies de campagne sans anesthésie : on serrait une balle entre les dents. [voc3]'),
(24, 'qcm', 'Que veut dire « to cut corners » ?', '["Bâcler pour aller plus vite","Réduire les coûts","Prendre un raccourci utile","Arrondir les angles"]', 'Bâcler pour aller plus vite', 'Connotation toujours négative : la qualité est sacrifiée. Ne pas confondre avec « cut costs », qui est neutre. [voc3]'),
(24, 'trous', 'Complète : « Let us play it by ___ . » (au feeling)', null, 'ear', '« Play it by ear » = improviser, décider sur le moment. Image du musicien qui joue sans partition. [voc3]'),
(24, 'trous', 'Complète : « That is the last ___ . » (la goutte de trop)', null, 'straw', '« The last straw » vient du chameau dont la dernière paille brise le dos. Équivalent exact de notre goutte d''eau. [voc3]'),
(24, 'traduction', 'Traduis en anglais : « Ça ne me dit rien. » (aucun souvenir)', null, 'It does not ring a bell/That doesn''t ring a bell', '« Ring a bell » = évoquer quelque chose. Traduire mot à mot donnerait un contresens total. [voc3]'),

-- ---------- C1.5 Rédaction argumentative ----------
(25, 'qcm', 'Lequel introduit une CONCESSION ?', '["admittedly","consequently","furthermore","namely"]', 'admittedly', '« Admittedly, the data are limited » : on concède avant de répondre. Renforce l''argument au lieu de l''affaiblir. [voc3]'),
(25, 'qcm', 'Que veut dire « to substantiate a claim » ?', '["L''étayer par des preuves","La reformuler","La nuancer","La retirer"]', 'L''étayer par des preuves', '« Unsubstantiated » = non étayé, reproche méthodologique fréquent dans les rapports. [voc3]'),
(25, 'trous', 'Complète : « This finding is consistent ___ earlier research. » (cohérent avec)', null, 'with', '« Consistent WITH » = concorde avec. « Consistent in » n''existe pas dans ce sens. [voc3]'),
(25, 'trous', 'Complète : « The study draws ___ three separate datasets. » (s''appuie sur)', null, 'on', '« Draw on a source » = puiser dans. « Draw from » se rencontre, mais « draw on » domine à l''écrit académique. [voc3]'),
(25, 'traduction', 'Traduis en anglais : « Cet argument ne résiste pas à l''examen. »', null, 'This argument does not stand up to scrutiny/That argument does not withstand scrutiny', '« Stand up to scrutiny » est la collocation consacrée. « Resist the exam » serait un calque incompréhensible. [voc3]'),

-- ---------- C2.1 Registres académiques et littéraires ----------
(26, 'qcm', 'Que veut dire « notwithstanding » ?', '["Malgré","Sans attendre","Sans doute","En outre"]', 'Malgré', 'Registre juridique et académique. Peut se placer avant OU après le nom : « notwithstanding the delay » / « the delay notwithstanding ». [voc3]'),
(26, 'qcm', 'Que signale « arguably » dans une phrase ?', '["Une opinion défendable, pas un fait","Une certitude","Une objection","Une preuve"]', 'Une opinion défendable, pas un fait', '« Arguably the finest novel of the decade » : l''auteur avance une thèse discutable tout en la revendiquant. [voc3]'),
(26, 'trous', 'Complète : « The theory is predicated ___ a false assumption. » (fondée sur)', null, 'on', '« Predicated on » = repose sur. Registre très soutenu, fréquent dans la critique méthodologique. [voc3]'),
(26, 'trous', 'Complète : « The author is ___ to hyperbole. » (enclin à)', null, 'prone', '« Prone to » = enclin à, avec une nuance de défaut. « Inclined to » est neutre. [voc3]'),
(26, 'traduction', 'Traduis en anglais : « Cette lecture, aussi séduisante soit-elle, reste indémontrable. »', null, 'This reading, however appealing, remains unprovable/This interpretation, appealing as it is, cannot be demonstrated', '« However + adjectif » = aussi… que ce soit. Structure concessive du registre soutenu. [voc3]'),

-- ---------- C2.2 Subtilités phonétiques ----------
(27, 'qcm', 'Dans quel mot le « ch » se prononce-t-il « k » ?', '["chemistry","chair","cheese","church"]', 'chemistry', 'Le « ch » grec se prononce « k » : chemistry, character, architect, chorus. Le « ch » anglo-saxon reste « tch ». [voc3]'),
(27, 'qcm', 'Où tombe l''accent dans « photographer » ?', '["Sur la 2e syllabe","Sur la 1re","Sur la 3e","Sur la dernière"]', 'Sur la 2e syllabe', 'PHOtograph mais phoTOgrapher : le suffixe déplace l''accent. Un accent mal placé gêne plus qu''un son approximatif. [voc3]'),
(27, 'trous', 'Complète : « The b in ___ is silent. » (dette)', null, 'debt', 'Le « b » de debt, doubt et subtle est muet : il fut ajouté au XVIe siècle par imitation du latin, sans jamais se prononcer. [voc3]'),
(27, 'trous', 'Complète : « Record is a noun when stressed on the ___ syllable. » (première)', null, 'first', 'REcord (nom) / reCORD (verbe). Même schéma pour present, export, increase, permit. [voc3]'),
(27, 'traduction', 'Traduis en anglais : « Je n''arrive pas à entendre la différence. »', null, 'I cannot hear the difference/I can''t tell the difference', '« Tell the difference » = distinguer. « Hear » insiste sur la perception, « tell » sur la discrimination. [voc3]'),

-- ---------- C2.3 Négociation et diplomatie ----------
(28, 'qcm', 'Que veut dire « a non-starter » ?', '["Une option d''emblée exclue","Un retard","Un débutant","Un point mineur"]', 'Une option d''emblée exclue', '« That is a non-starter » ferme la discussion sans agressivité : la proposition n''entre pas dans le champ du négociable. [voc3]'),
(28, 'qcm', 'Que veut dire « to table a proposal » en britannique ?', '["La soumettre à discussion","L''ajourner","La retirer","La refuser"]', 'La soumettre à discussion', 'Piège rare et coûteux : en américain, « to table » signifie au contraire AJOURNER. Le même verbe, deux sens opposés. [voc3]'),
(28, 'trous', 'Complète : « We need to reach a ___ . » (un compromis)', null, 'compromise', '« Compromise » = compromis, sans connotation négative. « Compromis » au sens de compromettre se dit « to compromise ». [voc3]'),
(28, 'trous', 'Complète : « This is contingent ___ board approval. » (subordonné à)', null, 'on', '« Contingent on » = conditionné par. Registre contractuel, plus fort que « depending on ». [voc3]'),
(28, 'traduction', 'Traduis en anglais : « Je crains que nous ne puissions accepter ces conditions. »', null, 'I am afraid we cannot accept these terms/I am afraid we are unable to accept those conditions', '« I am afraid » n''exprime aucune peur : c''est l''amortisseur poli d''un refus. « Terms » = conditions d''un accord. [voc3]'),

-- ---------- C2.4 Humour, ironie et sous-entendus ----------
(29, 'qcm', 'Que sous-entend « That is an interesting approach » ?', '["Un doute poli","Un compliment","Une curiosité sincère","Un accord"]', 'Un doute poli', '« Interesting » est le mot-valise de la réserve britannique : il évite de dire qu''on n''y croit pas. [voc3]'),
(29, 'qcm', 'Que veut dire « to be economical with the truth » ?', '["Mentir par omission","Résumer","Être honnête","Se taire"]', 'Mentir par omission', 'Litote politique célèbre : on ne ment pas, on est simplement « économe » en vérité. [voc3]'),
(29, 'trous', 'Complète : « I am not ___ convinced. » (entièrement)', null, 'entirely', '« Not entirely convinced » = pas convaincu du tout, en langage diplomatique. La litote atténue la forme, pas le fond. [voc3]'),
(29, 'trous', 'Complète : « Well, that is one ___ of looking at it. » (façon)', null, 'way', '« That is one way of looking at it » = je ne partage pas cet avis. Désaccord sans confrontation. [voc3]'),
(29, 'traduction', 'Traduis en anglais : « Disons que ça aurait pu mieux se passer. »', null, 'Let us say it could have gone better/Let''s just say it could have gone better', 'Litote : on décrit un échec par ce qu''il n''a pas été. « Let us say » annonce l''euphémisme. [voc3]'),

-- ---------- C2.5 Maîtrise : synthèse ----------
(30, 'qcm', 'Que veut dire « to take something with a pinch of salt » ?', '["Le prendre avec réserve","Le prendre au sérieux","L''assaisonner","L''oublier"]', 'Le prendre avec réserve', 'Britannique : « pinch ». Américain : « grain ». Formule d''esprit critique appliquée à une source douteuse. [voc3]'),
(30, 'qcm', 'Que veut dire « correlation is not causation » ?', '["Deux faits liés n''ont pas forcément de cause commune","Toute corrélation prouve une cause","Les statistiques mentent","Les données sont fausses"]', 'Deux faits liés n''ont pas forcément de cause commune', 'Principe fondamental de la lecture des chiffres, et l''erreur la plus fréquente de la presse. [voc3]'),
(30, 'trous', 'Complète : « The evidence is, at ___ , inconclusive. » (au mieux)', null, 'best', '« At best » = dans le meilleur des cas. « At worst » ouvre l''hypothèse inverse. Deux bornes du jugement nuancé. [voc3]'),
(30, 'trous', 'Complète : « We should not conflate the two ___ . » (questions)', null, 'issues', '« Conflate » = confondre deux choses distinctes en une seule. Reproche argumentatif précis, sans équivalent simple en français. [voc3]'),
(30, 'traduction', 'Traduis en anglais : « La question mérite d''être posée autrement. »', null, 'The question deserves to be put differently/The question is worth framing differently/That question should be asked another way', '« Put a question » se dit autant que « ask ». « Frame » ajoute l''idée du cadrage, donc du choix de perspective. [voc3]');
