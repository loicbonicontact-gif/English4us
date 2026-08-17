-- ============================================
-- MIGRATION — rappel quotidien (notifications)
-- À exécuter dans Supabase SQL Editor.
--
-- Elle crée UNIQUEMENT la table des abonnements et la colonne qui évite de
-- redemander l'autorisation. La tâche planifiée, elle, est dans
-- `migration-push-cron.sql` — séparée exprès, parce qu'elle demande des
-- valeurs propres à ton projet et ne doit jamais être commitée remplie.
--
-- TANT QU'ELLE N'EST PAS PASSÉE
-- Rien ne change. Le code client vérifie l'existence de la colonne avant
-- de proposer quoi que ce soit : sans elle, aucune demande d'autorisation
-- n'apparaît, et le réglage du profil reste masqué.
-- ============================================

-- Un abonnement par APPAREIL, pas par compte.
--
-- Quelqu'un peut installer l'application sur son téléphone et sur son
-- ordinateur : ce sont deux abonnements distincts, avec deux clés
-- différentes. Les confondre reviendrait à ne notifier qu'un des deux, et à
-- perdre l'autre silencieusement.
create table if not exists push_subscriptions (
  id serial primary key,
  user_id uuid not null references profiles(id) on delete cascade,

  -- L'adresse fournie par le navigateur. Unique : si le même appareil se
  -- réabonne, on remplace au lieu d'empiler des doublons qui recevraient
  -- deux fois la même notification.
  endpoint text not null unique,

  -- Les deux clés de chiffrement du navigateur. Sans elles, impossible de
  -- lui envoyer quoi que ce soit — le contenu est chiffré de bout en bout.
  p256dh text not null,
  auth text not null,

  created_at timestamp with time zone not null default now(),

  -- Mis à jour à chaque envoi réussi. Sert au ménage : un abonnement mort
  -- (téléphone réinitialisé, application désinstallée) finit par ne plus
  -- rien accepter, et l'envoi renvoie 404 ou 410.
  last_seen_at timestamp with time zone
);

create index if not exists push_subscriptions_user_idx
  on push_subscriptions (user_id);

-- Quand l'autorisation a été demandée. Comme pour la note : on ne demande
-- qu'une fois. Un refus navigateur est DÉFINITIF — on ne peut plus jamais
-- reposer la question sans passer par les réglages du téléphone. Insister
-- serait donc non seulement pénible, mais inutile.
alter table profiles add column if not exists push_asked_at timestamp with time zone;

-- ============================================
-- SÉCURITÉ
-- Chacun ne gère que ses propres abonnements. Personne ne peut lire ceux
-- des autres : une adresse d'abonnement permettrait d'envoyer une
-- notification à quelqu'un d'autre.
-- ============================================
alter table push_subscriptions enable row level security;

drop policy if exists "Utilisateur gere ses propres abonnements" on push_subscriptions;
create policy "Utilisateur gere ses propres abonnements"
  on push_subscriptions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Vérification : la table, son index, sa politique, la colonne.
select policyname from pg_policies where tablename = 'push_subscriptions';

select column_name from information_schema.columns
where table_name = 'profiles' and column_name = 'push_asked_at';
