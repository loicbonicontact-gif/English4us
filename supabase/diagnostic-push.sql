-- ============================================
-- DIAGNOSTIC — dans quel état sont les rappels ?
--
-- Ce script ne MODIFIE rien. Il ne fait que regarder et raconter.
-- Colle-le entier dans Supabase → SQL Editor et lis les résultats.
--
-- Il ne contient aucune clé et n'en affiche aucune : la requête sur le
-- coffre dit seulement si le secret EXISTE, jamais sa valeur.
-- ============================================

-- --------------------------------------------
-- 1. La table des abonnements existe-t-elle ?
--    Attendu : une ligne. Sinon, migration-push.sql n'est pas passé.
-- --------------------------------------------
select 'Table push_subscriptions' as verification,
       count(*)::text || ' table(s) trouvée(s)' as resultat
from information_schema.tables
where table_name = 'push_subscriptions';

-- --------------------------------------------
-- 2. La colonne qui évite de redemander l'autorisation
--    Attendu : 1.
-- --------------------------------------------
select 'Colonne profiles.push_asked_at' as verification,
       count(*)::text as resultat
from information_schema.columns
where table_name = 'profiles' and column_name = 'push_asked_at';

-- --------------------------------------------
-- 3. La clé de service est-elle rangée dans le coffre ?
--    Attendu : « oui ». Si « non », l'étape 2 du script cron n'a pas été
--    exécutée — c'est le cas le plus probable, puisqu'elle est livrée en
--    commentaire exprès.
--
--    ⚠️ Cette requête ne révèle PAS la clé, seulement son existence.
-- --------------------------------------------
select 'Cle de service dans le coffre' as verification,
       case when exists (select 1 from vault.secrets where name = 'service_role_key')
            then 'oui' else 'non — etape 2 a faire' end as resultat;

-- --------------------------------------------
-- 4. La tâche planifiée existe-t-elle, et est-elle correcte ?
--
--    Regarde la colonne `commande` : si tu y vois « TON-PROJET », la tâche
--    appelle une adresse qui n'existe pas. Il faut alors la supprimer et la
--    recréer avec la vraie référence de ton projet (voir plus bas).
-- --------------------------------------------
select jobname as tache,
       schedule as horaire,
       active as active,
       case when command like '%TON-PROJET%'
            then 'A REFAIRE — l''adresse contient encore TON-PROJET'
            else 'adresse renseignee' end as etat
from cron.job
where jobname = 'rappel-quotidien-18h';

-- --------------------------------------------
-- 5. Ses dernières exécutions
--    Vide tant que 18 h n'est pas passé une fois. Si tu vois « failed »,
--    le message d'erreur est dans `return_message`.
-- --------------------------------------------
select status, start_time, return_message
from cron.job_run_details
where jobid in (select jobid from cron.job where jobname = 'rappel-quotidien-18h')
order by start_time desc
limit 5;

-- ============================================
-- POUR REPARTIR PROPREMENT
--
-- Si le point 4 dit « A REFAIRE », execute cette ligne pour supprimer la
-- tache, puis reprends migration-push-cron.sql etape par etape — sans
-- coller le fichier entier d'un coup.
-- ============================================
-- select cron.unschedule('rappel-quotidien-18h');
