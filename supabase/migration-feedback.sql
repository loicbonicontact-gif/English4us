-- ============================================
-- MIGRATION — note de l'application
-- « Après quelques leçons, on demande une note sur 5. »
--
-- À exécuter dans Supabase SQL Editor. Ne touche à aucune donnée existante :
-- elle crée une table et ajoute une colonne à `profiles`.
--
-- CE QU'ON COLLECTE, ET RIEN DE PLUS
-- Une note de 1 à 5. Pas de commentaire libre — décision de Loïc, et la
-- bonne : un champ de texte libre est l'endroit exact où les gens écrivent
-- leur nom, leur école ou leur numéro, sans y penser. Ne pas offrir le champ
-- est la seule façon sûre de ne pas récolter ça.
--
-- POURQUOI LA NOTE EST LIÉE AU COMPTE
-- Pour empêcher qu'une même personne note dix fois, et surtout pour qu'elle
-- puisse SUPPRIMER son avis — un avis anonyme ne peut plus être retiré par
-- celui qui l'a laissé, ce qui contredit le droit à l'effacement.
--
-- MINEURS
-- L'application s'adresse à tous, mineurs compris. La demande de note est
-- donc conçue pour être refusable d'un geste, sans insistance et sans
-- récompense : rien qui pousse un enfant à répondre pour « débloquer »
-- quelque chose.
-- ============================================

create table if not exists app_feedback (
  user_id uuid primary key references profiles(id) on delete cascade,

  -- La note, de 1 à 5. `primary key` sur user_id : un avis par personne,
  -- modifiable, jamais dupliqué.
  rating integer not null check (rating between 1 and 5),

  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Quand la question a été posée. Sert à ne JAMAIS la reposer, que la
-- personne ait répondu ou refusé.
--
-- Cette colonne vit dans `profiles` et non dans `app_feedback` : un refus ne
-- doit pas créer de ligne d'avis. Refuser, c'est ne rien donner — pas même
-- une ligne vide qui dirait « a refusé ».
alter table profiles add column if not exists feedback_asked_at timestamp with time zone;

-- ============================================
-- SÉCURITÉ
-- Chacun ne voit, ne modifie et ne supprime QUE son propre avis.
--
-- Personne ne peut lire les notes des autres depuis l'application — pas même
-- pour en calculer la moyenne. Cette moyenne se regarde dans Supabase, côté
-- administration, jamais depuis le navigateur.
-- ============================================
alter table app_feedback enable row level security;

drop policy if exists "Utilisateur gere son propre avis" on app_feedback;
create policy "Utilisateur gere son propre avis"
  on app_feedback for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Vérification : la table, sa politique, et la nouvelle colonne.
select policyname from pg_policies where tablename = 'app_feedback';

select column_name from information_schema.columns
where table_name = 'profiles' and column_name = 'feedback_asked_at';
