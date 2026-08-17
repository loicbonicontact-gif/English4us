-- Inventaire complet du contenu. Ne modifie rien, affiche juste un tableau.
--
-- Les trois séries de vocabulaire se distinguent par leur marqueur en fin
-- d'explication. Attention : en SQL, « like '%[voc]' » ne trouve QUE les
-- lignes terminées par « [voc] » — « [voc2] » et « [voc3] » ne sont pas
-- comptés deux fois.

select 'exercices : ' || type as contenu, count(*) as nombre
from exercises group by type
union all
select 'vocabulaire serie 1 [voc]', count(*) from exercises where explanation like '%[voc]'
union all
select 'vocabulaire serie 2 [voc2]', count(*) from exercises where explanation like '%[voc2]'
union all
select 'vocabulaire serie 3 [voc3]', count(*) from exercises where explanation like '%[voc3]'
union all
select 'passages d ecoute', count(*) from listening_passages
union all
select 'questions d ecoute', count(*) from listening_questions
union all
select 'textes de lecture', count(*) from reading_passages
union all
select 'questions de lecture', count(*) from reading_questions
order by contenu;
