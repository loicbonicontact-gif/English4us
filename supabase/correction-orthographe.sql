-- ============================================
-- CORRECTION D'ORTHOGRAPHE — contenu déjà en base
-- À exécuter dans Supabase SQL Editor. Sans risque : deux UPDATE ciblés,
-- aucune suppression, aucun ajout.
--
-- Les scripts de contenu ont été corrigés à la source, mais les leçons
-- sont déjà en base : les rejouer entièrement serait disproportionné (et
-- effacerait la progression liée). Ce script ne change que le texte.
--
-- « email » -> « e-mail ». En français, « email » sans trait d'union
-- désigne l'émail, la matière vitrifiée. La forme correcte est « e-mail »
-- (ou « courriel »), et c'est déjà celle qu'emploie le reste du contenu.
--
-- Prudence volontaire : le filtre exige « un email formel », pas seulement
-- « email ». Le mot apparaît ailleurs à l'intérieur de textes ANGLAIS
-- (« Send an email », les clés JSON "kind":"email"), où il est correct et
-- ne doit surtout pas être touché.
-- ============================================

update exercises
set question = replace(question, 'un email formel', 'un e-mail formel')
where question like '%un email formel%';

-- Vérification : doit renvoyer 0 ligne.
select id, question
from exercises
where question like '%un email formel%';

-- Et celle-ci doit en renvoyer deux, désormais corrigées.
select id, question
from exercises
where question like '%un e-mail formel%'
order by id;
