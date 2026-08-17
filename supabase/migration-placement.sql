-- ============================================
-- MIGRATION — test de placement
-- À exécuter dans Supabase SQL Editor.
--
-- Problème résolu : un apprenant de niveau B1 démarrait à A1 leçon 1 et
-- devait traverser quinze leçons avant d'atteindre son niveau. C'est aussi
-- la première question que pose un établissement scolaire.
--
-- Le test ne fabrique AUCUN contenu : il puise dans les exercices à choix
-- multiple déjà en base, par niveau. Rien à semer ici, seulement trois
-- colonnes pour retenir le résultat.
--
--   placement_level     niveau où l'apprenant démarre (null = jamais testé)
--   placement_taken_at  instant de la décision (null = jamais répondu)
--   placement_score     bonnes réponses sur le total posé, pour l'historique
--
-- Pourquoi trois colonnes et pas une : `placement_taken_at` distingue
-- « n'a jamais vu la question » de « a répondu, et se place en A1 ». Sans
-- elle, l'invitation à passer le test réapparaîtrait indéfiniment devant
-- un vrai débutant.
--
-- CE QUE LE PLACEMENT NE FAIT PAS : il ne marque aucune leçon comme
-- terminée et ne donne aucun XP. Il ouvre les niveaux inférieurs, sans
-- prétendre qu'ils ont été travaillés. Un apprenant placé en B1 peut
-- redescendre relire A2 quand il veut, et sa progression affichée reste
-- honnête (0 leçon terminée le premier jour).
-- ============================================

alter table profiles
  add column if not exists placement_level text
    check (placement_level in ('A1','A2','B1','B2','C1','C2'));

alter table profiles
  add column if not exists placement_taken_at timestamp with time zone;

alter table profiles
  add column if not exists placement_score integer;

-- Vérification : doit renvoyer trois lignes.
select column_name, data_type
from information_schema.columns
where table_name = 'profiles'
  and column_name in ('placement_level', 'placement_taken_at', 'placement_score')
order by column_name;
