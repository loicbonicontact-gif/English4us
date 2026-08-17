-- ============================================
-- MIGRATION — nouveau type d'exercice : 'ordre'
-- « Remets les mots dans l'ordre » (étiquettes à cliquer)
--
-- À exécuter dans Supabase SQL Editor AVANT seed-word-order.sql.
-- Ne sème aucun contenu, ne supprime rien : la contrainte de type de la
-- table `exercises` accepte simplement une valeur de plus.
--
-- TANT QU'ELLE N'EST PAS PASSÉE
-- L'application fonctionne exactement comme avant. Le nouveau format
-- n'existe qu'en base : sans exercice de type 'ordre', aucun écran ne
-- change. C'est seed-word-order.sql qui échouerait, avec un message clair
-- (« violates check constraint »), et il ne modifie rien avant d'échouer.
--
-- POURQUOI UNE MIGRATION SÉPARÉE
-- `schema.sql` porte déjà la nouvelle liste, mais il ne se rejoue que sur
-- une base vide : il détruirait tout le contenu existant. Cette migration
-- est le seul chemin sûr pour une base déjà en service.
-- ============================================

alter table exercises drop constraint if exists exercises_type_check;

alter table exercises add constraint exercises_type_check
  check (type in ('qcm','traduction','ecoute','trous','oral','ordre'));

-- Vérification : doit renvoyer une ligne contenant 'ordre'.
select conname, pg_get_constraintdef(oid) as definition
from pg_constraint
where conrelid = 'exercises'::regclass
  and conname = 'exercises_type_check';
