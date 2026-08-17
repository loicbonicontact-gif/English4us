-- ============================================
-- TÂCHE PLANIFIÉE — le rappel de 18 h
--
-- ⚠️ CE FICHIER CONTIENT DES TROUS À REMPLIR, ET LA VERSION REMPLIE NE DOIT
-- JAMAIS ÊTRE COMMITÉE. Elle contiendrait ta clé de service, qui donne un
-- accès TOTAL à ta base — lecture, écriture et suppression de tout, en
-- ignorant les règles de sécurité.
--
-- Pour éviter ce risque, la clé n'est pas écrite dans la commande : elle est
-- rangée une fois pour toutes dans le coffre de Supabase (Vault), et la
-- tâche va l'y chercher au moment de s'exécuter.
--
-- À exécuter APRÈS `migration-push.sql` et APRÈS avoir déployé la fonction
-- `daily-reminder` (voir README.md).
-- ============================================

-- --------------------------------------------
-- ÉTAPE 1 — les extensions
-- `pg_cron` fait tourner la tâche, `pg_net` lui permet d'appeler la fonction.
-- --------------------------------------------
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- --------------------------------------------
-- ÉTAPE 2 — ranger la clé de service dans le coffre
--
-- REMPLACE `COLLE_ICI_TA_CLE_SERVICE_ROLE` par la valeur trouvée dans
-- Supabase → Project Settings → API → `service_role` `secret`.
--
-- Exécute cette instruction SEULE, puis EFFACE-LA de l'éditeur avant de
-- continuer. Elle ne doit rester nulle part.
-- --------------------------------------------
-- select vault.create_secret('COLLE_ICI_TA_CLE_SERVICE_ROLE', 'service_role_key');

-- --------------------------------------------
-- ÉTAPE 3 — la tâche elle-même
--
-- REMPLACE `TON-PROJET` par la référence de ton projet (elle apparaît dans
-- l'URL de Supabase : https://TON-PROJET.supabase.co).
--
-- `0 16 * * *` = 16 h UTC, soit **18 h à Paris en heure d'été**. pg_cron ne
-- connaît que UTC : en hiver, ce serait 17 h. Deux tâches sont donc
-- possibles si l'heure exacte compte toute l'année ; pour un rappel
-- d'entraînement, une heure de décalage l'hiver est sans conséquence.
-- --------------------------------------------
select cron.schedule(
  'rappel-quotidien-18h',
  '0 16 * * *',
  $$
  select net.http_post(
    url := 'https://TON-PROJET.supabase.co/functions/v1/daily-reminder',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (
        select decrypted_secret from vault.decrypted_secrets
        where name = 'service_role_key'
      )
    ),
    body := '{}'::jsonb
  );
  $$
);

-- --------------------------------------------
-- VÉRIFICATIONS
-- --------------------------------------------

-- La tâche existe et est active :
select jobname, schedule, active from cron.job where jobname = 'rappel-quotidien-18h';

-- Ses dernières exécutions (vide tant que 18 h n'est pas passé une fois) :
select status, return_message, start_time
from cron.job_run_details
where jobid = (select jobid from cron.job where jobname = 'rappel-quotidien-18h')
order by start_time desc
limit 5;

-- --------------------------------------------
-- POUR ARRÊTER LES RAPPELS
-- --------------------------------------------
-- select cron.unschedule('rappel-quotidien-18h');
